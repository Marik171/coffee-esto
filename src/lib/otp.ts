import crypto from 'crypto';

export const CODE_LENGTH = 6;
export const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_VERIFY_ATTEMPTS = 5;

export function generateCode(): string {
  const max = 10 ** CODE_LENGTH;
  const n = crypto.randomInt(0, max);
  return n.toString().padStart(CODE_LENGTH, '0');
}

export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}
