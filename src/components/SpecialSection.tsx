'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './SpecialSection.module.css';

interface CoffeeBagProps {
  title: string;
  subtitle: string;
  bannerColor: string;
  varietal: string;
  process: string;
  altitude: string;
  roast: string;
  roastDate: string;
  mapPath: string;
  className: string;
  imageUrl: string;
  locale?: string;
}

function CoffeeBag({
  title,
  imageUrl,
  className,
}: CoffeeBagProps) {
  return (
    <div className={`${styles.bagWrapper} ${className}`}>
      <div className={styles.imageContainer}>
        <img 
          src={imageUrl} 
          alt={title} 
          className={styles.bagImage} 
          loading="eager" 
        />
      </div>
    </div>
  );
}

export default function SpecialSection({ locale = 'en' }: { locale?: string }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Setup intersection observer to trigger animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the section is visible
      }
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
      title: "The Roaster's Choice – 6 Bags to Explore",
      description: 'Discover the ultimate sensory journey. Our curated bundle consists of 6 distinct coffees handpicked by our master roaster, selected from the freshest beans available the day you order.',
      buyBtn: 'BUY NOW',
      ariaLabel: 'Explore our curated selection of six unique coffee bags handpicked by our master roaster',
      roasts: {
        sumatra: 'MANDHELING',
        colombia: 'EL EDEN',
        kenya: 'BLUE MOUNTAIN',
        papua: 'GUINEA',
        ethiopia: 'JIMMA',
      }
    },
    tr: {
      title: 'Kavurucunun Seçkisi – Keşfedilmeyi Bekleyen 6 Lezzet',
      description: 'Eşsiz bir duyusal yolculuğa çıkın. Baş kavurucumuz tarafından, sipariş verdiğiniz günün en taze çekirdekleri arasından özenle seçilen 6 farklı kahveden oluşan özel tadım paketi.',
      buyBtn: 'ŞİMDİ SATIN AL',
      ariaLabel: 'Baş kavurucumuz tarafından özenle seçilmiş altı farklı kahve paketinden oluşan özel seçkimizi keşfedin',
      roasts: {
        sumatra: 'MANDHELING',
        colombia: 'EL EDEN',
        kenya: 'MAVİ DAĞ',
        papua: 'YENİ GİNE',
        ethiopia: 'JIMMA',
      }
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  // Approximate SVG paths representing stylized country map contours
  const mapPaths = {
    colombia: 'M-15,-20 C-5,-25 15,-25 25,-10 C35,0 15,20 0,30 C-10,35 -20,20 -25,10 C-30,0 -25,-15 -15,-20 Z',
    kenya: 'M-20,-10 C-15,-25 15,-20 20,-10 C25,0 10,20 0,25 C-10,30 -20,20 -20,-10 Z',
    papua: 'M-35,-5 C-25,-15 15,-15 35,-5 C25,5 15,15 -10,15 C-20,15 -30,5 -35,-5 Z',
    sumatra: 'M-40,-15 C-10,-20 20,-10 40,-5 C20,10 0,15 -25,15 C-35,15 -45,-5 -40,-15 Z',
    ethiopia: 'M-15,-15 C5,-25 25,-15 20,5 C15,25 -5,25 -15,15 C-25,5 -20,-5 -15,-15 Z'
  };

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      aria-labelledby="special-title"
    >
      <div className={styles.container}>
        {/* Header Text & CTA Button */}
        <div className={styles.headerContent}>
          <h2 id="special-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.description}>
            {t.description}
          </p>
          <Link href={`${linkPrefix}/coffee`} className={styles.buyBtn} aria-label={t.ariaLabel}>
            {t.buyBtn}
          </Link>
        </div>

        {/* Coffee Bags Fan Layout Container */}
        <div className={styles.bagsContainer}>
          {/* Sumatra Mandheling (Far Left) */}
          <CoffeeBag 
            title="SUMATRA"
            subtitle={t.roasts.sumatra}
            bannerColor="#1d3557"
            varietal="Typica"
            process="Giling Basah"
            altitude="1100 - 1500m"
            roast={locale === 'tr' ? 'Orta-Koyu' : 'Medium-Dark'}
            roastDate="02/05/26"
            mapPath={mapPaths.sumatra}
            className={styles.bagFarLeft}
            imageUrl="/images/coffee_packs/BRAZIL_RIOMINAS.png"
            locale={locale}
          />

          {/* Colombian El Eden (Inner Left) */}
          <CoffeeBag 
            title="COLOMBIAN"
            subtitle={t.roasts.colombia}
            bannerColor="#e63946"
            varietal="Caturra, Castillo"
            process={locale === 'tr' ? 'Islak' : 'Wet'}
            altitude="1650m"
            roast={locale === 'tr' ? 'Orta' : 'Medium'}
            roastDate="03/05/26"
            mapPath={mapPaths.colombia}
            className={styles.bagInnerLeft}
            imageUrl="/images/coffee_packs/COLOMBIA.png"
            locale={locale}
          />

          {/* Kenya Blue Mountain (Center - Front) */}
          <CoffeeBag 
            title="KENYA"
            subtitle={t.roasts.kenya}
            bannerColor="#457b9d"
            varietal="Bourbon, Kent"
            process={locale === 'tr' ? 'Yıkanmış' : 'Washed'}
            altitude="1850m"
            roast={locale === 'tr' ? 'Orta' : 'Medium'}
            roastDate="08/05/26"
            mapPath={mapPaths.kenya}
            className={styles.bagCenter}
            imageUrl="/images/coffee_packs/KENYA.png"
            locale={locale}
          />

          {/* Papua New Guinea (Inner Right) */}
          <CoffeeBag 
            title="PAPUA NEW"
            subtitle={t.roasts.papua}
            bannerColor="#2a9d8f"
            varietal="Bourbon, Typica"
            process={locale === 'tr' ? 'Islak' : 'Wet'}
            altitude="1200 - 1750m"
            roast={locale === 'tr' ? 'Orta' : 'Medium'}
            roastDate="11/05/26"
            mapPath={mapPaths.papua}
            className={styles.bagInnerRight}
            imageUrl="/images/coffee_packs/BRAZIL_MOGIANA.png"
            locale={locale}
          />

          {/* Ethiopian Jimma (Far Right) */}
          <CoffeeBag 
            title="ETHIOPIAN"
            subtitle={t.roasts.ethiopia}
            bannerColor="#a8dadc"
            varietal="Heirloom"
            process={locale === 'tr' ? 'Doğal' : 'Natural'}
            altitude="1500 - 2000m"
            roast={locale === 'tr' ? 'Açık-Orta' : 'Light-Medium'}
            roastDate="15/05/26"
            mapPath={mapPaths.ethiopia}
            className={styles.bagFarRight}
            imageUrl="/images/coffee_packs/ETHIOPIA_SIDAMO.png"
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
