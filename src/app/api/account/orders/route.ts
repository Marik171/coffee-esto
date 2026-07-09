import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { customerId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: orders.map((order) => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((i) => ({
          id: i.coffeeId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      })),
      error: null,
    });
  } catch (error) {
    console.error('List orders error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
