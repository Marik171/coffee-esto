import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: products, error: null });
  } catch (error) {
    console.error('Failed to retrieve products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products inventory.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id, name, category, origin, altitude,
      varietal, roastLevel, tastingNotes, description,
      price, stock, imageUrl, videoUrl, isActive,
    } = body;

    if (!id || !name || !category || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID, name, category, and price are required.' },
        { status: 400 }
      );
    }

    const existing = await db.product.findUnique({ where: { id: id.trim() } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Product "${id}" already exists.` },
        { status: 400 }
      );
    }

    const newProduct = await db.product.create({
      data: {
        id: id.trim().toLowerCase(),
        name,
        category,
        origin: origin || '',
        altitude: altitude || '',
        varietal: varietal || '',
        roastLevel: Number(roastLevel) || 50,
        tastingNotes: tastingNotes || '',
        description: description || '',
        price: Number(price),
        stock: Number(stock) || 0,
        imageUrl: imageUrl || '',
        videoUrl: videoUrl || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, data: newProduct, error: null });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error saving new product.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id, name, category, origin, altitude,
      varietal, roastLevel, tastingNotes, description,
      price, stock, imageUrl, videoUrl, isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for updates.' },
        { status: 400 }
      );
    }

    const updated = await db.product.update({
      where: { id },
      data: {
        name,
        category,
        origin,
        altitude,
        varietal,
        roastLevel:   roastLevel !== undefined ? Number(roastLevel) : undefined,
        tastingNotes,
        description,
        price:        price !== undefined ? Number(price) : undefined,
        stock:        stock !== undefined ? Number(stock) : undefined,
        imageUrl:     imageUrl !== undefined ? imageUrl : undefined,
        videoUrl:     videoUrl !== undefined ? videoUrl : undefined,
        isActive:     isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error modifying product.' },
      { status: 500 }
    );
  }
}

// Soft-delete: sets isActive = false so order history stays intact.
// Products with past orders must never be hard-deleted.
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('Failed to deactivate product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deactivating product.' },
      { status: 500 }
    );
  }
}
