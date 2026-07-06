'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './NewArrivals.module.css';

interface ProductDetails {
  varietal: string;
  process: string;
  altitude: string;
  roast: string;
  roastDate: string;
  notes: string;
}

interface ProductProps {
  title: string;
  subtitle: string;
  bannerColor: string;
  price: string;
  oldPrice?: string;
  hasRibbon?: boolean;
  details: ProductDetails;
  mapPath: string;
  imageUrl: string;
  fruitIcon?: React.ReactNode;
  delayClass: string;
  locale?: string;
}

function ShowcaseCard({
  title,
  subtitle,
  bannerColor,
  price,
  oldPrice,
  hasRibbon,
  details,
  mapPath,
  imageUrl,
  fruitIcon,
  delayClass,
  locale = 'en'
}: ProductProps) {
  const t = {
    en: {
      coffee: 'COFFEE:',
      varietal: 'VARIETAL:',
      process: 'PROCESS:',
      altitude: 'ALTITUDE:',
      roast: 'ROAST:',
      roastOn: 'ROAST ON:',
      netWeight: 'NET WEIGHT 250G',
      recyclable: '100% RECYCLABLE PACKAGING',
      roastersChoice: "ROASTER'S CHOICE",
      viewProduct: 'View Product',
    },
    tr: {
      coffee: 'KAHVE:',
      varietal: 'VARYETE:',
      process: 'İŞLEM:',
      altitude: 'RAKIM:',
      roast: 'KAVRUM:',
      roastOn: 'KAVRUM TARİHİ:',
      netWeight: 'NET AĞIRLIK 250G',
      recyclable: '%100 GERİ DÖNÜŞTÜRÜLEBİLİR AMBALAJ',
      roastersChoice: 'KAVURUCUNUN SEÇİMİ',
      viewProduct: 'Ürünü İncele',
    }
  }[locale === 'tr' ? 'tr' : 'en'];

  return (
    <div className={`${styles.card} ${delayClass}`} tabIndex={0}>
      {/* Roaster's Choice Diagonal Ribbon */}
      {hasRibbon && (
        <div className={styles.ribbonContainer}>
          <span className={styles.ribbonText}>{t.roastersChoice}</span>
        </div>
      )}

      {/* Floating Price Badge */}
      <div className={styles.priceBadge}>
        <span className={styles.currentPrice}>{price}</span>
        {oldPrice && <span className={styles.oldPrice}>{oldPrice}</span>}
      </div>

      {/* Showcase Bag Image Container */}
      <div className={styles.bagContainer}>
        <div className={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt={title} 
            className={styles.bagImage} 
            loading="eager" 
          />
        </div>
      </div>

      {/* Slide up View Product Button on hover */}
      <div className={styles.btnOverlay}>
        <button className={styles.viewBtn}>{t.viewProduct}</button>
      </div>
    </div>
  );
}

export default function NewArrivals({ locale = 'en' }: { locale?: string }) {
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
      badge: 'Freshly Landed',
      title: 'NEW ARRIVALS',
      subtitle: 'The latest, freshest seasons coffees that have just landed at the roastery.',
      roastMedium: 'Medium',
      notesGuatemala: 'Orange - Caramel - Sweet - Chocolate',
      notesEthiopia: 'Lime - Floral - Bergamot - Peach',
      notesNicaragua: 'Pineapple - Sweet - Caramel',
      processWet: 'Wet',
      processWashed: 'Washed',
      processSemiWashed: 'Semi Washed',
    },
    tr: {
      badge: 'Yeni Gelenler',
      title: 'YENİ KAVRUMLARIMIZ',
      subtitle: 'Kavurmahanemize henüz ulaşan, sezonun en yeni ve en taze kahveleri.',
      roastMedium: 'Orta',
      notesGuatemala: 'Portakal - Karamel - Tatlı - Çikolata',
      notesEthiopia: 'Limon - Çiçeksi - Bergamot - Şeftali',
      notesNicaragua: 'Ananas - Tatlı - Karamel',
      processWet: 'Islak',
      processWashed: 'Yıkanmış',
      processSemiWashed: 'Yarı Yıkanmış',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;

  // Stylized country map vectors
  const mapPaths = {
    guatemala: 'M-15,-15 C-5,-20 15,-20 20,-10 C25,0 15,15 0,25 C-10,30 -20,20 -20,-5 Z',
    ethiopia: 'M-15,-15 C5,-25 25,-15 20,5 C15,25 -5,25 -15,15 C-25,5 -20,-5 -15,-15 Z',
    nicaragua: 'M-20,-10 C-5,-20 15,-15 25,-5 C15,10 0,15 -15,15 C-25,10 -25,0 -20,-10 Z'
  };

  // Detailed pineapple vector icon for Nicaraguan bag
  const pineappleIcon = (
    <svg width="28" height="38" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crown Leaves */}
      <path d="M12,12 C10,5 6,2 6,2 C6,2 9,6 12,8 C15,6 18,2 18,2 C18,2 14,5 12,12 Z" fill="#2a9d8f" />
      <path d="M12,12 C8,7 3,6 3,6 C3,6 7,9 10,11 C13,9 17,6 17,6 C17,6 14,8 12,12 Z" fill="#375140" />
      {/* Pineapple body */}
      <ellipse cx="12" cy="20" rx="9" ry="11" fill="#e5c158" stroke="#d4a326" strokeWidth="0.8" />
      {/* Cross-hatch scale pattern */}
      <path d="M6,14 L18,26 M18,14 L6,26 M3,20 H21 M12,9 V31" stroke="#d4a326" strokeWidth="0.5" opacity="0.6" />
      {/* Little scale dots */}
      <circle cx="12" cy="20" r="1" fill="#8c6239" />
      <circle cx="8" cy="16" r="0.8" fill="#8c6239" />
      <circle cx="16" cy="16" r="0.8" fill="#8c6239" />
      <circle cx="8" cy="24" r="0.8" fill="#8c6239" />
      <circle cx="16" cy="24" r="0.8" fill="#8c6239" />
    </svg>
  );

  return (
    <section 
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      aria-labelledby="arrivals-title"
    >
      {/* Wavy top transition (Overlay on dark background) */}
      <div className={styles.waveTopContainer} aria-hidden="true">
        <svg 
          viewBox="0 0 1440 180" 
          className={styles.waveSvg} 
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,0 L1440,0 L1440,80 C1080,180 720,20 360,160 C180,230 60,110 0,90 Z" 
            fill="#ffffff" 
          />
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>{t.badge}</span>
          <h2 id="arrivals-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.subtitle}>
            {t.subtitle}
          </p>
        </div>

        {/* 3 Showcase Cards Grid */}
        <div className={styles.grid}>
          <ShowcaseCard 
            title="GUATEMALA"
            subtitle="ANTIGUA"
            bannerColor="#e5c158"
            price="₺180"
            oldPrice="₺200"
            hasRibbon={true}
            details={{
              varietal: 'Bourbon, Typica, Caturra, Catuai',
              process: t.processWet,
              altitude: '1550 - 2000m',
              roast: t.roastMedium,
              roastDate: '22/06/26',
              notes: t.notesGuatemala
            }}
            mapPath={mapPaths.guatemala}
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/guatemala.webp"
            delayClass={styles.delay1}
            locale={locale}
          />

          <ShowcaseCard 
            title="ETHIOPIAN"
            subtitle="LIMU"
            bannerColor="#74a57f"
            price="₺195"
            oldPrice="₺210"
            hasRibbon={true}
            details={{
              varietal: 'Heirloom',
              process: t.processWashed,
              altitude: '1500 - 1900m',
              roast: t.roastMedium,
              roastDate: '16/06/26',
              notes: t.notesEthiopia
            }}
            mapPath={mapPaths.ethiopia}
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp"
            delayClass={styles.delay2}
            locale={locale}
          />

          <ShowcaseCard 
            title="NICARAGUAN"
            subtitle="PINEAPPLE CANDY"
            bannerColor="#f4a261"
            price="₺170"
            hasRibbon={true}
            details={{
              varietal: 'H3',
              process: t.processSemiWashed,
              altitude: '1350 - 1400m',
              roast: t.roastMedium,
              roastDate: '23/06/26',
              notes: t.notesNicaragua
            }}
            mapPath={mapPaths.nicaragua}
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp"
            fruitIcon={pineappleIcon}
            delayClass={styles.delay3}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
