'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import styles from './SubscribePopup.module.css';

const STORAGE_KEY = 'coffee_esto_subscribe_popup_seen';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // don't nag again for a week
const MIN_TIME_ON_PAGE_MS = 8000; // ignore scroll/exit signals from instant bounces
const IDLE_TRIGGER_MS = 45000; // fallback for mobile, where there is no exit intent
const SKIP_PREFIXES = ['/admin', '/checkout', '/cart', '/account', '/orders'];

const copy = {
  en: {
    eyebrow: 'Before you go',
    title: 'Get 10% off every coffee',
    text: 'Become a Coffee Esto subscriber and save 10% on all our coffees, automatically applied at checkout.',
    guestCta: 'Sign in / Create account',
    memberCta: 'Subscribe & save 10%',
    working: 'Subscribing…',
    done: "You're subscribed — 10% off coffees is now active!",
    dismiss: 'No thanks',
    close: 'Close',
  },
  tr: {
    eyebrow: 'Ayrılmadan önce',
    title: 'Her kahvede %10 indirim',
    text: 'Coffee Esto abonesi olun, tüm kahvelerde %10 indirim kazanın. İndirim ödeme sırasında otomatik uygulanır.',
    guestCta: 'Giriş yap / Hesap oluştur',
    memberCta: 'Abone ol, %10 kazan',
    working: 'Abone olunuyor…',
    done: 'Abone oldunuz — kahvelerde %10 indirim aktif!',
    dismiss: 'Hayır, teşekkürler',
    close: 'Kapat',
  },
};

export default function SubscribePopup() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'tr';
  const linkPrefix = locale === 'en' ? '/en' : '';
  const t = copy[locale];
  const { isSubscriber, refreshUserStatus } = useCart();

  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const shownRef = useRef(false);

  const skip = SKIP_PREFIXES.some((p) => pathname.startsWith(p) || pathname.startsWith(`/en${p}`));

  // Know whether the visitor has an account, so the CTA can subscribe in one click.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/account/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => { if (!cancelled) setSignedIn(Boolean(json?.success && json?.data)); })
      .catch(() => { if (!cancelled) setSignedIn(false); });
    return () => { cancelled = true; };
  }, []);

  const recentlySeen = () => {
    try {
      const at = Number(localStorage.getItem(STORAGE_KEY));
      return Boolean(at) && Date.now() - at < COOLDOWN_MS;
    } catch {
      return false;
    }
  };

  const markSeen = () => {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* non-fatal */ }
  };

  const show = useCallback(() => {
    if (shownRef.current) return;
    shownRef.current = true;
    markSeen();
    setOpen(true);
  }, []);

  useEffect(() => {
    if (skip || isSubscriber || signedIn === null) return;

    // Testing aid: visit any page with ?popup=1 to see the popup right away, ignoring the cooldown.
    if (new URLSearchParams(window.location.search).get('popup') === '1') {
      const forceTimer = window.setTimeout(show, 800);
      return () => window.clearTimeout(forceTimer);
    }

    if (recentlySeen()) return;

    const start = Date.now();
    const settled = () => Date.now() - start >= MIN_TIME_ON_PAGE_MS;

    // Desktop: cursor leaves through the top of the window (heading to tabs / close button)
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget === null && e.clientY <= 0 && settled()) show();
    };

    // Scrolled to the bottom of the page
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable > 200 && window.scrollY / scrollable >= 0.95 && settled()) show();
    };

    // Mobile fallback: no exit intent exists, so show after a while on the site
    const idleTimer = window.setTimeout(show, IDLE_TRIGGER_MS);

    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer);
    };
  }, [skip, isSubscriber, signedIn, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const subscribe = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/account/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSubscriber: true }),
      });
      if (res.ok) {
        setSubscribed(true);
        await refreshUserStatus();
        window.setTimeout(() => setOpen(false), 2200);
      }
    } catch (err) {
      console.error('Failed to subscribe:', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={t.close}>
              ×
            </button>
            <div className={styles.media}>
              <img src="/images/coffee_grouped.webp" alt="" className={styles.image} />
            </div>
            <div className={styles.body}>
            <span className={styles.eyebrow}>{t.eyebrow}</span>
            <h2 className={styles.title}>{t.title}</h2>
            {subscribed ? (
              <p className={styles.note}>{t.done}</p>
            ) : (
              <>
                <p className={styles.text}>{t.text}</p>
                {signedIn ? (
                  <button type="button" className={styles.cta} onClick={subscribe} disabled={busy}>
                    {busy ? t.working : t.memberCta}
                  </button>
                ) : (
                  <Link href={`${linkPrefix}/account`} className={styles.cta} onClick={() => setOpen(false)}>
                    {t.guestCta}
                  </Link>
                )}
                <button type="button" className={styles.dismiss} onClick={() => setOpen(false)}>
                  {t.dismiss}
                </button>
              </>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
