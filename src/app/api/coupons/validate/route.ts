import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

// Public — lets the checkout page preview a discount before submitting payment.
// The checkout route re-validates independently; this is display-only.
export async function POST(request: Request) {
  try {
    const { code, subtotal } = (await request.json()) as { code?: string; subtotal?: number };
    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json(
        { success: false, error: 'code and subtotal are required.' },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, subtotal);
    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.error, data: null });
    }

    return NextResponse.json({
      success: true,
      data: { code: result.coupon!.code, discountAmount: result.discountAmount },
      error: null,
    });
  } catch (error) {
    console.error('[POST /api/coupons/validate] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon.' },
      { status: 500 }
    );
  }
}
