import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** GET /api/admin/categories — returns all categories */
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { label: 'asc' },
    });

    // Attach product count per category
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await db.product.count({ where: { category: cat.slug } });
        return { ...cat, productCount: count };
      })
    );

    return NextResponse.json({ success: true, data: withCounts, error: null });
  } catch (error) {
    console.error('Failed to fetch admin categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching categories.' },
      { status: 500 }
    );
  }
}

/** POST /api/admin/categories — create a new category */
export async function POST(request: Request) {
  try {
    const { label } = await request.json();

    if (!label?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category label is required.' },
        { status: 400 }
      );
    }

    // Auto-generate slug from label
    const slug = label.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Category with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: { slug, label: label.trim() },
    });

    return NextResponse.json({ success: true, data: category, error: null });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error creating category.' },
      { status: 500 }
    );
  }
}

/** PUT /api/admin/categories — rename a category label */
export async function PUT(request: Request) {
  try {
    const { id, label } = await request.json();

    if (!id || !label?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category id and label are required.' },
        { status: 400 }
      );
    }

    const updated = await db.category.update({
      where: { id },
      data: { label: label.trim() },
    });

    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error updating category.' },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/categories?id=... — remove a category */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category id is required.' },
        { status: 400 }
      );
    }

    // Guard: block deletion if products reference this category
    const cat = await db.category.findUnique({ where: { id } });
    if (!cat) {
      return NextResponse.json(
        { success: false, error: 'Category not found.' },
        { status: 404 }
      );
    }

    const productCount = await db.product.count({ where: { category: cat.slug } });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete — ${productCount} product(s) are using this category. Reassign them first.` },
        { status: 409 }
      );
    }

    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting category.' },
      { status: 500 }
    );
  }
}
