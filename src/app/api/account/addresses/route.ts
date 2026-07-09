import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: addresses, error: null });
  } catch (error) {
    console.error('List addresses error:', error);
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
    const { fullName, address, city, zipCode, phone, isDefault } = body as {
      fullName?: string;
      address?: string;
      city?: string;
      zipCode?: string;
      phone?: string;
      isDefault?: boolean;
    };

    if (!fullName || !address || !city || !zipCode) {
      return NextResponse.json(
        { success: false, error: 'Full name, address, city and zip code are required.' },
        { status: 400 }
      );
    }

    if (isDefault) {
      await db.address.updateMany({ where: { customerId }, data: { isDefault: false } });
    }

    const created = await db.address.create({
      data: {
        customerId,
        fullName: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),
        phone: (phone ?? '').trim(),
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, data: created, error: null });
  } catch (error) {
    console.error('Create address error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
