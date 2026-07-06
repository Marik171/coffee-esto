'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './CategoriesBento.module.css';

interface CategoryItem {
  id: string;
  name: string;
  link: string;
  gridClass: string;
  bgColor: string;
  svgIcon?: React.ReactNode;
  imageSrc?: string;
}

export default function CategoriesBento({ locale = 'en' }: { locale?: string }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const translations = {
    en: {
      title: 'Explore Coffee Esto Roastery',
      subtitle: 'Choose your brewing journey. From direct-trade beans to equipment and locations, we roast and deliver fresh daily.',
      categories: {
        coffee: 'COFFEE',
        brewBags: 'BREW BAGS',
        bundles: 'BUNDLES',
        subscriptions: 'SUBSCRIPTIONS',
        equipment: 'EQUIPMENT',
        wholesale: 'WHOLESALE',
        locations: 'LOCATIONS',
      },
      labels: {
        coffee: 'COFFEE',
        nicaraguan: 'NICARAGUAN',
        honduras: 'HONDURAS',
      }
    },
    tr: {
      title: 'Coffee Esto Roastery\'yi Keşfedin',
      subtitle: 'Demleme yolculuğunuzu seçin. Doğrudan ticari çekirdeklerden ekipman ve kafelerimize kadar, her gün taze kavuruyor ve teslim ediyoruz.',
      categories: {
        coffee: 'KAHVE',
        brewBags: 'DEMLEME ÇANTALARI',
        bundles: 'PAKETLER',
        subscriptions: 'ABONELİKLER',
        equipment: 'EKİPMANLAR',
        wholesale: 'TOPTAN SATIŞ',
        locations: 'KAFELERİMİZ',
      },
      labels: {
        coffee: 'KAHVE',
        nicaraguan: 'NİKARAGUA',
        honduras: 'HONDURAS',
      }
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const categories: CategoryItem[] = [
    {
      id: 'coffee',
      name: t.categories.coffee,
      link: `${linkPrefix}/coffee?category=single-origin`,
      gridClass: styles.cardCoffee,
      bgColor: '#fcf6f0', // Warm cream
      imageSrc: '/images/coffee_grouped.webp'
    },
    {
      id: 'brew-bags',
      name: t.categories.brewBags,
      link: `${linkPrefix}/coffee?category=light`,
      gridClass: styles.cardBrewBags,
      bgColor: '#171717', // Elegant dark theme
      svgIcon: (
        <svg viewBox="0 0 400 320" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Scattered brew bags */}
          <g opacity="0.8">
            <rect x="70" y="60" width="65" height="65" rx="6" transform="rotate(-15 70 60)" fill="#333333" stroke="#555555" strokeWidth="2" />
            <line x1="75" y1="85" x2="135" y2="70" stroke="#444444" strokeWidth="2" strokeDasharray="3 3" />
            
            <rect x="260" y="50" width="60" height="60" rx="6" transform="rotate(10 260 50)" fill="#333333" stroke="#555555" strokeWidth="2" />
            <line x1="262" y1="75" x2="318" y2="85" stroke="#444444" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="80" y="180" width="55" height="55" rx="6" transform="rotate(25 80 180)" fill="#333333" stroke="#555555" strokeWidth="2" />
          </g>
          {/* Premium Blue Coffee Bag flat on surface */}
          <g transform="translate(160, 100) rotate(-5)">
            <path d="M10 20 L90 20 L80 140 L20 140 Z" fill="#2c3a4e" stroke="#ff3601" strokeWidth="1.5" />
            <rect x="25" y="45" width="50" height="60" rx="3" fill="#ffffff" />
            <text x="50" y="58" fill="#1b2532" fontSize="5" fontWeight="bold" textAnchor="middle">COFFEE ESTO ROASTERY</text>
            <text x="50" y="70" fill="#e5c158" fontSize="8" fontWeight="900" textAnchor="middle">{t.labels.coffee}</text>
            <rect x="30" y="76" width="40" height="12" fill="#ff3601" rx="1" />
            <text x="50" y="84" fill="#ffffff" fontSize="4.5" fontWeight="bold" textAnchor="middle">{t.labels.nicaraguan}</text>
          </g>
        </svg>
      )
    },
    {
      id: 'bundles',
      name: t.categories.bundles,
      link: `${linkPrefix}/coffee?category=all`,
      gridClass: styles.cardBundles,
      bgColor: '#e3ebf0', // Clean icy blue
      svgIcon: (
        <svg viewBox="0 0 400 320" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="160" r="120" fill="#ff3601" fillOpacity="0.03" />
          {/* Cardboard box shape */}
          <path d="M90 180 L310 180 L290 270 L110 270 Z" fill="#d7ccc8" stroke="#a1887f" strokeWidth="3" />
          <path d="M90 180 L200 205 L310 180 L200 160 Z" fill="#efe5fd" fillOpacity="0.1" />
          
          {/* Coffee bags inside box */}
          {/* Left Bag (Costa Rica - Yellow) */}
          <path d="M110 100 L160 90 L160 190 L120 190 Z" fill="#e5c158" />
          <rect x="120" y="120" width="28" height="40" rx="2" fill="#ffffff" />
          <rect x="124" y="138" width="20" height="6" fill="#e5c158" />

          {/* Right Bag (Malabar - Purple) */}
          <path d="M230 100 L280 90 L270 190 L230 190 Z" fill="#4d394d" />
          <rect x="240" y="120" width="28" height="40" rx="2" fill="#ffffff" />
          <rect x="244" y="138" width="20" height="6" fill="#4d394d" />

          {/* Center Bag (Kenya - Red) */}
          <path d="M160 80 L230 80 L220 195 L170 195 Z" fill="#ff3601" />
          <rect x="175" y="105" width="40" height="50" rx="3" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
          <text x="195" y="118" fill="#ff3601" fontSize="6" fontWeight="bold" textAnchor="middle">{t.labels.coffee}</text>
          <rect x="180" y="124" width="30" height="8" fill="#457b9d" rx="1" />
          <text x="195" y="130" fill="#ffffff" fontSize="4.5" fontWeight="bold" textAnchor="middle">KENYA</text>
        </svg>
      )
    },
    {
      id: 'subscriptions',
      name: t.categories.subscriptions,
      link: `${linkPrefix}/coffee?category=single-origin`,
      gridClass: styles.cardSubscriptions,
      bgColor: '#e8f3f5', // Soft teal-white
      svgIcon: (
        <svg viewBox="0 0 600 360" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="180" r="140" fill="#ff3601" fillOpacity="0.04" />
          {/* Fanning coffee bags */}
          {/* Bag 1 (Back Left) */}
          <g transform="translate(140, 70) scale(0.9) rotate(-12)">
            <path d="M30 20 L130 20 L115 200 L45 200 Z" fill="#1b2532" opacity="0.7" />
            <rect x="50" y="55" width="60" height="90" rx="4" fill="#ffffff" opacity="0.7" />
          </g>
          {/* Bag 2 (Back Right) */}
          <g transform="translate(290, 70) scale(0.9) rotate(12)">
            <path d="M30 20 L130 20 L115 200 L45 200 Z" fill="#1b2532" opacity="0.7" />
            <rect x="50" y="55" width="60" height="90" rx="4" fill="#ffffff" opacity="0.7" />
          </g>
          {/* Bag 3 (Front Center) */}
          <g transform="translate(200, 60) scale(1.05)">
            <path d="M35 25 C65 20 115 20 145 25 L135 200 C135 206 125 210 115 210 L65 210 C55 210 45 206 45 200 L35 25 Z" fill="#2c3a4e" stroke="#ff3601" strokeWidth="2" strokeOpacity="0.3" />
            <rect x="52" y="60" width="76" height="115" rx="4" fill="#ffffff" />
            <text x="90" y="74" fill="#666666" fontSize="4.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.8">COFFEE ESTO ROASTERY</text>
            <text x="90" y="88" fill="#e5c158" fontSize="12" fontWeight="900" textAnchor="middle">{t.labels.coffee}</text>
            <rect x="58" y="94" width="64" height="22" fill="#457b9d" rx="2" />
            <text x="90" y="104" fill="#ffffff" fontSize="6.5" fontWeight="800" textAnchor="middle">{t.labels.honduras}</text>
            <text x="90" y="112" fill="#ffffff" fontSize="4.5" fontWeight="500" textAnchor="middle" opacity="0.9">LA FLOR</text>
          </g>
        </svg>
      )
    },
    {
      id: 'equipment',
      name: t.categories.equipment,
      link: `${linkPrefix}/coffee?category=espresso`,
      gridClass: styles.cardEquipment,
      bgColor: '#f5f5f5', // Minimalist clean gray
      svgIcon: (
        <svg viewBox="0 0 600 360" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Espresso Machine hints */}
          <rect x="80" y="60" width="160" height="240" rx="10" fill="#e1e4e6" stroke="#b0b5b9" strokeWidth="4" />
          <path d="M100 240H220" stroke="#9da2a7" strokeWidth="6" />
          <circle cx="160" cy="120" r="18" fill="#ff3601" fillOpacity="0.1" stroke="#ff3601" strokeWidth="2" />
          <path d="M160 138V180" stroke="#b0b5b9" strokeWidth="8" strokeLinecap="round" />
          
          {/* Elegant Iced Latte Glass (Front Center-Right) */}
          <g transform="translate(320, 80)">
            <path d="M20 20 L100 20 L85 180 C85 188 75 195 60 195 L60 195 C45 195 35 188 35 180 L20 20 Z" fill="rgba(255,255,255,0.4)" stroke="#b0b5b9" strokeWidth="2.5" />
            {/* Latte Layers */}
            {/* Bottom Milk layer */}
            <path d="M35 180 L28 100 C45 95 75 95 92 100 L85 180 Z" fill="#fdfbf7" />
            {/* Swirling espresso layer */}
            <path d="M28 100 L24 50 C45 42 75 42 96 50 L92 100 C75 95 45 95 28 100 Z" fill="#8d6239" />
            {/* Top foam and coffee crema */}
            <path d="M24 50 L21 22 L99 22 L96 50 C75 42 45 42 24 50 Z" fill="#d7ccc8" />
            {/* Ice Cubes inside glass */}
            <rect x="42" y="60" width="30" height="30" rx="5" fill="#ffffff" fillOpacity="0.7" transform="rotate(15 42 60)" />
            <rect x="52" y="110" width="28" height="28" rx="5" fill="#ffffff" fillOpacity="0.7" transform="rotate(-10 52 110)" />
          </g>
        </svg>
      )
    },
    {
      id: 'wholesale',
      name: t.categories.wholesale,
      link: `${linkPrefix}/wholesale`,
      gridClass: styles.cardWholesale,
      bgColor: '#e3eae6', // Warm olive green-gray
      imageSrc: '/images/wholesale.webp'
    },
    {
      id: 'locations',
      name: t.categories.locations,
      link: `${linkPrefix}/location`,
      gridClass: styles.cardLocations,
      bgColor: '#f4ece3', // Warm golden sand
      imageSrc: '/images/about/about-6.webp'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      aria-labelledby="bento-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>{locale === 'tr' ? 'Kategoriler' : 'Categories'}</span>
          <h2 id="bento-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.subtitle}>
            {t.subtitle}
          </p>
        </div>

        {/* 12-Column Modern Bento Grid */}
        <div className={styles.grid}>
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id}
              href={cat.link}
              className={`${styles.card} ${cat.gridClass}`}
              aria-label={locale === 'tr' ? `${cat.name.toLowerCase()} kategorimizi keşfedin` : `Explore our ${cat.name.toLowerCase()} category`}
              style={{ 
                backgroundColor: cat.bgColor,
                animationDelay: `${idx * 0.1}s` 
              }}
            >
              {/* Decorative Vector Graphic Background */}
              <div className={styles.graphic}>
                {cat.imageSrc ? (
                  <img src={cat.imageSrc} alt="" className={styles.cardImage} />
                ) : (
                  cat.svgIcon
                )}
              </div>

              {/* Glassmorphic Floating Label */}
              <div className={styles.label}>
                <span className={styles.name}>{cat.name}</span>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
