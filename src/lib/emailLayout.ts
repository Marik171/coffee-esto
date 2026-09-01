// Shared HTML shell for all transactional emails — table-based layout with inline
// styles for compatibility across Gmail, Apple Mail, and Outlook. Mirrors the
// brand palette/tokens from src/app/globals.css. Editorial masthead style: a
// full-bleed photo with a magazine-style caption bar underneath.

const palette = {
  espresso: '#09090b',
  roast: '#18181b',
  cream: '#fafafa',
  parchment: '#e4e4e7',
  sand: '#f4f4f5',
  amber: '#09090b',
  orange: '#09090b',
  warmWhite: '#ffffff',
  warmMuted: '#a1a1aa',
  warmText: '#27272a',
  warmMid: '#71717a',
};

const fontDisplay = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const fontBody = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function button(label: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
      <tr>
        <td align="center" bgcolor="#09090b" style="border-radius: 9999px;">
          <a href="${href}" target="_blank"
            style="display: inline-block; padding: 13px 32px; font-family: ${fontBody}; font-size: 13px;
                   font-weight: 700; letter-spacing: 0.05em; color: #ffffff;
                   text-decoration: none; border-radius: 9999px; background-color: #09090b; border: 1px solid #09090b;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function divider(): string {
  return `<div style="height: 1px; background-color: #e4e4e7; margin: 28px 0;"></div>`;
}

interface LayoutOptions {
  preheader?: string;
  bodyHtml: string;
  /** Small uppercase label above the caption headline, e.g. "WELCOME" or "ORDER CONFIRMED" */
  heroEyebrow: string;
  /** Editorial caption headline shown under the masthead photo */
  heroTitle: string;
  /** Language/locale context */
  locale?: string;
}

export function renderEmailLayout({
  preheader = '',
  bodyHtml,
  heroEyebrow,
  heroTitle,
  locale = 'tr',
}: LayoutOptions): string {
  const isEn = locale === 'en';
  const logoSubtitle = isEn ? 'SPECIALTY COFFEE ROASTERS • İSTANBUL' : 'NİTELİKLİ KAHVE KAVURMAHANE • İSTANBUL';
  const addressLabel = isEn
    ? 'Coffee Esto Roastery Atelier &middot; Topselvi Mh, Kartal, İstanbul, Turkey'
    : 'Coffee Esto Roastery Atelier &middot; Topselvi Mh, Kartal, İstanbul, Türkiye';
  const copyrightLabel = isEn
    ? `&copy; ${new Date().getFullYear()} Coffee Esto Roastery. All rights reserved.`
    : `&copy; ${new Date().getFullYear()} Coffee Esto Roastery. Tüm hakları saklıdır.`;
  const managePrefLabel = isEn ? 'Manage Preferences' : 'Tercihleri Yönet';
  const unsubscribeLabel = isEn ? 'Unsubscribe' : 'Abonelikten Çık';

  // Anti-spillover sequence: 90+ zero-width non-breaking spaces so email clients don't bleed body text into inbox snippet
  const antiSpillover = '&#847;&zwnj;&nbsp;'.repeat(30);

  return `
<!DOCTYPE html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Coffee Esto</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #09090b !important; }
      .email-card { background-color: #121215 !important; border-color: #27272a !important; }
      .email-title { color: #ffffff !important; }
      .email-body { color: #d4d4d8 !important; }
      .email-muted { color: #a1a1aa !important; }
      .email-divider { background-color: #27272a !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${palette.cream}; font-family: ${fontBody}; -webkit-font-smoothing: antialiased;">
  <!-- Preheader with anti-spillover padding -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #ffffff;">
    ${preheader}${antiSpillover}
  </div>

  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${palette.cream}; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 36px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table width="580" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
        <![endif]-->
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="width: 100%; max-width: 580px; background-color: #ffffff; border: 1px solid ${palette.parchment}; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">

          <!-- Masthead / Header with Brand Logo -->
          <tr>
            <td align="center" style="padding: 28px 24px 20px; background-color: #ffffff; border-bottom: 1px solid ${palette.parchment};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="https://coffeeesto.com/images/logo.png" alt="Coffee Esto Logo" width="44" height="44"
                      style="display: block; width: 44px; height: 44px; object-fit: contain; margin-bottom: 8px; border-radius: 8px;"
                      onerror="this.style.display='none'" />
                    <span class="email-title" style="font-family: ${fontDisplay}; font-size: 18px; font-weight: 800; letter-spacing: 0.18em; color: ${palette.espresso}; text-transform: uppercase;">
                      COFFEE ESTO
                    </span>
                    <div class="email-muted" style="margin-top: 4px; font-family: ${fontBody}; font-size: 9.5px; font-weight: 700; letter-spacing: 0.15em;
                                text-transform: uppercase; color: ${palette.warmMid};">
                      ${logoSubtitle}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Editorial text banner -->
          <tr>
            <td align="left" style="padding: 28px 32px 10px;">
              <p style="margin: 0 0 6px; font-family: ${fontBody}; font-size: 10.5px; font-weight: 800;
                        letter-spacing: 0.15em; text-transform: uppercase; color: ${palette.warmMid};">
                ${heroEyebrow}
              </p>
              <h1 class="email-title" style="margin: 0; font-family: ${fontDisplay}; font-size: 22px; font-weight: 800; line-height: 1.3; color: ${palette.espresso}; letter-spacing: -0.01em;">
                ${heroTitle}
              </h1>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td class="email-body" style="padding: 10px 32px 30px; font-family: ${fontBody}; font-size: 14px; line-height: 1.7; color: ${palette.warmText};">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer with CAN-SPAM / KVKK Compliance & Preferences -->
          <tr>
            <td style="padding: 24px 32px 30px; background-color: #fafafa; border-top: 1px solid ${palette.parchment};">
              <p class="email-muted" style="margin: 0 0 6px; font-family: ${fontBody}; font-size: 12px; color: ${palette.warmMid};">
                ${addressLabel}
              </p>
              <p class="email-muted" style="margin: 0 0 12px; font-family: ${fontBody}; font-size: 12px; color: ${palette.warmMid};">
                <a href="mailto:thecoffeeesto@gmail.com" style="color: ${palette.espresso}; text-decoration: underline; font-weight: 600;">thecoffeeesto@gmail.com</a>
                &nbsp;&middot;&nbsp; +90 553 605 31 83 &nbsp;&middot;&nbsp; <a href="https://coffeeesto.com" style="color: ${palette.espresso}; text-decoration: none; font-weight: 600;">coffeeesto.com</a>
              </p>
              <p style="margin: 0 0 10px; font-family: ${fontBody}; font-size: 11px; color: ${palette.warmMuted}; line-height: 1.5;">
                Heat-sealed in Istanbul with one-way degassing valves. Roasted to order in small batches.
              </p>
              <p style="margin: 0; font-family: ${fontBody}; font-size: 10.5px; color: ${palette.warmMuted};">
                ${copyrightLabel} &nbsp;&middot;&nbsp; 
                <a href="https://coffeeesto.com/account/preferences" style="color: ${palette.warmMid}; text-decoration: underline;">${managePrefLabel}</a> &nbsp;&middot;&nbsp;
                <a href="https://coffeeesto.com/account/preferences?optout=all" style="color: ${palette.warmMid}; text-decoration: underline;">${unsubscribeLabel}</a>
              </p>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export const colors = palette;
export const fonts = { display: fontDisplay, body: fontBody };

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
