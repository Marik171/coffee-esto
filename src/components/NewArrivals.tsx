'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import styles from './NewArrivals.module.css';

interface ShowcaseCardProps {
  id: string;
  name: string;
  origin: string;
  price: string;
  imageUrl: string;
  bgColor: string;
  tastingNotes: string;
  locale?: string;
}

function ShowcaseCard({
  id,
  name,
  origin,
  price,
  imageUrl,
  bgColor,
  tastingNotes,
  locale = 'en'
}: ShowcaseCardProps) {
  const linkPrefix = locale === 'tr' ? '' : '/en';
  return (
    <Link href={`${linkPrefix}/coffee/${id}`} className={styles.cardLink}>
      <div className={styles.cardContainer}>
        {/* Solid Pastel Colored Card Box */}
        <div className={styles.cardBox} style={{ backgroundColor: bgColor }}>
          <div className={styles.bagWrapper}>
            <img 
              src={imageUrl} 
              alt={name} 
              className={styles.coffeeBagImage} 
              loading="lazy" 
            />
          </div>
          {/* Slide up tasting notes overlay on hover */}
          <div className={styles.notesOverlay}>
            <span className={styles.notesLabel}>
              {locale === 'tr' ? 'TADIM NOTLARI' : 'TASTING NOTES'}
            </span>
            <span className={styles.notesText}>{tastingNotes}</span>
          </div>
        </div>
        {/* Centered label information below card box */}
        <div className={styles.cardInfo}>
          <span className={styles.cardOrigin}>{origin}</span>
          <h3 className={styles.cardName}>{name}</h3>
          <span className={styles.cardPrice}>{price}</span>
        </div>
      </div>
    </Link>
  );
}

export default function NewArrivals({ locale = 'en' }: { locale?: string }) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({
        left: -320, // scroll width of one card + margin
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({
        left: 320,
        behavior: 'smooth',
      });
    }
  };

  const translations = {
    en: {
      category: 'NEW ARRIVALS',
      title: 'Freshest of the Fresh',
      descPrefix: 'Shop the freshest',
      descSuffix: ' in our beautiful range of seasonal coffees sourced throughout the year.',
      linkUrl: '/coffee',
      products: [
        {
          id: 'guatemala',
          name: 'Guatemala Antigua',
          origin: 'ANTIGUA, GUATEMALA',
          price: '₺337.50',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/guatemala.webp',
          bgColor: '#e0ebf5',
          tastingNotes: 'Chocolate, Orange, Sweet Acidity',
        },
        {
          id: 'ethiopia',
          name: 'Ethiopia Sidamo',
          origin: 'SIDAMO, ETHIOPIA',
          price: '₺325.00',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp',
          bgColor: '#f7ebec',
          tastingNotes: 'Bergamot, Citrus, Tea Notes',
        },
        {
          id: 'brazil-mogiana',
          name: 'Brazil Mogiana',
          origin: 'ALTA MOGIANA, BRAZIL',
          price: '₺325.00',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp',
          bgColor: '#e2e4e6',
          tastingNotes: 'Caramel, Hazelnut, Balanced',
        },
        {
          id: 'colombia',
          name: 'Colombia Supremo',
          origin: 'HUILA, COLOMBIA',
          price: '₺350.00',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/colombia.webp',
          bgColor: '#eae9e7',
          tastingNotes: 'Chocolate, Hazelnut, Caramel',
        },
        {
          id: 'velora-signature',
          name: 'Velora Signature Espresso',
          origin: 'SINGLE ESTATE, ETHIOPIA',
          price: '₺350.00',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/velora-signature.webp',
          bgColor: '#eaebe6',
          tastingNotes: 'Floral, Winey, Tropical Fruit, Honey',
        },
      ]
    },
    tr: {
      category: 'YENİ GELENLER',
      title: 'Tazelerin En Tazesi',
      descPrefix: 'Tazeleri keşfedin',
      descSuffix: ' - Yıl boyunca tedarik edilen, sezonluk kahvelerimizin yer aldığı eşsiz seriden en taze kavrumlarımız.',
      linkUrl: '/coffee',
      products: [
        {
          id: 'guatemala',
          name: 'Guatemala Antigua',
          origin: 'ANTIGUA, GUATEMALA',
          price: '337,50 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/guatemala.webp',
          bgColor: '#e0ebf5',
          tastingNotes: 'Çikolata, Portakal, Tatlı Asidite',
        },
        {
          id: 'ethiopia',
          name: 'Etiyopya Sidamo',
          origin: 'SIDAMO, ETİYOPYA',
          price: '325,00 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp',
          bgColor: '#f7ebec',
          tastingNotes: 'Bergamot, Narenciye, Çay Notaları',
        },
        {
          id: 'brazil-mogiana',
          name: 'Brezilya Mogiana',
          origin: 'ALTA MOGIANA, BREZİLYA',
          price: '325,00 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp',
          bgColor: '#e2e4e6',
          tastingNotes: 'Karamel, Fındık, Dengeli',
        },
        {
          id: 'colombia',
          name: 'Kolombiya Supremo',
          origin: 'HUILA, KOLOMBİYA',
          price: '350,00 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/colombia.webp',
          bgColor: '#eae9e7',
          tastingNotes: 'Çikolata, Fındık, Karamel',
        },
        {
          id: 'velora-signature',
          name: 'Velora Özel Seri Espresso',
          origin: 'TEK ÇİFTLİK, ETİYOPYA',
          price: '350,00 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/velora-signature.webp',
          bgColor: '#eaebe6',
          tastingNotes: 'Çiçeksi, Şarapsı, Tropikal Meyve, Bal',
        },
      ]
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  return (
    <section className={styles.section} aria-labelledby="arrivals-title">
      <div className={styles.container}>
        {/* Section Header with split text and arrow controls */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerText}>
            <span className={styles.categoryLabel}>{t.category}</span>
            <h2 id="arrivals-title" className={styles.title}>
              {t.title}
            </h2>
            <p className={styles.description}>
              <Link href={`${linkPrefix}${t.linkUrl}`} className={styles.underlinedLink}>
                {t.descPrefix}
              </Link>
              {t.descSuffix}
            </p>
          </div>
          <div className={styles.headerControls}>
            <button 
              className={styles.scrollBtn} 
              onClick={scrollLeft} 
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button 
              className={styles.scrollBtn} 
              onClick={scrollRight} 
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div className={styles.grid} ref={gridRef}>
          {t.products.map((product) => (
            <ShowcaseCard 
              key={product.id}
              id={product.id}
              name={product.name}
              origin={product.origin}
              price={product.price}
              imageUrl={product.imageUrl}
              bgColor={product.bgColor}
              tastingNotes={product.tastingNotes}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
