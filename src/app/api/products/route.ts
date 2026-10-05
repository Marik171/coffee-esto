import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cached = getCached('products_public');
    if (cached) {
      return NextResponse.json({ success: true, data: cached, error: null });
    }

    const products = await db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    setCached('products_public', products, 60);

    return NextResponse.json({ success: true, data: products, error: null });
  } catch (error) {
    console.error('Failed to query public products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error retrieving coffee catalog.' },
      { status: 500 }
    );
  }
}
