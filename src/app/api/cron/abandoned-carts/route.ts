import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendAbandonedCartEmail } from '@/lib/emails';

// Reminds customers who left items in their cart 1+ hour ago and haven't
// checked out, capped at carts under 3 days old so we don't email stale leads.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const now = Date.now();
    const carts = await db.abandonedCart.findMany({
      where: {
        recovered: false,
        reminderSentAt: null,
        createdAt: {
          lte: new Date(now - 60 * 60 * 1000),
          gte: new Date(now - 3 * 24 * 60 * 60 * 1000),
        },
      },
    });

    let sent = 0;
    for (const cart of carts) {
      try {
        await sendAbandonedCartEmail({
          email: cart.email,
          name: cart.name || undefined,
          items: cart.items as { name: string; quantity: number; price: number }[],
          subtotal: cart.subtotal,
          locale: cart.locale,
        });
        await db.abandonedCart.update({ where: { id: cart.id }, data: { reminderSentAt: new Date() } });
        sent += 1;
      } catch (err) {
        console.error(`[cron/abandoned-carts] failed to email ${cart.email}:`, err);
      }
    }

    return NextResponse.json({ success: true, data: { checked: carts.length, sent }, error: null });
  } catch (error) {
    console.error('[GET /api/cron/abandoned-carts] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process abandoned carts.' }, { status: 500 });
  }
}
