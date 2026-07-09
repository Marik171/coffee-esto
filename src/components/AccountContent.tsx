'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../app/account/account.module.css';
import AccountDashboard from './AccountDashboard';

interface AccountContentProps {
  locale?: string;
}

type Step = 'checking' | 'email' | 'code';

interface CustomerData {
  id: string;
  email: string;
  name: string;
  phone: string;
  newsOptIn: boolean;
}

export default function AccountContent({ locale = 'en' }: AccountContentProps) {
  const [step, setStep] = useState<Step>('checking');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
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
            setStep('email');
            return;
          }
        }
      } catch {
        // ignore — fall through to sign-in form
      }
      setStep('email');
    })();
  }, []);

  const translations = {
    en: {
      signIn: 'Sign in',
      signInSub: 'Sign in or create an account',
      enterCode: 'Enter your code',
      enterCodeSub: `We sent a 6-digit code to ${email}`,
      emailPlaceholder: 'Email',
      codePlaceholder: '6-digit code',
      lastUsed: 'Last used',
      newsOptIn: 'Email me with news and offers',
      termsText: 'By continuing, you agree to our ',
      termsLink: 'Terms of service',
      privacyPolicy: 'Privacy policy',
      continueWithShop: 'Continue with ',
      useDifferentEmail: 'Use a different email',
      genericError: 'Something went wrong. Please try again.',
    },
    tr: {
      signIn: 'Giriş Yap',
      signInSub: 'Giriş yap veya hesap oluştur',
      enterCode: 'Kodunuzu girin',
      enterCodeSub: `${email} adresine 6 haneli bir kod gönderdik`,
      emailPlaceholder: 'E-posta',
      codePlaceholder: '6 haneli kod',
      lastUsed: 'Son kullanılan',
      newsOptIn: 'Haber ve teklifleri e-posta ile gönder',
      termsText: 'Devam ederek, ',
      termsLink: 'Hizmet Şartları',
      privacyPolicy: 'Gizlilik politikası',
      continueWithShop: 'ile devam et ',
      useDifferentEmail: 'Farklı bir e-posta kullan',
      genericError: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/account/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || t.genericError);
        return;
      }
      setStep('code');
    } catch (err) {
      console.error(err);
      setError(t.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/account/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || t.genericError);
        return;
      }

      if (json.data.newsOptIn !== newsOptIn) {
        await fetch('/api/account/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsOptIn }),
        }).catch(() => {});
        json.data.newsOptIn = newsOptIn;
      }

      setCustomer(json.data);
    } catch (err) {
      console.error(err);
      setError(t.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/account/logout', { method: 'POST' }).catch(() => {});
    setCustomer(null);
    setEmail('');
    setCode('');
    setStep('email');
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
        <p className={styles.logoText}>CEREMONY</p>
        <p className={styles.logoSubtext}>Coffee Roasters</p>
      </div>

      <div className={styles.accountSection}>
        <div className={styles.accountContainer}>

          {step === 'email' ? (
            <>
              <h1 className={styles.heading}>{t.signIn}</h1>
              <p className={styles.subheading}>{t.signInSub}</p>

              {/* Core App Integration Action Button */}
              <button type="button" className={styles.shopButton}>
                {t.continueWithShop}<span className={styles.shopText}>shop</span>
              </button>

              {/* Inline Muted Segment Divider */}
              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.dividerLine} />
              </div>

              <form onSubmit={handleRequestCode} className={styles.formElement}>
                {/* Input Wrapper with Border-Overlapping Badge */}
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
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                    aria-label="Submit email"
                  >
                    →
                  </button>

                  {/* Pill badge centers directly over the lower border line */}
                  <span className={styles.lastUsedLabel}>{t.lastUsed}</span>
                </div>

                {/* Circular Checked Context Selector Row */}
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

                {error && <p className={styles.termsText} style={{ color: '#c0392b' }}>{error}</p>}
              </form>
            </>
          ) : (
            <>
              <h1 className={styles.heading}>{t.enterCode}</h1>
              <p className={styles.subheading}>{t.enterCodeSub}</p>

              <form onSubmit={handleVerifyCode} className={styles.formElement}>
                <div className={styles.emailInputWrapper}>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.codePlaceholder}
                    className={styles.emailInput}
                    required
                  />
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                    aria-label="Submit code"
                  >
                    →
                  </button>
                </div>

                {error && <p className={styles.termsText} style={{ color: '#c0392b' }}>{error}</p>}

                <p className={styles.termsText}>
                  <button
                    type="button"
                    className={styles.termsLink}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                    onClick={() => { setStep('email'); setCode(''); setError(''); }}
                  >
                    {t.useDifferentEmail}
                  </button>
                </p>
              </form>
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
