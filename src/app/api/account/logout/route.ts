import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set({
      name: 'customer_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ success: true, error: null });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error invalidating session.' },
      { status: 500 }
    );
  }
}
