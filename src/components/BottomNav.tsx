'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) return null;

  const isEn = pathname.startsWith('/en') || pathname.includes('/en/');
  const linkPrefix = isEn ? '/en' : '';

  const active = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/en';
    }
    return pathname.startsWith(`${linkPrefix}${href}`);
  };

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">

      {/* Home */}
      <Link href={linkPrefix || '/'} className={`${styles.item} ${active('/') ? styles.active : ''}`}>
        {active('/') && (
          <motion.span layoutId="pill" className={styles.pill} transition={{ type: 'spring', damping: 26, stiffness: 340 }} />
        )}
        <motion.span className={styles.iconWrap} whileTap={{ scale: 0.82 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </motion.span>
        <span className={styles.label}>Home</span>
      </Link>

      {/* Shop */}
      <Link href={`${linkPrefix}/coffee`} className={`${styles.item} ${active('/coffee') ? styles.active : ''}`}>
        {active('/coffee') && (
          <motion.span layoutId="pill" className={styles.pill} transition={{ type: 'spring', damping: 26, stiffness: 340 }} />
        )}
        <motion.span className={styles.iconWrap} whileTap={{ scale: 0.82 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8h1a4 4 0 010 8h-1"/>
            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
        </motion.span>
        <span className={styles.label}>Shop</span>
      </Link>

      {/* Cart — center highlight */}
      <button className={`${styles.item} ${styles.cartItem}`} onClick={() => setIsCartOpen(true)} aria-label={`Cart, ${cartCount} items`}>
        <motion.span className={styles.cartBubble} whileTap={{ scale: 0.85 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
          </svg>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                className={styles.badge}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 18, stiffness: 400 }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
        <span className={styles.label}>Cart</span>
      </button>

      {/* Track */}
      <Link href={`${linkPrefix}/orders/track`} className={`${styles.item} ${active('/orders') ? styles.active : ''}`}>
        {active('/orders') && (
          <motion.span layoutId="pill" className={styles.pill} transition={{ type: 'spring', damping: 26, stiffness: 340 }} />
        )}
        <motion.span className={styles.iconWrap} whileTap={{ scale: 0.82 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </motion.span>
        <span className={styles.label}>Track</span>
      </Link>

    </nav>
  );
}
