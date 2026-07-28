import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** GET /api/admin/blog — returns all blog posts */
export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: posts, error: null });
  } catch (error) {
    console.error('Failed to fetch admin blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching blog posts.' },
      { status: 500 }
    );
  }
}

/** POST /api/admin/blog — create a new blog post */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleEn, titleTr, contentEn, contentTr, category, imageUrl } = body as {
      titleEn?: string;
      titleTr?: string;
      contentEn?: string;
      contentTr?: string;
      category?: string;
      imageUrl?: string;
    };

    if (!titleEn?.trim() || !titleTr?.trim() || !contentEn?.trim() || !contentTr?.trim() || !category?.trim()) {
      return NextResponse.json(
        { success: false, error: 'All fields (English/Turkish Title and Content, and Category) are required.' },
        { status: 400 }
      );
    }

    const post = await db.blogPost.create({
      data: {
        titleEn: titleEn.trim(),
        titleTr: titleTr.trim(),
        contentEn: contentEn.trim(),
        contentTr: contentTr.trim(),
        category: category.trim(),
        imageUrl: imageUrl?.trim() ?? '',
      },
    });

    return NextResponse.json({ success: true, data: post, error: null });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error creating blog post.' },
      { status: 500 }
    );
  }
}

/** PUT /api/admin/blog — edit an existing blog post */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, titleEn, titleTr, contentEn, contentTr, category, imageUrl } = body as {
      id?: string;
      titleEn?: string;
      titleTr?: string;
      contentEn?: string;
      contentTr?: string;
      category?: string;
      imageUrl?: string;
    };

    if (!id || !titleEn?.trim() || !titleTr?.trim() || !contentEn?.trim() || !contentTr?.trim() || !category?.trim()) {
      return NextResponse.json(
        { success: false, error: 'ID and all fields are required.' },
        { status: 400 }
      );
    }

    const updated = await db.blogPost.update({
      where: { id },
      data: {
        titleEn: titleEn.trim(),
        titleTr: titleTr.trim(),
        contentEn: contentEn.trim(),
        contentTr: contentTr.trim(),
        category: category.trim(),
        imageUrl: imageUrl?.trim() ?? '',
      },
    });

    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error updating blog post.' },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/blog?id=... — remove a blog post */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Blog post ID is required.' },
        { status: 400 }
      );
    }

    await db.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id }, error: null });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting blog post.' },
      { status: 500 }
    );
  }
}
