'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar({ locale = 'tr' }: { locale?: string }) {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll height to trigger background blur shifts
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = pathname === '/' || pathname === '/en';
  
  const headerClass = `${styles.header} ${
    isScrolled || !isHomepage ? styles.headerSolid : styles.headerTransparent
  }`;

  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      locations: 'Locations',
      coffee: 'Coffee',
      quiz: 'Find Your Roast',
      brew: 'Brew Guides',
      wholesale: 'Wholesale',
      track: 'Track Order',
      register: 'Register',
      cart: 'Shopping Cart',
      homepage: 'Coffee Esto Roastery Homepage',
    },
    tr: {
      home: 'Ana Sayfa',
      about: 'Hakkımızda',
      locations: 'Şubelerimiz',
      coffee: 'Kahvelerimiz',
      quiz: 'Kavrum Testi',
      brew: 'Demleme Rehberi',
      wholesale: 'Toptan Satış',
      track: 'Sipariş Takibi',
      register: 'Kayıt Ol',
      cart: 'Sepet',
      homepage: 'Coffee Esto Roastery Ana Sayfa',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const getLanguageToggleHref = () => {
    if (locale === 'tr') {
      if (pathname === '/') return '/en';
      return `/en${pathname}`;
    } else {
      if (pathname === '/en') return '/';
      return pathname.replace('/en/', '/');
    }
  };

  return (
    <header className={headerClass}>
      <div className={styles.headerInner}>
        
        {/* Branding Logo */}
        <Link href={locale === 'tr' ? '/' : '/en'} className={styles.logo} aria-label={t.homepage} onClick={() => setIsNavOpen(false)}>
          <span className={styles.logoTop}>COFFEE</span>
          <span className={styles.logoMiddle}>ESTO</span>
          <span className={styles.logoBottom}>ROASTERY</span>
        </Link>

        {/* Desktop Sitemap Menu */}
        <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li>
              <Link 
                href={locale === 'tr' ? '/' : '/en'} 
                className={`${styles.navLink} ${(pathname === '/' || pathname === '/en') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.home}
              </Link>
            </li>
            <li>
              <Link 
                href={`${linkPrefix}/about`} 
                className={`${styles.navLink} ${pathname.includes('/about') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.about}
              </Link>
            </li>
            <li>
              <Link
                href={`${linkPrefix}/location`} 
                className={`${styles.navLink} ${pathname.includes('/location') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.locations}
              </Link>
            </li>
            <li>
              <Link 
                href={`${linkPrefix}/coffee`} 
                className={`${styles.navLink} ${pathname.includes('/coffee') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.coffee}
              </Link>
            </li>
            <li>
              <Link 
                href={`${linkPrefix}/quiz`} 
                className={`${styles.navLink} ${pathname.includes('/quiz') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.quiz}
              </Link>
            </li>
            <li>
              <Link 
                href={`${linkPrefix}/brew`} 
                className={`${styles.navLink} ${pathname.includes('/brew') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.brew}
              </Link>
            </li>
            <li>
              <Link 
                href={`${linkPrefix}/wholesale`} 
                className={`${styles.navLink} ${pathname.includes('/wholesale') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.wholesale}
              </Link>
            </li>
            <li>
              <Link 
                href={`${linkPrefix}/orders/track`} 
                className={`${styles.navLink} ${pathname.includes('/orders/track') ? styles.navLinkActive : ''}`}
                onClick={() => setIsNavOpen(false)}
              >
                {t.track}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Customer Actions & Shopping Cart Toggle */}
        <div className={styles.actions}>
          {/* Language Switcher */}
          <Link 
            href={getLanguageToggleHref()} 
            className={styles.langToggle}
            aria-label={locale === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
          >
            {locale === 'tr' ? 'EN' : 'TR'}
          </Link>
          
          <button 
            className={styles.cartBtn} 
            onClick={() => setIsCartOpen(true)}
            aria-label={`${t.cart}, ${cartCount} items`}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className={styles.cartBadge}>{cartCount}</span>
          </button>
          
          {/* Responsive Hamburger Toggle Button */}
          <button 
            className={`${styles.burger} ${isNavOpen ? styles.burgerActive : ''}`}
            onClick={() => setIsNavOpen(!isNavOpen)} 
            aria-label="Toggle navigation menu"
            aria-expanded={isNavOpen}
          >
            <span className={styles.burgerBar}></span>
            <span className={styles.burgerBar}></span>
            <span className={styles.burgerBar}></span>
          </button>
        </div>

      </div>
    </header>
  );
}
