// Stub mailer — swap the body of sendVerificationEmail() for a real provider
// (Resend, SMTP via nodemailer, etc.) when credentials are available.
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  console.log(`[mailer] Verification code for ${email}: ${code}`);
}
