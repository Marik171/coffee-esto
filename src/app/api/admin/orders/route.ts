import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cancelPayment } from '@/lib/iyzipay';

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
  phone: string;
  address: string;
  paymentId: string;
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

function formatOrder(o: OrderWithItems) {
  return {
    id: o.id,
    email: o.email,
    phone: o.phone,
    address: o.address,
    subtotal: o.subtotal,
    shippingFee: o.shippingFee,
    totalAmount: o.totalAmount,
    status: o.status,
    payment_status: o.paymentStatus,
    fulfillment_status: o.fulfillmentStatus,
    trackingNumber: o.trackingNumber,
    shippingProvider: o.shippingProvider,
    items: o.items.map((i) => ({
      id: i.coffeeId,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    createdAt: o.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: orders.map(formatOrder), error: null });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin order logs from database.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, shippingProvider, trackingNumber } = body as {
      action: string;
      orderId: string;
      shippingProvider?: string;
      trackingNumber?: string;
    };

    if (!orderId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or action parameters.' },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${orderId} not found.` },
        { status: 404 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? '0.0.0.0';

    let nextStatus            = order.status;
    let nextPaymentStatus     = order.paymentStatus;
    let nextFulfillmentStatus = order.fulfillmentStatus;
    let nextTrackingNumber    = order.trackingNumber;
    let nextShippingProvider  = order.shippingProvider;

    switch (action) {
      case 'start_roasting':
        if (order.fulfillmentStatus !== 'not_fulfilled') {
          return NextResponse.json(
            { success: false, error: 'Order must be awaiting fulfillment to start roasting.' },
            { status: 400 }
          );
        }
        nextFulfillmentStatus = 'roasting';
        break;

      case 'create_fulfillment':
        if (order.fulfillmentStatus !== 'roasting') {
          return NextResponse.json(
            { success: false, error: 'Order must finish roasting before it can be packed.' },
            { status: 400 }
          );
        }
        if (!shippingProvider) {
          return NextResponse.json(
            { success: false, error: 'Fulfillment provider must be specified.' },
            { status: 400 }
          );
        }
        nextFulfillmentStatus = 'fulfilled';
        nextShippingProvider  = shippingProvider;
        break;

      case 'ship_fulfillment':
        if (order.fulfillmentStatus !== 'fulfilled') {
          return NextResponse.json(
            { success: false, error: 'Fulfillment must be created before shipping.' },
            { status: 400 }
          );
        }
        if (!trackingNumber) {
          return NextResponse.json(
            { success: false, error: 'A tracking number is required to ship.' },
            { status: 400 }
          );
        }
        nextFulfillmentStatus = 'shipped';
        nextTrackingNumber    = trackingNumber;
        nextStatus            = 'completed';
        break;

      case 'cancel_order':
        if (order.fulfillmentStatus === 'shipped') {
          return NextResponse.json(
            { success: false, error: 'Cannot cancel an order that has already been shipped.' },
            { status: 400 }
          );
        }
        if (order.paymentStatus === 'captured' && order.paymentId) {
          const cancelResult = await cancelPayment(order.paymentId, ip);
          if (cancelResult.status !== 'success') {
            return NextResponse.json(
              {
                success: false,
                error: `Payment void failed (${cancelResult.errorCode ?? 'unknown'}): ${cancelResult.errorMessage ?? 'iyzico error'}. Issue refund manually from the iyzico dashboard.`,
              },
              { status: 402 }
            );
          }
        }
        nextStatus            = 'canceled';
        nextFulfillmentStatus = 'canceled';
        nextPaymentStatus     = order.paymentStatus === 'captured' ? 'refunded' : 'canceled';
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }

    const isNewlyCanceled = action === 'cancel_order' && order.status !== 'canceled';

    const [updated] = await db.$transaction([
      db.order.update({
        where: { id: orderId },
        data: {
          status: nextStatus,
          paymentStatus: nextPaymentStatus,
          fulfillmentStatus: nextFulfillmentStatus,
          trackingNumber: nextTrackingNumber,
          shippingProvider: nextShippingProvider,
        },
        include: { items: true },
      }),
      ...(isNewlyCanceled
        ? order.items.map((item) =>
            db.product.updateMany({
              where: { id: item.coffeeId },
              data: { stock: { increment: item.quantity } },
            })
          )
        : []),
    ]);

    return NextResponse.json({ success: true, data: formatOrder(updated), error: null });

  } catch (error) {
    console.error('Admin order action failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing order action.' },
      { status: 500 }
    );
  }
}
