import { sendVerificationCodeEmail } from './emails';

export async function sendVerificationEmail(email: string, code: string, locale?: string): Promise<void> {
  await sendVerificationCodeEmail(email, code, locale);
}
