import db from '@/lib/db';
import type { PendingCheckoutPayload } from '@/lib/checkoutShared';

// Serves the bank's raw 3D Secure HTML as a real top-level response, loaded by
// navigating the checkout popup's `location` directly to this URL — not via
// document.write() into an about:blank popup. about:blank documents inherit
// the CSP of whatever script created them, so writing the bank's HTML into one
// still left it bound by our site's strict CSP (script-src/form-action 'self'),
// which blocked the bank's own scripts and its form submissions to scheme
// domains like goguvenliodeme.bkm.com.tr. A real navigation to this route gets
// its own response headers instead, which we deliberately leave permissive
// below — this page exists only to show the bank's own verbatim content.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const pending = await db.pendingCheckout.findUnique({ where: { id } });
  if (!pending) {
    return new Response(
      '<!doctype html><body style="font-family:sans-serif;color:#888;text-align:center;padding:40px">This verification link has expired or was already used. Please close this window and try again.</body>',
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  }

  const payload = pending.payload as unknown as PendingCheckoutPayload;
  const html = Buffer.from(payload.threeDSHtmlContent, 'base64').toString('utf-8');

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy':
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; form-action *",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
