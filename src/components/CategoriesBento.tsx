'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './CategoriesBento.module.css';

const MotionLink = motion.create(Link);

interface CategoryItem {
  id: string;
  name: string;
  link: string;
  gridClass: string;
  bgColor: string;
  svgIcon?: React.ReactNode;
  imageSrc?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
      id: 'equipment',
      name: t.categories.equipment,
      link: `${linkPrefix}/coffee?category=espresso`,
      gridClass: styles.cardEquipment,
      bgColor: '#f5f5f5', // Minimalist clean gray
      imageSrc: '/images/coffee_equipment.webp'
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

        {/* 12-Column Modern Bento Grid with staggered Framer Motion entrances */}
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((cat) => (
            <MotionLink 
              key={cat.id}
              href={cat.link}
              className={`${styles.card} ${cat.gridClass}`}
              aria-label={locale === 'tr' ? `${cat.name.toLowerCase()} kategorimizi keşfedin` : `Explore our ${cat.name.toLowerCase()} category`}
              style={{ backgroundColor: cat.bgColor }}
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Decorative Vector Graphic Background with smooth hover zoom */}
              <div className={styles.graphic}>
                {cat.imageSrc && (
                  <motion.img 
                    src={cat.imageSrc} 
                    alt="" 
                    className={styles.cardImage} 
                    variants={{
                      hover: { scale: 1.04 }
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </div>

              {/* Glassmorphic Floating Label */}
              <div className={styles.label}>
                <span className={styles.name}>{cat.name}</span>
                <motion.span 
                  className={styles.arrow} 
                  aria-hidden="true"
                  variants={{
                    hover: { x: 6 }
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.span>
              </div>
            </MotionLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
