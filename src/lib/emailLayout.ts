// Shared HTML shell for all transactional emails — table-based layout with inline
// styles for compatibility across Gmail, Apple Mail, and Outlook. Mirrors the
// brand palette/tokens from src/app/globals.css. Editorial masthead style: a
// full-bleed photo with a magazine-style caption bar underneath.

const palette = {
  espresso: '#1a0e07',
  roast: '#2c1a0e',
  cream: '#fdf8f0',
  parchment: '#ede5d0',
  sand: '#f5ead8',
  amber: '#c9963a',
  orange: '#e84d00',
  warmWhite: '#f5ede0',
  warmMuted: '#a08060',
  warmText: '#2a1a0e',
  warmMid: '#6b4e30',
};

const fontDisplay = "'Playfair Display', Georgia, 'Times New Roman', serif";
const fontBody = "'DM Sans', Helvetica, Arial, sans-serif";

export function button(label: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
      <tr>
        <td align="center" bgcolor="${palette.orange}" style="border-radius: 50px;">
          <a href="${href}" target="_blank"
            style="display: inline-block; padding: 14px 34px; font-family: ${fontBody}; font-size: 13px;
                   font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${palette.cream};
                   text-decoration: none; border-radius: 50px; background-color: ${palette.orange}; border: 1px solid ${palette.orange};">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function divider(): string {
  return `<div style="height: 1px; background-color: ${palette.parchment}; margin: 28px 0;"></div>`;
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
  const logoSubtitle = isEn ? 'C O F F E E &nbsp; R O A S T E R Y' : 'K A H V E &nbsp; K A V U R M A &nbsp; E V İ';
  const addressLabel = isEn
    ? 'Coffee Esto Roastery &middot; Topselvi Mh, Kartal, İstanbul, Turkey'
    : 'Coffee Esto Roastery &middot; Topselvi Mh, Kartal, İstanbul, Türkiye';
  const copyrightLabel = isEn
    ? `&copy; ${new Date().getFullYear()} Coffee Esto Roastery. All rights reserved.`
    : `&copy; ${new Date().getFullYear()} Coffee Esto Roastery. Tüm hakları saklıdır.`;

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Coffee Esto</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${palette.cream}; font-family: ${fontBody}; -webkit-font-smoothing: antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${palette.cream};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
          style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid ${palette.parchment}; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(26,14,7,0.04);">

          <!-- Masthead (Header) -->
          <tr>
            <td align="center" style="padding: 36px 24px 20px;">
              <span style="font-family: ${fontDisplay}; font-size: 26px; font-weight: 700; letter-spacing: 0.15em; color: ${palette.espresso};">
                C O F F E E &nbsp; E S T O
              </span>
              <div style="margin-top: 6px; font-family: ${fontBody}; font-size: 9px; font-weight: 600; letter-spacing: 0.25em;
                          text-transform: uppercase; color: ${palette.warmMid};">
                ${logoSubtitle}
              </div>
            </td>
          </tr>
          
          <!-- Elegant header thin divider -->
          <tr>
            <td align="center">
              <div style="height: 1px; background-color: ${palette.parchment}; width: 85%;"></div>
            </td>
          </tr>

          <!-- Editorial text banner (No Image) -->
          <tr>
            <td align="center" style="padding: 28px 40px 12px;">
              <p style="margin: 0 0 6px; font-family: ${fontBody}; font-size: 11px; font-weight: 700;
                        letter-spacing: 0.18em; text-transform: uppercase; color: ${palette.amber};">
                ${heroEyebrow}
              </p>
              <h1 style="margin: 0; font-family: ${fontDisplay}; font-size: 28px; font-weight: 700; line-height: 1.3; color: ${palette.espresso};">
                ${heroTitle}
              </h1>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding: 16px 40px 32px; font-family: ${fontBody}; font-size: 15px; line-height: 1.7; color: ${palette.warmText};">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 40px 36px;">
              <div style="height: 1px; background-color: ${palette.parchment}; margin-bottom: 24px;"></div>
              <p style="margin: 0 0 6px; font-family: ${fontBody}; font-size: 13px; color: ${palette.warmMid};">
                ${addressLabel}
              </p>
              <p style="margin: 0 0 16px; font-family: ${fontBody}; font-size: 13px; color: ${palette.warmMid};">
                <a href="mailto:thecoffeeesto@gmail.com" style="color: ${palette.orange}; text-decoration: none; font-weight: 600;">thecoffeeesto@gmail.com</a>
                &nbsp;&middot;&nbsp; +90 553 605 31 83
              </p>
              <p style="margin: 0; font-family: ${fontBody}; font-size: 11px; color: ${palette.warmMuted};">
                ${copyrightLabel}
              </p>
            </td>
          </tr>
        </table>
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
