import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invalidateCache } from '@/lib/cache';
import { cancelPayment, refundPayment } from '@/lib/iyzipay';
import { checkRateLimit } from '@/lib/rateLimiter';

const RATE_LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown';

    const rate = checkRateLimit(`orders-cancel:${ip}`, RATE_LIMIT, WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later or contact support.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { orderId, email } = body as { orderId?: string; email?: string };

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, error: 'Order ID and email are required.' },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId.trim() },
      include: { items: true },
    });

    if (!order || order.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return NextResponse.json(
        { success: false, error: 'No matching order found.' },
        { status: 404 }
      );
    }

    if (order.status === 'canceled') {
      return NextResponse.json(
        { success: false, error: 'This order has already been canceled.' },
        { status: 400 }
      );
    }

    if (order.fulfillmentStatus !== 'not_fulfilled') {
      return NextResponse.json(
        { success: false, error: 'This order can no longer be canceled — roasting or shipping has already started. Please request a return instead.' },
        { status: 400 }
      );
    }

    // Reverse the charge via iyzico before touching the database. A same-day
    // void (cancelPayment) is preferred — it's instant and fee-free — but it
    // fails once iyzico has settled the payment (typically the next day), so
    // we fall back to a per-transaction refund, which works after settlement.
    if (order.paymentStatus === 'captured' && order.paymentId) {
      const voidIp = ip !== 'unknown' ? ip : '0.0.0.0';
      const voidResult = await cancelPayment(order.paymentId, voidIp).catch(
        (err): { status: 'failure'; errorMessage: string } => ({ status: 'failure', errorMessage: String(err) })
      );

      if (voidResult.status !== 'success') {
        const transactions = (order.paymentTransactions as Array<{ paymentTransactionId: string; price: string }> | null) ?? [];
        if (transactions.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: `Payment reversal failed: ${voidResult.errorMessage ?? 'iyzico returned an error'}. Please contact support.`,
            },
            { status: 402 }
          );
        }

        const refundResults = await Promise.all(
          transactions.map((t) => refundPayment(t.paymentTransactionId, t.price, voidIp).catch(
            (err): { status: 'failure'; errorMessage: string } => ({ status: 'failure', errorMessage: String(err) })
          ))
        );
        const failed = refundResults.find((r) => r.status !== 'success');
        if (failed) {
          console.error('Order cancel: void and refund both failed', { orderId, voidResult, refundResults });
          return NextResponse.json(
            {
              success: false,
              error: `Refund failed: ${failed.errorMessage ?? 'iyzico returned an error'}. Please contact support — your payment has not been reversed.`,
            },
            { status: 402 }
          );
        }
      }
    }

    await db.$transaction([
      db.order.update({
        where: { id: orderId },
        data: {
          status: 'canceled',
          fulfillmentStatus: 'canceled',
          paymentStatus: order.paymentStatus === 'captured' ? 'refunded' : 'canceled',
        },
      }),
      ...order.items.map((item) =>
        db.product.updateMany({
          where: { id: item.coffeeId },
          data: { stock: { increment: item.quantity } },
        })
      ),
    ]);
    invalidateCache('product');

    return NextResponse.json({ success: true, error: null });

  } catch (error) {
    console.error('Customer cancel error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please contact support.' },
      { status: 500 }
    );
  }
}
