import { NextResponse } from 'next/server';

// Returns are not offered — all orders are roasted to order and non-refundable.
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Returns are not available. All coffee is roasted fresh to order.' },
    { status: 410 }
  );
}
