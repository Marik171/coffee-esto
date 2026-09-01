import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: coupons, error: null });
  } catch (error) {
    console.error('[GET /api/admin/coupons] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve coupons.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, minOrderAmount, maxUses, expiresAt, isActive } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Code, type, and value are required.' },
        { status: 400 }
      );
    }
    if (type !== 'percent' && type !== 'fixed') {
      return NextResponse.json(
        { success: false, error: 'type must be "percent" or "fixed".' },
        { status: 400 }
      );
    }
    const numValue = Number(value);
    if (!Number.isFinite(numValue) || numValue <= 0 || (type === 'percent' && numValue > 100)) {
      return NextResponse.json(
        { success: false, error: 'Invalid discount value.' },
        { status: 400 }
      );
    }

    const cleanCode = String(code).trim().toUpperCase();
    const existing = await db.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Coupon "${cleanCode}" already exists.` },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: cleanCode,
        type,
        value: numValue,
        minOrderAmount: Number(minOrderAmount) || 0,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, data: coupon, error: null });
  } catch (error) {
    console.error('[POST /api/admin/coupons] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, code, type, value, minOrderAmount, maxUses, expiresAt, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required for updates.' },
        { status: 400 }
      );
    }

    const updated = await db.coupon.update({
      where: { id },
      data: {
        code: code !== undefined ? String(code).trim().toUpperCase() : undefined,
        type: type !== undefined ? type : undefined,
        value: value !== undefined ? Number(value) : undefined,
        minOrderAmount: minOrderAmount !== undefined ? Number(minOrderAmount) : undefined,
        maxUses: maxUses !== undefined ? (maxUses === null || maxUses === '' ? null : Number(maxUses)) : undefined,
        expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('[PUT /api/admin/coupons] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required.' }, { status: 400 });
    }
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('[DELETE /api/admin/coupons] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon.' },
      { status: 500 }
    );
  }
}
