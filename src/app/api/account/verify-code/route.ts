import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimiter';
import { hashCode, MAX_VERIFY_ATTEMPTS } from '@/lib/otp';
import { signToken } from '@/lib/auth';

// 10 verify attempts per 15-minute window per IP+email pair
const RATE_LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body as { email?: string; code?: string };

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const rate = checkRateLimit(`account-verify-code:${ip}:${normalizedEmail}`, RATE_LIMIT, WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Try again in ${rate.retryAfterSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
      );
    }

    const loginCode = await db.loginCode.findFirst({
      where: { email: normalizedEmail, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!loginCode || loginCode.attempts >= MAX_VERIFY_ATTEMPTS) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code.' },
        { status: 401 }
      );
    }

    if (loginCode.codeHash !== hashCode(code.trim())) {
      await db.loginCode.update({
        where: { id: loginCode.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code.' },
        { status: 401 }
      );
    }

    await db.loginCode.update({
      where: { id: loginCode.id },
      data: { consumedAt: new Date() },
    });

    const customer = await db.customer.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
    });

    const token = await signToken({ customerId: customer.id, role: 'customer' }, 60 * 60 * 24 * 30);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'customer_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        newsOptIn: customer.newsOptIn,
      },
      error: null,
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying code.' },
      { status: 500 }
    );
  }
}
