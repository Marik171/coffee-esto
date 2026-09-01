import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Snapshots a customer's cart once they've entered an email, so we can
// send a recovery reminder if they never complete checkout.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, items, subtotal, locale } = body as {
      email?: string;
      name?: string;
      items?: { name: string; quantity: number; price: number }[];
      subtotal?: number;
      locale?: string;
    };

    if (!email || !email.includes('@') || !Array.isArray(items) || items.length === 0 || typeof subtotal !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid cart snapshot.' }, { status: 400 });
    }

    await db.abandonedCart.upsert({
      where: { email },
      create: {
        email,
        name: name ?? '',
        items,
        subtotal,
        locale: locale === 'en' ? 'en' : 'tr',
      },
      update: {
        name: name ?? '',
        items,
        subtotal,
        locale: locale === 'en' ? 'en' : 'tr',
        recovered: false,
        reminderSentAt: null,
      },
    });

    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('[POST /api/cart/track] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track cart.' }, { status: 500 });
  }
}
