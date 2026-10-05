import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** GET /api/shipping — public endpoint the checkout page uses to render cargo options. */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await db.shippingSettings.findUnique({ where: { id: 1 } });
    const enabled = settings?.enabled ?? false;

    const providers = enabled
      ? await db.cargoProvider.findMany({
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          select: { id: true, name: true, fee: true },
        })
      : [];

    return NextResponse.json({ success: true, data: { enabled, providers }, error: null });
  } catch (error) {
    console.error('Failed to fetch shipping options:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching shipping options.' },
      { status: 500 }
    );
  }
}
