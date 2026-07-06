'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      title: 'Try Our Special – 6 Bags from £40',
      description: 'Our Half roasters bundle consists of 6 bags of coffee handpicked by John our master roaster who will select a wide variety from our beans available that day you order',
      buyBtn: 'BUY NOW',
      ariaLabel: 'Buy our special bundle of 6 coffee bags starting from 40 pounds',
      roasts: {
        sumatra: 'MANDHELING',
        colombia: 'EL EDEN',
        kenya: 'BLUE MOUNTAIN',
        papua: 'GUINEA',
        ethiopia: 'JIMMA',
      }
    },
    tr: {
      title: 'Özel Teklifimizi Deneyin – 6 Paket ₺1500\'den Başlayan Fiyatlarla',
      description: 'Yarı kavurucu paketimiz, sipariş verdiğiniz gün mevcut çekirdeklerimiz arasından geniş bir çeşitlilik seçecek olan baş kavurucumuz John tarafından özenle seçilen 6 paket kahveden oluşmaktadır.',
      buyBtn: 'ŞİMDİ SATIN AL',
      ariaLabel: '1500 liradan başlayan 6\'lı kahve paketi özel teklifimizi satın alın',
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
          <button className={styles.buyBtn} aria-label={t.ariaLabel}>
            {t.buyBtn}
          </button>
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
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-rio-minas.webp"
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
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/colombia.webp"
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
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/kenya.webp"
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
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp"
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
            imageUrl="https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp"
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
