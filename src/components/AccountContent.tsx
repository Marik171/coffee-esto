'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../app/account/account.module.css';
import { useCart } from '../context/CartContext';
import AccountDashboard from './AccountDashboard';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AccountContentProps {
  locale?: string;
}

type Step = 'checking' | 'signin' | 'signup';

interface CustomerData {
  id: string;
  email: string;
  name: string;
  phone: string;
  newsOptIn: boolean;
}

export default function AccountContent({ locale = 'en' }: AccountContentProps) {
  const router = useRouter();
  const { refreshUserStatus } = useCart();
  const [step, setStep] = useState<Step>('checking');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newsOptIn, setNewsOptIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/account/me');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setCustomer(json.data);
            setStep('signin');
            return;
          }
        }
      } catch {
        // ignore — fall through to sign-in form
      }
      setStep('signin');
    })();
  }, []);

  const translations = {
    en: {
      signIn: 'Sign In',
      signInSub: 'Access your account or track orders',
      signUp: 'Create Account',
      signUpSub: 'Join Coffee Esto Roastery',
      emailPlaceholder: 'Email Address',
      passwordPlaceholder: 'Password',
      namePlaceholder: 'Full Name',
      newsOptIn: 'Email me with news and offers',
      termsText: 'By continuing, you agree to our ',
      termsLink: 'Terms of service',
      privacyPolicy: 'Privacy policy',
      genericError: 'Something went wrong. Please try again.',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      or: 'or',
      googleBtn: 'Continue with Google',
    },
    tr: {
      signIn: 'Giriş Yap',
      signInSub: 'Hesabınıza erişin veya siparişlerinizi takip edin',
      signUp: 'Kayıt Ol',
      signUpSub: 'Coffee Esto Roastery\'ye katılın',
      emailPlaceholder: 'E-posta Adresi',
      passwordPlaceholder: 'Şifre',
      namePlaceholder: 'Ad Soyad',
      newsOptIn: 'Haber ve teklifleri e-posta ile gönder',
      termsText: 'Devam ederek, ',
      termsLink: 'Hizmet Şartları',
      privacyPolicy: 'Gizlilik politikası',
      genericError: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
      noAccount: 'Hesabınız yok mu?',
      haveAccount: 'Zaten hesabınız var mı?',
      or: 'veya',
      googleBtn: 'Google ile Devam Et',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/account/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, locale }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || t.genericError);
        return;
      }
      setCustomer(json.data);
      refreshUserStatus();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(t.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/account/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, locale }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || t.genericError);
        return;
      }
      setCustomer(json.data);
      refreshUserStatus();
    } catch (err: any) {
      console.error(err);
      if (
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential'
      ) {
        setError(locale === 'tr' ? 'Hatalı e-posta adresi veya şifre.' : 'Invalid email address or password.');
      } else {
        setError(t.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    setIsLoading(true);
    setError('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(result.user, { displayName: name.trim() });
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/account/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, locale }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || t.genericError);
        return;
      }

      if (newsOptIn) {
        await fetch('/api/account/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsOptIn }),
        }).catch(() => {});
        json.data.newsOptIn = newsOptIn;
      }

      setCustomer(json.data);
      refreshUserStatus();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError(locale === 'tr' ? 'Bu e-posta adresi zaten kullanımda.' : 'This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError(locale === 'tr' ? 'Şifre çok zayıf. En az 6 karakter olmalıdır.' : 'Password is too weak. It must be at least 6 characters.');
      } else {
        setError(t.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut().catch(() => {});
    await fetch('/api/account/logout', { method: 'POST' }).catch(() => {});
    setCustomer(null);
    refreshUserStatus();
    setName('');
    setEmail('');
    setPassword('');
    setStep('signin');
  };

  if (step === 'checking') {
    return <div className={styles.pageWrapper} />;
  }

  if (customer) {
    return (
      <AccountDashboard
        locale={locale}
        email={customer.email}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Brand Identity Header */}
      <div className={styles.logo}>
        <p className={styles.logoText}>COFFEE ESTO</p>
        <p className={styles.logoSubtext}>Roastery</p>
      </div>

      <div className={styles.accountSection}>
        <div className={styles.accountContainer}>

          {step === 'signin' ? (
            <>
              <h1 className={styles.heading}>{t.signIn}</h1>
              <p className={styles.subheading}>{t.signInSub}</p>

              {/* Google OAuth Button */}
              <button 
                type="button" 
                onClick={handleGoogleSignIn} 
                className={styles.googleButton}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" className={styles.googleIcon}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t.googleBtn}
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>{t.or}</span>
                <span className={styles.dividerLine} />
              </div>

              <form onSubmit={handleManualSignIn} className={styles.formElement}>
                <div className={styles.emailInputWrapper}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={styles.emailInput}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className={styles.emailInputWrapper}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className={styles.emailInput}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {error && <p className={styles.termsText} style={{ color: '#c0392b', marginTop: '0px' }}>{error}</p>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {t.signIn}
                </button>
              </form>

              <p className={styles.toggleModeText}>
                {t.noAccount}
                <button 
                  type="button" 
                  onClick={() => { setStep('signup'); setError(''); }} 
                  className={styles.toggleModeBtn}
                >
                  {t.signUp}
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.heading}>{t.signUp}</h1>
              <p className={styles.subheading}>{t.signUpSub}</p>

              {/* Google OAuth Button */}
              <button 
                type="button" 
                onClick={handleGoogleSignIn} 
                className={styles.googleButton}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" className={styles.googleIcon}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t.googleBtn}
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>{t.or}</span>
                <span className={styles.dividerLine} />
              </div>

              <form onSubmit={handleManualSignUp} className={styles.formElement}>
                <div className={styles.emailInputWrapper}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={styles.emailInput}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className={styles.emailInputWrapper}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={styles.emailInput}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className={styles.emailInputWrapper}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className={styles.emailInput}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="newsOptIn"
                    checked={newsOptIn}
                    onChange={(e) => setNewsOptIn(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <label htmlFor="newsOptIn" className={styles.checkboxLabelStructure}>
                    <div className={styles.circularCheckbox}>
                      {newsOptIn && '✓'}
                    </div>
                    <span className={styles.checkboxTextLabel}>{t.newsOptIn}</span>
                  </label>
                </div>

                {error && <p className={styles.termsText} style={{ color: '#c0392b', marginTop: '0px' }}>{error}</p>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {t.signUp}
                </button>
              </form>

              <p className={styles.toggleModeText}>
                {t.haveAccount}
                <button 
                  type="button" 
                  onClick={() => { setStep('signin'); setError(''); }} 
                  className={styles.toggleModeBtn}
                >
                  {t.signIn}
                </button>
              </p>
            </>
          )}

          {/* Legal Acknowledgement Link */}
          <p className={styles.termsText}>
            {t.termsText}
            <Link href="/terms" className={styles.termsLink}>
              {t.termsLink}
            </Link>
          </p>

        </div>
      </div>

      {/* Centered Flat Screen Base Link */}
      <div className={styles.footer}>
        <Link href="/privacy" className={styles.footerLink}>
          {t.privacyPolicy}
        </Link>
      </div>
    </div>
  );
}

