import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invalidateCache } from '@/lib/cache';

// Admin moderation — lists every review with the product name attached
// (Review.productId isn't a Prisma relation, so we join it manually).
export async function GET() {
  try {
    const [reviews, products] = await Promise.all([
      db.review.findMany({
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true, email: true } } },
      }),
      db.product.findMany({ select: { id: true, name: true } }),
    ]);

    const productNames = new Map(products.map((p) => [p.id, p.name]));

    const data = reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productName: productNames.get(r.productId) ?? r.productId,
      customerName: r.customer.name || r.customer.email,
      customerEmail: r.customer.email,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isHidden: r.isHidden,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    console.error('[GET /api/admin/reviews] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reviews.' },
      { status: 500 }
    );
  }
}

// Body: { id, isHidden }
export async function PUT(request: Request) {
  try {
    const { id, isHidden } = (await request.json()) as { id?: string; isHidden?: boolean };
    if (!id || typeof isHidden !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'id and isHidden are required.' },
        { status: 400 }
      );
    }
    await db.review.update({ where: { id }, data: { isHidden } });
    invalidateCache('reviews_');
    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('[PUT /api/admin/reviews] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review.' },
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
    await db.review.delete({ where: { id } });
    invalidateCache('reviews_');
    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('[DELETE /api/admin/reviews] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review.' },
      { status: 500 }
    );
  }
}
