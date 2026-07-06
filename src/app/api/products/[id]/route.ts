import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const product = await db.product.findUnique({
      where: { id: id.trim().toLowerCase() },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Coffee roast profile not found or inactive.' },
        { status: 404 }
      );
    }

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
