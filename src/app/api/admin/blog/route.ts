import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invalidateCache } from '@/lib/cache';


/** True when an HTML string has visible text or embedded media (editors leave "<br>" behind when cleared). */
function hasContent(html?: string): boolean {
  if (!html) return false;
  if (/<(img|video)\b/i.test(html)) return true;
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;
}

/**
 * A post needs at least one complete language (title + content). The other language may be left
 * empty — the storefront falls back to whichever one exists. Returns cleaned fields or an error.
 */
function normalizeBlogFields(input: {
  titleEn?: string; titleTr?: string; contentEn?: string; contentTr?: string; category?: string; imageUrl?: string;
}) {
  const hasTr = !!input.titleTr?.trim() && hasContent(input.contentTr);
  const hasEn = !!input.titleEn?.trim() && hasContent(input.contentEn);

  if (!input.category?.trim()) return { error: 'Category is required.' } as const;
  if (!hasTr && !hasEn) {
    return { error: 'Add a title and content in at least one language (Turkish or English).' } as const;
  }

  return {
    data: {
      titleTr: hasTr ? input.titleTr!.trim() : '',
      contentTr: hasTr ? input.contentTr!.trim() : '',
      titleEn: hasEn ? input.titleEn!.trim() : '',
      contentEn: hasEn ? input.contentEn!.trim() : '',
      category: input.category.trim(),
      imageUrl: input.imageUrl?.trim() ?? '',
    },
  } as const;
}

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

    const normalized = normalizeBlogFields({ titleEn, titleTr, contentEn, contentTr, category, imageUrl });
    if ('error' in normalized) {
      return NextResponse.json({ success: false, error: normalized.error }, { status: 400 });
    }

    const post = await db.blogPost.create({ data: normalized.data });

    invalidateCache('blog_');

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

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog post ID is required.' }, { status: 400 });
    }

    const normalized = normalizeBlogFields({ titleEn, titleTr, contentEn, contentTr, category, imageUrl });
    if ('error' in normalized) {
      return NextResponse.json({ success: false, error: normalized.error }, { status: 400 });
    }

    const updated = await db.blogPost.update({ where: { id }, data: normalized.data });

    invalidateCache('blog_');

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

    invalidateCache('blog_');

    return NextResponse.json({ success: true, data: { id }, error: null });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting blog post.' },
      { status: 500 }
    );
  }
}
