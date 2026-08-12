import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** GET /api/admin/shipping-settings — returns the singleton shipping settings row */
export async function GET() {
  try {
    const settings = await db.shippingSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, enabled: false },
    });
    return NextResponse.json({ success: true, data: settings, error: null });
  } catch (error) {
    console.error('Failed to fetch shipping settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching shipping settings.' },
      { status: 500 }
    );
  }
}

/** PUT /api/admin/shipping-settings — toggle whether checkout charges shipping */
export async function PUT(request: Request) {
  try {
    const { enabled } = await request.json();

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: '"enabled" must be a boolean.' },
        { status: 400 }
      );
    }

    const settings = await db.shippingSettings.upsert({
      where: { id: 1 },
      update: { enabled },
      create: { id: 1, enabled },
    });

    return NextResponse.json({ success: true, data: settings, error: null });
  } catch (error) {
    console.error('Failed to update shipping settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error updating shipping settings.' },
      { status: 500 }
    );
  }
}
