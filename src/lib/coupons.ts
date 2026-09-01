import db from '@/lib/db';

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  coupon?: { id: string; code: string; type: string; value: number };
  discountAmount: number;
}

// Server-side source of truth for coupon validity — never trust a
// client-computed discount amount.
export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return { valid: false, error: 'Enter a coupon code.', discountAmount: 0 };

  const coupon = await db.coupon.findUnique({ where: { code: cleanCode } });
  if (!coupon || !coupon.isActive) {
    return { valid: false, error: 'This coupon code is not valid.', discountAmount: 0 };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: 'This coupon has expired.', discountAmount: 0 };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: 'This coupon has reached its usage limit.', discountAmount: 0 };
  }
  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `This coupon requires a minimum order of ₺${coupon.minOrderAmount.toFixed(2)}.`,
      discountAmount: 0,
    };
  }

  const discountAmount = coupon.type === 'percent'
    ? Math.round((subtotal * coupon.value) / 100 * 100) / 100
    : Math.min(coupon.value, subtotal);

  return {
    valid: true,
    coupon: { id: coupon.id, code: coupon.code, type: coupon.type, value: coupon.value },
    discountAmount,
  };
}
