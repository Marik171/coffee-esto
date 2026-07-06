import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Exclude public and auth endpoints from inspection
  if (
    pathname === '/admin/login' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/checkout') ||
    pathname.startsWith('/api/orders/track') ||
    pathname.startsWith('/api/products') ||
    pathname.startsWith('/api/categories')
  ) {
    return NextResponse.next();
  }

  // 2. Protect administrative routes and upload endpoint
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Authorization credentials missing.' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Session credentials invalid or expired.' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Force Node.js runtime so crypto.subtle and the HMAC auth module resolve correctly
export const runtime = 'nodejs';

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/upload',
  ],
};
