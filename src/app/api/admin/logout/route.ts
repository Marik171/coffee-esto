import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear cookie by overwriting it with an expired maxAge
    cookieStore.set({
      name: 'admin_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Immediately expired
    });

    return NextResponse.json({
      success: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error invalidating session.' },
      { status: 500 }
    );
  }
}
