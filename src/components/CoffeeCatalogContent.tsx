'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from '../app/coffee/coffee.module.css';
import { localizeProduct } from '../lib/localize';

interface CoffeeProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  altitude: string;
  varietal: string;
  roastLevel: number;
  tastingNotes: string;
  description: string;
  price: number;
  imageUrl: string;
  videoUrl: string;
  isActive: boolean;
}

interface Category {
  id: string;
  slug: string;
  label: string;
}

interface CoffeeBagProps {
  coffeeName: string;
  origin: string;
  bagColor: string;
  illustration: React.ReactNode;
  emoji: string;
  locale?: string;
}

function CoffeeBag({ coffeeName, origin, bagColor, illustration, emoji, locale = 'en' }: CoffeeBagProps) {
  // Let's create an ID-safe identifier for gradients since multiple bags are rendered in a grid!
  const safeId = coffeeName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        {/* Soft 3D drop shadow underneath the entire bag */}
        <filter id={`bagShadow-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-2" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.16" />
        </filter>

        {/* Shading for the side panel (Gusset) */}
        <linearGradient id={`gussetGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
          <stop offset="35%" stopColor="rgba(0, 0, 0, 0.12)" />
          <stop offset="70%" stopColor="rgba(255, 255, 255, 0.08)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.35)" />
        </linearGradient>

        {/* Shading for the front panel (soft gradient from left to right) */}
        <linearGradient id={`frontShade-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.08)" />
          <stop offset="15%" stopColor="rgba(255, 255, 255, 0.22)" />
          <stop offset="90%" stopColor="rgba(255, 255, 255, 0.0)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.06)" />
        </linearGradient>

        {/* Gold metallic gradient for the crest */}
        <linearGradient id={`goldGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="30%" stopColor="#f3e5ab" />
          <stop offset="55%" stopColor="#aa7c11" />
          <stop offset="85%" stopColor="#e5c158" />
          <stop offset="100%" stopColor="#966d00" />
        </linearGradient>
      </defs>

      <g filter={`url(#bagShadow-${safeId})`}>

        {/* 1. LEFT GUSSET SIDE PANEL */}
        <path d="M35,35 L65,24 L65,236 L35,248 Z" fill={bagColor} />
        <path d="M35,35 L65,24 L65,236 L35,248 Z" fill={`url(#gussetGrad-${safeId})`} />

        {/* Vertical branding text on the side gusset */}
        <g transform="translate(47, 135) rotate(-90)">
          <text textAnchor="middle" fill="rgba(255, 255, 255, 0.3)" fontSize="8.5" fontWeight="800" letterSpacing="2.5">
            COFFEE ESTO
          </text>
        </g>

        {/* 2. FRONT PAPER PANEL */}
        <path d="M65,24 L165,29 L165,231 L65,236 Z" fill="#faf9f3" />
        <path d="M65,24 L165,29 L165,231 L65,236 Z" fill={`url(#frontShade-${safeId})`} />

        {/* 3. TOP CRIMPED FLAP */}
        <path d="M35,20 L65,10 L165,15 L135,25 Z" fill={bagColor} opacity="0.9" />
        <path d="M35,20 L65,10 L165,15 M35,23 L65,13 L165,18 M35,26 L65,16 L165,21" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />

        {/* 4. FRONT LABEL DETAILS (slanted perspective shear matrix) */}
        <g transform="matrix(1 0.047 -0.047 1 0 0)">

          {/* Gold Rounded Crest at top */}
          <path d="M102,28 H128 V64 C128,72 102,72 102,64 Z" fill={`url(#goldGrad-${safeId})`} />

          {/* Circular Ring in Crest */}
          <circle cx="115" cy="45" r="8.5" fill="none" stroke="#2a170c" strokeWidth="0.8" />
          <circle cx="115" cy="45" r="6.5" fill="none" stroke="#2a170c" strokeWidth="0.5" strokeDasharray="1.5 1" />

          {/* Coffee Bean inside crest */}
          <path d="M115,41 C112.5,43 112.5,47 115,49 C117.5,47 117.5,43 115,41 Z" fill="#2a170c" />
          <path d="M113.8,44 C114.5,44.5 115.5,45.5 116.2,46" stroke="#faf9f3" strokeWidth="0.4" fill="none" />

          {/* Typography */}
          <text x="115" y="82" textAnchor="middle" fill="#c9963a" fontSize="6.5" fontWeight="800" letterSpacing="0.8">ESTO ROASTERY</text>
          <text x="115" y="93" textAnchor="middle" fill="#2a170c" fontSize="9.5" fontWeight="900" letterSpacing="0.2" fontFamily="var(--font-family-display, 'Playfair Display', Georgia, serif)">THE BEAN</text>

          {/* Custom Origin Illustration translated & scaled in center */}
          <g transform="translate(15, 22) scale(0.85)" stroke="#423229" strokeWidth="1.2" fill="none">
            {illustration}
          </g>

          {/* Sketched coffee beans at baseline */}
          <g transform="translate(101, 168)" fill="#423229" stroke="none">
            <ellipse cx="6" cy="4" rx="3.5" ry="2.2" transform="rotate(25 6 4)" />
            <ellipse cx="14" cy="2" rx="3" ry="1.8" transform="rotate(-35 14 2)" />
            <ellipse cx="-4" cy="3" rx="3.2" ry="2" transform="rotate(60 -4 3)" />
          </g>

          {/* Net weight label */}
          <text x="115" y="190" textAnchor="middle" fill="rgba(66, 50, 41, 0.45)" fontSize="5.5" fontWeight="700" letterSpacing="0.5">
            {locale === 'tr' ? 'TAZE KAVRULMUŞ • 250G' : 'FRESHLY ROASTED • 250G'}
          </text>

        </g>

      </g>
    </svg>
  );
}

// Preset visual styles for core branded coffees
const PRODUCT_STYLES: Record<string, { bagColor: string; textColor: string; accentColor: string; illustration: React.ReactNode; emoji: string }> = {
  guatemala: {
    bagColor: '#523e3e',
    textColor: '#ffffff',
    accentColor: '#ebdada',
    emoji: '🌋',
    illustration: (
      <g opacity="0.85">
        <circle cx="100" cy="95" r="18" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M100,85 L135,145 L65,145 Z" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M92,98 L100,85 L108,98" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M92,98 L100,105 L108,98" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M125,120 L150,145 L100,145" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinejoin="round" />
        <path d="M100,75 Q105,65 98,58 Q92,50 102,42" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M104,78 Q109,70 104,63" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <line x1="50" y1="145" x2="150" y2="145" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="75" cy="152" r="1" fill="#ffffff" />
        <circle cx="100" cy="152" r="1.5" fill="#ffffff" />
        <circle cx="125" cy="152" r="1" fill="#ffffff" />
      </g>
    )
  },
  ethiopia: {
    bagColor: '#74a57f',
    textColor: '#ffffff',
    accentColor: '#c7edd0',
    emoji: '🍋',
    illustration: (
      <g opacity="0.9">
        <path d="M100,145 L100,80" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M100,120 C70,110 65,85 100,75 C100,75 100,120 100,120 Z" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M100,95 Q80,95 72,102" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <path d="M100,105 Q85,108 78,114" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <path d="M100,130 C130,120 135,95 100,85 C100,85 100,130 100,130 Z" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M100,105 Q120,105 128,112" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <path d="M100,115 Q115,118 122,124" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <circle cx="100" cy="80" r="4" fill="none" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M96,80 Q90,74 96,68 Q100,62 104,68 Q110,74 104,80" fill="none" stroke="#ffffff" strokeWidth="1" />
        <circle cx="100" cy="80" r="1" fill="#ffffff" />
      </g>
    )
  },
  nicaragua: {
    bagColor: '#f4a261',
    textColor: '#2c2626',
    accentColor: '#ffe2cd',
    emoji: '🍯',
    illustration: (
      <g opacity="0.9" stroke="#2c2626">
        <circle cx="100" cy="100" r="28" fill="none" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="22" fill="rgba(44, 38, 38, 0.05)" strokeWidth="1.2" />
        <path d="M60,128 C80,120 120,120 140,128" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50,136 C80,126 120,126 150,136" fill="none" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M65,120 C85,115 115,115 135,120" fill="none" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <line x1="100" y1="68" x2="100" y2="60" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="77" y1="77" x2="71" y2="71" strokeWidth="1" strokeLinecap="round" />
        <line x1="123" y1="77" x2="129" y2="71" strokeWidth="1" strokeLinecap="round" />
        <line x1="68" y1="100" x2="60" y2="100" strokeWidth="1" strokeLinecap="round" />
        <line x1="132" y1="100" x2="140" y2="100" strokeWidth="1" strokeLinecap="round" />
      </g>
    )
  },
  sumatra: {
    bagColor: '#3d4b5c',
    textColor: '#ffffff',
    accentColor: '#cbd6e2',
    emoji: '🌲',
    illustration: (
      <g opacity="0.85">
        <circle cx="100" cy="95" r="20" fill="none" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="4 2" />
        <path d="M60,145 L95,85 L130,145" fill="rgba(255,255,255,0.03)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M90,145 L115,102 L140,145" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" strokeLinejoin="round" />
        <line x1="95" y1="85" x2="95" y2="145" stroke="#ffffff" strokeWidth="1" />
        <line x1="115" y1="102" x2="115" y2="145" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
        <path d="M55,145 Q65,115 85,110" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60,135 Q70,120 80,122" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M57,125 Q68,118 74,124" fill="none" stroke="#ffffff" strokeWidth="1" />
        <line x1="45" y1="145" x2="155" y2="145" stroke="#ffffff" strokeWidth="1.5" />
      </g>
    )
  },
  colombia: {
    bagColor: '#b23b3b',
    textColor: '#ffffff',
    accentColor: '#fcd3d3',
    emoji: '🍒',
    illustration: (
      <g opacity="0.85">
        <path d="M70,95 Q100,105 130,90" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70,95 C60,75 80,60 100,82 C90,87 75,92 70,95 Z" fill="rgba(255,255,255,0.05)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M85,78 Q78,82 72,88" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
        <circle cx="95" cy="115" r="11" fill="rgba(255,255,255,0.05)" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M90,110 A6,6 0 0,0 90,120" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.75" />
        <circle cx="98" cy="111" r="1.2" fill="#ffffff" />
        <circle cx="112" cy="118" r="9.5" fill="rgba(255,255,255,0.05)" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M108,114 A5,5 0 0,0 108,122" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.75" />
        <circle cx="114" cy="115" r="1" fill="#ffffff" />
        <circle cx="104" cy="104" r="8" fill="rgba(0,0,0,0.15)" stroke="#ffffff" strokeWidth="1" />
        <circle cx="106" cy="102" r="0.8" fill="#ffffff" />
        <path d="M95,104 L95,110" stroke="#ffffff" strokeWidth="1" />
        <path d="M112,100 L112,109" stroke="#ffffff" strokeWidth="1" />
      </g>
    )
  },
  papua: {
    bagColor: '#206a5d',
    textColor: '#ffffff',
    accentColor: '#c5ebd6',
    emoji: '🕊️',
    illustration: (
      <g opacity="0.85">
        <path d="M100,65 L125,95 L108,98 L135,115 L102,118 L120,135 L90,125 Z" fill="rgba(255,255,255,0.04)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M60,132 C80,122 95,142 115,132 C125,127 135,135 145,130" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50,140 C75,130 90,150 115,140 C130,135 140,143 150,138" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
        <circle cx="70" cy="80" r="1.2" fill="#ffffff" />
        <circle cx="85" cy="70" r="1.5" fill="#ffffff" />
        <circle cx="130" cy="75" r="1" fill="#ffffff" opacity="0.7" />
      </g>
    )
  }
};

// Fallback style for admin created coffees
const DEFAULT_STYLE = {
  bagColor: '#6c5ce7', // Royal Purple
  textColor: '#ffffff',
  accentColor: '#e0dbff',
  emoji: '☕️',
  illustration: (
    <g opacity="0.8">
      <circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" />
    </g>
  )
};

interface CoffeeCatalogContentProps {
  locale?: string;
}

function CoffeeCatalogInner({ locale = 'en' }: CoffeeCatalogContentProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category'); // Read bento tags link queries

  const [coffees, setCoffees] = useState<CoffeeProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const translations = {
    en: {
      eyebrow: 'Roastery Catalog',
      title: 'Specialty Coffees',
      subtitle: 'Direct-trade, small-batch roasted single origins and espresso blends. Freshly sealed and shipped from İstanbul.',
      allFilters: 'All Coffees',
      lightRoasts: 'Light Roasts',
      mediumDark: 'Medium & Dark',
      searchPlaceholder: 'Search origins or flavor notes...',
      specs: 'Specs',
      buyNow: 'Buy Now',
      drawerTitle: 'Flavor Specifications',
      country: 'Country / Origin',
      altitude: 'Elevation / Altitude',
      varietal: 'Varietal Family',
      category: 'Profile Category',
      roastProfile: 'Roast Degree Profile',
      sensoryNotes: 'Sensory Taste Notes',
      light: 'Light',
      medium: 'Medium',
      dark: 'Dark',
      customizePurchase: 'Customize Roast & Purchase',
      noResultsTitle: 'No Roasts Located',
      noResultsSub: 'We couldn\'t find any coffee matching "{query}". Try selecting another filter tag or search term.',
      loadingText: 'Brewing catalog items...',
    },
    tr: {
      eyebrow: 'Kavurmahane Kataloğu',
      title: 'Nitelikli Kahveler',
      subtitle: 'Doğrudan ticaret, küçük partiler halinde kavrulmuş tek kökenler ve espresso harmanları. Taze mühürlenip İstanbul\'dan gönderilir.',
      allFilters: 'Tüm Kahveler',
      lightRoasts: 'Açık Kavrum',
      mediumDark: 'Orta & Koyu',
      searchPlaceholder: 'Kökenleri veya tadım notlarını arayın...',
      specs: 'Detaylar',
      buyNow: 'Satın Al',
      drawerTitle: 'Lezzet Özellikleri',
      country: 'Ülke / Köken',
      altitude: 'Rakım / Yükseklik',
      varietal: 'Varyete Ailesi',
      category: 'Profil Kategorisi',
      roastProfile: 'Kavrum Derecesi Profili',
      sensoryNotes: 'Duyusal Tadım Notları',
      light: 'Açık',
      medium: 'Orta',
      dark: 'Koyu',
      customizePurchase: 'Kavrumu Özelleştir & Satın Al',
      noResultsTitle: 'Kavrulmuş Kahve Bulunamadı',
      noResultsSub: '"{query}" ile eşleşen kahve bulamadık. Lütfen başka bir filtre seçin veya arama yapın.',
      loadingText: 'Katalog ürünleri hazırlanıyor...',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';
  const getCategoryLabel = (label: string) => {
    const l = label.toLowerCase();
    if (locale === 'tr') {
      if (l === 'single origin' || l === 'single-origin') return 'Tek Köken';
      if (l === 'espresso') return 'Espresso';
      if (l === 'filter coffee' || l === 'filter') return 'Filtre Kahve';
      if (l === 'turkish coffee' || l === 'turkish') return 'Türk Kahvesi';
      if (l === 'limited-edition' || l === 'limited edition') return 'Sınırlı Üretim';
    }
    return label;
  };
  useEffect(() => {
    if (categoryParam) {
      requestAnimationFrame(() => {
        setActiveFilter(categoryParam);
      });
    }
  }, [categoryParam]);

  // Fetch products + categories from SQLite
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);
        if (prodData.success) setCoffees(prodData.data.map((p: any) => localizeProduct(p, locale)));
        if (catData.success) setCategories(catData.data);
      } catch (error) {
        console.error('Failed to load catalog data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter coffees
  const filteredCoffees = coffees.filter((coffee) => {
    const matchesSearch =
      coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coffee.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coffee.tastingNotes.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'single-origin') return coffee.category === 'single-origin' && matchesSearch;
    if (activeFilter === 'espresso') return coffee.category === 'espresso' && matchesSearch;

    if (activeFilter === 'light') return coffee.roastLevel < 45 && matchesSearch;
    if (activeFilter === 'medium-dark') return coffee.roastLevel >= 45 && matchesSearch;

    return matchesSearch;
  });

  const handleOpenDrawer = (coffee: CoffeeProduct) => {
    setSelectedCoffee(coffee);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getStyle = (id: string) => {
    return PRODUCT_STYLES[id] || DEFAULT_STYLE;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} aria-hidden="true" />
        <p style={{ color: 'var(--color-warm-mid)', fontSize: '14px', fontWeight: 500 }}>{t.loadingText}</p>
      </div>
    );
  }

  return (
    <>
      {/* 1. Typographic Page Hero */}
      <section
        ref={heroRef}
        className={`${styles.heroSection} ${styles.inView}`}
        aria-labelledby="catalog-hero-title"
      >
        {/* Floating Coffee Beans */}
        <img src="/images/beans.webp" className="heroBean heroBean1" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean2" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean3" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean4" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean5" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean6" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean7" alt="" />

        <div className={styles.heroContainer}>
          <span className={styles.heroBadge}>{t.eyebrow}</span>
          <h1 id="catalog-hero-title" className={styles.heroTitle}>
            {t.title}
          </h1>
          <p className={styles.heroSubtitle}>
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Interactive Catalog Grid & Filters */}
      <section
        ref={gridRef}
        className={`${styles.catalogSection} ${styles.inView}`}
        aria-label="Product Showcase Filter"
      >
        <div className={styles.container}>

          {/* Filter Bar Row */}
          <div className={styles.filterBar}>
            <div className={styles.filterTags} role="tablist" aria-label="Coffee Category Filters">
              {/* All filter */}
              <button
                className={`${styles.tagBtn} ${activeFilter === 'all' ? styles.tagBtnActive : ''}`}
                onClick={() => setActiveFilter('all')}
                role="tab"
                aria-selected={activeFilter === 'all'}
              >
                {t.allFilters}
              </button>
              {/* Dynamic category filters from DB */}
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  className={`${styles.tagBtn} ${activeFilter === cat.slug ? styles.tagBtnActive : ''}`}
                  onClick={() => setActiveFilter(cat.slug)}
                  role="tab"
                  aria-selected={activeFilter === cat.slug}
                >
                  {getCategoryLabel(cat.label)}
                </button>
              ))}
              {/* Roast-level pseudo-filters */}
              <button
                className={`${styles.tagBtn} ${activeFilter === 'light' ? styles.tagBtnActive : ''}`}
                onClick={() => setActiveFilter('light')}
                role="tab"
                aria-selected={activeFilter === 'light'}
              >
                {t.lightRoasts}
              </button>
              <button
                className={`${styles.tagBtn} ${activeFilter === 'medium-dark' ? styles.tagBtnActive : ''}`}
                onClick={() => setActiveFilter('medium-dark')}
                role="tab"
                aria-selected={activeFilter === 'medium-dark'}
              >
                {t.mediumDark}
              </button>
            </div>

            {/* Search Input Box */}
            <div className={styles.searchWrapper}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search origins or flavor notes"
              />
            </div>
          </div>

          {/* Coffees Showcase Grid */}
          {filteredCoffees.length > 0 ? (
            <motion.div
              className={styles.coffeeGrid}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {filteredCoffees.map((coffee) => {
                const style = getStyle(coffee.id);
                return (
                  <motion.div
                    key={coffee.id}
                    className={styles.coffeeCard}
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Link href={`${linkPrefix}/coffee/${coffee.id}`} className={styles.cardLink}>
                      {/* Product visual */}
                      <div className={styles.bagWrapper} style={{ background: 'radial-gradient(circle, #fbfaf5 0%, #e3ddd3 100%)' }}>
                        {coffee.imageUrl ? (
                          <img
                            src={coffee.imageUrl}
                            alt={coffee.name}
                            className={styles.productImage}
                          />
                        ) : (
                          <div className={styles.vectorArt}>
                            <CoffeeBag
                              coffeeName={coffee.name}
                              origin={coffee.origin}
                              bagColor={style.bagColor}
                              illustration={style.illustration}
                              emoji={style.emoji}
                              locale={locale}
                            />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Meta info details */}
                    <div className={styles.cardDetails}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardName}>{coffee.name}</h3>
                        <span className={styles.cardPrice}>₺{coffee.price}</span>
                      </div>

                      <p className={styles.cardOrigin}>{coffee.origin}</p>

                      <div className={styles.cardNotes}>
                        {coffee.tastingNotes.split(',').map((note) => (
                          <span key={note.trim()} className={styles.noteTag}>{note.trim()}</span>
                        ))}
                      </div>

                      <div className={styles.cardActions}>
                        <Link href={`${linkPrefix}/coffee/${coffee.id}`} className={styles.buyBtn}>
                          {t.buyNow}
                        </Link>
                        <button
                          className={styles.specsBtn}
                          onClick={() => handleOpenDrawer(coffee)}
                          aria-label={`View tasting specs for ${coffee.name}`}
                        >
                          {t.specs}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>☕️</span>
              <h3>{t.noResultsTitle}</h3>
              <p>
                {t.noResultsSub.replace('{query}', searchQuery)}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 3. Tasting Profile Spec Sliding Drawer Panel */}
      {selectedCoffee && (
        <div
          className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.drawerOverlayOpen : ''}`}
          onClick={handleCloseDrawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <div
            className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h2 id="drawer-title" className={styles.drawerTitle}>{t.drawerTitle}</h2>
              <button
                className={styles.closeBtn}
                onClick={handleCloseDrawer}
                aria-label="Close details spec panel"
              >
                ✕
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerMainInfo}>
                <span className={styles.drawerEmoji}>{getStyle(selectedCoffee.id).emoji}</span>
                <h3 className={styles.drawerName}>{selectedCoffee.name}</h3>
                <span className={styles.drawerPrice}>₺{selectedCoffee.price}</span>
                <p className={styles.drawerDesc}>{selectedCoffee.description}</p>
              </div>

              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t.country}</span>
                  <span className={styles.specValue}>{selectedCoffee.origin}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t.altitude}</span>
                  <span className={styles.specValue}>{selectedCoffee.altitude || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t.varietal}</span>
                  <span className={styles.specValue}>{selectedCoffee.varietal || 'N/A'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t.category}</span>
                  <span className={styles.specValue} style={{ textTransform: 'capitalize' }}>
                    {getCategoryLabel(selectedCoffee.category.replace('-', ' '))}
                  </span>
                </div>
              </div>

              {/* Roast level indicator */}
              <div className={styles.roastProfiler}>
                <div className={styles.roastLabelRow}>
                  <span className={styles.roastTitle}>{t.roastProfile}</span>
                  <span className={styles.roastVal}>{selectedCoffee.roastLevel}%</span>
                </div>
                <div className={styles.roastTrack}>
                  <div
                    className={styles.roastProgress}
                    style={{ width: `${selectedCoffee.roastLevel}%` }}
                  />
                </div>
                <div className={styles.roastMarkers}>
                  <span>{t.light}</span>
                  <span>{t.medium}</span>
                  <span>{t.dark}</span>
                </div>
              </div>

              {/* Tasting notes list */}
              <div className={styles.tastingNotesBlock}>
                <h4 className={styles.notesTitle}>{t.sensoryNotes}</h4>
                <div className={styles.notesTagsGroup}>
                  {selectedCoffee.tastingNotes.split(',').map((note) => (
                    <span key={note.trim()} className={styles.largeNoteTag}>
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`${linkPrefix}/coffee/${selectedCoffee.id}`}
                className={styles.drawerBuyBtn}
                onClick={handleCloseDrawer}
              >
                {t.customizePurchase}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CoffeeCatalogContent({ locale = 'en' }: CoffeeCatalogContentProps) {
  return (
    <Suspense fallback={
      <div className={styles.loadingWrapper}>
        <span className={styles.spinner}>☕️</span>
        <p>{locale === 'tr' ? 'Katalog ürünleri hazırlanıyor...' : 'Brewing catalog items...'}</p>
      </div>
    }>
      <CoffeeCatalogInner locale={locale} />
    </Suspense>
  );
}
