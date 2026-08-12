import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimiter';
import { sendWholesaleInquiryNotification } from '@/lib/emails';

const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, city, zip, company, website, message, locale } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      city?: string;
      zip?: string;
      company?: string;
      website?: string;
      message?: string;
      locale?: string;
    };

    if (
      !firstName || !lastName || !email || !city || !message ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, a valid email, city, and a message are required.' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const rate = checkRateLimit(`wholesale-form:${ip}`, RATE_LIMIT, WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Try again in ${rate.retryAfterSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    await sendWholesaleInquiryNotification({
      firstName, lastName, email, phone, city, zip, company, website, message, locale,
    });

    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error) {
    console.error('Wholesale form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error sending inquiry.' },
      { status: 500 }
    );
  }
}
