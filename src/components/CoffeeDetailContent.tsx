'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from './Footer';
import Navbar from './Navbar';
import { useCart } from '../context/CartContext';
import styles from '../app/coffee/[id]/detail.module.css';
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
  stock: number;
  imageUrl: string;
  videoUrl: string;
  isActive: boolean;
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
  const safeId = coffeeName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <filter id={`bagShadow-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-2" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.16" />
        </filter>
        <linearGradient id={`gussetGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
          <stop offset="35%" stopColor="rgba(0, 0, 0, 0.12)" />
          <stop offset="70%" stopColor="rgba(255, 255, 255, 0.08)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.35)" />
        </linearGradient>
        <linearGradient id={`frontShade-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.08)" />
          <stop offset="15%" stopColor="rgba(255, 255, 255, 0.22)" />
          <stop offset="90%" stopColor="rgba(255, 255, 255, 0.0)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.06)" />
        </linearGradient>
        <linearGradient id={`goldGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="30%" stopColor="#f3e5ab" />
          <stop offset="55%" stopColor="#aa7c11" />
          <stop offset="85%" stopColor="#e5c158" />
          <stop offset="100%" stopColor="#966d00" />
        </linearGradient>
      </defs>

      <g filter={`url(#bagShadow-${safeId})`}>
        <path d="M35,35 L65,24 L65,236 L35,248 Z" fill={bagColor} />
        <path d="M35,35 L65,24 L65,236 L35,248 Z" fill={`url(#gussetGrad-${safeId})`} />
        <g transform="translate(47, 135) rotate(-90)">
          <text textAnchor="middle" fill="rgba(255, 255, 255, 0.3)" fontSize="8.5" fontWeight="800" letterSpacing="2.5">
            COFFEE ESTO
          </text>
        </g>

        <path d="M65,24 L165,29 L165,231 L65,236 Z" fill="#faf9f3" />
        <path d="M65,24 L165,29 L165,231 L65,236 Z" fill={`url(#frontShade-${safeId})`} />

        <path d="M35,20 L65,10 L165,15 L135,25 Z" fill={bagColor} opacity="0.9" />
        <path d="M35,20 L65,10 L165,15 M35,23 L65,13 L165,18 M35,26 L65,16 L165,21" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />

        <g transform="matrix(1 0.047 -0.047 1 0 0)">
          <path d="M102,28 H128 V64 C128,72 102,72 102,64 Z" fill={`url(#goldGrad-${safeId})`} />
          <circle cx="115" cy="45" r="8.5" fill="none" stroke="#2a170c" strokeWidth="0.8" />
          <circle cx="115" cy="45" r="6.5" fill="none" stroke="#2a170c" strokeWidth="0.5" strokeDasharray="1.5 1" />
          <path d="M115,41 C112.5,43 112.5,47 115,49 C117.5,47 117.5,43 115,41 Z" fill="#2a170c" />
          <path d="M113.8,44 C114.5,44.5 115.5,45.5 116.2,46" stroke="#faf9f3" strokeWidth="0.4" fill="none" />

          <text x="115" y="82" textAnchor="middle" fill="#c9963a" fontSize="6.5" fontWeight="800" letterSpacing="0.8">ESTO ROASTERY</text>
          <text x="115" y="93" textAnchor="middle" fill="#2a170c" fontSize="9.5" fontWeight="900" letterSpacing="0.2" fontFamily="var(--font-family-display, 'Playfair Display', Georgia, serif)">THE BEAN</text>

          <g transform="translate(15, 22) scale(0.85)" stroke="#423229" strokeWidth="1.2" fill="none">
            {illustration}
          </g>

          <g transform="translate(101, 168)" fill="#423229" stroke="none">
            <ellipse cx="6" cy="4" rx="3.5" ry="2.2" transform="rotate(25 6 4)" />
            <ellipse cx="14" cy="2" rx="3" ry="1.8" transform="rotate(-35 14 2)" />
            <ellipse cx="-4" cy="3" rx="3.2" ry="2" transform="rotate(60 -4 3)" />
          </g>

          <text x="115" y="190" textAnchor="middle" fill="rgba(66, 50, 41, 0.45)" fontSize="5.5" fontWeight="700" letterSpacing="0.5">
            {locale === 'tr' ? 'TAZE KAVRULMUŞ • 250G' : 'FRESHLY ROASTED • 250G'}
          </text>
        </g>
      </g>
    </svg>
  );
}

