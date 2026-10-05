import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invalidateCache } from '@/lib/cache';
import { cancelPayment, refundPayment } from '@/lib/iyzipay';
import {
  sendOrderRoastingStartedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderReturnedEmail,
} from '@/lib/emails';

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
  fullName: string;
  locale: string;
  phone: string;
  address: string;
  paymentId: string;
  identityNumber: string;
  isWholesale: boolean;
  subtotal: number;
  shippingFee: number;
  couponCode: string;
  discountAmount: number;
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
    fullName: o.fullName,
    phone: o.phone,
    address: o.address,
    identityNumber: o.identityNumber,
    isWholesale: o.isWholesale,
    subtotal: o.subtotal,
    shippingFee: o.shippingFee,
    couponCode: o.couponCode,
    discountAmount: o.discountAmount,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing order id.' }, { status: 400 });
    }

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ success: false, error: `Order ${id} not found.` }, { status: 404 });
    }

    // Paid orders should be canceled/refunded (POST action=cancel_order) first —
    // deleting the row here only removes the record, it never touches iyzico.
    if (order.paymentStatus === 'captured') {
      return NextResponse.json(
        { success: false, error: 'Cancel and refund this order before deleting it.' },
        { status: 400 }
      );
    }

    await db.order.delete({ where: { id } }); // OrderItem rows cascade

    return NextResponse.json({ success: true, data: { id }, error: null });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting order.' },
      { status: 500 }
    );
  }
}

// Same-day void first (instant, fee-free); once iyzico has settled the payment
// that fails, so fall back to a per-transaction refund. Shared by cancel_order
// (pre-shipment) and mark_returned (post-delivery) — both end with the money
// back in the customer's hands, just at different points in the order lifecycle.
async function voidOrRefundPayment(
  order: { paymentId: string; paymentStatus: string; paymentTransactions: unknown },
  ip: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (order.paymentStatus !== 'captured' || !order.paymentId) {
    return { ok: true };
  }

  const cancelResult = await cancelPayment(order.paymentId, ip).catch(
    (err): { status: 'failure'; errorMessage: string } => ({ status: 'failure', errorMessage: String(err) })
  );
  if (cancelResult.status === 'success') {
    return { ok: true };
  }

  const transactions = (order.paymentTransactions as Array<{ paymentTransactionId: string; price: string }> | null) ?? [];
  if (transactions.length === 0) {
    return {
      ok: false,
      status: 402,
      error: `Payment void failed: ${cancelResult.errorMessage ?? 'iyzico error'}. Issue refund manually from the iyzico dashboard.`,
    };
  }

  const refundResults = await Promise.all(
    transactions.map((t) => refundPayment(t.paymentTransactionId, t.price, ip).catch(
      (err): { status: 'failure'; errorMessage: string } => ({ status: 'failure', errorMessage: String(err) })
    ))
  );
  const failed = refundResults.find((r) => r.status !== 'success');
  if (failed) {
    console.error('Admin refund: void and refund both failed', { cancelResult, refundResults });
    return {
      ok: false,
      status: 402,
      error: `Refund failed: ${failed.errorMessage ?? 'iyzico error'}. Issue refund manually from the iyzico dashboard.`,
    };
  }
  return { ok: true };
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
        nextShippingProvider  = shippingProvider || order.shippingProvider;
        break;

      case 'update_tracking':
        if (!['shipped', 'delivered'].includes(order.fulfillmentStatus)) {
          return NextResponse.json(
            { success: false, error: 'Tracking can only be edited once the order has shipped.' },
            { status: 400 }
          );
        }
        if (!trackingNumber?.trim() || !shippingProvider?.trim()) {
          return NextResponse.json(
            { success: false, error: 'Both carrier and tracking number are required.' },
            { status: 400 }
          );
        }
        nextTrackingNumber   = trackingNumber;
        nextShippingProvider = shippingProvider;
        break;

      case 'mark_delivered':
        if (order.fulfillmentStatus !== 'shipped') {
          return NextResponse.json(
            { success: false, error: 'Order must be shipped before it can be marked delivered.' },
            { status: 400 }
          );
        }
        nextFulfillmentStatus = 'delivered';
        nextStatus            = 'completed';
        break;

      case 'mark_returned': {
        if (!['shipped', 'delivered'].includes(order.fulfillmentStatus)) {
          return NextResponse.json(
            { success: false, error: 'Only shipped or delivered orders can be marked as returned.' },
            { status: 400 }
          );
        }
        const refundResult = await voidOrRefundPayment(order, ip);
        if (!refundResult.ok) {
          return NextResponse.json({ success: false, error: refundResult.error }, { status: refundResult.status });
        }
        nextFulfillmentStatus = 'returned';
        nextStatus            = 'returned';
        nextPaymentStatus     = order.paymentStatus === 'captured' ? 'refunded' : order.paymentStatus;
        break;
      }

      case 'cancel_order': {
        if (['shipped', 'delivered', 'returned'].includes(order.fulfillmentStatus)) {
          return NextResponse.json(
            { success: false, error: 'Cannot cancel an order that has already shipped — use Mark as Returned instead.' },
            { status: 400 }
          );
        }
        const refundResult = await voidOrRefundPayment(order, ip);
        if (!refundResult.ok) {
          return NextResponse.json({ success: false, error: refundResult.error }, { status: refundResult.status });
        }
        nextStatus            = 'canceled';
        nextFulfillmentStatus = 'canceled';
        nextPaymentStatus     = order.paymentStatus === 'captured' ? 'refunded' : 'canceled';
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }

    // Items physically come back into stock whenever an order newly becomes
    // canceled or returned — guarded by "newly" so re-running the action on an
    // already-canceled/returned order (which the earlier switch cases already
    // mostly prevent) can't double-increment stock.
    const shouldRestock =
      (action === 'cancel_order' && order.status !== 'canceled') ||
      (action === 'mark_returned' && order.fulfillmentStatus !== 'returned');

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
      ...(shouldRestock
        ? order.items.map((item: OrderItem) =>
            db.product.updateMany({
              where: { id: item.coffeeId },
              data: { stock: { increment: item.quantity } },
            })
          )
        : []),
    ]);
    if (shouldRestock) invalidateCache('product');

    // Notify the customer of the status change — best-effort, never blocks the response
    // (sendEmail() already swallows its own provider errors internally).
    if (action === 'start_roasting') {
      await sendOrderRoastingStartedEmail({
        orderId: updated.id,
        email: updated.email,
        fullName: order.fullName,
        locale: order.locale,
      }).catch((err) => console.error('Failed to send roasting-started email:', err));
    } else if (action === 'ship_fulfillment') {
      await sendOrderShippedEmail({
        orderId: updated.id,
        email: updated.email,
        fullName: order.fullName,
        locale: order.locale,
        trackingNumber: updated.trackingNumber,
        shippingProvider: updated.shippingProvider,
      }).catch((err) => console.error('Failed to send shipped email:', err));
    } else if (action === 'mark_delivered') {
      await sendOrderDeliveredEmail({
        orderId: updated.id,
        email: updated.email,
        fullName: order.fullName,
        locale: order.locale,
      }).catch((err) => console.error('Failed to send delivered email:', err));
    } else if (action === 'mark_returned') {
      await sendOrderReturnedEmail({
        orderId: updated.id,
        email: updated.email,
        fullName: order.fullName,
        locale: order.locale,
      }).catch((err) => console.error('Failed to send returned email:', err));
    }

    return NextResponse.json({ success: true, data: formatOrder(updated), error: null });

  } catch (error) {
    console.error('Admin order action failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing order action.' },
      { status: 500 }
    );
  }
}
