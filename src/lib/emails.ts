import { sendEmail, getOwnerEmail } from './brevo';
import { renderEmailLayout, button, divider, colors, fonts, escapeHtml } from './emailLayout';

const verificationTranslations = {
  tr: {
    subject: (code: string) => `${code} Coffee Esto giriş kodunuz`,
    preheader: (code: string) => `Coffee Esto giriş kodunuz: ${code}`,
    eyebrow: 'GİRİŞ YAP',
    title: 'Giriş kodunuz',
    bodyText: 'Coffee Esto hesabınıza giriş yapmak için bu kodu kullanın. Kodun geçerlilik süresi birkaç dakikadır.',
    footerText: 'Bu talebi siz yapmadıysanız, bu e-postayı güvenle yoksayabilirsiniz — hesabınızda hiçbir değişiklik yapılmayacaktır.',
  },
  en: {
    subject: (code: string) => `${code} is your Coffee Esto login code`,
    preheader: (code: string) => `Your Coffee Esto login code is ${code}`,
    eyebrow: 'SIGN IN',
    title: 'Your login code',
    bodyText: 'Enter this code to finish signing in to your Coffee Esto account. It expires in a few minutes.',
    footerText: "Didn't request this? You can safely ignore this email — no changes will be made to your account.",
  },
};

const welcomeTranslations = {
  tr: {
    subject: "Coffee Esto'ya Hoş Geldiniz",
    preheader: 'Hesabınız hazır — en yeni kahvelerimizi keşfedin.',
    eyebrow: 'HOŞ GELDİNİZ',
    title: (name?: string) => `Aramıza hoş geldiniz${name ? `, ${name}` : ''}.`,
    bodyIntro: "Coffee Esto hesabınız hazır. Taze kavrulmuş single origin kahvelerimizden imza harmanlarımıza kadar ürettiğimiz her şey Kartal roastery'mizde küçük partiler halinde kavruluyor — ve şimdi bir tık uzağınızda.",
    bodyListIntro: 'Hemen yapabileceğiniz birkaç şey:',
    listItems: [
      'En yeni kavrumlarimizi ve sinirli üretim kahvelerimizi keşfedin',
      'Daha hızlı ödeme için adreslerinizi ve ödeme yöntemlerinizi kaydedin',
      'Düzenli teslimatlar ve kahvelerde %10 üye indirimi için abone olun',
    ],
    buttonLabel: 'Alışverişe başla',
    buttonHref: 'https://coffeeesto.com/coffee',
  },
  en: {
    subject: 'Welcome to Coffee Esto',
    preheader: 'Your account is ready — explore our latest roasts.',
    eyebrow: 'WELCOME',
    title: (name?: string) => `Glad you're here${name ? `, ${name}` : ''}.`,
    bodyIntro: "Your Coffee Esto account is ready. From freshly roasted single origins to our signature blends, everything we make is roasted in small batches in our Kartal roastery — and now it's a click away.",
    bodyListIntro: 'A few things you can do right away:',
    listItems: [
      'Explore our latest roasts and limited editions',
      'Save your addresses and payment methods for faster checkout',
      'Subscribe for regular deliveries and a 10% member discount on coffee',
    ],
    buttonLabel: 'Start shopping',
    buttonHref: 'https://coffeeesto.com/en/coffee',
  },
};

const orderConfirmationTranslations = {
  tr: {
    subject: (id: string) => `Siparişiniz onaylandı — ${id}`,
    preheader: (id: string, total: string) => `Siparişiniz ${id} onaylandı — toplam ${total} TRY`,
    eyebrow: 'SİPARİŞ ONAYLANDI',
    title: (name?: string) => `Teşekkürler${name ? `, ${name}` : ''}!`,
    bodyText: 'Siparişinizi aldık, kavurma ve gönderim için hazırlıyoruz.',
    orderLabel: 'Sipariş',
    subtotalLabel: 'Ara Toplam',
    shippingLabel: 'Kargo',
    freeLabel: 'Ücretsiz',
    totalLabel: 'Toplam',
    closingText: 'Siparişiniz kargoya verilir verilmez başka bir e-posta göndereceğiz. Bu süreçte sorularınız olursa, bu e-postayı doğrudan yanıtlayabilirsiniz.',
  },
  en: {
    subject: (id: string) => `Order confirmed — ${id}`,
    preheader: (id: string, total: string) => `Your order ${id} is confirmed — total ${total} TRY`,
    eyebrow: 'ORDER CONFIRMED',
    title: (name?: string) => `Thank you${name ? `, ${name}` : ''}!`,
    bodyText: "We've received your order and it's being prepared for roasting and dispatch.",
    orderLabel: 'Order',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Shipping',
    freeLabel: 'Free',
    totalLabel: 'Total',
    closingText: "We'll send another email as soon as your order ships. Questions in the meantime? Just reply to this email.",
  },
};

