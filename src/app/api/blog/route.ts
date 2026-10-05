import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    const cacheKey = `blog_${category}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        error: null,
      });
    }

    const posts = await db.blogPost.findMany({
      where: category !== 'all' ? { category } : {},
      orderBy: { createdAt: 'desc' },
    });

    setCached(cacheKey, posts, 60);

    return NextResponse.json({
      success: true,
      data: posts,
      error: null,
    });
  } catch (error) {
    console.error('Fetch blog posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load blog posts.' },
      { status: 500 }
    );
  }
}
