import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface OrderItem {
  id: string;
  orderId: string;
  coffeeId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderWithItems {
  id: string;
  email: string;
  address: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string;
  shippingProvider: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email } = body as { orderId?: string; email?: string };

    if (!orderId || !email) {
      return NextResponse.json(
        { success: false, error: 'Order ID and email are required to track shipments.' },
        { status: 400 }
      );
    }

    const order: OrderWithItems | null = await db.order.findUnique({
      where: { id: orderId.trim() },
      include: { items: true },
    });

    if (!order || order.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return NextResponse.json(
        { success: false, error: 'No matching order found. Please verify your Order ID and email.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        email: order.email,
        address: order.address,
        totalAmount: order.totalAmount,
        status: order.status,
        payment_status: order.paymentStatus,
        fulfillment_status: order.fulfillmentStatus,
        trackingNumber: order.trackingNumber,
        shippingProvider: order.shippingProvider,
        items: order.items.map((i) => ({
          id: i.coffeeId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        createdAt: order.createdAt.toISOString(),
      },
      error: null,
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error resolving order tracking details.' },
      { status: 500 }
    );
  }
}
