import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        newsOptIn: customer.newsOptIn,
      },
      error: null,
    });
  } catch (error) {
    console.error('Get account error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, phone, newsOptIn } = body as {
      email?: string;
      name?: string;
      phone?: string;
      newsOptIn?: boolean;
    };

    const data: { email?: string; name?: string; phone?: string; newsOptIn?: boolean } = {};

    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await db.customer.findUnique({ where: { email: normalizedEmail } });
      if (existing && existing.id !== customerId) {
        return NextResponse.json({ success: false, error: 'That email is already in use.' }, { status: 409 });
      }
      data.email = normalizedEmail;
    }
    if (name !== undefined) data.name = name.trim();
    if (phone !== undefined) data.phone = phone.trim();
    if (newsOptIn !== undefined) data.newsOptIn = newsOptIn;

    const customer = await db.customer.update({ where: { id: customerId }, data });

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        newsOptIn: customer.newsOptIn,
      },
      error: null,
    });
  } catch (error) {
    console.error('Update account error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
