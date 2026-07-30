// Thin wrapper around Brevo's transactional email REST API (free tier: 300 emails/day).
// No SDK dependency — a single fetch call to https://api.brevo.com/v3/smtp/email.

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export async function sendEmail({ to, subject, htmlContent, replyTo }: SendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? 'Coffee Esto';

  if (!apiKey || !senderEmail) {
    console.error('[brevo] BREVO_API_KEY or BREVO_SENDER_EMAIL is not configured — email not sent.', { subject, to });
    return;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to,
        subject,
        htmlContent,
        ...(replyTo && { replyTo }),
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error(`[brevo] Failed to send email (${res.status}): ${errBody}`);
    }
  } catch (error) {
    // Never let an email-provider outage break the calling flow (checkout, signup, etc.)
    console.error('[brevo] Network error sending email:', error);
  }
}

export function getOwnerEmail(): string {
  return process.env.OWNER_EMAIL ?? process.env.ADMIN_EMAIL ?? '';
}
