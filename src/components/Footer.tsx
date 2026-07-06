'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

interface FooterProps {
  waveColor?: string; // Kept for backward compatibility, now safely ignored
  locale?: string;
}

export default function Footer({ waveColor: _waveColor, locale = 'tr' }: FooterProps) {
  const [inView, setInView] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(-1);

  // Determine current day of week (Sunday = 0, Monday = 1, ..., Saturday = 6)
  useEffect(() => {
    const day = new Date().getDay();
    requestAnimationFrame(() => {
      setCurrentDayIndex(day);
    });
  }, []);

  // Setup scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.01 }
    );

    const currentFooter = footerRef.current;
    if (currentFooter) {
      observer.observe(currentFooter);
    }

    return () => {
      if (currentFooter) {
        observer.unobserve(currentFooter);
      }
    };
  }, []);

  const translations = {
    en: {
      brandStatement: 'Independent specialty coffee roasters. Direct-trade micro-lots roasted with precision and care in small batches.',
      sitemap: 'Sitemap',
      hours: 'Hours',
      delivery: 'Delivery',
      statusOpen: 'Open 10 AM – 10 PM',
      deliveryDesc: 'Order freshly roasted whole beans, filter bags, and artisanal snacks straight to your doorstep.',
      orderBtn: 'Order Online',
      partnerText: 'Delivery via Yemeksepeti 🚚',
      copyright: 'Coffee Esto Roastery. Sourced ethically, roasted locally.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      wholesaleTerms: 'Wholesale Terms',
      today: '• Today',
      links: {
        home: 'Home',
        about: 'About Our Craft',
        coffee: 'Specialty Coffee',
        locations: 'Cafe Locations',
      },
      days: {
        Saturday: 'Saturday',
        Sunday: 'Sunday',
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
      },
      timeStr: '10:00 AM – 10:00 PM',
      yemeksepetiAria: 'Place an order at Coffee Esto Roastery on yemeksepeti.com',
      logoHomepageAria: 'Coffee Esto Roastery Homepage',
      mapLocationAria: 'The Coffee Esto Roastery Map Location',
    },
    tr: {
      brandStatement: 'Bağımsız nitelikli kahve kavurucuları. Doğrudan ticaretle temin edilen mikro lotlar, küçük partiler halinde hassasiyetle kavrulur.',
      sitemap: 'Site Haritası',
      hours: 'Çalışma Saatleri',
      delivery: 'Teslimat',
      statusOpen: '10:00 - 22:00 Açık',
      deliveryDesc: 'Taze kavrulmuş çekirdek kahveleri, pratik filtre demleme paketlerini ve lezzetli atıştırmalıkları kapınıza kadar sipariş edin.',
      orderBtn: 'Online Sipariş',
      partnerText: 'Yemeksepeti ile teslimat 🚚',
      copyright: 'Coffee Esto Roastery. Etik kaynaklı, yerel kavrulmuş.',
      privacyPolicy: 'Gizlilik Politikası',
      termsOfService: 'Kullanım Koşulları',
      wholesaleTerms: 'Toptan Satış Koşulları',
      today: '• Bugün',
      links: {
        home: 'Ana Sayfa',
        about: 'Hakkımızda & Sanatımız',
        coffee: 'Nitelikli Kahveler',
        locations: 'Kafelerimiz',
      },
      days: {
        Saturday: 'Cumartesi',
        Sunday: 'Pazar',
        Monday: 'Pazartesi',
        Tuesday: 'Salı',
        Wednesday: 'Çarşamba',
        Thursday: 'Perşembe',
        Friday: 'Cuma',
      },
      timeStr: '10:00 - 22:00',
      yemeksepetiAria: 'Yemeksepeti üzerinden Coffee Esto Roastery siparişi ver',
      logoHomepageAria: 'Coffee Esto Roastery Ana Sayfa',
      mapLocationAria: 'Coffee Esto Roastery Harita Konumu',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const hoursList = [
    { day: t.days.Saturday, time: t.timeStr, index: 6 },
    { day: t.days.Sunday, time: t.timeStr, index: 0 },
    { day: t.days.Monday, time: t.timeStr, index: 1 },
    { day: t.days.Tuesday, time: t.timeStr, index: 2 },
    { day: t.days.Wednesday, time: t.timeStr, index: 3 },
    { day: t.days.Thursday, time: t.timeStr, index: 4 },
    { day: t.days.Friday, time: t.timeStr, index: 5 },
  ];

  return (
    <footer 
      ref={footerRef}
      className={`${styles.footer} ${inView ? styles.inView : ''}`} 
      aria-label="Roastery footer navigation"
    >
      {/* 
        Wavy top transition (Transparent top, filled bottom).
        This renders the wave outline filled with the footer background color (#0f131a).
        The space above the wave curve is transparent, allowing whatever section is above 
        the footer to naturally bleed through! 
      */}
      <div className={styles.waveTopContainer} aria-hidden="true">
        <svg 
          viewBox="0 0 1440 200" 
          className={styles.waveSvg} 
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,90 C360,190 720,30 1080,150 C1260,210 1380,110 1440,90 L1440,200 L0,200 Z" 
            fill="#0f131a" 
          />
        </svg>
      </div>

      {/* Main Footer content container with background styling */}
      <div className={styles.footerContent}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            
            {/* Column 1: Brand & Contact Info */}
            <div className={styles.brandCol}>
              <Link href={locale === 'tr' ? '/' : '/en'} className={styles.logoGroup} style={{ textDecoration: 'none' }} aria-label={t.logoHomepageAria}>
                <span className={styles.logoTop}>COFFEE</span>
                <span className={styles.logoMiddle}>ESTO</span>
                <span className={styles.logoBottom}>ROASTERY</span>
              </Link>
              <p className={styles.brandStatement}>
                {t.brandStatement}
              </p>
              
              <div className={styles.contactList}>
                <a href="tel:+905536053183" className={styles.contactItem} aria-label="Call +90 553 605 31 83">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.contactIcon}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +90 553 605 31 83
                </a>
                <a href="https://maps.app.goo.gl/ja48oQk66ieujCGc8" target="_blank" rel="noopener noreferrer" className={styles.contactItem} aria-label="Open location in Google Maps">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.contactIcon}>
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Topselvi Mh, Kartal, İstanbul
                </a>
              </div>
              
              <div className={styles.mapContainer}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.3421114519965!2d29.227464077271424!3d40.90822602561937!2m3!1f0!2f0!3f0!3m2!1i1040!2i768!4f13.1!3m3!1m2!1s0x14cac3d76e737e61%3A0xa6212d2ff721a37c!2sThe%20Coffee%20Esto%20Roastery!5e0!3m2!1sen!2str!4v1719600000000!5m2!1sen!2str" 
                  className={styles.mapIframe}
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.mapLocationAria}
                />
              </div>
            </div>

            {/* Column 2: Sitemap */}
            <div className={styles.navCol}>
              <h3 className={styles.colTitle}>{t.sitemap}</h3>
              <ul className={styles.navLinks}>
                <li><Link href={locale === 'tr' ? '/' : '/en'} className={styles.footerLink}>{t.links.home}</Link></li>
                <li><Link href={`${linkPrefix}/about`} className={styles.footerLink}>{t.links.about}</Link></li>
                <li><Link href={`${linkPrefix}/coffee`} className={styles.footerLink}>{t.links.coffee}</Link></li>
                <li><Link href={`${linkPrefix}/location`} className={styles.footerLink}>{t.links.locations}</Link></li>
              </ul>
            </div>

            {/* Column 3: Operation Hours */}
            <div className={styles.hoursCol}>
              <div className={styles.hoursHeader}>
                <h3 className={styles.colTitle}>{t.hours}</h3>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  <span className={styles.statusText}>{t.statusOpen}</span>
                </div>
              </div>
              <div className={styles.hoursList}>
                {hoursList.map((h) => (
                  <div 
                    key={h.day} 
                    className={`${styles.hoursRow} ${currentDayIndex === h.index ? styles.hoursRowActive : ''}`}
                  >
                    <span>
                      {h.day}
                      {currentDayIndex === h.index && <span className={styles.activeTag}>{t.today}</span>}
                    </span>
                    <span className={styles.hoursTime}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Delivery Order */}
            <div className={styles.deliveryCol}>
              <h3 className={styles.colTitle}>{t.delivery}</h3>
              <p className={styles.deliveryStatement}>
                {t.deliveryDesc}
              </p>
              
              <a 
                href="https://yemeksepeti.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.orderBtn}
                aria-label={t.yemeksepetiAria}
              >
                {t.orderBtn}
              </a>
              <span className={styles.partnerText}>{t.partnerText}</span>
            </div>

          </div>

          {/* Bottom copyright details bar */}
          <div className={styles.footerBottom}>
            <p className={styles.copyText}>
              &copy; {new Date().getFullYear()} {t.copyright}
            </p>
            <div className={styles.bottomLinks}>
              <a href="#" className={styles.bottomLink}>{t.privacyPolicy}</a>
              <a href="#" className={styles.bottomLink}>{t.termsOfService}</a>
              <Link href={locale === 'tr' ? '/wholesale' : '/en/wholesale'} className={styles.bottomLink}>
                {t.wholesaleTerms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
