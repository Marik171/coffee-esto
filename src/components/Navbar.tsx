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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Fetch products on mount or when search is clicked
  useEffect(() => {
    if (isSearchOpen && products.length === 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setProducts(json.data);
          }
        })
        .catch(err => console.error("Search fetch products error:", err));
    }
  }, [isSearchOpen, products]);

  // Filter products based on query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = products.filter(p => {
      const name = (locale === 'tr' ? p.nameTr || p.name : p.nameEn || p.name).toLowerCase();
      const desc = (locale === 'tr' ? p.descriptionTr || p.description : p.descriptionEn || p.description).toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
    setFilteredProducts(filtered.slice(0, 5)); // show top 5 results
  }, [searchQuery, products, locale]);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      about: 'About Us',
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
      shippingPromo: 'Free Shipping over ₺500 | Sign up for 10% Off Coffees!',
      shop: 'SHOP',
      subscriptions: 'SUBSCRIPTIONS',
      coldBrew: 'COLD BREW',
      coffeeWorld: 'COFFEE WORLD',
      learn: 'LEARN',
      account: 'ACCOUNT',
      allCoffees: 'All Coffees',
      singleOriginCategory: 'Single Origin',
      espressoCategory: 'Espresso',
      filterCategory: 'Filter Coffee',
      turkishCategory: 'Turkish Coffee',
      limitedCategory: 'Limited Edition',
      contact: 'Contact',
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
      shippingPromo: '500 TL Üzeri Ücretsiz Kargo | Üye Ol, Kahvelerde %10 İndirim Kazan!',
      shop: 'MAĞAZA',
      subscriptions: 'ABONELİK',
      coldBrew: 'SOĞUK DEMLEME',
      coffeeWorld: 'KAHVE DÜNYASI',
      learn: 'REHBER',
      account: 'SİPARİŞ TAKİBİ',
      allCoffees: 'Tüm Kahveler',
      singleOriginCategory: 'Tek Kökenli',
      espressoCategory: 'Espresso',
      filterCategory: 'Filtre Kahve',
      turkishCategory: 'Türk Kahvesi',
      limitedCategory: 'Özel Seri',
      contact: 'İletişim',
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
            {/* Order Ahead removed */}
          </div>
          <div className={styles.announcementCenter}>
            <span>{t.shippingPromo}</span>
          </div>
          <div className={styles.announcementRight}>
            <button type="button" onClick={() => setIsSearchOpen(true)} className={styles.searchBtn}>
              <span className={styles.searchText}>{t.search}</span>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
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
          {/* Mobile Left Controls (Hamburger) */}
          <div className={styles.mobileLeftControls}>
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
                <div className={styles.dropdownColumn}>
                  <h4 className={styles.dropdownColTitle}>
                    {locale === 'tr' ? 'KAHVELER' : 'COFFEES'}
                  </h4>
                  <Link href={`${linkPrefix}/coffee`} className={styles.dropdownLink}>
                    {t.allCoffees}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=single-origin`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Single Origin (Tek Yöre)' : 'Single Origin'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=espresso`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Espresso Blend' : 'Espresso Blend'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=filter`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Filtre Blend' : 'Filter Blend'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=turkish`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Türk Kahvesi' : 'Turkish Coffee'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=signature-blend`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Özel Harmanlar (Signature)' : 'Signature Blend'}
                  </Link>
                </div>
                <div className={styles.dropdownColumn}>
                  <h4 className={styles.dropdownColTitle}>
                    {locale === 'tr' ? 'EKİPMAN & AKSESUAR' : 'EQUIPMENT & GEAR'}
                  </h4>
                  <Link href={`${linkPrefix}/coffee?category=espresso-machines`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Espresso Makineleri' : 'Espresso Machines'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=coffee-grinders`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Kahve Değirmenleri' : 'Coffee Grinders'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=filter-brewing-equipment`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Filtre Demleme Ekipmanları' : 'Filter Brewing Equipment'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=small-bar-equipment`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Küçük Bar Ekipmanları' : 'Small Bar Equipment'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=barista-accessories`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Barista Aksesuarları' : 'Barista Accessories'}
                  </Link>
                  <Link href={`${linkPrefix}/coffee?category=cleaning-products`} className={styles.dropdownLink}>
                    {locale === 'tr' ? 'Temizlik Ürünleri' : 'Cleaning Products'}
                  </Link>
                </div>
              </div>
            </div>
            <Link href={`${linkPrefix}/wholesale`} className={styles.brandLink}>
              {t.wholesale}
            </Link>
            <Link href={`${linkPrefix}/coffee-world`} className={styles.brandLink}>
              {t.coffeeWorld}
            </Link>
            <Link href={`${linkPrefix}/about`} className={styles.brandLink}>
              {t.about}
            </Link>
          </nav>

          {/* Centered Brand Logo */}
          <Link href={locale === 'tr' ? '/' : '/en'} className={styles.logoContainer} aria-label={t.homepage} onClick={() => setIsNavOpen(false)}>
            <span className={styles.logoTitle}>C O F F E E &nbsp; E S T O</span>
            <span className={styles.logoSubtitle}>C O F F E E &nbsp; R O A S T E R Y</span>
          </Link>

          {/* Desktop Right Menu Links */}
          <nav className={styles.desktopMenuRight}>
            <Link href={`${linkPrefix}/quiz`} className={styles.brandLink}>
              {t.quiz}
            </Link>
            <Link href={`${linkPrefix}/brew`} className={styles.brandLink}>
              {t.brew}
            </Link>
            <Link href={`${linkPrefix}/location`} className={styles.brandLink}>
              {t.locations}
            </Link>
            <Link href={`${linkPrefix}/contact`} className={styles.brandLink}>
              {t.contact}
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

          {/* Mobile Right Controls (Search + Account + Cart) */}
          <div className={styles.mobileRightControls}>
            <button 
              type="button" 
              onClick={() => setIsSearchOpen(true)} 
              className={styles.searchBtnMobile}
              aria-label={t.search}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIconMobile}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link 
              href={`${linkPrefix}/account`} 
              className={styles.accountBtnMobile}
              aria-label={t.account}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.accountIconMobile}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <button 
              className={styles.cartBubbleBtnMobile} 
              onClick={() => setIsCartOpen(true)}
              aria-label={`${t.cart}, ${cartCount} items`}
            >
              <span>{cartCount}</span>
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
            <Link href={`${linkPrefix}/wholesale`} onClick={() => setIsNavOpen(false)}>
              {t.wholesale}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/coffee-world`} onClick={() => setIsNavOpen(false)}>
              {t.coffeeWorld}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/quiz`} onClick={() => setIsNavOpen(false)}>
              {t.quiz}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/brew`} onClick={() => setIsNavOpen(false)}>
              {t.brew}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/about`} onClick={() => setIsNavOpen(false)}>
              {t.about}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/location`} onClick={() => setIsNavOpen(false)}>
              {t.locations}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/contact`} onClick={() => setIsNavOpen(false)}>
              {t.contact}
            </Link>
          </li>
          <li>
            <Link href={`${linkPrefix}/account`} onClick={() => setIsNavOpen(false)}>
              {t.account}
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

      {/* Premium Morphing Search Overlay */}
      {isSearchOpen && (
        <div className={styles.searchBackdrop} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
          <div className={styles.searchContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.searchHeader}>
              <span className={styles.searchTitle}>
                {locale === 'tr' ? 'Kahve Arama' : 'Search our Roasts'}
              </span>
              <button className={styles.closeSearchBtn} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>✕</button>
            </div>
            
            <div className={styles.searchInputWrapper}>
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.searchBarIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                autoFocus
                placeholder={locale === 'tr' ? 'Kahve adı, köken veya tat profili arayın...' : 'Search by origin, roast profile, note...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.searchBarInput}
              />
            </div>

            {filteredProducts.length > 0 && (
              <div className={styles.searchResultsList}>
                {filteredProducts.map(p => {
                  const productUrl = `${linkPrefix}/coffee/${p.id}`;
                  const displayName = locale === 'tr' ? p.nameTr || p.name : p.nameEn || p.name;
                  const price = p.price;
                  return (
                    <Link
                      key={p.id}
                      href={productUrl}
                      className={styles.searchResultItem}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    >
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt={displayName} className={styles.searchResultImg} />
                      )}
                      <div className={styles.searchResultMeta}>
                        <span className={styles.searchResultName}>{displayName}</span>
                        <span className={styles.searchResultCategory}>{p.category}</span>
                      </div>
                      <span className={styles.searchResultPrice}>₺{price}</span>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {searchQuery && filteredProducts.length === 0 && (
              <div className={styles.noResultsText}>
                {locale === 'tr' ? 'Eşleşen kahve bulunamadı.' : 'No roasts found matching your search.'}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
