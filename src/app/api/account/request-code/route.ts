import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimiter';
import { generateCode, hashCode, CODE_TTL_MS } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/mailer';

// 5 code requests per 15-minute window per IP+email pair
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const rate = checkRateLimit(`account-request-code:${ip}:${normalizedEmail}`, RATE_LIMIT, WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Try again in ${rate.retryAfterSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const code = generateCode();

    await db.loginCode.create({
      data: {
        email: normalizedEmail,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    await sendVerificationEmail(normalizedEmail, code);

    return NextResponse.json({ success: true, data: { email: normalizedEmail }, error: null });

  } catch (error) {
    console.error('Request code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error requesting verification code.' },
      { status: 500 }
    );
  }
}
