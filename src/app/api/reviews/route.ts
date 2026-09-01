import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

/* ─────────────────────────────────────────────────────────────
   GET /api/reviews?productId=xxx
   Public — returns all reviews + aggregated stats for a product.
───────────────────────────────────────────────────────────── */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId')?.trim().toLowerCase();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId query parameter is required.' },
        { status: 400 }
      );
    }

    const reviews = await db.review.findMany({
      where: { productId, isHidden: false },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true, email: true },
        },
      },
    });

    // Build aggregated stats
    const total = reviews.length;
    const avgRating = total > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
      : 0;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) {
      if (r.rating >= 1 && r.rating <= 5) distribution[r.rating]++;
    }

    // Strip PII — only expose initials + display name
    const safeReviews = reviews.map((r) => {
      const displayName = r.customer.name?.trim() || r.customer.email.split('@')[0];
      const initials = displayName
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? '')
        .join('');

      return {
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
        displayName,
        initials,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        reviews: safeReviews,
        stats: { total, avgRating, distribution },
      },
      error: null,
    });
  } catch (error) {
    console.error('[GET /api/reviews] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reviews.' },
      { status: 500 }
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   POST /api/reviews
   Authenticated — requires a valid customer_token cookie.
   Body: { productId, rating, title?, body }
   One review per customer per product — re-submitting upserts.
───────────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    // Resolve customer from JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to submit a review.' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'customer' || typeof payload.customerId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Session invalid or expired. Please sign in again.' },
        { status: 401 }
      );
    }

    const customerId = payload.customerId;

    // Parse + validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    const { productId, rating, title, body: reviewBody } = body as {
      productId?: unknown;
      rating?: unknown;
      title?: unknown;
      body?: unknown;
    };

    if (typeof productId !== 'string' || !productId.trim()) {
      return NextResponse.json(
        { success: false, error: 'productId is required.' },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: 'rating must be an integer between 1 and 5.' },
        { status: 400 }
      );
    }

    if (typeof reviewBody !== 'string' || reviewBody.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Review body must be at least 5 characters.' },
        { status: 400 }
      );
    }

    if (reviewBody.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Review body must not exceed 1000 characters.' },
        { status: 400 }
      );
    }

    const cleanTitle = typeof title === 'string' ? title.trim().slice(0, 120) : '';

    // Verify the product actually exists
    const product = await db.product.findUnique({
      where: { id: productId.trim().toLowerCase() },
      select: { id: true, isActive: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    // Upsert — one review per customer per product
    const review = await db.review.upsert({
      where: {
        productId_customerId: {
          productId: productId.trim().toLowerCase(),
          customerId,
        },
      },
      create: {
        productId: productId.trim().toLowerCase(),
        customerId,
        rating: ratingNum,
        title: cleanTitle,
        body: reviewBody.trim(),
      },
      update: {
        rating: ratingNum,
        title: cleanTitle,
        body: reviewBody.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: review.id },
      error: null,
    });
  } catch (error) {
    console.error('[POST /api/reviews] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review.' },
      { status: 500 }
    );
  }
}
