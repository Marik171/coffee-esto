import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    console.log("SERVER API PRODUCTS FIRST:", products[0]);
    return NextResponse.json({ success: true, data: products, error: null });
  } catch (error) {
    console.error('Failed to query public products:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error retrieving coffee catalog.' },
      { status: 500 }
    );
  }
}
