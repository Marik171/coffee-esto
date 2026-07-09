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
      cart: 'Shopping Cart',
      homepage: 'Coffee Esto Roastery Homepage',
      orderAhead: 'ORDER AHEAD',
      search: 'Search',
      shippingPromo: 'Free Shipping on Orders Over ₺500',
      shop: 'SHOP',
      subscriptions: 'SUBSCRIPTIONS',
      coldBrew: 'COLD BREW',
      learn: 'LEARN',
      account: 'ACCOUNT',
      allCoffees: 'All Coffees',
      singleOriginCategory: 'Single Origin',
      espressoCategory: 'Espresso',
      filterCategory: 'Filter Coffee',
      turkishCategory: 'Turkish Coffee',
      limitedCategory: 'Limited Edition',
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
      cart: 'Sepet',
      homepage: 'Coffee Esto Roastery Ana Sayfa',
      orderAhead: 'ÖNCEDEN SİPARİŞ ET',
      search: 'Ara',
      shippingPromo: '500 TL Üzeri Siparişlerde Ücretsiz Kargo',
      shop: 'MAĞAZA',
      subscriptions: 'ABONELİK',
      coldBrew: 'SOĞUK DEMLEME',
      learn: 'REHBER',
      account: 'SİPARİŞ TAKİBİ',
      allCoffees: 'Tüm Kahveler',
      singleOriginCategory: 'Tek Kökenli',
      espressoCategory: 'Espresso',
      filterCategory: 'Filtre Kahve',
      turkishCategory: 'Türk Kahvesi',
      limitedCategory: 'Özel Seri',
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

  const headerClass = `${styles.headerWrapper} ${
    isScrolled ? styles.headerScrolled : ''
  }`;

  return (
    <header className={headerClass}>
      {/* 1. Black Top Announcement Bar */}
      <div className={styles.announcementBar}>
        <div className={styles.announcementInner}>
          <div className={styles.announcementLeft}>
            <Link href={`${linkPrefix}/location`} className={styles.orderAheadBtn}>
              {t.orderAhead}
            </Link>
          </div>
          <div className={styles.announcementCenter}>
            <span>{t.shippingPromo}</span>
          </div>
          <div className={styles.announcementRight}>
            <Link href={`${linkPrefix}/coffee`} className={styles.searchBtn}>
              <span className={styles.searchText}>{t.search}</span>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>
            <span className={styles.barDivider}>|</span>
            <Link 
              href={getLanguageToggleHref()} 
              className={styles.langToggleTop}
              aria-label={locale === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
            >
              {locale === 'tr' ? 'EN' : 'TR'}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. White Main Brand Bar */}
      <div className={styles.brandBar}>
        <div className={styles.brandInner}>
          {/* Desktop Left Menu Links */}
          <nav className={styles.desktopMenuLeft}>
            <div className={styles.shopDropdownWrapper}>
              <Link href={`${linkPrefix}/coffee`} className={styles.brandLink}>
                {t.shop}
                <svg viewBox="0 0 24 24" width="8" height="8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', verticalAlign: 'middle' }} className={styles.dropdownArrow}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
              <div className={styles.shopDropdownMenu}>
                <Link href={`${linkPrefix}/coffee`} className={styles.dropdownLink}>
                  {t.allCoffees}
                </Link>
                <Link href={`${linkPrefix}/coffee?category=single-origin`} className={styles.dropdownLink}>
                  {t.singleOriginCategory}
                </Link>
                <Link href={`${linkPrefix}/coffee?category=espresso`} className={styles.dropdownLink}>
                  {t.espressoCategory}
                </Link>
                <Link href={`${linkPrefix}/coffee?category=filter`} className={styles.dropdownLink}>
                  {t.filterCategory}
                </Link>
                <Link href={`${linkPrefix}/coffee?category=turkish`} className={styles.dropdownLink}>
                  {t.turkishCategory}
                </Link>
                <Link href={`${linkPrefix}/coffee?category=limited-edition`} className={styles.dropdownLink}>
                  {t.limitedCategory}
                </Link>
              </div>
            </div>
            <Link href={`${linkPrefix}/coffee?category=single-origin`} className={styles.brandLink}>
              {t.subscriptions}
            </Link>
            <Link href={`${linkPrefix}/wholesale`} className={styles.brandLink}>
              {t.wholesale}
            </Link>
            <Link href={`${linkPrefix}/coffee`} className={styles.brandLink}>
              {t.coldBrew}
            </Link>
          </nav>

          {/* Centered Brand Logo */}
          <Link href={locale === 'tr' ? '/' : '/en'} className={styles.logoContainer} aria-label={t.homepage} onClick={() => setIsNavOpen(false)}>
            <span className={styles.logoTitle}>C O F F E E &nbsp; E S T O</span>
            <span className={styles.logoSubtitle}>C O F F E E &nbsp; R O A S T E R S</span>
          </Link>

          {/* Desktop Right Menu Links */}
          <nav className={styles.desktopMenuRight}>
            <Link href={`${linkPrefix}/location`} className={styles.brandLink}>
              {t.locations}
            </Link>
            <Link href={`${linkPrefix}/brew`} className={styles.brandLink}>
              {t.learn}
            </Link>
            <Link href={`${linkPrefix}/account`} className={styles.brandLink}>
              {t.account}
            </Link>
            {/* Cart count bubble */}
            <button 
              className={styles.cartBubbleBtn} 
              onClick={() => setIsCartOpen(true)}
              aria-label={`${t.cart}, ${cartCount} items`}
            >
              <span className={styles.cartCount}>{cartCount}</span>
            </button>
          </nav>

          {/* Mobile Right Controls */}
          <div className={styles.mobileRightControls}>
            <button 
              className={styles.cartBubbleBtnMobile} 
              onClick={() => setIsCartOpen(true)}
              aria-label={`${t.cart}, ${cartCount} items`}
            >
              <span>{cartCount}</span>
            </button>
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
      </div>

      {/* 3. Mobile Navigation Drawer */}
      <nav className={`${styles.mobileDrawer} ${isNavOpen ? styles.mobileDrawerOpen : ''}`}>
        <ul className={styles.mobileDrawerList}>
          <li>
            <Link href={`${linkPrefix}/coffee`} onClick={() => setIsNavOpen(false)}>
              {t.shop}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/coffee?category=single-origin`} onClick={() => setIsNavOpen(false)}>
              {t.subscriptions}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/wholesale`} onClick={() => setIsNavOpen(false)}>
              {t.wholesale}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/coffee`} onClick={() => setIsNavOpen(false)}>
              {t.coldBrew}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/location`} onClick={() => setIsNavOpen(false)}>
              {t.locations}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/brew`} onClick={() => setIsNavOpen(false)}>
              {t.learn}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/account`} onClick={() => setIsNavOpen(false)}>
              {t.account}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/coffee`} onClick={() => setIsNavOpen(false)}>
              {t.search.toUpperCase()}
            </Link>
          </li>
          <li className={styles.mobileLangLi}>
            <Link 
              href={getLanguageToggleHref()} 
              className={styles.mobileLangToggle}
              onClick={() => setIsNavOpen(false)}
            >
              {locale === 'tr' ? 'ENGLISH (EN)' : 'TÜRKÇE (TR)'}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
