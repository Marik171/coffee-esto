import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** GET /api/categories — public: returns all categories sorted by label */
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { label: 'asc' },
    });
    return NextResponse.json({ success: true, data: categories, error: null });
  } catch (error) {
    console.error('Failed to fetch public categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching categories.' },
      { status: 500 }
    );
  }
}
