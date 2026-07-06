import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimiter';

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set.`);
  return val;
}

const ADMIN_EMAIL    = requireEnv('ADMIN_EMAIL');
const ADMIN_PASSWORD = requireEnv('ADMIN_PASSWORD');

// 5 attempts per 15-minute window per IP
const RATE_LIMIT    = 5;
const WINDOW_MS     = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    // ── Rate limiting ────────────────────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    const rate = checkRateLimit(`admin-login:${ip}`, RATE_LIMIT, WINDOW_MS);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Try again in ${rate.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      );
    }

    // ── Credentials check ────────────────────────────────────────
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (
      !email || !password ||
      email.toLowerCase().trim()  !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    // ── Issue session token ──────────────────────────────────────
    const token = await signToken({ email: ADMIN_EMAIL, role: 'admin' }, 86400);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400,
    });

    return NextResponse.json({ success: true, data: { email: ADMIN_EMAIL }, error: null });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
