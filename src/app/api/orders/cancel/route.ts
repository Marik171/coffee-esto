import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cancelPayment } from '@/lib/iyzipay';
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

    // Issue real void via iyzico before touching the database
    if (order.paymentStatus === 'captured' && order.paymentId) {
      const result = await cancelPayment(order.paymentId, ip !== 'unknown' ? ip : '0.0.0.0');

      if (result.status !== 'success') {
        return NextResponse.json(
          {
            success: false,
            error: `Payment void failed: ${result.errorMessage ?? 'iyzico returned an error'}. Please contact support.`,
          },
          { status: 402 }
        );
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

    return NextResponse.json({ success: true, error: null });

  } catch (error) {
    console.error('Customer cancel error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please contact support.' },
      { status: 500 }
    );
  }
}
