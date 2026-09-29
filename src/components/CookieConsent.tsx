'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const STORAGE_KEY = 'coffee_esto_cookie_consent';

// Gate for any future analytics/pixel script — call this before loading one,
// so tracking only fires once the visitor has actually accepted.
export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

const copy = {
  en: {
    text: 'We use cookies to run this site (cart, sign-in) and, if you agree, to understand how visitors use it. See our',
    link: 'Privacy Policy',
    accept: 'Accept',
    decline: 'Decline',
  },
  tr: {
    text: 'Bu siteyi çalıştırmak (sepet, oturum açma) ve izniniz olması halinde ziyaretçilerin siteyi nasıl kullandığını anlamak için çerezler kullanıyoruz. Bkz.',
    link: 'Gizlilik Politikası',
    accept: 'Kabul et',
    decline: 'Reddet',
  },
};

export default function CookieConsent() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'tr';
  const t = copy[locale];

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage blocked (private mode, etc.) — skip the banner rather than show it forever.
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch { /* non-fatal */ }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-label="Cookie consent"
          style={{
            position: 'fixed',
            left: '16px',
            right: '16px',
            bottom: '16px',
            zIndex: 2000,
            maxWidth: '560px',
            margin: '0 auto',
            background: '#1a0e07',
            color: '#ffffff',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
            {t.text}{' '}
            <a href="#" style={{ color: '#e84d00', textDecoration: 'underline' }}>
              {t.link}
            </a>
            .
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => choose('declined')}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {t.decline}
            </button>
            <button
              type="button"
              onClick={() => choose('accepted')}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#e84d00',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
