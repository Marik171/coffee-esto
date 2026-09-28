import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { createPayment, cancelPayment, Iyzipay } from '@/lib/iyzipay';
import { verifyToken } from '@/lib/auth';
import { sendOrderConfirmationEmail, sendOwnerNewOrderNotification, sendLowStockAlert, sendCheckoutFailsafeAlert } from '@/lib/emails';
import { validateCoupon } from '@/lib/coupons';
import { checkRateLimit } from '@/lib/rateLimiter';

const LOW_STOCK_THRESHOLD = 5;

// Mirrors the address shown in the checkout page's pickup panel
// (src/components/CheckoutPaymentContent.tsx) — used as the order's stored
// address for pickup orders, and as the address/city/zip iyzico requires
// on the payment request when the customer skips filling in their own.
const PICKUP_LABEL = 'Store Pickup';
const PICKUP_ADDRESS = {
  line: 'Coffee Esto Roastery, Topselvi Mahallesi, Kubilay Caddesi, Şht. Ahmet Yalçın Sk. 3/a',
  city: 'İstanbul',
  district: 'Kartal',
  zipCode: '34873',
};

// Charge attempts per IP — generous for a real shopper (retrying a declined card,
// checking out a wholesale order separately, etc.) but tight enough to blunt
// scripted card-testing, which is the realistic abuse pattern for this endpoint.
const RATE_LIMIT = 8;
const WINDOW_MS = 60 * 60 * 1000;

interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CardDetails {
  cardHolderName: string;
  cardNumber: string;   // may include spaces from frontend formatting
  expireMonth: string;  // "MM"
  expireYear: string;   // "YY" (frontend) → we convert to "YYYY"
  cvc: string;
}

interface ShippingDetails {
  email: string;
  fullName: string;
  address: string;
  city: string;
  phone: string;
  zipCode: string;
}

// Thrown inside the post-payment transaction when stock ran out between the
// pre-charge check and now (a race between two near-simultaneous checkouts).
// Distinguishing it lets us tell the customer "sold out" instead of a generic error.
class StockConflictError extends Error {
  constructor(public readonly productId: string) {
    super(`Stock for "${productId}" changed before the order could be completed.`);
  }
}

function getProductId(id: string): string {
  const parts = id.split('-');
  const sizeIndex = parts.findIndex((p) => p === '250g' || p === '500g' || p === '1kg');
  if (sizeIndex !== -1) {
    return parts.slice(0, sizeIndex).join('-');
  }
  return id;
}

