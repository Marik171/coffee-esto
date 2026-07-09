'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

interface FooterProps {
  waveColor?: string; // safely ignored
  locale?: string;
}

export default function Footer({ locale = 'en' }: FooterProps) {
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
      today: 'Today',
      everyDay: 'EVERY DAY',
      links: {
        home: 'Home',
        about: 'About Our Craft',
        coffee: 'Specialty Coffee',
        locations: 'Cafe Locations',
        contact: 'Contact Us',
      },
      days: {
        Sunday: 'Sunday',
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
      },
      timeStr: '10:00 AM – 10:00 PM',
      yemeksepetiAria: 'Place an order at Coffee Esto Roastery on yemeksepeti.com',
      logoHomepageAria: 'Coffee Esto Roastery Homepage',
      mapLocationAria: 'The Coffee Esto Roastery Map Location',
    },
    tr: {
      brandStatement: 'Bağımsız nitelikli kavurucular. Doğrudan ticaretle temin edilen mikro lotlar, küçük partiler halinde hassasiyetle kavrulur.',
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
      today: 'Bugün',
      everyDay: 'HER GÜN',
      links: {
        home: 'Ana Sayfa',
        about: 'Hakkımızda & Sanatımız',
        coffee: 'Nitelikli Kahveler',
        locations: 'Kafelerimiz',
        contact: 'İletişim',
      },
      days: {
        Sunday: 'Pazar',
        Monday: 'Pazartesi',
        Tuesday: 'Salı',
        Wednesday: 'Çarşamba',
        Thursday: 'Perşembe',
        Friday: 'Cuma',
        Saturday: 'Cumartesi',
      },
      timeStr: '10:00 - 22:00',
      yemeksepetiAria: 'Yemeksepeti üzerinden Coffee Esto Roastery siparişi ver',
      logoHomepageAria: 'Coffee Esto Roastery Ana Sayfa',
      mapLocationAria: 'Coffee Esto Roastery Harita Konumu',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const enDays = [
    { label: 'S', name: t.days.Sunday, index: 0 },
    { label: 'M', name: t.days.Monday, index: 1 },
    { label: 'T', name: t.days.Tuesday, index: 2 },
    { label: 'W', name: t.days.Wednesday, index: 3 },
    { label: 'T', name: t.days.Thursday, index: 4 },
    { label: 'F', name: t.days.Friday, index: 5 },
    { label: 'S', name: t.days.Saturday, index: 6 },
  ];
  
  const trDays = [
    { label: 'P', name: t.days.Sunday, index: 0 },
    { label: 'P', name: t.days.Monday, index: 1 },
    { label: 'S', name: t.days.Tuesday, index: 2 },
    { label: 'Ç', name: t.days.Wednesday, index: 3 },
    { label: 'P', name: t.days.Thursday, index: 4 },
    { label: 'C', name: t.days.Friday, index: 5 },
    { label: 'C', name: t.days.Saturday, index: 6 },
  ];

  const daysList = locale === 'tr' ? trDays : enDays;

  return (
    <footer 
      ref={footerRef}
      className={`${styles.footer} ${inView ? styles.inView : ''}`} 
      aria-label="Roastery footer navigation"
    >
      <div className={styles.footerInner}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            
            {/* Column 1: Brand & Contact Info */}
            <div className={styles.brandCol}>
              <Link href={locale === 'tr' ? '/' : '/en'} className={styles.logoGroup} aria-label={t.logoHomepageAria}>
                <span className={styles.logoTitle}>COFFEE ESTO</span>
                <span className={styles.logoSubtitle}>ROASTERY</span>
              </Link>
              <p className={styles.brandStatement}>
                {t.brandStatement}
              </p>
              
              <div className={styles.contactList}>
                <a href="tel:+905536053183" className={styles.contactItem} aria-label="Call +90 553 605 31 83">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.contactIcon}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +90 553 605 31 83
                </a>
                <a href="https://maps.app.goo.gl/ja48oQk66ieujCGc8" target="_blank" rel="noopener noreferrer" className={styles.contactItem} aria-label="Open location in Google Maps">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.contactIcon}>
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Topselvi Mh, Kartal, İstanbul
                </a>
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
                <li><Link href={`${linkPrefix}/contact`} className={styles.footerLink}>{t.links.contact}</Link></li>
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
              <div className={styles.hoursBox}>
                <span className={styles.hoursLabel}>{t.everyDay}</span>
                <span className={styles.hoursTimeLarge}>{t.timeStr}</span>
                
                <div className={styles.daysRow}>
                  {daysList.map((d, index) => {
                    const isActive = currentDayIndex === d.index;
                    return (
                      <div 
                        key={index} 
                        className={`${styles.dayCircle} ${isActive ? styles.dayCircleActive : ''}`}
                        title={`${d.name}: ${t.timeStr}`}
                      >
                        {d.label}
                      </div>
                    );
                  })}
                </div>
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

        {/* Giant Professional Watermark in background */}
        <div className={styles.watermark} aria-hidden="true">
          COFFEE ESTO
        </div>
      </div>
    </footer>
  );
}
