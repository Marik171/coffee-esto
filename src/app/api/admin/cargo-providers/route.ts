import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** GET /api/admin/cargo-providers — returns all cargo providers */
export async function GET() {
  try {
    const providers = await db.cargoProvider.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ success: true, data: providers, error: null });
  } catch (error) {
    console.error('Failed to fetch cargo providers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching cargo providers.' },
      { status: 500 }
    );
  }
}

/** POST /api/admin/cargo-providers — create a new cargo provider */
export async function POST(request: Request) {
  try {
    const { name, fee, isActive, sortOrder } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Provider name is required.' },
        { status: 400 }
      );
    }
    const feeNum = Number(fee);
    if (!Number.isFinite(feeNum) || feeNum < 0) {
      return NextResponse.json(
        { success: false, error: 'Shipping fee must be a non-negative number.' },
        { status: 400 }
      );
    }

    const provider = await db.cargoProvider.create({
      data: {
        name: name.trim(),
        fee: feeNum,
        isActive: isActive ?? true,
        sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, data: provider, error: null });
  } catch (error) {
    console.error('Failed to create cargo provider:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error creating cargo provider.' },
      { status: 500 }
    );
  }
}

/** PUT /api/admin/cargo-providers — update a cargo provider */
export async function PUT(request: Request) {
  try {
    const { id, name, fee, isActive, sortOrder } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Provider id is required.' },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) {
      if (!name?.trim()) {
        return NextResponse.json(
          { success: false, error: 'Provider name cannot be empty.' },
          { status: 400 }
        );
      }
      data.name = name.trim();
    }
    if (fee !== undefined) {
      const feeNum = Number(fee);
      if (!Number.isFinite(feeNum) || feeNum < 0) {
        return NextResponse.json(
          { success: false, error: 'Shipping fee must be a non-negative number.' },
          { status: 400 }
        );
      }
      data.fee = feeNum;
    }
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder) || 0;

    const updated = await db.cargoProvider.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('Failed to update cargo provider:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error updating cargo provider.' },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/cargo-providers?id=... — remove a cargo provider */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Provider id is required.' },
        { status: 400 }
      );
    }

    await db.cargoProvider.delete({ where: { id } });
    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('Failed to delete cargo provider:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting cargo provider.' },
      { status: 500 }
    );
  }
}
