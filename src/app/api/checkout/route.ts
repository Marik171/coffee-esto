import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { createPayment, Iyzipay } from '@/lib/iyzipay';
import { verifyToken } from '@/lib/auth';

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
    const body = await request.json();
    const { items, shippingDetails, cardDetails, isWholesale } = body as {
      items: CheckoutItem[];
      shippingDetails: ShippingDetails;
      cardDetails: CardDetails;
      isWholesale?: boolean;
    };

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

    if (!shippingDetails?.email || !shippingDetails?.fullName ||
        !shippingDetails?.address || !shippingDetails?.city ||
        !shippingDetails?.phone || !shippingDetails?.zipCode) {
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

    const shippingFee = isWholesale ? 0 : (calculatedSubtotal >= 500 ? 0 : 35);
    const totalAmount = calculatedSubtotal + shippingFee;

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

    // Buyer IP from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? '0.0.0.0';

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
        registrationAddress: shippingDetails.address,
        ip,
        city: shippingDetails.city,
        country: 'Turkey',
        zipCode: shippingDetails.zipCode,
      },
      shippingAddress: {
        contactName: shippingDetails.fullName,
        city: shippingDetails.city,
        country: 'Turkey',
        address: shippingDetails.address,
        zipCode: shippingDetails.zipCode,
      },
      billingAddress: {
        contactName: shippingDetails.fullName,
        city: shippingDetails.city,
        country: 'Turkey',
        address: shippingDetails.address,
        zipCode: shippingDetails.zipCode,
      },
      basketItems,
    };

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


    const [newOrder] = await db.$transaction([
      db.order.create({
        data: {
          id: orderId,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: `${shippingDetails.address}, ${shippingDetails.city} ${shippingDetails.zipCode}`,
          paymentId: paymentResult.paymentId ?? '',
          subtotal: calculatedSubtotal,
          shippingFee,
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
      }),
      ...Array.from(requestedTotals.entries()).map(([baseId, qty]) =>
        db.product.update({
          where: { id: baseId },
          data: { stock: { decrement: qty } },
        })
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orderId: newOrder.id,
        subtotal: newOrder.subtotal,
        shippingFee: newOrder.shippingFee,
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
