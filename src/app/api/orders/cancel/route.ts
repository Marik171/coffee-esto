import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cancelPayment } from '@/lib/iyzipay';

export async function POST(request: Request) {
  try {
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
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        ?? request.headers.get('x-real-ip')
        ?? '0.0.0.0';

      const result = await cancelPayment(order.paymentId, ip);

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
