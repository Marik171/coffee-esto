import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { initializeThreeDSPayment, Iyzipay } from '@/lib/iyzipay';
import { verifyToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimiter';
import { validateCoupon } from '@/lib/coupons';
import { PICKUP_LABEL, PICKUP_ADDRESS, getProductId, type PendingCheckoutPayload, type ShippingDetails } from '@/lib/checkoutShared';

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

    // ── 4. Start 3D Secure authentication via iyzico ─────────────
    // The card is NOT charged yet — iyzico returns an HTML page (shown to the
    // customer in an iframe) that hands them off to their bank. The bank
    // authenticates them and POSTs the result to our callback route, which is
    // what actually charges the card and creates the order.
    const callbackUrl = `${new URL(request.url).origin}/api/checkout/callback`;
    const threeDSResult = await initializeThreeDSPayment({ ...iyzipayRequest, callbackUrl });

    if (threeDSResult.status !== 'success' || !threeDSResult.threeDSHtmlContent) {
      return NextResponse.json(
        {
          success: false,
          error: threeDSResult.errorMessage ?? 'Payment was declined. Please check your card details.',
          errorCode: threeDSResult.errorCode,
        },
        { status: 402 }
      );
    }

    // Stash everything needed to build the order once the bank confirms —
    // no card data, just the already-locked-in prices/shipping/coupon inputs.
    const pendingPayload: PendingCheckoutPayload = {
      shippingDetails,
      mappedItems,
      isWholesale: !!isWholesale,
      isPickup,
      calculatedSubtotal,
      shippingFee,
      cargoProviderName,
      discountAmount,
      appliedCouponCode,
      appliedCouponId,
      totalAmount,
      ...(customerId && { customerId }),
      detectedLocale,
      ip,
    };
    await db.pendingCheckout.create({
      data: { id: orderId, payload: pendingPayload as unknown as object },
    });

    return NextResponse.json({
      success: true,
      data: {
        conversationId: orderId,
        threeDSHtmlContent: threeDSResult.threeDSHtmlContent,
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
