import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { createCard } from '@/lib/iyzipay';

export async function GET(request: Request) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const methods = await db.paymentMethod.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        cardAlias: true,
        lastFourDigits: true,
        cardAssociation: true,
        cardFamily: true,
        cardBankName: true,
        isDefault: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: methods, error: null });
  } catch (error) {
    console.error('List payment methods error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const body = await request.json();
    const { cardHolderName, cardNumber, expireMonth, expireYear, cardAlias, isDefault } = body as {
      cardHolderName?: string;
      cardNumber?: string;
      expireMonth?: string;
      expireYear?: string;
      cardAlias?: string;
      isDefault?: boolean;
    };

    if (!cardHolderName || !cardNumber || !expireMonth || !expireYear) {
      return NextResponse.json(
        { success: false, error: 'Card holder name, number and expiry are required.' },
        { status: 400 }
      );
    }

    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Account not found.' }, { status: 404 });
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const normalizedExpireYear = expireYear.length === 2 ? `20${expireYear}` : expireYear;

    const cardResult = await createCard({
      email: customer.email,
      externalId: customer.id,
      ...(customer.iyzicoCardUserKey && { cardUserKey: customer.iyzicoCardUserKey }),
      card: {
        cardAlias: cardAlias || `${cleanCardNumber.slice(-4)}`,
        cardNumber: cleanCardNumber,
        expireYear: normalizedExpireYear,
        expireMonth,
        cardHolderName,
      },
    });

    if (cardResult.status !== 'success' || !cardResult.cardToken || !cardResult.cardUserKey) {
      return NextResponse.json(
        { success: false, error: cardResult.errorMessage || 'Could not save card.' },
        { status: 400 }
      );
    }

    if (!customer.iyzicoCardUserKey) {
      await db.customer.update({
        where: { id: customerId },
        data: { iyzicoCardUserKey: cardResult.cardUserKey },
      });
    }

    if (isDefault) {
      await db.paymentMethod.updateMany({ where: { customerId }, data: { isDefault: false } });
    }

    const saved = await db.paymentMethod.create({
      data: {
        customerId,
        cardToken: cardResult.cardToken,
        cardAlias: cardResult.cardAlias || '',
        lastFourDigits: cardResult.lastFourDigits || cleanCardNumber.slice(-4),
        cardAssociation: cardResult.cardAssociation || '',
        cardFamily: cardResult.cardFamily || '',
        cardBankName: cardResult.cardBankName || '',
        isDefault: Boolean(isDefault),
      },
      select: {
        id: true,
        cardAlias: true,
        lastFourDigits: true,
        cardAssociation: true,
        cardFamily: true,
        cardBankName: true,
        isDefault: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: saved, error: null });
  } catch (error) {
    console.error('Save payment method error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
