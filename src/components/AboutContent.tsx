'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Footer from './Footer';
import Navbar from './Navbar';
import styles from '../app/about/about.module.css';

/* ── Reusable SVG icons ──────────────────────────────────────── */
const IconLeaf = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconFlame = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3Z"/>
  </svg>
);

const IconCup = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);

const IconBox = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
    <path d="M2 12h20"/>
  </svg>
);

const IconTarget = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconRecycle = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
    <path d="m14 16-3 3 3 3"/>
    <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
  </svg>
);

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
      heroEyebrow: 'Est. 2021 · İstanbul Roastery',
      heroTitle: 'Coffee is Our Craft,\nYour Profit.',
      heroSub: 'The Coffee Esto Roastery - Boutique Coffee Roasting & Horeca Solutions',
      beginningsEyebrow: 'Our Story',
      beginningsTitle: 'Who We\nAre',
      paragraphs: [
        "The Coffee Esto Roastery is a boutique coffee roasting brand that views coffee not just as a beverage, but as a craft where expertise, passion, and experience meet.",
        "Our founder, Hakan Akdağ, has over 23 years of professional experience in the service industry. Throughout his career, he has served as a manager, operations director, and brand representative for Turkey's leading coffee and food & beverage brands; for the last 15 years, he has contributed value to the industry as a professional coffee roaster.",
        "Established in 2021, The Coffee Esto Roastery began its operations with the goal of bringing specialty coffee together with the most precise roasting profiles. Today, in our own facility, green coffees sourced carefully from the world's distinguished coffee-producing regions are roasted to reveal the unique character of each bean and delivered to our customers using freshness-preserving methods.",
        "In addition to coffee production, we offer end-to-end professional solutions for cafe and restaurant investments. We provide all products and services required by the Horeca sector under one roof, including the sale of espresso machines and coffee equipment, project consultancy, business setup, and supply of bar and kitchen equipment.",
        "Thanks to the field experience we have gained over the years, we have consulted on the establishment, operation, and growth stages of many businesses. We aim for our business partners to achieve not only quality coffee but also a sustainable business model.",
        "Our vision as The Coffee Esto Roastery is to add value to coffee culture based on quality, integrity, and sustainability, and to offer products that make our effort and expertise felt in every cup.",
        "The Coffee Esto Roastery – Coffee is Our Craft, Your Profit."
      ],
      exploreBtn: 'Explore Our Coffees',
      philosophyEyebrow: 'Our Philosophy',
      philosophyTitle: 'What We Stand For',
      processEyebrow: 'From Farm to Cup',
      processTitle: 'How We Roast',
      stats: [
        { value: '2021', label: 'Founded' },
        { value: '15+', label: 'Specialty Coffees' },
        { value: '8+', label: 'Origin Countries' },
        { value: '48h', label: 'Roast-to-Door' },
      ],
      pillars: [
        { icon: <IconGlobe />, num: '01', title: 'Direct & Ethical Sourcing', desc: 'We bypass corporate brokers to source micro-lots directly from farmers, guaranteeing fair pay, community infrastructure support, and full crop traceability.' },
        { icon: <IconTarget />, num: '02', title: 'Precision Profile Roasting', desc: 'We develop specific heat curves for every single origin. Our roasters map airflow and drum speeds to draw out clean fruit acidity and rich caramel notes.' },
        { icon: <IconRecycle />, num: '03', title: 'Sustainable Packaging', desc: 'All our coffees are packed in 100% recyclable, one-way valved pouches that lock in freshness without costing the earth.' },
      ],
      steps: [
        { num: '01', icon: <IconLeaf />, title: 'Ethical Sourcing', desc: 'We visit small-holder farms and micro-lots in Colombia, Ethiopia, and Nicaragua, negotiating directly for fair premiums and sustainable methods.' },
        { num: '02', icon: <IconFlame />, title: 'Precision Roasting', desc: 'Heat and airflow curves are mapped by our head roasters for every batch, drawing out the natural sweetness unique to each origin.' },
        { num: '03', icon: <IconCup />, title: 'Quality Cupping', desc: 'No coffee leaves our roastery without being cupped. Every batch is evaluated for acidity, body, sweetness, and aroma.' },
        { num: '04', icon: <IconBox />, title: 'Fresh Dispatch', desc: 'Packed in recyclable valved pouches and shipped within 24 hours of roasting — the freshest aroma arrives in your cup.' },
      ]
    },
    tr: {
      heroEyebrow: 'Kuruluş 2021 · İstanbul Kavurmahanesi',
      heroTitle: 'Coffee is Our Craft,\nYour Profit.',
      heroSub: 'The Coffee Esto Roastery - Butik Kahve Kavurma & Horeca Çözümleri',
      beginningsEyebrow: 'Hikayemiz',
      beginningsTitle: 'Biz\nKimiz',
      paragraphs: [
        "The Coffee Esto Roastery, kahveyi yalnızca bir içecek olarak değil, uzmanlık, tutku ve deneyimin buluştuğu bir zanaat olarak gören butik bir kahve kavurma markasıdır.",
        "Markamızın kurucusu Hakan Akdağ, hizmet sektöründe 23 yılı askerî profesyonel deneyime sahiptir. Kariyeri boyunca Türkiye'nin önde gelen kahve ve yeme-içme markalarında yöneticilik, operasyon müdürlüğü ve marka temsilciliği görevlerinde bulunmuş; son 15 yıldır ise profesyonel kahve kavurucusu olarak sektöre değer katmıştır.",
        "2021 yılında kurulan The Coffee Esto Roastery, nitelikli kahveyi en doğru kavurma profilleriyle buluşturma hedefiyle faaliyetlerine başlamıştır. Bugün kendi tesisimizde, dünyanın seçkin kahve üretim bölgelerinden özenle temin edilen yeşil kahveler, her çekirdeğin karakterini ortaya çıkaracak şekilde kavrulmakta ve tazeliğini koruyacak yöntemlerle müşterilerimize ulaştırılmaktadır.",
        "Kahve üretiminin yanı sıra, kafe ve restoran yatırımlarına uçtan uca profesyonel çözümler sunuyoruz. Espresso makineleri ve kahve ekipmanlarının satışı, proje danışmanlığı, işletme kurulumu, bar ve mutfak ekipmanlarının tedariki ile Horeca sektörünün ihtiyaç duyduğu tüm ürün ve hizmetleri tek çatı altında sağlıyoruz.",
        "Yıllar içinde edindiğimiz saha tecrübesi sayesinde birçok işletmenin kuruluş, operasyon ve büyüme süreçlerine danışmanlık verdik. İş ortaklarımızın yalnızca kaliteli kahveye değil, sürdürülebilir bir işletme modeline de ulaşmasını hedefliyoruz.",
        "The Coffee Esto Roastery olarak vizyonumuz; kalite, dürüstlük ve sürdürülebilirliği temel alarak kahve kültürüne değer katmak, her fincanda emeğimizi ve uzmanlığımızı hissettiren ürünler sunmaktır.",
        "The Coffee Esto Roastery – Coffee is Our Craft, Your Profit."
      ],
      exploreBtn: 'Kahvelerimizi Keşfedin',
      philosophyEyebrow: 'Felsefemiz',
      philosophyTitle: 'Neyi Savunuyoruz',
      processEyebrow: 'Çiftlikten Fincana',
      processTitle: 'Nasıl Kavuruyoruz',
      stats: [
        { value: '2021', label: 'Kuruluş' },
        { value: '15+', label: 'Nitelikli Kahveler' },
        { value: '8+', label: 'Menşe Ülkeler' },
        { value: '48s', label: 'Kavrumdan Kapıya' },
      ],
      pillars: [
        { icon: <IconGlobe />, num: '01', title: 'Doğrudan & Etik Tedarik', desc: 'Kurumsal aracıları devre dışı bırakarak mikro lotları doğrudan çiftçilerden temin ediyor; adil ödeme, topluluk altyapısı desteği ve tam mahsul izlenebilirliğini garanti ediyoruz.' },
        { icon: <IconTarget />, num: '02', title: 'Hassas Profil Kavurma', desc: 'Her bir tek köken için özel ısı eğrileri geliştiriyoruz. Kavurucularımız, temiz meyve asiditesini ve zengin karamel notalarını ortaya çıkarmak için hava akışını ve tambur hızlarını haritalandırır.' },
        { icon: <IconRecycle />, num: '03', title: 'Sürdürülebilir Ambalaj', desc: 'Tüm kahvelerimiz, dünyaya zarar vermeden tazeliği kilitleyen, %100 geri dönüştürülebilir, tek yönlü valfli poşetlerde paketlenmektedir.' },
      ],
      steps: [
        { num: '01', icon: <IconLeaf />, title: 'Etik Tedarik', desc: 'Kolombiya, Etiyopya ve Nikaragua\'daki küçük ölçekli çiftlikleri ve mikro lotları ziyaret ediyor, adil primler ve sürdürülebilir yöntemler için doğrudan pazarlık yapıyoruz.' },
        { num: '02', icon: <IconFlame />, title: 'Hassas Kavurma', desc: 'Isı ve hava akışı eğrileri, her parti için baş kavurucularımız tarafından haritalandırılır ve her kökene özgü doğal tatlılığı ortaya çıkarır.' },
        { num: '03', icon: <IconCup />, title: 'Kalite Tadımı', desc: 'Hiçbir kahve, tadımı (cupping) yapılmadan kavurmahanemizden çıkmaz. Her parti asidite, gövde, tatlılık ve aroma açısından değerlendirilir.' },
        { num: '04', icon: <IconBox />, title: 'Taze Gönderim', desc: 'Geri dönüştürülebilir valfli poşetlerde paketlenir ve kavrulduktan sonra 24 saat içinde gönderilir - fincanınıza en taze aroma ulaşır.' },
      ]
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const gallery = [
    { src: '/images/about/about-2.webp', alt: 'The Coffee Esto Roastery team and process' },
    { src: '/images/about/about-3.webp', alt: 'Premium coffee brewing setup' },
    { src: '/images/about/about-4.webp', alt: 'Horeca espresso equipment solutions' },
    { src: '/images/about/about-5.webp', alt: 'Artisan coffee roasting machine' },
    { src: '/images/about/about-6.webp', alt: 'Fresh coffee beans selection' },
    { src: '/images/about/about-7.webp', alt: 'Cafe service experience' },
  ];

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="about-hero-title">
        {/* Floating Coffee Beans */}
        <img src="/images/beans.webp" className="heroBean heroBean1" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean2" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean3" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean4" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean5" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean6" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean7" alt="" />

        <motion.div
          ref={heroRef}
          className={styles.heroInner}
          initial={{ opacity: 0, y: 36 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.heroEyebrow}>{t.heroEyebrow}</span>
          <h1 id="about-hero-title" className={styles.heroTitle}>
            {t.heroTitle.split('\n')[0]}<br />{t.heroTitle.split('\n')[1]}
          </h1>
          <p className={styles.heroSub}>
            {t.heroSub}
          </p>
        </motion.div>

        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 L1440,100 L1440,45 C1080,5 720,95 360,20 C180,-10 60,40 0,50 Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      {/* ── 2. Origin Story ──────────────────────────────────── */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <FadeUp className={styles.storyLayoutContainer}>
              <div className={styles.storyImageFrame}>
                <img
                  src="/images/about/about-1.webp"
                  alt="The Coffee Esto Roastery, Hakan Akdağ"
                  className={styles.storyImg}
                />
              </div>

              <div className={styles.storyAccentLine} />
              <span className={styles.eyebrow}>{t.beginningsEyebrow}</span>
              <h2 className={styles.storyHeading}>
                {t.beginningsTitle.split('\n')[0]}<br />{t.beginningsTitle.split('\n')[1]}
              </h2>
              <div className={styles.storyBody}>
                {t.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              <Link href={`${linkPrefix}/coffee`} className={styles.storyLink}>
                {t.exploreBtn}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </FadeUp>
          </div>

          {/* Photo gallery */}
          <FadeUp className={styles.gallery}>
            {gallery.map((img) => (
              <div key={img.src} className={styles.galleryItem}>
                <img src={img.src} alt={img.alt} className={styles.galleryImg} />
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── 3. Stats ─────────────────────────────────────────── */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {t.stats.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.08}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Philosophy Pillars ────────────────────────────── */}
      <section className={styles.pillars} aria-labelledby="pillars-title">
        <div className={styles.container}>
          <FadeUp className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t.philosophyEyebrow}</span>
            <h2 id="pillars-title" className={styles.sectionTitle}>{t.philosophyTitle}</h2>
          </FadeUp>

          <div className={styles.pillarsGrid}>
            {t.pillars.map((p, i) => (
              <FadeUp key={p.num} delay={i * 0.1} className={styles.pillarCard}>
                <div className={styles.pillarIcon}>{p.icon}</div>
                <span className={styles.pillarNum}>{p.num}</span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarDesc}>{p.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Roasting Process ──────────────────────────────── */}
      <section className={styles.process} aria-labelledby="process-title">
        <div className={styles.processWaveTop} aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L1440,0 L1440,50 C1080,90 720,10 360,70 C180,100 60,50 0,40 Z" fill="#ede5d0" />
          </svg>
        </div>

        <div className={styles.container}>
          <FadeUp className={styles.sectionHeaderLight}>
            <span className={styles.eyebrowLight}>{t.processEyebrow}</span>
            <h2 id="process-title" className={styles.sectionTitleLight}>{t.processTitle}</h2>
          </FadeUp>

          <div className={styles.stepsGrid}>
            {t.steps.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.09} className={styles.stepCard}>
                <div className={styles.stepTop}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <span className={styles.stepIcon}>{s.icon}</span>
                </div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Footer waveColor="#1a0e07" locale={locale} />
    </div>
  );
}