const PRODUCT_STYLES: Record<string, { bagColor: string; themeBg: string; sensoryBg: string; sensoryName: string; textColor: string; accentColor: string; illustration: React.ReactNode; emoji: string }> = {
  guatemala: {
    bagColor: '#523e3e',
    themeBg: '#edf2f7',
    sensoryBg: 'radial-gradient(circle, rgba(230,215,200,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Warm Cocoa',
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
    themeBg: '#fbf1c9',
    sensoryBg: 'radial-gradient(circle, rgba(247,231,168,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Bright Yellow',
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
    themeBg: '#fdf0e2',
    sensoryBg: 'radial-gradient(circle, rgba(250,220,185,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Warm Amber',
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
    themeBg: '#e3ebf2',
    sensoryBg: 'radial-gradient(circle, rgba(202,219,232,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Deep Moss',
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
    themeBg: '#fbecee',
    sensoryBg: 'radial-gradient(circle, rgba(248,212,217,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Ruby Red',
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
    themeBg: '#e1f0ec',
    sensoryBg: 'radial-gradient(circle, rgba(198,231,223,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Crisp Jade',
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

const DEFAULT_STYLE = {
  bagColor: '#6c5ce7',
  themeBg: '#e1e9f0',
  sensoryBg: 'radial-gradient(circle, rgba(225,233,240,0.7) 0%, rgba(255,255,255,0) 70%)',
  sensoryName: 'Balanced Tone',
  textColor: '#ffffff',
  accentColor: '#e0dbff',
  emoji: '☕️',
  illustration: (<g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>)
};

interface CoffeeDetailContentProps {
  id: string;
  locale?: string;
}

export default function CoffeeDetailContent({ id: coffeeId, locale = 'en' }: CoffeeDetailContentProps) {
  const { addToCart } = useCart();
  const [coffee, setCoffee] = useState<CoffeeProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [inView, setInView] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [size, setSize] = useState('250g');
  const [grindType, setGrindType] = useState('whole');
  const [purchaseType, setPurchaseType] = useState<'oneTime' | 'subscribe'>('oneTime');
  const detailRef = useRef<HTMLDivElement | null>(null);

  const translations = {
    en: {
      loadingText: 'Loading roast parameters...',
      notFoundTitle: 'Roast Profile Unavailable',
      notFoundSub: 'This specialty origin could not be located in our inventory.',
      backBtn: 'Return to Coffee Catalog',
      breadcrumbCatalog: 'Catalog',
      wholeBean: '250g / Whole Bean',
      tastingNotes: 'Tasting Notes',
      origin: 'Origin',
      altitude: 'Altitude',
      varietal: 'Varietal',
      roastLevel: 'Roast Level',
      light: 'Light',
      medium: 'Medium',
      dark: 'Dark',
      sensoryProfile: 'Sensory Profile',
      acidity: 'Acidity',
      sweetness: 'Sweetness',
      body: 'Body',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      onlyXLeft: 'Only {n} left in stock',
      categorySingleOrigin: 'Single Origin',
      categoryEspresso: 'Espresso Blends',
      brewGuideCTA: '📖 Open Coffee Brewing Companion',
    },
    tr: {
      loadingText: 'Kavrum parametreleri yükleniyor...',
      notFoundTitle: 'Kavrum Profili Bulunamadı',
      notFoundSub: 'Bu özel kahve stoklarımızda bulunamadı.',
      backBtn: 'Katalog\'a Geri Dön',
      breadcrumbCatalog: 'Katalog',
      wholeBean: '250g / Çekirdek Kahve',
      tastingNotes: 'Tadım Notları',
      origin: 'Menşe',
      altitude: 'Rakım',
      varietal: 'Varyete',
      roastLevel: 'Kavrum Derecesi',
      light: 'Açık',
      medium: 'Orta',
      dark: 'Koyu',
      sensoryProfile: 'Duyusal Profil',
      acidity: 'Asidite',
      sweetness: 'Tatlılık',
      body: 'Gövde',
      addToCart: 'Sepete Ekle',
      outOfStock: 'Stokta Yok',
      onlyXLeft: 'Stokta sadece {n} adet kaldı',
      categorySingleOrigin: 'Tek Köken',
      categoryEspresso: 'Espresso Harmanları',
      brewGuideCTA: '📖 Kahve Demleme Asistanını Aç',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const getCategoryLabel = (label: string) => {
    if (locale === 'tr') {
      if (label.toLowerCase() === 'single origin' || label.toLowerCase() === 'single-origin') return t.categorySingleOrigin;
      if (label.toLowerCase() === 'espresso') return t.categoryEspresso;
    }
    return label;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${coffeeId}`);
        const d = await res.json();
        if (res.ok && d.success) {
          setCoffee(localizeProduct(d.data, locale));
          setQty(Math.min(1, d.data.stock));
          setInView(true);
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [coffeeId]);

  const increment = () => setQty(p => Math.min(coffee?.stock ?? p, p + 1));
  const decrement = () => setQty(p => Math.max(1, p - 1));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 15;
    const rotateY = (x / (box.width / 2)) * 15;
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`, transition: 'transform 0.05s ease-out' });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)', transition: 'transform 0.5s ease-out' });
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar locale={locale} />
        <div className={styles.loadingWrapper}><span className={styles.spinner}>☕️</span><p>{t.loadingText}</p></div>
        <Footer locale={locale} />
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar locale={locale} />
        <div className={styles.notFoundWrapper}>
          <span className={styles.notFoundIcon}>☕️</span>
          <h2>{t.notFoundTitle}</h2>
          <p>{t.notFoundSub}</p>
          <Link href={`${linkPrefix}/coffee`} className={styles.backBtnLink}>{t.backBtn}</Link>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  const style = PRODUCT_STYLES[coffee.id] || DEFAULT_STYLE;

  return (
    <div className={styles.pageWrapper}>
      <Navbar locale={locale} />
      <div className={styles.navOffset} aria-hidden="true" />

      {/* ── 1. Hero Checkout Container Section ── */}
      <section
        ref={detailRef}
        className={`${styles.detailSection} ${inView ? styles.inView : ''}`}
        style={{ '--product-theme-bg': style.themeBg } as React.CSSProperties}
        aria-label={`Coffee details for ${coffee.name}`}
      >
        <div className={styles.container}>
          <div className={styles.splitLayout}>

            {/* Visual Media Column */}
            <div className={styles.visualCol}>
              {coffee.imageUrl ? (
                <div className={styles.mediaCol}>
                  <img src={coffee.imageUrl} alt={coffee.name} className={styles.productPhoto} />
                  {coffee.videoUrl && (
                    <video
                      src={coffee.videoUrl}
                      controls
                      muted
                      loop
                      playsInline
                      className={styles.productVideo}
                      aria-label={`Product video for ${coffee.name}`}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={styles.perspectiveContainer}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.tiltCard} style={{ ...tiltStyle, backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <div className={styles.cardVector}>
                      <CoffeeBag
                        coffeeName={coffee.name}
                        origin={coffee.origin}
                        bagColor={style.bagColor}
                        illustration={style.illustration}
                        emoji={style.emoji}
                        locale={locale}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Details & Purchase Logic Column */}
            <div className={styles.detailsCol}>
              <div className={styles.categoryBreadcrumb}>
                <Link href={`${linkPrefix}/coffee`}>{t.breadcrumbCatalog}</Link> / <span style={{ textTransform: 'capitalize' }}>{getCategoryLabel(coffee.category.replace('-', ' '))}</span>
              </div>

              <h1 className={styles.productName}>{coffee.name}</h1>
              <div className={styles.subtitleNotes}>
                {coffee.varietal || 'Single Origin Blend'} • {coffee.altitude || '1500m'}
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceVal}>
                  ₺{purchaseType === 'subscribe' ? Math.round(coffee.price * qty * 0.85) : coffee.price * qty}
                </span>
              </div>

              <div className={styles.quantitySection}>
                <label className={styles.quantityLabel}>Quantity</label>
                <div className={styles.qtyBox}>
                  <button onClick={decrement} className={styles.qtyBtn} disabled={qty <= 1} aria-label="Decrease quantity">–</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button onClick={increment} className={styles.qtyBtn} disabled={qty >= coffee.stock} aria-label="Increase quantity">+</button>
                </div>
              </div>

              <div className={styles.selectControl}>
                <label className={styles.selectLabel}>Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className={styles.selectInput}>
                  <option value="250g">250g</option>
                  <option value="500g">500g</option>
                  <option value="1kg">1kg</option>
                </select>
              </div>

              <div className={styles.selectControl}>
                <label className={styles.selectLabel}>Grind Type</label>
                <select value={grindType} onChange={(e) => setGrindType(e.target.value)} className={styles.selectInput}>
                  <option value="whole">Whole Bean</option>
                  <option value="medium">Medium Grind</option>
                  <option value="fine">Fine Grind</option>
                </select>
              </div>

              <div style={{ marginTop: '8px' }}>
                <div className={styles.purchaseOptions}>
                  <div
                    className={`${styles.purchaseOption} ${purchaseType === 'oneTime' ? styles.active : ''}`}
                    onClick={() => setPurchaseType('oneTime')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={styles.purchaseOptionRadio} />
                      <span className={styles.purchaseOptionName}>One-time</span>
                    </div>
                    <span className={styles.purchaseOptionPrice}>Extra Fresh</span>
                  </div>
                  <div
                    className={`${styles.purchaseOption} ${purchaseType === 'subscribe' ? styles.active : ''}`}
                    onClick={() => setPurchaseType('subscribe')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={styles.purchaseOptionRadio} />
                      <span className={styles.purchaseOptionName}>Subscribe & Save</span>
                    </div>
                    <span className={styles.purchaseOptionPrice}>Save 15%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => addToCart({
                  id: coffee.id,
                  name: coffee.name,
                  price: purchaseType === 'subscribe' ? Math.round(coffee.price * 0.85) : coffee.price,
                  stock: coffee.stock,
                  emoji: style.emoji,
                  bagColor: style.bagColor,
                  notes: coffee.tastingNotes.split(',').map(n => n.trim()),
                  imageUrl: coffee.imageUrl,
                }, qty)}
                className={styles.addToCartBtn}
                disabled={coffee.stock === 0}
              >
                {coffee.stock === 0 ? t.outOfStock : t.addToCart}
              </button>

              {coffee.stock > 0 && coffee.stock <= 5 && (
                <span className={`${styles.stockNote} ${styles.stockNoteLow}`} style={{ marginTop: '8px', display: 'block' }}>
                  {t.onlyXLeft.replace('{n}', coffee.stock.toString())}
                </span>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Product Reviews Section ── */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          <h2 className={styles.reviewsMainTitle}>Product Reviews</h2>

          {/* Reviews Summary Dashboard */}
          <div className={styles.reviewsDashboard}>
            <div className={styles.dashboardScore}>
              <span className={styles.scoreNumber}>5.00 / 5</span>
              <div className={styles.scoreStars}>★★★★★</div>
              <span className={styles.scoreCount}>Based on 1 review</span>
            </div>

            <div className={styles.dashboardBars}>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className={styles.barRow}>
                  <span className={styles.barLabel}>★ {stars}</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: stars === 5 ? '100%' : '0%' }} />
                  </div>
                  <span className={styles.barCount}>({stars === 5 ? 1 : 0})</span>
                </div>
              ))}
            </div>

            <div className={styles.dashboardActions}>
              <button className={styles.secondarySharpBtn}>Write a review</button>
              <button className={styles.secondarySharpBtn}>Ask a question</button>
            </div>
          </div>

          {/* Individual Reviews Feed */}
          <div className={styles.reviewsFeed}>
            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerBadge}>TW</div>
                <div>
                  <h4 className={styles.reviewerName}>Review</h4>
                  <div className={styles.reviewMeta}>Delivered by Coffee • 1 year ago</div>
                </div>
              </div>
              <div className={styles.reviewRating}>★★★★★</div>
              <h5 className={styles.reviewTitle}>Total Treat</h5>
              <p className={styles.reviewBody}>
                An absolutely beautiful roast profile. Clean, incredibly bright development notes that make morning pourovers a true ritual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer waveColor="#ffffff" locale={locale} />
    </div>
  );
}