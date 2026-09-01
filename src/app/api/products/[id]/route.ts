import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const cleanId = id.trim().toLowerCase();

    const cacheKey = `product_${cleanId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        error: null,
      });
    }

    const product = await db.product.findUnique({
      where: { id: cleanId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Coffee roast profile not found or inactive.' },
        { status: 404 }
      );
    }

    setCached(cacheKey, product, 60);

    return NextResponse.json({
      success: true,
      data: product,
      error: null,
    });

  } catch (error) {
    console.error('Failed to query single product details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error resolving coffee roast details.' },
      { status: 500 }
    );
  }
}
