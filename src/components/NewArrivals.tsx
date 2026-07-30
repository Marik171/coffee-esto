'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
};

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
    <motion.div 
      variants={cardVariants} 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={styles.cardWrapper}
    >
      <Link href={`${linkPrefix}/coffee/${id}`} className={styles.cardLink}>
        <div className={styles.cardContainer}>
          {/* Gradient Colored Card Box */}
          <div className={styles.cardBox} style={{ background: bgColor }}>
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
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

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
          bgColor: 'linear-gradient(135deg, #e0ebf5 0%, #edf4fa 100%)',
          tastingNotes: 'Chocolate, Orange, Sweet Acidity',
        },
        {
          id: 'ethiopia',
          name: 'Ethiopia Sidamo',
          origin: 'SIDAMO, ETHIOPIA',
          price: '₺352.50',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp',
          bgColor: 'linear-gradient(135deg, #fbf1c9 0%, #fffdf0 100%)',
          tastingNotes: 'Floral, Jasmine, Citric Brightness',
        },
        {
          id: 'brazil-mogiana',
          name: 'Brazil Mogiana',
          origin: 'MOGIANA, BRAZIL',
          price: '₺292.50',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp',
          bgColor: 'linear-gradient(135deg, #ebdbe8 0%, #faf3f9 100%)',
          tastingNotes: 'Nutty, Cocoa, Low Acidity',
        },
        {
          id: 'colombia',
          name: 'Colombia Supremo',
          origin: 'HUILA, COLOMBIA',
          price: '₺315.00',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/colombia.webp',
          bgColor: 'linear-gradient(135deg, #e0ebd5 0%, #f3f9ee 100%)',
          tastingNotes: 'Caramel, Red Apple, Balanced Body',
        },
        {
          id: 'velora-signature',
          name: 'Velora Signature',
          origin: 'HOUSE BLEND',
          price: '₺360.00',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/velora-signature.webp',
          bgColor: 'linear-gradient(135deg, #f5e2d6 0%, #fffbf7 100%)',
          tastingNotes: 'Rich Berry, Dark Chocolate, Smooth Finish',
        }
      ]
    },
    tr: {
      category: 'YENİ GELENLER',
      title: 'Tazelerin En Tazesi',
      descPrefix: 'Mevsimlik kahvelerimizin',
      descSuffix: ' en tazesini yıl boyu özenle tedarik ediyor ve kavuruyoruz.',
      linkUrl: '/coffee',
      products: [
        {
          id: 'guatemala',
          name: 'Guatemala Antigua',
          origin: 'ANTIGUA, GUATEMALA',
          price: '337.50 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/guatemala.webp',
          bgColor: 'linear-gradient(135deg, #e0ebf5 0%, #edf4fa 100%)',
          tastingNotes: 'Çikolata, Portakal, Tatlı Asidite',
        },
        {
          id: 'ethiopia',
          name: 'Ethiopia Sidamo',
          origin: 'SIDAMO, ETİYOPYA',
          price: '352.50 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp',
          bgColor: 'linear-gradient(135deg, #fbf1c9 0%, #fffdf0 100%)',
          tastingNotes: 'Çiçeksi, Yasemin, Narenciye Parlaklığı',
        },
        {
          id: 'brazil-mogiana',
          name: 'Brazil Mogiana',
          origin: 'MOGIANA, BREZİLYA',
          price: '292.50 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp',
          bgColor: 'linear-gradient(135deg, #ebdbe8 0%, #faf3f9 100%)',
          tastingNotes: 'Fındıksı, Kakao, Düşük Asidite',
        },
        {
          id: 'colombia',
          name: 'Colombia Supremo',
          origin: 'HUILA, KOLOMBİYA',
          price: '315.00 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/colombia.webp',
          bgColor: 'linear-gradient(135deg, #e0ebd5 0%, #f3f9ee 100%)',
          tastingNotes: 'Karamel, Kırmızı Elma, Dengeli Gövde',
        },
        {
          id: 'velora-signature',
          name: 'Velora Signature',
          origin: 'ÖZEL HARMAN',
          price: '360.00 TL',
          imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/velora-signature.webp',
          bgColor: 'linear-gradient(135deg, #f5e2d6 0%, #fffbf7 100%)',
          tastingNotes: 'Zengin Orman Meyveleri, Bitter Çikolata, Yumuşak Bitiş',
        }
      ]
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  return (
    <section className={styles.section} aria-labelledby="arrivals-title">
      <div className={styles.container}>
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

        {/* Horizontal Carousel Track with staggered Framer Motion entrances */}
        <motion.div 
          className={styles.grid} 
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
