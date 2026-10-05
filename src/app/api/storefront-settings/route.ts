import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cached = getCached('storefront_settings');
    if (cached) {
      return NextResponse.json({ success: true, data: cached, error: null });
    }

    let settings = await db.storefrontSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await db.storefrontSettings.create({
        data: {
          id: 1,
          announcementEnabled: true,
          announcementTextTr: '☕ 2.000 TL ve üzeri tüm siparişlerde Kargo ÜCRETSİZ!',
          announcementTextEn: '☕ Free Shipping on all orders over ₺2,000!',
          announcementBg: 'linear-gradient(90deg, #2a170c 0%, #4a2817 100%)',
          announcementLink: '/coffee',
          spotlightProductId: 'ethiopia',
          holidayModeEnabled: false,
          holidayNoticeTr: '',
          holidayNoticeEn: '',
        },
      });
    }

    setCached('storefront_settings', settings, 60);

    return NextResponse.json({ success: true, data: settings, error: null });
  } catch (error) {
    console.error('Failed to get public storefront settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching announcement settings.' },
      { status: 500 }
    );
  }
}