export async function sendVerificationCodeEmail(email: string, code: string, locale?: string): Promise<void> {
  const tLoc = locale === 'en' ? 'en' : 'tr';
  const t = verificationTranslations[tLoc];

  const digits = code.split('');
  const codeBoxes = digits
    .map(
      (d) => `
        <td style="width: 44px; height: 54px; background-color: ${colors.parchment}; border-radius: 8px;
                   font-family: ${fonts.display}; font-size: 26px; font-weight: 700; color: ${colors.espresso};
                   text-align: center; vertical-align: middle;">
          ${d}
        </td>
        <td style="width: 8px;"></td>
      `
    )
    .join('');

  const bodyHtml = `
    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; color: ${colors.warmMid};">
      ${t.bodyText}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px;">
      <tr>${codeBoxes}</tr>
    </table>
    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: ${colors.warmMid};">
      ${t.footerText}
    </p>
  `;

  await sendEmail({
    to: [{ email }],
    subject: t.subject(code),
    htmlContent: renderEmailLayout({
      preheader: t.preheader(code),
      heroEyebrow: t.eyebrow,
      heroTitle: t.title,
      bodyHtml,
      locale: tLoc,
    }),
  });
}

export async function sendWelcomeEmail(email: string, name?: string, locale?: string): Promise<void> {
  const tLoc = locale === 'en' ? 'en' : 'tr';
  const t = welcomeTranslations[tLoc];

  const firstName = name?.trim().split(/\s+/)[0];
  const safeFirstName = firstName ? escapeHtml(firstName) : undefined;

  const listHtml = t.listItems.map((item) => `<li>${item}</li>`).join('');

  const bodyHtml = `
    <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.75; color: ${colors.warmMid};">
      ${t.bodyIntro}
    </p>
    <p style="margin: 0 0 8px; font-size: 15px; line-height: 1.75; color: ${colors.warmMid};">
      ${t.bodyListIntro}
    </p>
    <ul style="margin: 0 0 8px; padding-left: 20px; font-size: 15px; line-height: 1.9; color: ${colors.warmText};">
      ${listHtml}
    </ul>
    ${button(t.buttonLabel, t.buttonHref)}
  `;

  await sendEmail({
    to: [{ email, name }],
    subject: t.subject,
    htmlContent: renderEmailLayout({
      preheader: t.preheader,
      heroEyebrow: t.eyebrow,
      heroTitle: t.title(safeFirstName),
      bodyHtml,
      locale: tLoc,
    }),
  });
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailDetails {
  orderId: string;
  email: string;
  fullName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  locale?: string;
}

function renderItemsTable(items: OrderItem[], locale: string): string {
  const qtyLabel = locale === 'en' ? 'Qty' : 'Adet';
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 14px 0; border-top: 1px solid ${colors.parchment}; font-size: 14px; color: ${colors.warmText};">
            ${escapeHtml(item.name)}
            <span style="display: block; font-size: 12px; color: ${colors.warmMid}; margin-top: 2px;">
              ${qtyLabel} ${item.quantity}
            </span>
          </td>
          <td style="padding: 14px 0; border-top: 1px solid ${colors.parchment}; font-size: 14px; color: ${colors.warmText};
                     text-align: right; white-space: nowrap;">
            ${(item.price * item.quantity).toFixed(2)} TRY
          </td>
        </tr>
      `
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 8px 0 4px;">${rows}</table>`;
}

function renderTotalsRow(label: string, value: string, emphasize = false): string {
  return `
    <tr>
      <td style="padding: 4px 0; font-size: ${emphasize ? '16px' : '14px'}; font-weight: ${emphasize ? '700' : '400'};
                 color: ${emphasize ? colors.espresso : colors.warmMid};">
        ${label}
      </td>
      <td style="padding: 4px 0; font-size: ${emphasize ? '16px' : '14px'}; font-weight: ${emphasize ? '700' : '400'};
                 color: ${emphasize ? colors.espresso : colors.warmMid}; text-align: right;">
        ${value}
      </td>
    </tr>
  `;
}

export async function sendOrderConfirmationEmail(order: OrderEmailDetails): Promise<void> {
  const tLoc = order.locale === 'en' ? 'en' : 'tr';
  const t = orderConfirmationTranslations[tLoc];

  const firstName = order.fullName?.trim().split(/\s+/)[0];
  const safeFirstName = firstName ? escapeHtml(firstName) : undefined;

  const totalAmountStr = order.totalAmount.toFixed(2);
  const subtotalStr = order.subtotal.toFixed(2);
  const shippingFeeStr = order.shippingFee > 0 ? `${order.shippingFee.toFixed(2)} TRY` : t.freeLabel;

  const bodyHtml = `
    <p style="margin: 0 0 4px; font-size: 15px; line-height: 1.7; color: ${colors.warmMid};">
      ${t.bodyText}
    </p>
    <p style="margin: 0 0 24px; font-size: 13px; color: ${colors.warmMid};">
      ${t.orderLabel} <strong style="color: ${colors.warmText};">${order.orderId}</strong>
    </p>

    <div style="background-color: ${colors.sand}; border-radius: 12px; padding: 20px 24px;">
      ${renderItemsTable(order.items, tLoc)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px; border-top: 1px solid ${colors.parchment}; padding-top: 8px;">
        ${renderTotalsRow(t.subtotalLabel, `${subtotalStr} TRY`)}
        ${renderTotalsRow(t.shippingLabel, shippingFeeStr)}
        ${renderTotalsRow(t.totalLabel, `${totalAmountStr} TRY`, true)}
      </table>
    </div>

    ${divider()}
    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: ${colors.warmMid};">
      ${t.closingText}
    </p>
  `;

  await sendEmail({
    to: [{ email: order.email, name: order.fullName }],
    subject: t.subject(order.orderId),
    htmlContent: renderEmailLayout({
      preheader: t.preheader(order.orderId, totalAmountStr),
      heroEyebrow: t.eyebrow,
      heroTitle: t.title(safeFirstName),
      bodyHtml,
      locale: tLoc,
    }),
  });
}

export async function sendOwnerNewOrderNotification(order: OrderEmailDetails): Promise<void> {
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) {
    console.error('[emails] OWNER_EMAIL is not configured — skipping new order notification.');
    return;
  }

  const bodyHtml = `
    <p style="margin: 0 0 24px; font-size: 14px; color: ${colors.warmMid};">
      ${order.fullName ? escapeHtml(order.fullName) : 'Guest customer'} &middot; ${escapeHtml(order.email)}
    </p>

    <div style="background-color: ${colors.sand}; border-radius: 12px; padding: 20px 24px;">
      ${renderItemsTable(order.items, 'tr')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px; border-top: 1px solid ${colors.parchment}; padding-top: 8px;">
        ${renderTotalsRow('Ara Toplam', `${order.subtotal.toFixed(2)} TRY`)}
        ${renderTotalsRow('Kargo', `${order.shippingFee.toFixed(2)} TRY`)}
        ${renderTotalsRow('Toplam', `${order.totalAmount.toFixed(2)} TRY`, true)}
      </table>
    </div>

    ${button('View in admin panel', 'https://coffeeesto.com/admin/orders')}
  `;

  await sendEmail({
    to: [{ email: ownerEmail }],
    subject: `New order — ${order.orderId} (${order.totalAmount.toFixed(2)} TRY)`,
    htmlContent: renderEmailLayout({
      preheader: `${order.fullName ?? order.email} just placed an order worth ${order.totalAmount.toFixed(2)} TRY`,
      heroEyebrow: 'New order',
      heroTitle: order.orderId,
      bodyHtml,
      locale: 'tr',
    }),
  });
}

