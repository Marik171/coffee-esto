import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invalidateCache } from '@/lib/cache';

export async function GET() {
  try {
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

    return NextResponse.json({ success: true, data: settings, error: null });
  } catch (error) {
    console.error('Failed to get storefront settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching storefront settings.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      announcementEnabled,
      announcementTextTr,
      announcementTextEn,
      announcementBg,
      announcementLink,
      spotlightProductId,
      holidayModeEnabled,
      holidayNoticeTr,
      holidayNoticeEn,
    } = body;

    const updated = await db.storefrontSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        announcementEnabled: announcementEnabled !== undefined ? Boolean(announcementEnabled) : true,
        announcementTextTr: announcementTextTr || '☕ 2.000 TL ve üzeri tüm siparişlerde Kargo ÜCRETSİZ!',
        announcementTextEn: announcementTextEn || '☕ Free Shipping on all orders over ₺2,000!',
        announcementBg: announcementBg || 'linear-gradient(90deg, #2a170c 0%, #4a2817 100%)',
        announcementLink: announcementLink || '/coffee',
        spotlightProductId: spotlightProductId || 'ethiopia',
        holidayModeEnabled: holidayModeEnabled !== undefined ? Boolean(holidayModeEnabled) : false,
        holidayNoticeTr: holidayNoticeTr || '',
        holidayNoticeEn: holidayNoticeEn || '',
      },
      update: {
        announcementEnabled: announcementEnabled !== undefined ? Boolean(announcementEnabled) : undefined,
        announcementTextTr: announcementTextTr !== undefined ? announcementTextTr : undefined,
        announcementTextEn: announcementTextEn !== undefined ? announcementTextEn : undefined,
        announcementBg: announcementBg !== undefined ? announcementBg : undefined,
        announcementLink: announcementLink !== undefined ? announcementLink : undefined,
        spotlightProductId: spotlightProductId !== undefined ? spotlightProductId : undefined,
        holidayModeEnabled: holidayModeEnabled !== undefined ? Boolean(holidayModeEnabled) : undefined,
        holidayNoticeTr: holidayNoticeTr !== undefined ? holidayNoticeTr : undefined,
        holidayNoticeEn: holidayNoticeEn !== undefined ? holidayNoticeEn : undefined,
      },
    });

    invalidateCache('storefront_settings');

    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('Failed to update storefront settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error saving storefront settings.' },
      { status: 500 }
    );
  }
}
