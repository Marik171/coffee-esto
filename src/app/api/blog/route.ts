import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const posts = await db.blogPost.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
    });

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
