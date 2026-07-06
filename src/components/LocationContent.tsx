'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../app/location/location.module.css';

/* ── Inline SVG icons ───────────────────────────────────────── */
const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconTrain = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="16" height="16" x="4" y="3" rx="2"/>
    <path d="M4 11h16"/><path d="M12 3v8"/>
    <path d="m8 19-2 3"/><path d="m18 22-2-3"/>
    <path d="M8 15h.01"/><path d="M16 15h.01"/>
  </svg>
);

const IconBus = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6v6"/><path d="M15 6v6"/>
    <path d="M2 12h19.6"/>
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
    <circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>
  </svg>
);

const IconAnchor = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" y1="22" x2="12" y2="8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
);

const IconParking = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2"/>
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
  </svg>
);

/* ── Reusable FadeUp ─────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-64px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

interface LocationContentProps {
  locale?: string;
}

export default function LocationContent({ locale = 'en' }: LocationContentProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [currentDay, setCurrentDay] = useState(-1);

  useEffect(() => {
    const day = new Date().getDay();
    requestAnimationFrame(() => {
      setCurrentDay(day);
    });
  }, []);

  const translations = {
    en: {
      eyebrow: 'Kartal · İstanbul',
      heroTitle: 'Come Visit\nOur Roastery',
      heroSub: 'We roast every batch to order from our İstanbul roastery. Come by, smell the roast, and take home something fresh.',
      directionsBtn: 'Get Directions',
      findUs: 'Find Us',
      addressLabel: 'Address',
      addressValue: 'Topselvi Mh, Kartal\nİstanbul, Turkey',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      hoursLabel: 'Hours',
      hoursValue: 'Daily, 10:00 AM – 10:00 PM',
      mapsLinkText: 'Open in Google Maps',
      mapsTitle: 'The Coffee Esto Roastery on Google Maps',
      openingTimes: 'Opening Times',
      whenOpen: "When We're Open",
      walkinsWelcome: 'We roast fresh every morning. Walk-ins always welcome — no reservation needed.',
      today: 'Today',
      gettingHere: 'Getting Here',
      howToFindUs: 'How to Find Us',
      whileHere: "While You're Here",
      whileHereSub: 'Pick up a fresh bag, try a pour-over at the bar, or talk to our roaster — John is almost always around.',
      browseBtn: 'Browse Our Coffees',
      trackBtn: 'Track an Order',
      days: {
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
        Sunday: 'Sunday',
      },
      timeStr: '10:00 AM – 10:00 PM',
      transport: [
        { icon: <IconTrain />, name: 'Metro / Marmaray', detail: 'Kartal station — M4 line & Marmaray, 5 min walk' },
        { icon: <IconBus />,   name: 'Bus', detail: 'Lines 15B, 14Ç, E11 — stop at Kartal Meydanı' },
        { icon: <IconAnchor />,name: 'Ferry', detail: 'Kartal ferry pier — İDO to Adalar & Bostancı, 10 min walk' },
        { icon: <IconParking />,name: 'Parking', detail: 'Street parking on Topselvi Caddesi, paid municipal lot nearby' },
      ]
    },
    tr: {
      eyebrow: 'Kartal · İstanbul',
      heroTitle: 'Kavurmahanemizi\nZiyaret Edin',
      heroSub: 'Her partiyi İstanbul\'daki kavurmahanemizde sipariş üzerine kavuruyoruz. Uğrayın, taze kavrum kahve kokusunu içinize çekin ve evinize taze bir şeyler götürün.',
      directionsBtn: 'Yol Tarifi Al',
      findUs: 'Bizi Bulun',
      addressLabel: 'Adres',
      addressValue: 'Topselvi Mh, Kartal\nİstanbul, Türkiye',
      phoneLabel: 'Telefon',
      emailLabel: 'E-posta',
      hoursLabel: 'Saatler',
      hoursValue: 'Her Gün, 10:00 – 22:00',
      mapsLinkText: 'Google Haritalar\'da Aç',
      mapsTitle: 'Google Haritalar\'da Coffee Esto Roastery',
      openingTimes: 'Açılış Saatleri',
      whenOpen: 'Açık Olduğumuz Saatler',
      walkinsWelcome: 'Her sabah taze kahve kavuruyoruz. Randevusuz misafirlerimizi her zaman bekleriz.',
      today: 'Bugün',
      gettingHere: 'Ulaşım',
      howToFindUs: 'Bize Nasıl Ulaşırsınız',
      whileHere: 'Buradayken',
      whileHereSub: 'Taze bir paket kahve alın, barda bir V60 demleme deneyin veya kavurucumuzla sohbet edin — John neredeyse her zaman buralardadır.',
      browseBtn: 'Kahvelerimizi İnceleyin',
      trackBtn: 'Sipariş Takibi',
      days: {
        Monday: 'Pazartesi',
        Tuesday: 'Salı',
        Wednesday: 'Çarşamba',
        Thursday: 'Perşembe',
        Friday: 'Cuma',
        Saturday: 'Cumartesi',
        Sunday: 'Pazar',
      },
      timeStr: '10:00 – 22:00',
      transport: [
        { icon: <IconTrain />, name: 'Metro / Marmaray', detail: 'Kartal istasyonu — M4 metro hattı & Marmaray, 5 dk yürüme mesafesinde' },
        { icon: <IconBus />,   name: 'Otobüs', detail: '15B, 14Ç, E11 hatları — Kartal Meydanı durağında iniş' },
        { icon: <IconAnchor />,name: 'Vapur / Deniz Otobüsü', detail: 'Kartal vapur iskelesi — Adalar & Bostancı İDO iskelesi, 10 dk yürüme mesafesinde' },
        { icon: <IconParking />,name: 'Otopark', detail: 'Topselvi Caddesi üzerinde yol kenarı otopark, yakınlarda İSPARK otoparkı mevcuttur' },
      ]
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const hours = [
    { day: t.days.Monday,    time: t.timeStr, index: 1 },
    { day: t.days.Tuesday,   time: t.timeStr, index: 2 },
    { day: t.days.Wednesday, time: t.timeStr, index: 3 },
    { day: t.days.Thursday,  time: t.timeStr, index: 4 },
    { day: t.days.Friday,    time: t.timeStr, index: 5 },
    { day: t.days.Saturday,  time: t.timeStr, index: 6 },
    { day: t.days.Sunday,    time: t.timeStr, index: 0 },
  ];

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="location-hero-title">
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
          <span className={styles.heroEyebrow}>{t.eyebrow}</span>
          <h1 id="location-hero-title" className={styles.heroTitle}>
            {t.heroTitle.split('\n')[0]}<br />{t.heroTitle.split('\n')[1]}
          </h1>
          <p className={styles.heroSub}>
            {t.heroSub}
          </p>
          <a
            href="https://maps.app.goo.gl/ja48oQk66ieujCGc8"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroDirectionsBtn}
          >
            <IconPin />
            {t.directionsBtn}
          </a>
        </motion.div>

        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 L1440,100 L1440,45 C1080,5 720,95 360,20 C180,-10 60,40 0,50 Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      {/* ── Map + Contact ─────────────────────────────────────── */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapGrid}>
            {/* Map */}
            <FadeUp className={styles.mapCol}>
              <div className={styles.mapFrame}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.781920088112!2d29.211596076140864!3d40.89859842617103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac55245d4a5c3%3A0x23927209a8c7020a!2sThe%20Coffee%20Esto%20Roastery!5e0!3m2!1sen!2s!4v1783143101076!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={t.mapsTitle}
                  className={styles.mapIframe}
                />
              </div>
            </FadeUp>

            {/* Contact info */}
            <FadeUp delay={0.12} className={styles.infoCol}>
              <div className={styles.infoCard}>
                <div className={styles.infoAccentLine} />
                <span className={styles.eyebrow}>{t.findUs}</span>
                <h2 className={styles.infoHeading}>The Coffee Esto Roastery</h2>

                <div className={styles.contactList}>
                  <a
                    href="https://maps.app.goo.gl/ja48oQk66ieujCGc8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactRow}
                  >
                    <span className={styles.contactIcon}><IconPin /></span>
                    <span>
                      <span className={styles.contactLabel}>{t.addressLabel}</span>
                      <span className={styles.contactValue}>
                        {t.addressValue.split('\n')[0]}<br />{t.addressValue.split('\n')[1]}
                      </span>
                    </span>
                  </a>

                  <a href="tel:+905536053183" className={styles.contactRow}>
                    <span className={styles.contactIcon}><IconPhone /></span>
                    <span>
                      <span className={styles.contactLabel}>{t.phoneLabel}</span>
                      <span className={styles.contactValue}>+90 553 605 31 83</span>
                    </span>
                  </a>

                  <a href="mailto:hello@coffeesto.com" className={styles.contactRow}>
                    <span className={styles.contactIcon}><IconMail /></span>
                    <span>
                      <span className={styles.contactLabel}>{t.emailLabel}</span>
                      <span className={styles.contactValue}>hello@coffeesto.com</span>
                    </span>
                  </a>

                  <div className={styles.contactRow}>
                    <span className={styles.contactIcon}><IconClock /></span>
                    <span>
                      <span className={styles.contactLabel}>{t.hoursLabel}</span>
                      <span className={styles.contactValue}>{t.hoursValue}</span>
                    </span>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/ja48oQk66ieujCGc8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  {t.mapsLinkText}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Hours ─────────────────────────────────────────────── */}
      <section className={styles.hoursSection} aria-labelledby="hours-title">
        <div className={styles.container}>
          <FadeUp className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t.openingTimes}</span>
            <h2 id="hours-title" className={styles.sectionTitle}>{t.whenOpen}</h2>
            <p className={styles.sectionSub}>{t.walkinsWelcome}</p>
          </FadeUp>

          <FadeUp delay={0.1} className={styles.hoursTable}>
            {hours.map((h) => {
              const isToday = h.index === currentDay;
              return (
                <div key={h.day} className={`${styles.hoursRow} ${isToday ? styles.hoursRowToday : ''}`}>
                  <div className={styles.hoursDay}>
                    {h.day}
                    {isToday && <span className={styles.todayBadge}>{t.today}</span>}
                  </div>
                  <div className={styles.hoursDivider} />
                  <div className={styles.hoursTime}>{h.time}</div>
                </div>
              );
            })}
          </FadeUp>
        </div>
      </section>

      {/* ── Getting Here ──────────────────────────────────────── */}
      <section className={styles.transport} aria-labelledby="transport-title">
        <div className={styles.transportWaveTop} aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L1440,0 L1440,50 C1080,90 720,10 360,70 C180,100 60,50 0,40 Z" fill="#fdf8f0" />
          </svg>
        </div>

        <div className={styles.container}>
          <FadeUp className={styles.sectionHeaderLight}>
            <span className={styles.eyebrowLight}>{t.gettingHere}</span>
            <h2 id="transport-title" className={styles.sectionTitleLight}>{t.howToFindUs}</h2>
          </FadeUp>

          <div className={styles.transportGrid}>
            {t.transport.map((tItem, i) => (
              <FadeUp key={tItem.name} delay={i * 0.08} className={styles.transportCard}>
                <span className={styles.transportIcon}>{tItem.icon}</span>
                <h3 className={styles.transportName}>{tItem.name}</h3>
                <p className={styles.transportDetail}>{tItem.detail}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <FadeUp className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>{t.whileHere}</h2>
            <p className={styles.ctaSub}>{t.whileHereSub}</p>
            <div className={styles.ctaButtons}>
              <Link href={`${linkPrefix}/coffee`} className={styles.ctaPrimary}>{t.browseBtn}</Link>
              <Link href={`${linkPrefix}/orders/track`} className={styles.ctaSecondary}>{t.trackBtn}</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer waveColor="#1a0e07" locale={locale} />
    </div>
  );
}