export async function sendContactFormNotification(details: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale?: string;
}): Promise<void> {
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) {
    console.error('[emails] OWNER_EMAIL is not configured — skipping contact form notification.');
    return;
  }

  const isTr = details.locale === 'tr';
  const labelName = isTr ? 'İsim' : 'Name';
  const labelEmail = isTr ? 'E-posta' : 'Email';
  const labelPhone = isTr ? 'Telefon' : 'Phone';
  const replyButtonLabel = isTr ? `${details.name} kişisine yanıt ver` : `Reply to ${details.name.split(/\s+/)[0]}`;
  const subject = isTr ? `Yeni iletişim formu mesajı — ${details.name}` : `New contact form message from ${details.name}`;
  const heroEyebrow = isTr ? 'İLETİŞİM FORMU' : 'CONTACT FORM';
  const heroTitle = isTr ? `${details.name} gönderisinden yeni mesaj` : `New message from ${details.name}`;

  const safeName = escapeHtml(details.name);
  const safeEmail = escapeHtml(details.email);
  const safePhone = details.phone ? escapeHtml(details.phone) : undefined;
  const safeMessage = escapeHtml(details.message);
  const replyToUri = encodeURIComponent(details.email);

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 4px 0; color: ${colors.warmMid}; width: 90px;">${labelName}</td>
        <td style="padding: 4px 0; color: ${colors.warmText};">${safeName}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: ${colors.warmMid};">${labelEmail}</td>
        <td style="padding: 4px 0; color: ${colors.warmText};">
          <a href="mailto:${replyToUri}" style="color: ${colors.orange}; text-decoration: none;">${safeEmail}</a>
        </td>
      </tr>
      ${
        safePhone
          ? `<tr>
              <td style="padding: 4px 0; color: ${colors.warmMid};">${labelPhone}</td>
              <td style="padding: 4px 0; color: ${colors.warmText};">${safePhone}</td>
            </tr>`
          : ''
      }
    </table>

    <div style="background-color: ${colors.sand}; border-radius: 12px; padding: 20px 24px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: ${colors.warmText}; white-space: pre-line;">${safeMessage}</p>
    </div>

    ${button(replyButtonLabel.replace(/[<>&"']/g, ''), `mailto:${replyToUri}`)}
  `;

  await sendEmail({
    to: [{ email: ownerEmail }],
    subject,
    replyTo: { email: details.email, name: details.name },
    htmlContent: renderEmailLayout({
      preheader: details.message.slice(0, 100),
      heroEyebrow,
      heroTitle,
      bodyHtml,
      locale: isTr ? 'tr' : 'en',
    }),
  });
}

export async function sendWholesaleInquiryNotification(details: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city: string;
  zip?: string;
  company?: string;
  website?: string;
  message: string;
  locale?: string;
}): Promise<void> {
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) {
    console.error('[emails] OWNER_EMAIL is not configured — skipping wholesale inquiry notification.');
    return;
  }

  // The owner is Turkish — always notify in Turkish regardless of which
  // language the visitor filled out the form in.
  const fullName = `${details.firstName} ${details.lastName}`.trim();
  const labelName = 'İsim';
  const labelEmail = 'E-posta';
  const labelPhone = 'Telefon';
  const labelCity = 'Şehir';
  const labelZip = 'Posta Kodu';
  const labelCompany = 'Şirket';
  const labelWebsite = 'Web Sitesi';
  const replyButtonLabel = `${fullName} kişisine yanıt ver`;
  const subject = `Yeni toptan satış talebi — ${fullName}`;
  const heroEyebrow = 'TOPTAN SATIŞ TALEBİ';
  const heroTitle = `${fullName} toptan satış formu gönderdi`;

  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(details.email);
  const safePhone = details.phone ? escapeHtml(details.phone) : undefined;
  const safeCity = escapeHtml(details.city);
  const safeZip = details.zip ? escapeHtml(details.zip) : undefined;
  const safeCompany = details.company ? escapeHtml(details.company) : undefined;
  const safeWebsite = details.website ? escapeHtml(details.website) : undefined;
  const safeMessage = escapeHtml(details.message);
  const replyToUri = encodeURIComponent(details.email);

  const row = (label: string, value?: string) =>
    value
      ? `<tr>
          <td style="padding: 4px 0; color: ${colors.warmMid}; width: 90px;">${label}</td>
          <td style="padding: 4px 0; color: ${colors.warmText};">${value}</td>
        </tr>`
      : '';

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; margin-bottom: 20px;">
      ${row(labelName, safeName)}
      <tr>
        <td style="padding: 4px 0; color: ${colors.warmMid};">${labelEmail}</td>
        <td style="padding: 4px 0; color: ${colors.warmText};">
          <a href="mailto:${replyToUri}" style="color: ${colors.orange}; text-decoration: none;">${safeEmail}</a>
        </td>
      </tr>
      ${row(labelPhone, safePhone)}
      ${row(labelCity, safeCity)}
      ${row(labelZip, safeZip)}
      ${row(labelCompany, safeCompany)}
      ${row(labelWebsite, safeWebsite)}
    </table>

    <div style="background-color: ${colors.sand}; border-radius: 12px; padding: 20px 24px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: ${colors.warmText}; white-space: pre-line;">${safeMessage}</p>
    </div>

    ${button(replyButtonLabel.replace(/[<>&"']/g, ''), `mailto:${replyToUri}`)}
  `;

  await sendEmail({
    to: [{ email: ownerEmail }],
    subject,
    replyTo: { email: details.email, name: fullName },
    htmlContent: renderEmailLayout({
      preheader: details.message.slice(0, 100),
      heroEyebrow,
      heroTitle,
      bodyHtml,
      locale: 'tr',
    }),
  });
}
