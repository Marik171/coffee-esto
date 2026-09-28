import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// script-src needs 'unsafe-eval' in dev for React error overlay / HMR.
// In production, eval is never used by Next.js or React.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com"
  : "script-src 'self' 'unsafe-inline' https://apis.google.com https://*.firebaseapp.com";

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
  "connect-src 'self' https://*.supabase.co https://api.iyzipay.com https://sandbox-api.iyzipay.com https://*.googleapis.com https://*.firebaseapp.com",
  // Google Maps embeds require google.com and maps.google.com frames
  "frame-src 'self' https://www.google.com https://maps.google.com https://google.com https://*.firebaseapp.com",
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

// iyzipay's lib/Iyzipay.js scandir()s its own lib/resources folder and
// require()s each file dynamically by path. The Next.js standalone build's
// file tracer (@vercel/nft) can't see through that — it never even visits
// those resource files, so it also misses every package THEY require, such
// as postman-request and postman-request's own dependencies. That already
// bit production once (iyzipay's own resources dir was missing -> ENOENT),
// and again with postman-request missing -> "Cannot find module
// 'postman-request'" crashing every route that imports '@/lib/iyzipay'
// (checkout, admin/orders, orders/cancel, account/payment-methods).
// Fix: force-include the full resolved dependency closure of iyzipay +
// postman-request (computed by walking package-lock.json), since none of
// it gets picked up by normal tracing.
const iyzipayDependencyClosure = [
  '@postman/form-data', '@postman/tough-cookie', '@postman/tunnel-agent',
  'agent-base', 'asn1', 'assert-plus', 'asynckit', 'aws-sign2', 'aws4',
  'bcrypt-pbkdf', 'bluebird', 'call-bind-apply-helpers', 'call-bound',
  'caseless', 'combined-stream', 'core-util-is', 'dashdash', 'debug',
  'delayed-stream', 'dunder-proto', 'ecc-jsbn', 'es-define-property',
  'es-errors', 'es-object-atoms', 'extend', 'extsprintf', 'forever-agent',
  'function-bind', 'get-intrinsic', 'get-proto', 'getpass', 'gopd',
  'has-symbols', 'hasown', 'http-signature', 'ip-address', 'is-typedarray',
  'isstream', 'iyzipay', 'jsbn', 'json-schema', 'json-stringify-safe',
  'jsprim', 'math-intrinsics', 'mime-db', 'mime-types', 'ms', 'oauth-sign',
  'object-inspect', 'postman-request', 'psl', 'punycode', 'qs',
  'querystringify', 'requires-port', 'safe-buffer', 'safer-buffer',
  'side-channel', 'side-channel-list', 'side-channel-map',
  'side-channel-weakmap', 'smart-buffer', 'socks', 'socks-proxy-agent',
  'sshpk', 'stream-length', 'tweetnacl', 'universalify', 'url-parse',
  'uuid', 'verror',
];

const nextConfig: NextConfig = {
  // iyzipay uses dynamic require() internally — must be excluded from the
  // Next.js bundle and loaded natively by Node at runtime.
  serverExternalPackages: ['iyzipay'],

  outputFileTracingIncludes: {
    '/**': iyzipayDependencyClosure.map((pkg) => `./node_modules/${pkg}/**/*`),
  },

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
