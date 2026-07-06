import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// script-src needs 'unsafe-eval' in dev for React error overlay / HMR.
// In production, eval is never used by Next.js or React.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const cspDirectives = [
  "default-src 'self'",
  scriptSrc,
  // CSS Modules use inline styles; Google Fonts stylesheet loaded as <link>
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // data: covers Next.js font subsetting (base64-inlined woff2)
  // fonts.gstatic.com serves the actual Google Fonts binary files
  "font-src 'self' data: https://fonts.gstatic.com",
  // Supabase CDN for product images/videos; Google Maps tile servers
  "img-src 'self' data: blob: https://*.supabase.co https://maps.gstatic.com https://*.googleapis.com",
  "media-src 'self' blob: https://*.supabase.co",
  // iyzico API calls are server-side — only Supabase needs browser connect; Maps JS uses googleapis
  "connect-src 'self' https://*.supabase.co https://api.iyzipay.com https://sandbox-api.iyzipay.com https://*.googleapis.com",
  // Google Maps embeds require google.com and maps.google.com frames
  "frame-src 'self' https://www.google.com https://maps.google.com https://google.com",
  // Prevent this page from being framed by others (clickjacking)
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspDirectives.join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  // iyzipay uses dynamic require() internally — must be excluded from the
  // Next.js bundle and loaded natively by Node at runtime.
  serverExternalPackages: ['iyzipay'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        // Supabase Storage CDN — covers any project ref
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
