'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from '../app/about/about.module.css';

/* ── Scroll-triggered fade-up wrapper ───────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-72px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

interface AboutContentProps {
  locale?: string;
}

export default function AboutContent({ locale = 'en' }: AboutContentProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const translations = {
    en: {
      heroEyebrow: 'About Coffee Esto',
      heroTitle: 'About Coffee Esto',
      heroSub: 'Our core values: to source directly, to roast to order, to welcome. We roast green coffee to reflect its unique terroir in a style that highlights clean sweetness.',
      quoteText: '“The idea of Coffee Esto starts with the thought that coffee by itself is compelling, but how it brings people to connect in explicitly human ways all over the world is what makes it infinitely spellbinding.”',
      established: 'ESTABLISHED 2021 / KARTAL, İSTANBUL',
      
      storyLabel: 'HISTORY',
      storyTitle: 'Our Story',
      storyText: 'The Coffee Esto Roastery is a boutique coffee roasting brand that views coffee not just as a beverage, but as a craft where expertise, passion, and experience meet. Our founder, Hakan Akdağ, has over 23 years of professional experience in the service industry. Established in 2021, The Coffee Esto Roastery began its operations with the goal of bringing specialty coffee together with the most precise roasting profiles. Today, in our own facility, green coffees sourced carefully from the world\'s distinguished coffee-producing regions are roasted to reveal the unique character of each bean.',
      
      mattersLabel: 'DIRECT TRADE',
      mattersTitle: 'What Matters to Us',
      mattersText: 'We bypass corporate brokers to source micro-lots directly from farmers, guaranteeing fair pay, community infrastructure support, and full crop traceability. We develop specific heat curves for every single origin. Our roasters map airflow and drum speeds to draw out clean fruit acidity and rich caramel notes. All our coffees are packed in 100% recyclable, one-way valved pouches that lock in freshness.',
      
      horecaLabel: 'HORECA SOLUTIONS',
      horecaTitle: 'Consultancy & Equipment',
      horecaText: 'In addition to coffee production, we offer end-to-end professional solutions for cafe and restaurant investments. We provide all products and services required by the Horeca sector under one roof, including the sale of espresso machines and coffee equipment, project consultancy, business setup, and supply of bar and kitchen equipment.',
      
      roastLabel: 'PRECISION ROASTING',
      roastTitle: 'Precision Roast & Quality Control',
      roastText: 'Heat and airflow curves are mapped by our head roasters for every batch, drawing out the natural sweetness unique to each origin. No coffee leaves our roastery without being cupped. Every batch is evaluated for acidity, body, sweetness, and aroma to ensure consistency in every package.',
      
      ctaShop: 'Shop products',
      ctaWholesale: 'Wholesale'
    },
    tr: {
      heroEyebrow: 'Coffee Esto Hakkında',
      heroTitle: 'Coffee Esto Hakkında',
      heroSub: 'Temel değerlerimiz: doğrudan tedarik etmek, sipariş üzerine kavurmak, eğitmek ve ağırlamak. Yeşil kahveyi, temiz tatlılığı öne çıkaran bir tarzda, kendine özgü yöresini yansıtacak şekilde kavuruyoruz.',
      quoteText: '“Coffee Esto fikri, kahvenin kendi başına büyüleyici olduğu düşüncesiyle başlar; ancak insanları dünyanın her yerinde insani yollarla birbirine bağlama şeklidir onu sonsuz kılan.”',
      established: 'KURULUŞ 2021 / KARTAL, İSTANBUL',
      
      storyLabel: 'TARİHÇEMİZ',
      storyTitle: 'Hikayemiz',
      storyText: 'The Coffee Esto Roastery, kahveyi yalnızca bir içecek olarak değil, uzmanlık, tutku ve deneyimin buluştuğu bir zanaat olarak gören butik bir kahve kavurma markasıdır. Markamızın kurucusu Hakan Akdağ, hizmet sektöründe 23 yılı aşkın profesyonel deneyime sahiptir. 2021 yılında kurulan Coffee Esto, nitelikli kahveyi en doğru kavurma profilleriyle buluşturma hedefiyle kurulmuştur. Bugün kendi tesisimizde, dünyanın seçkin kahve bölgelerinden özenle temin edilen kahveler, her çekirdeğin karakterini ortaya çıkaracak şekilde kavrulmaktadır.',
      
      mattersLabel: 'DOĞRUDAN TEDARİK',
      mattersTitle: 'Bizim İçin Önemli Olanlar',
      mattersText: 'Mikro lotları doğrudan çiftçilerden temin ediyor; adil ödeme, topluluk altyapısı desteği ve tam mahsul izlenebilirliğini garanti ediyoruz. Her köken için özel ısı eğrileri geliştirerek meyve asiditesini ve zengin karamel notalarını ortaya çıkarmak için hava akışını ve tambur hızlarını haritalandırıyoruz. Tüm kahvelerimiz tazeliği koruyan, geri dönüştürülebilir valfli poşetlerde sunulmaktadır.',
      
      horecaLabel: 'HORECA ÇÖZÜMLERİ',
      horecaTitle: 'Danışmanlık & Ekipman',
      horecaText: 'Kahve üretiminin yanı sıra, kafe ve restoran yatırımlarına uçtan uca profesyonel çözümler sunuyoruz. Espresso makineleri ve kahve ekipmanlarının satışı, proje danışmanlığı, işletme kurulumu, bar ve mutfak ekipmanlarının tedariki ile Horeca sektörünün ihtiyaç duyduğu tüm ürün ve hizmetleri tek çatı altında sağlıyoruz.',
      
      roastLabel: 'HASSAS KAVURMA',
      roastTitle: 'Hassas Kavrum & Kalite Kontrol',
      roastText: 'Isı ve hava akışı eğrileri, her parti için baş kavurucularımız tarafından haritalandırılır ve her kökene özgü doğal tatlılığı ortaya çıkarır. Hiçbir kahve, tadımı (cupping) yapılmadan kavurmahanemizden çıkmaz. Her parti asidite, gövde, tatlılık ve aroma açısından değerlendirilir.',
      
      ctaShop: 'Kahveleri Keşfet',
      ctaWholesale: 'Toptan Satış'
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />

      {/* ── 1. Full-width Hero Banner ─────────────────────────── */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <img
            src="/images/about/about-7.webp"
            alt="The Coffee Esto Roastery Roasting Process"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        
        <div className={styles.container}>
          <motion.div
            ref={heroRef}
            className={styles.heroCard}
            initial={{ opacity: 0, y: 36 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className={styles.heroEyebrow}>{t.heroEyebrow}</span>
            <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
            <p className={styles.heroSub}>{t.heroSub}</p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Typographic Quote Block ───────────────────────── */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <FadeUp className={styles.quoteContainer}>
            <blockquote className={styles.quoteText}>{t.quoteText}</blockquote>
            <div className={styles.quoteRule} />
            <span className={styles.established}>{t.established}</span>
          </FadeUp>
        </div>
      </section>

      {/* ── 3. Vertical Stories & Images Feed ─────────────────── */}
      <section className={styles.feedSection}>
        <div className={styles.container}>
          <div className={styles.feed}>
            
            {/* Row 1: Our Story */}
            <div className={styles.feedRow}>
              <FadeUp className={styles.feedColImage}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-1.webp" alt="Coffee Esto Story" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.feedColContent} delay={0.08}>
                <span className={styles.feedLabel}>{t.storyLabel}</span>
                <h2 className={styles.feedHeading}>{t.storyTitle}</h2>
                <p className={styles.feedText}>{t.storyText}</p>
              </FadeUp>
            </div>

            {/* Row 2: Two Side-by-Side Images */}
            <div className={styles.feedDoubleImageRow}>
              <FadeUp className={styles.doubleImageCol}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-5.webp" alt="Cafe Environment" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.doubleImageCol} delay={0.08}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-2.webp" alt="Roastery Team & Machine" className={styles.feedImg} />
                </div>
              </FadeUp>
            </div>

            {/* Row 3: What Matters to Us */}
            <div className={styles.feedRow}>
              <FadeUp className={styles.feedColImage}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-6.webp" alt="Coffee Beans Sourcing" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.feedColContent} delay={0.08}>
                <span className={styles.feedLabel}>{t.mattersLabel}</span>
                <h2 className={styles.feedHeading}>{t.mattersTitle}</h2>
                <p className={styles.feedText}>{t.mattersText}</p>
              </FadeUp>
            </div>

            {/* Row 4: Consultancy & Horeca */}
            <div className={styles.feedRowReverse}>
              <FadeUp className={styles.feedColContent}>
                <span className={styles.feedLabel}>{t.horecaLabel}</span>
                <h2 className={styles.feedHeading}>{t.horecaTitle}</h2>
                <p className={styles.feedText}>{t.horecaText}</p>
              </FadeUp>
              <FadeUp className={styles.feedColImage} delay={0.08}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-3.webp" alt="Barista Equipment solutions" className={styles.feedImg} />
                </div>
              </FadeUp>
            </div>

            {/* Row 5: Precision Roast & Quality */}
            <div className={styles.feedRow}>
              <FadeUp className={styles.feedColImage}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-4.webp" alt="Espresso extraction quality control" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.feedColContent} delay={0.08}>
                <span className={styles.feedLabel}>{t.roastLabel}</span>
                <h2 className={styles.feedHeading}>{t.roastTitle}</h2>
                <p className={styles.feedText}>{t.roastText}</p>
              </FadeUp>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. CTA Black Banner ──────────────────────────────── */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.ctaContainer}>
          <Link href={`${linkPrefix}/coffee`} className={styles.ctaLink}>
            {t.ctaShop}
          </Link>
          <Link href={`${linkPrefix}/wholesale`} className={styles.ctaLink}>
            {t.ctaWholesale}
          </Link>
        </div>
      </section>

      <Footer waveColor="#1a0e07" locale={locale} />
    </div>
  );
}