export async function POST(request: Request) {
  try {
    const ip0 = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown';

    const rate = checkRateLimit(`checkout:${ip0}`, RATE_LIMIT, WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many checkout attempts. Please try again later or contact support.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { items, shippingDetails, cardDetails, isWholesale, locale, cargoProviderId, couponCode, deliveryMode } = body as {
      items: CheckoutItem[];
      shippingDetails: ShippingDetails;
      cardDetails: CardDetails;
      isWholesale?: boolean;
      locale?: string;
      cargoProviderId?: string;
      couponCode?: string;
      deliveryMode?: 'ship' | 'pickup';
    };

    // Pickup only applies to retail orders — wholesale always ships.
    const isPickup = !isWholesale && deliveryMode === 'pickup';

    // ── 1. Input validation ──────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Basket is empty or invalid.' },
        { status: 400 }
      );
    }

    if (isWholesale) {
      const totalWeight = items.reduce((acc, i) => acc + i.quantity, 0);
      if (totalWeight < 50) {
        return NextResponse.json(
          { success: false, error: 'Minimum order of 50kg is required for wholesale pricing.' },
          { status: 400 }
        );
      }
    }

    if (!shippingDetails?.email || !shippingDetails?.fullName || !shippingDetails?.phone ||
        (!isPickup && (!shippingDetails?.address || !shippingDetails?.city || !shippingDetails?.zipCode))) {
      return NextResponse.json(
        { success: false, error: 'All shipping fields are required.' },
        { status: 400 }
      );
    }

    if (!cardDetails?.cardNumber || !cardDetails?.cardHolderName ||
        !cardDetails?.expireMonth || !cardDetails?.expireYear || !cardDetails?.cvc) {
      return NextResponse.json(
        { success: false, error: 'All card fields are required.' },
        { status: 400 }
      );
    }

    // ── 2. Fetch products from DB (server-side price source of truth) ──
    const customerToken = (await cookies()).get('customer_token')?.value;
    const customerPayload = customerToken ? await verifyToken(customerToken) : null;
    const customerId = customerPayload?.role === 'customer' ? (customerPayload.customerId as string) : undefined;

    let isSubscriber = false;
    if (customerId) {
      const customer = await db.customer.findUnique({ where: { id: customerId } });
      if (customer?.isSubscriber) {
        isSubscriber = true;
      }
    }

    const productIds = Array.from(new Set(items.map((i) => getProductId(i.id))));
    const products = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, name: true, category: true, price: true, wholesalePrice: true, stock: true },
    });

    type DbProduct = { id: string; name: string; category: string; price: number; wholesalePrice: number; stock: number };
    const productMap = new Map<string, DbProduct>(
      products.map((p: DbProduct) => [p.id, p])
    );

    // Sum requested quantities per base product ID
    const requestedTotals = new Map<string, number>();
    for (const item of items) {
      const baseId = getProductId(item.id);
      requestedTotals.set(baseId, (requestedTotals.get(baseId) ?? 0) + item.quantity);
    }

    let calculatedSubtotal = 0;
    const mappedItems: Array<{ id: string; name: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const baseId = getProductId(item.id);
      const product = productMap.get(baseId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product "${baseId}" is unavailable or no longer active.` },
          { status: 400 }
        );
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json(
          { success: false, error: `Invalid quantity for product "${item.id}".` },
          { status: 400 }
        );
      }
      
      const totalRequested = requestedTotals.get(baseId) ?? 0;
      if (!isWholesale && product.stock < totalRequested) {
        return NextResponse.json(
          { success: false, error: `"${product.name}" only has ${product.stock} units in stock.` },
          { status: 400 }
        );
      }

      let priceToUse = isWholesale ? product.wholesalePrice : product.price;
      const isCoffeeProduct = ['single-origin', 'limited-edition', 'signature-blend', 'filter', 'espresso', 'turkish'].includes(product.category);
      if (!isWholesale && isSubscriber && isCoffeeProduct) {
        priceToUse = Math.round(priceToUse * 0.90);
      }

      calculatedSubtotal += priceToUse * item.quantity;
      mappedItems.push({ id: product.id, name: product.name, quantity: item.quantity, price: priceToUse });
    }

    // ── 2b. Shipping fee — server-side source of truth, never trust a client-sent fee ──
    let shippingFee = 0;
    let cargoProviderName = '';
    if (isPickup) {
      // No shipping fee, no courier — the customer collects it in person.
      cargoProviderName = PICKUP_LABEL;
    } else if (!isWholesale) {
      const shippingSettings = await db.shippingSettings.findUnique({ where: { id: 1 } });
      if (shippingSettings?.enabled) {
        if (!cargoProviderId) {
          return NextResponse.json(
            { success: false, error: 'Please select a shipping method.' },
            { status: 400 }
          );
        }
        const provider = await db.cargoProvider.findUnique({ where: { id: cargoProviderId } });
        if (!provider || !provider.isActive) {
          return NextResponse.json(
            { success: false, error: 'Selected shipping method is no longer available.' },
            { status: 400 }
          );
        }
        shippingFee = provider.fee;
        cargoProviderName = provider.name;
      }
    }
    // ── 2c. Coupon — server-side validation, never trust a client-computed discount ──
    let discountAmount = 0;
    let appliedCouponCode = '';
    let appliedCouponId: string | null = null;
    if (couponCode && couponCode.trim()) {
      const couponResult = await validateCoupon(couponCode, calculatedSubtotal);
      if (!couponResult.valid) {
        return NextResponse.json(
          { success: false, error: couponResult.error ?? 'Invalid coupon code.' },
          { status: 400 }
        );
      }
      discountAmount = couponResult.discountAmount;
      appliedCouponCode = couponResult.coupon!.code;
      appliedCouponId = couponResult.coupon!.id;
    }

    const totalAmount = calculatedSubtotal - discountAmount + shippingFee;

    // ── 3. Build iyzico payment request ─────────────────────────
    const orderId = `ESTO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`;

    // Split full name into first / last
    const nameParts = shippingDetails.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];

    // Normalize card fields
    const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    // Frontend sends "YY", iyzico needs "YYYY"
    const expireYear = cardDetails.expireYear.length === 2
      ? `20${cardDetails.expireYear}`
      : cardDetails.expireYear;

    // Buyer IP — fall back to the rate-limit IP computed above; iyzico wants a non-empty value
    const ip = ip0 !== 'unknown' ? ip0 : '0.0.0.0';

    // iyzico requires basketItems prices to sum to `price` (subtotal, not paidPrice).
    // Distribute subtotal across line items proportionally (avoid floating point drift).
    const basketItems = mappedItems.map((item) => ({
      id: item.id,
      name: item.name,
      category1: 'Coffee',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toFixed(2),
    }));

    const iyzipayRequest = {
      conversationId: orderId,
      price: calculatedSubtotal.toFixed(2),
      paidPrice: totalAmount.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: orderId,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: cardDetails.cardHolderName,
        cardNumber: cleanCardNumber,
        expireMonth: cardDetails.expireMonth,
        expireYear,
        cvc: cardDetails.cvc,
        registerCard: '0',
      },
      buyer: {
        id: shippingDetails.email,
        name: firstName,
        surname: lastName,
        gsmNumber: shippingDetails.phone.startsWith('+') ? shippingDetails.phone : `+90${shippingDetails.phone}`,
        email: shippingDetails.email,
        identityNumber: '11111111111', // Guest placeholder — collect TC Kimlik for KYC if needed
        registrationAddress: isPickup ? PICKUP_ADDRESS.line : shippingDetails.address,
        ip,
        city: isPickup ? PICKUP_ADDRESS.city : shippingDetails.city,
        country: 'Turkey',
        zipCode: isPickup ? PICKUP_ADDRESS.zipCode : shippingDetails.zipCode,
      },
      shippingAddress: {
        contactName: shippingDetails.fullName,
        city: isPickup ? PICKUP_ADDRESS.city : shippingDetails.city,
        country: 'Turkey',
        address: isPickup ? PICKUP_ADDRESS.line : shippingDetails.address,
        zipCode: isPickup ? PICKUP_ADDRESS.zipCode : shippingDetails.zipCode,
      },
      billingAddress: {
        contactName: shippingDetails.fullName,
        city: isPickup ? PICKUP_ADDRESS.city : shippingDetails.city,
        country: 'Turkey',
        address: isPickup ? PICKUP_ADDRESS.line : shippingDetails.address,
        zipCode: isPickup ? PICKUP_ADDRESS.zipCode : shippingDetails.zipCode,
      },
      basketItems,
    };

    // Detected once, up front, so it can be persisted on the order and reused
    // later (e.g. shipped-notification emails) — not just the confirmation email.
    let detectedLocale = locale;
    if (!detectedLocale) {
      const referer = request.headers.get('referer') || '';
      detectedLocale = (referer.includes('/en/') || referer.endsWith('/en')) ? 'en' : 'tr';
    }

    // ── 4. Charge via iyzico ─────────────────────────────────────
    const paymentResult = await createPayment(iyzipayRequest);

    if (paymentResult.status !== 'success') {
      return NextResponse.json(
        {
          success: false,
          error: paymentResult.errorMessage ?? 'Payment was declined. Please check your card details.',
          errorCode: paymentResult.errorCode,
        },
        { status: 402 }
      );
    }

    // ── 5. Payment succeeded — persist order + decrement stock atomically ──
    //
    // From here on the card has already been charged. If anything in this block
    // fails (DB error, or another checkout winning a stock race in the meantime),
    // we must void the charge before returning an error — otherwise the customer
    // is left charged with no order and no way for support to find it.

    let newOrder;
    try {
      newOrder = await db.$transaction(async (tx) => {
        // Wholesale keeps the pre-existing unconditional decrement (bulk/backorder
        // model). Retail gets a conditional decrement so two near-simultaneous
        // checkouts for the last unit in stock can't both succeed.
        for (const [baseId, qty] of requestedTotals.entries()) {
          if (isWholesale) {
            await tx.product.update({ where: { id: baseId }, data: { stock: { decrement: qty } } });
            continue;
          }
          const result = await tx.product.updateMany({
            where: { id: baseId, stock: { gte: qty } },
            data: { stock: { decrement: qty } },
          });
          if (result.count === 0) {
            throw new StockConflictError(baseId);
          }
        }

        if (appliedCouponId) {
          await tx.coupon.update({ where: { id: appliedCouponId }, data: { usedCount: { increment: 1 } } });
        }

        return tx.order.create({
          data: {
            id: orderId,
            email: shippingDetails.email,
            fullName: shippingDetails.fullName,
            locale: detectedLocale,
            phone: shippingDetails.phone,
            address: isPickup
              ? `${PICKUP_LABEL}: ${PICKUP_ADDRESS.line}, ${PICKUP_ADDRESS.city} ${PICKUP_ADDRESS.zipCode}`
              : `${shippingDetails.address}, ${shippingDetails.city} ${shippingDetails.zipCode}`,
            paymentId: paymentResult.paymentId ?? '',
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
      console.error('Checkout: order transaction failed after successful payment — voiding charge.', txError);

      const voidResult = await cancelPayment(paymentResult.paymentId ?? '', ip).catch((voidErr) => {
        console.error('Checkout: CRITICAL — payment void also failed after order-transaction failure.', voidErr);
        return null;
      });
      const voided = voidResult?.status === 'success';

      await sendCheckoutFailsafeAlert({
        attemptedOrderId: orderId,
        email: shippingDetails.email,
        totalAmount,
        paymentId: paymentResult.paymentId ?? '',
        reason: isStockConflict
          ? `Item "${(txError as StockConflictError).productId}" sold out between stock check and order creation.`
          : String(txError instanceof Error ? txError.message : txError),
        voided,
      });

      return NextResponse.json(
        {
          success: false,
          error: isStockConflict
            ? 'One or more items in your cart just sold out. Your payment was not completed.'
            : 'We could not complete your order after payment. Any charge has been automatically reversed — please try again, or contact support if you were still charged.',
        },
        { status: isStockConflict ? 409 : 500 }
      );
    }

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

    // Only alert when a product crosses the threshold on this order (was above it,
    // is now at or below it) — avoids re-sending the same alert on every subsequent order.
    const newlyLowStock = Array.from(requestedTotals.entries())
      .map(([baseId, qty]) => {
        const before = productMap.get(baseId);
        if (!before) return null;
        const after = before.stock - qty;
        return before.stock > LOW_STOCK_THRESHOLD && after <= LOW_STOCK_THRESHOLD
          ? { id: before.id, name: before.name, stock: Math.max(after, 0) }
          : null;
      })
      .filter((p): p is { id: string; name: string; stock: number } => p !== null);

    await Promise.all([
      sendOrderConfirmationEmail(orderEmailDetails),
      sendOwnerNewOrderNotification(orderEmailDetails),
      ...(newlyLowStock.length > 0 ? [sendLowStockAlert(newlyLowStock)] : []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orderId: newOrder.id,
        subtotal: newOrder.subtotal,
        shippingFee: newOrder.shippingFee,
        discountAmount: newOrder.discountAmount,
        couponCode: newOrder.couponCode,
        totalAmount: newOrder.totalAmount,
        email: newOrder.email,
        paymentId: paymentResult.paymentId,
      },
      error: null,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
