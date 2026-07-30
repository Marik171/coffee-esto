import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { signToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/emails';

export async function POST(request: Request) {
  try {
    const { idToken, locale } = await request.json() as { idToken?: string; locale?: string };

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Firebase ID token is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error('Firebase API key is missing in environment.');
      return NextResponse.json(
        { success: false, error: 'Authentication service configuration error.' },
        { status: 500 }
      );
    }

    // Verify the Firebase ID token by calling Google Identity Toolkit lookup API
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error('Firebase ID token verification failed:', errData);
      const googleError = errData?.error?.message || JSON.stringify(errData);
      return NextResponse.json(
        { success: false, error: `Firebase ID token verification failed: ${googleError}` },
        { status: 401 }
      );
    }

    const verifyData = await verifyRes.json() as {
      users?: Array<{
        email: string;
        displayName?: string;
        emailVerified?: boolean;
      }>;
    };

    if (!verifyData.users || verifyData.users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 401 }
      );
    }

    const firebaseUser = verifyData.users[0];
    const normalizedEmail = firebaseUser.email.toLowerCase().trim();
    const displayName = firebaseUser.displayName || '';

    // Retrieve or create the customer in the local database
    const existingCustomer = await db.customer.findUnique({ where: { email: normalizedEmail } });

    const customer = await db.customer.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: {
        email: normalizedEmail,
        name: displayName,
      },
    });

    if (!existingCustomer) {
      let detectedLocale = locale;
      if (!detectedLocale) {
        const referer = request.headers.get('referer') || '';
        detectedLocale = (referer.includes('/en/') || referer.endsWith('/en')) ? 'en' : 'tr';
      }
      await sendWelcomeEmail(normalizedEmail, displayName, detectedLocale);
    }

    // Issue standard customer session token (JWT)
    const token = await signToken({ customerId: customer.id, role: 'customer' }, 60 * 60 * 24 * 30);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'customer_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        newsOptIn: customer.newsOptIn,
        isSubscriber: customer.isSubscriber,
      },
      error: null,
    });

  } catch (error) {
    console.error('Firebase login route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
