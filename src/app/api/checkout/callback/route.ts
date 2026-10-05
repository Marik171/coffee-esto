import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invalidateCache } from '@/lib/cache';
import { completeThreeDSPayment, cancelPayment } from '@/lib/iyzipay';
import { sendOrderConfirmationEmail, sendOwnerNewOrderNotification, sendLowStockAlert, sendCheckoutFailsafeAlert } from '@/lib/emails';
import { PICKUP_LABEL, PICKUP_ADDRESS, StockConflictError, type PendingCheckoutPayload } from '@/lib/checkoutShared';

const LOW_STOCK_THRESHOLD = 5;

// The bank redirects the customer's browser back here (a POST, form-encoded)
// once 3D Secure authentication finishes. This renders inside the popup window
// the checkout page opened (not an iframe — iyzico's own 3DS relay page sets
// anti-framing headers and refuses to load inside any iframe), so the response
// is a tiny HTML page that reports the outcome back to the opener via
// postMessage — never a redirect, which would just navigate the popup itself.
function respondToParent(result: { success: boolean; error?: string; orderId?: string; totalAmount?: number; email?: string }) {
  // Escape "</" so a stray product/error string can't prematurely close the <script> tag.
  const payload = JSON.stringify({ source: 'coffee-esto-3ds', ...result }).replace(/<\//g, '<\\/');
  const html = `<!doctype html><html><body><script>
    (window.opener || window.parent).postMessage(${payload}, window.location.origin);
  </script></body></html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const conversationId = String(form.get('conversationId') ?? '');
    const paymentId = String(form.get('paymentId') ?? '');

    if (!conversationId) {
      return respondToParent({ success: false, error: 'Missing conversation reference from bank callback.' });
    }

    // Already-finalized order (e.g. a duplicate callback from the bank) — just report success again.
    const existingOrder = await db.order.findUnique({ where: { id: conversationId } });
    if (existingOrder) {
      return respondToParent({
        success: true,
        orderId: existingOrder.id,
        totalAmount: existingOrder.totalAmount,
        email: existingOrder.email,
      });
    }

    const pending = await db.pendingCheckout.findUnique({ where: { id: conversationId } });
    if (!pending) {
      return respondToParent({ success: false, error: 'This checkout session expired or was already processed. Please try again.' });
    }

    const payload = pending.payload as unknown as PendingCheckoutPayload;

    if (!paymentId) {
      await db.pendingCheckout.delete({ where: { id: conversationId } }).catch(() => {});
      return respondToParent({ success: false, error: 'Bank authentication failed. Please try again.' });
    }

    const paymentResult = await completeThreeDSPayment({ paymentId, conversationId });

    if (paymentResult.status !== 'success') {
      await db.pendingCheckout.delete({ where: { id: conversationId } }).catch(() => {});
      return respondToParent({
        success: false,
        error: paymentResult.errorMessage ?? 'Payment was declined. Please check your card details.',
      });
    }

    // ── Payment charged — persist order + decrement stock atomically ──
    //
    // From here on the card has already been charged. If anything in this block
    // fails (DB error, or another checkout winning a stock race in the meantime),
    // we must void the charge before returning an error — otherwise the customer
    // is left charged with no order and no way for support to find it.
    const { shippingDetails, mappedItems, isWholesale, isPickup, calculatedSubtotal, shippingFee,
      cargoProviderName, discountAmount, appliedCouponCode, appliedCouponId, totalAmount,
      customerId, detectedLocale, ip } = payload;

    let newOrder;
    let newlyLowStock: { id: string; name: string; stock: number }[] = [];
    try {
      newOrder = await db.$transaction(async (tx) => {
        const productIds = mappedItems.map((item) => item.id);
        const productsBefore = await tx.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, stock: true },
        });
        const stockBefore = new Map(productsBefore.map((p) => [p.id, p]));

        // Wholesale keeps the pre-existing unconditional decrement (bulk/backorder
        // model). Retail gets a conditional decrement so two near-simultaneous
        // checkouts for the last unit in stock can't both succeed.
        for (const item of mappedItems) {
          if (isWholesale) {
            await tx.product.update({ where: { id: item.id }, data: { stock: { decrement: item.quantity } } });
            continue;
          }
          const result = await tx.product.updateMany({
            where: { id: item.id, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (result.count === 0) {
            throw new StockConflictError(item.id);
          }
        }

        // Only alert when a product crosses the threshold on this order (was above
        // it, is now at or below it) — avoids re-sending the same alert every order.
        newlyLowStock = mappedItems
          .map((item) => {
            const before = stockBefore.get(item.id);
            if (!before) return null;
            const after = before.stock - item.quantity;
            return before.stock > LOW_STOCK_THRESHOLD && after <= LOW_STOCK_THRESHOLD
              ? { id: before.id, name: before.name, stock: Math.max(after, 0) }
              : null;
          })
          .filter((p): p is { id: string; name: string; stock: number } => p !== null);

        if (appliedCouponId) {
          await tx.coupon.update({ where: { id: appliedCouponId }, data: { usedCount: { increment: 1 } } });
        }

        return tx.order.create({
          data: {
            id: conversationId,
            email: shippingDetails.email,
            fullName: shippingDetails.fullName,
            locale: detectedLocale,
            phone: shippingDetails.phone,
            address: isPickup
              ? `${PICKUP_LABEL}: ${PICKUP_ADDRESS.line}, ${PICKUP_ADDRESS.city} ${PICKUP_ADDRESS.zipCode}`
              : `${shippingDetails.address}, ${shippingDetails.city} ${shippingDetails.zipCode}`,
            paymentId: paymentResult.paymentId ?? '',
            paymentTransactions: (paymentResult.itemTransactions ?? []) as unknown as object,
            identityNumber: shippingDetails.identityNumber ?? '',
            isWholesale,
            subtotal: calculatedSubtotal,
            shippingFee,
            cargoProviderName,
            couponCode: appliedCouponCode,
            discountAmount,
            totalAmount,
            status: 'pending',
            paymentStatus: 'captured',
            fulfillmentStatus: 'not_fulfilled',
            ...(customerId && { customerId }),
            items: {
              create: mappedItems.map((item) => ({
                coffeeId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: { items: true },
        });
      });
    } catch (txError) {
      const isStockConflict = txError instanceof StockConflictError;
      console.error('Checkout callback: order transaction failed after successful payment — voiding charge.', txError);

      const voidResult = await cancelPayment(paymentResult.paymentId ?? '', ip).catch((voidErr) => {
        console.error('Checkout callback: CRITICAL — payment void also failed after order-transaction failure.', voidErr);
        return null;
      });
      const voided = voidResult?.status === 'success';

      await sendCheckoutFailsafeAlert({
        attemptedOrderId: conversationId,
        email: shippingDetails.email,
        totalAmount,
        paymentId: paymentResult.paymentId ?? '',
        reason: isStockConflict
          ? `Item "${(txError as StockConflictError).productId}" sold out between stock check and order creation.`
          : String(txError instanceof Error ? txError.message : txError),
        voided,
      });

      await db.pendingCheckout.delete({ where: { id: conversationId } }).catch(() => {});

      return respondToParent({
        success: false,
        error: isStockConflict
          ? 'One or more items in your cart just sold out. Your payment was not completed.'
          : 'We could not complete your order after payment. Any charge has been automatically reversed — please try again, or contact support if you were still charged.',
      });
    }

    // Stock changed — drop cached product data so the storefront shows live stock.
    invalidateCache('product');

    await db.pendingCheckout.delete({ where: { id: conversationId } }).catch(() => {});
    // Cart converted to an order — stop any pending abandoned-cart reminder for this email.
    await db.abandonedCart.deleteMany({ where: { email: shippingDetails.email } }).catch(() => {});

    const orderEmailDetails = {
      orderId: newOrder.id,
      email: newOrder.email,
      fullName: shippingDetails.fullName,
      items: mappedItems,
      subtotal: newOrder.subtotal,
      shippingFee: newOrder.shippingFee,
      totalAmount: newOrder.totalAmount,
      locale: detectedLocale,
    };

    await Promise.all([
      sendOrderConfirmationEmail(orderEmailDetails),
      sendOwnerNewOrderNotification(orderEmailDetails),
      ...(newlyLowStock.length > 0 ? [sendLowStockAlert(newlyLowStock)] : []),
    ]);

    return respondToParent({
      success: true,
      orderId: newOrder.id,
      totalAmount: newOrder.totalAmount,
      email: newOrder.email,
    });

  } catch (error) {
    console.error('Checkout callback error:', error);
    return respondToParent({ success: false, error: 'An unexpected error occurred. Please contact support if you were charged.' });
  }
}
