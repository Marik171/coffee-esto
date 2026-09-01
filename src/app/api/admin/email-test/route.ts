import { NextResponse } from 'next/server';
import db from '@/lib/db';

function generateLuxuryEmailHtml(params: {
  fromName: string;
  templateName: string;
  badge: string;
  headline: string;
  subtitle: string;
  body: string;
  heroImage: string;
  roastmasterNote?: string;
  buttonText: string;
  buttonUrl: string;
  footerNote: string;
  locale?: 'tr' | 'en';
}) {
  const {
    badge,
    headline,
    subtitle,
    body,
    heroImage,
    roastmasterNote,
    buttonText,
    buttonUrl,
    footerNote,
    locale = 'tr',
  } = params;

  const isTr = locale === 'tr';
  const logoSubtitle = isTr ? 'NİTELİKLİ KAHVE KAVURMAHANE • İSTANBUL' : 'SPECIALTY COFFEE ROASTERS • İSTANBUL';
  const orderSummaryLabel = isTr ? 'Sipariş Özeti' : 'Order Summary';
  const sampleItemName = isTr ? 'Etiyopya Yirgacheffe G1 • Yıkanmış Lot' : 'Ethiopia Yirgacheffe G1 • Washed Lot';
  const sampleItemDetails = isTr ? '250g Paket • V60 Filtre Öğütüm • Yasemin & Şeftali' : '250g Pouch • V60 Filter Grind • Jasmine & Peach';
  const shippingLabel = isTr ? 'Öğütüm & Valfli Paketleme' : 'Shipping & Degassing Packaging';
  const freeLabel = isTr ? 'ÜCRETSİZ' : 'FREE';
  const totalAmountLabel = isTr ? 'Toplam Tutar' : 'Total Amount';
  const brewBarText = isTr
    ? '⚖️ 1:16 Oran &nbsp;•&nbsp; 🌡️ 93°C Su &nbsp;•&nbsp; ⏱️ 2:45 dk Demleme Süresi'
    : '⚖️ 1:16 Ratio &nbsp;•&nbsp; 🌡️ 93°C Water &nbsp;•&nbsp; ⏱️ 2:45 min Total Time';
  const managePrefText = isTr ? 'Tercihleri Yönet' : 'Manage Preferences';
  const unsubscribeText = isTr ? 'Abonelikten Çık' : 'Unsubscribe';
  const rightsReservedText = isTr ? 'Tüm hakları saklıdır.' : 'All rights reserved.';
  const freshnessDesc = isTr
    ? 'İstanbul’da tek yönlü gaz tahliye valfli kilitli paketlerde mühürlenmiştir. Kavrum tarihinden itibaren 60 gün içinde tüketilmesi önerilir.'
    : 'Heat-sealed in Istanbul with one-way degassing valves. Best consumed within 60 days of roast date.';

  const stepperSteps = isTr
    ? [
        { num: '1', title: 'Sıraya Alındı' },
        { num: '2', title: 'Kavruldu' },
        { num: '3', title: 'Mühürlendi' },
        { num: '4', title: 'Kargolandı' },
      ]
    : [
        { num: '1', title: 'Queued' },
        { num: '2', title: 'Roasted' },
        { num: '3', title: 'Degas Sealed' },
        { num: '4', title: 'Dispatched' },
      ];

  // Anti-spillover sequence: 90+ zero-width non-breaking spaces
  const antiSpillover = '&#847;&zwnj;&nbsp;'.repeat(30);

  return `
<!DOCTYPE html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${headline}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #09090b; }
    @media (prefers-color-scheme: dark) {
      body, .email-bg { background-color: #09090b !important; }
      .email-card { background-color: #121215 !important; border-color: #27272a !important; }
      .email-title { color: #ffffff !important; }
      .email-body { color: #d4d4d8 !important; }
      .email-muted { color: #a1a1aa !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader with anti-spillover whitespace padding -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #ffffff;">
    ${subtitle}${antiSpillover}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-bg" style="table-layout: fixed; background-color: #09090b;">
    <tr>
      <td align="center" style="padding: 36px 12px;">
        <!-- Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #27272a; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Top Atelier Header with Brand Logo -->
          <tr>
            <td align="center" style="background-color: #ffffff; padding: 26px 20px 20px; border-bottom: 1px solid #e4e4e7;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://coffeeesto.com/images/logo.png" alt="Coffee Esto Logo" width="44" height="44"
                      style="display: block; width: 44px; height: 44px; object-fit: contain; margin-bottom: 8px; border-radius: 8px;"
                      onerror="this.style.display='none'" />
                    <div class="email-title" style="font-size: 17px; font-weight: 800; letter-spacing: 3px; color: #09090b; text-transform: uppercase;">
                      COFFEE ESTO
                    </div>
                    <div class="email-muted" style="font-size: 9.5px; letter-spacing: 1.5px; color: #71717a; text-transform: uppercase; font-weight: 600; margin-top: 3px;">
                      ${logoSubtitle}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Image Banner -->
          <tr>
            <td style="position: relative; background-color: #18181b;">
              <img src="https://coffeeesto.com${heroImage}" alt="Coffee Esto Roastery" width="580" style="display: block; width: 100%; max-height: 200px; object-fit: cover;" onerror="this.style.display='none'" />
              <div style="background-color: #18181b; padding: 12px 24px; text-align: left;">
                <span style="background-color: #ffffff; color: #09090b; font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; padding: 5px 12px; border-radius: 9999px; display: inline-block;">
                  ${badge}
                </span>
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h1 class="email-title" style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #09090b; line-height: 1.3; letter-spacing: -0.02em;">
                      ${headline}
                    </h1>
                    <div class="email-muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin-bottom: 18px;">
                      ${subtitle}
                    </div>
                    <p class="email-body" style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: #3f3f46; word-break: break-word;">
                      ${body}
                    </p>
                  </td>
                </tr>

                <!-- 4-Step Roastery Stepper -->
                <tr>
                  <td style="padding: 16px 12px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 10.5px; text-align: center;">
                      <tr>
                        <td width="25%" style="color: #09090b; font-weight: bold;">
                          <div style="font-size: 14px; margin-bottom: 2px;">✓</div>
                          <div>1. ${stepperSteps[0].title}</div>
                        </td>
                        <td width="25%" style="color: #09090b; font-weight: bold;">
                          <div style="font-size: 14px; margin-bottom: 2px;">●</div>
                          <div>2. ${stepperSteps[1].title}</div>
                        </td>
                        <td width="25%" style="color: #71717a;">
                          <div style="font-size: 14px; margin-bottom: 2px;">3</div>
                          <div>3. ${stepperSteps[2].title}</div>
                        </td>
                        <td width="25%" style="color: #71717a;">
                          <div style="font-size: 14px; margin-bottom: 2px;">4</div>
                          <div>4. ${stepperSteps[3].title}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Bento Order Box Sample -->
                <tr>
                  <td style="padding-top: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px; padding: 16px;">
                      <tr>
                        <td style="font-size: 11px; font-weight: 800; color: #09090b; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 12px;">
                          ${orderSummaryLabel}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; border-bottom: 1px solid #e4e4e7;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td class="email-title" style="font-size: 13.5px; font-weight: bold; color: #09090b;">
                                ${sampleItemName}
                                <div class="email-muted" style="font-size: 11px; font-weight: normal; color: #71717a; margin-top: 3px;">${sampleItemDetails}</div>
                              </td>
                              <td align="right" class="email-title" style="font-size: 13.5px; font-weight: bold; color: #09090b; white-space: nowrap;">
                                ₺360.00
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #52525b;">
                            <tr>
                              <td>${shippingLabel}</td>
                              <td align="right" style="color: #059669; font-weight: bold;">${freeLabel}</td>
                            </tr>
                            <tr>
                              <td class="email-title" style="font-size: 14px; font-weight: bold; color: #09090b; padding-top: 8px;">${totalAmountLabel}</td>
                              <td align="right" class="email-title" style="font-size: 14px; font-weight: bold; color: #09090b; padding-top: 8px;">₺360.00</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Roastmaster Note -->
                ${
                  roastmasterNote
                    ? `
                <tr>
                  <td style="padding-top: 18px;">
                    <div style="background-color: #f4f4f5; border-left: 3px solid #09090b; border-radius: 0 8px 8px 0; padding: 14px 16px; font-size: 12.5px; color: #27272a; line-height: 1.6;">
                      💬 ${roastmasterNote}
                    </div>
                  </td>
                </tr>
                `
                    : ''
                }

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding: 28px 0 12px 0;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 9999px; background-color: #09090b;">
                          <a href="${buttonUrl}" target="_blank" style="font-size: 13.5px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 9999px; display: inline-block; letter-spacing: 0.5px;">
                            ${buttonText} →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Micro Brew Bar -->
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 10px 14px; font-size: 11px; font-weight: 600; color: #52525b; text-align: center;">
                      ${brewBarText}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer with CAN-SPAM / KVKK Compliance & Preferences -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 28px; text-align: center; color: #71717a; font-size: 11.5px; line-height: 1.6;">
              <div class="email-title" style="color: #09090b; font-weight: bold; margin-bottom: 6px;">
                Instagram @esto.roastery • Brewing Journal • Karaköy İstanbul
              </div>
              <div class="email-muted" style="color: #71717a; margin-bottom: 6px;">
                ${footerNote}
              </div>
              <div style="font-size: 10px; color: #a1a1aa; line-height: 1.5;">
                Coffee Esto Roastery Atelier &middot; Topselvi Mh, Kartal, İstanbul &middot; <a href="mailto:thecoffeeesto@gmail.com" style="color: #71717a; text-decoration: underline;">thecoffeeesto@gmail.com</a>
                <br>
                ${freshnessDesc}
                <br>
                © ${new Date().getFullYear()} Coffee Esto Roastery. ${rightsReservedText} &middot; 
                <a href="https://coffeeesto.com/account/preferences" style="color: #71717a; text-decoration: underline;">${managePrefText}</a> &middot; 
                <a href="https://coffeeesto.com/account/preferences?optout=all" style="color: #71717a; text-decoration: underline;">${unsubscribeText}</a>
              </div>
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      recipientEmail,
      templateId,
      locale = 'tr',
      customSubject,
      customHeadline,
      customSubtitle,
      customBody,
      customBadge,
      customHeroImage,
      customRoastmasterNote,
      customButtonText,
      customButtonUrl,
      customFooterNote,
    } = body;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid recipient email address.' },
        { status: 400 }
      );
    }

    let settings: any = null;
    try {
      settings = await db.emailSettings.findUnique({ where: { id: 1 } });
    } catch (dbErr) {
      console.warn('Could not read emailSettings from database, using defaults:', dbErr);
    }

    const fromName = settings?.fromName || 'Coffee Esto Roastery';
    const fromEmail = settings?.fromEmail || 'orders@grainandgrind.com';
    const resendApiKey = (settings?.resendApiKey || process.env.RESEND_API_KEY || '').trim();

    const isTr = locale === 'tr';
    const previewSubject = customSubject || (isTr ? 'Partiniz Kavrum İçin Sıraya Alındı ☕ [Sipariş #ESTO-9281]' : 'Batch Scheduled for Roast ☕ [Order #ESTO-9281]');
    const previewHeadline = customHeadline || (isTr ? 'Çekirdekleriniz Kavurma İçin Sıraya Alındı' : 'Your Beans Are Scheduled For Roasting');
    const previewSubtitle = customSubtitle || (isTr ? 'Mikro Parti Nitelikli Kavrum #ESTO-9281' : 'Micro-Batch Specialty Roast Lot #ESTO-9281');
    const previewBody = customBody || (isTr ? 'Coffee Esto’yu tercih ettiğiniz için teşekkür ederiz. Baş kavurucumuz, siparişinizdeki single-origin çekirdekleri tamburlu kavurma için sıraya aldı.' : 'Thank you for choosing Coffee Esto! Our roastmaster has queued your single-origin lots for precision drum roasting.');
    const previewBadge = customBadge || (isTr ? 'KAVURMAHANE SİPARİŞ ONAYI' : 'ROASTERY ORDER CONFIRMATION');
    const previewHeroImage = customHeroImage || '/images/hero_roast_order.png';
    const previewRoastmasterNote = customRoastmasterNote || (isTr ? 'Kavurucu Notu: V60 demlemelerinde 7 gün dinlendirmenizi öneririz.' : 'Roaster’s Tip: For pour-over brewing (V60), allow beans to rest 7 days post-roast.');
    const previewButtonText = customButtonText || (isTr ? 'Kavrum Durumunu Takip Et' : 'Track Roast & Order Status');
    const previewButtonUrl = customButtonUrl || 'https://coffeeesto.com/order-status';
    const previewFooterNote = customFooterNote || (isTr ? 'Coffee Esto Roastery • Karaköy, İstanbul' : 'Coffee Esto Roastery • Karaköy, İstanbul • Direct Trade Single Origins');

    const htmlContent = generateLuxuryEmailHtml({
      fromName,
      templateName: templateId || 'order_confirmation',
      badge: previewBadge,
      headline: previewHeadline,
      subtitle: previewSubtitle,
      body: previewBody,
      heroImage: previewHeroImage,
      roastmasterNote: previewRoastmasterNote,
      buttonText: previewButtonText,
      buttonUrl: previewButtonUrl,
      footerNote: previewFooterNote,
      locale: locale as 'tr' | 'en',
    });

    let liveDispatchInfo: any = null;
    let dispatchWarning: string | null = null;

    // 1. Try Brevo API first (configured in project via BREVO_API_KEY)
    const brevoApiKey = process.env.BREVO_API_KEY || (settings?.smtpPass?.startsWith('xkeysib-') ? settings.smtpPass : '');
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || settings?.fromEmail || 'no-reply@coffeeesto.com';
    const brevoSenderName = settings?.fromName || process.env.BREVO_SENDER_NAME || 'Coffee Esto Roastery';

    if (brevoApiKey && brevoApiKey.startsWith('xkeysib-')) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            sender: { email: brevoSenderEmail, name: brevoSenderName },
            to: [{ email: recipientEmail }],
            subject: previewSubject,
            htmlContent: htmlContent,
          }),
        });

        const brevoData = await brevoRes.json().catch(() => ({}));
        if (brevoRes.ok && brevoData?.messageId) {
          liveDispatchInfo = {
            provider: 'brevo',
            id: brevoData.messageId,
          };
        } else {
          dispatchWarning = brevoData?.message || `Brevo returned status ${brevoRes.status}`;
        }
      } catch (brevoErr: any) {
        dispatchWarning = brevoErr?.message || 'Network error connecting to Brevo API';
      }
    }

    // 2. Try Resend API if configured
    const isRealResendKey = resendApiKey.startsWith('re_') && !resendApiKey.includes('xxxx') && resendApiKey.length > 15;

    if (!liveDispatchInfo && isRealResendKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [recipientEmail],
            subject: previewSubject,
            html: htmlContent,
          }),
        });

        const resendData = await resendRes.json().catch(() => ({}));
        if (resendRes.ok && resendData?.id) {
          liveDispatchInfo = {
            provider: 'resend',
            id: resendData.id,
          };
        } else {
          dispatchWarning = resendData?.message || resendData?.error || 'Resend rejected payload';
        }
      } catch (liveErr: any) {
        dispatchWarning = liveErr?.message || 'Network failure connecting to Resend API';
      }
    }

    if (dispatchWarning && !liveDispatchInfo && (brevoApiKey || isRealResendKey)) {
      return NextResponse.json({
        success: false,
        error: `Live Dispatch Error: ${dispatchWarning}. Please verify recipient and sender configuration.`,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        dispatchedTo: recipientEmail,
        from: `"${fromName}" <${brevoSenderEmail}>`,
        subject: previewSubject,
        headline: previewHeadline,
        timestamp: new Date().toISOString(),
        deliveryStatus: liveDispatchInfo
          ? `dispatched_live_via_${liveDispatchInfo.provider}`
          : 'preview_rendered_successfully',
        messageId: liveDispatchInfo?.id || `msg_${Math.random().toString(36).substring(2, 12)}@esto.coffee`,
      },
      error: null,
    });
  } catch (error: any) {
    console.error('Failed to send test email:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error while rendering email.' },
      { status: 500 }
    );
  }
}

