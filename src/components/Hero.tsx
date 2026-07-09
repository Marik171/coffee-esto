'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

// Slide Interface
interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  accent: string;
  bgColor: string;
  imageUrl: string;
  btnText: string;
  btnLink: string;
}

export default function Hero({ locale = 'en' }: { locale?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAutoplayPlaying, setIsAutoplayPlaying] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const translations = {
    en: {
      slides: [
        {
          id: 1,
          title: "We'll Get Started for You",
          subtitle: 'Pick Up at Your Local Coffee Esto',
          accent: 'ORDER AHEAD',
          bgColor: '#1c0e07',
          imageUrl: '/latte_art_cup.png',
          btnText: 'SELECT A LOCATION',
          btnLink: '/location',
        },
        {
          id: 2,
          title: 'Freshly Roasted to Order',
          subtitle: 'Small-batch specialty coffee, sourced direct and shipped from our İstanbul roastery.',
          accent: 'FRESH ROAST',
          bgColor: '#1c0e07',
          imageUrl: '/images/hero_roast_order.png',
          btnText: 'SHOP OUR ROASTS',
          btnLink: '/coffee',
        },
        {
          id: 3,
          title: 'Sourced Direct from Farmers',
          subtitle: 'Ensuring fair pay and sustainable farming practices at every origin.',
          accent: 'DIRECT TRADE',
          bgColor: '#0f1a0c',
          imageUrl: '/images/hero_direct_farmers.png',
          btnText: 'OUR RELATIONSHIPS',
          btnLink: '/about',
        },
        {
          id: 4,
          title: 'Flexible Coffee Subscriptions',
          subtitle: 'Never run out of fresh coffee. Tailored to your taste and schedule.',
          accent: 'SUBSCRIPTIONS',
          bgColor: '#1e1220',
          imageUrl: '/images/hero_subscriptions.png',
          btnText: 'START A SUBSCRIPTION',
          btnLink: '/coffee?category=single-origin',
        },
        {
          id: 5,
          title: 'Find Your Perfect Roast',
          subtitle: 'Take our coffee flavor test and match with your ideal roast profile.',
          accent: 'COFFEE QUIZ',
          bgColor: '#0d1a10',
          imageUrl: '/images/hero_brewing_gear.png',
          btnText: 'START COFFEE QUIZ',
          btnLink: '/quiz',
        },
      ]
    },
    tr: {
      slides: [
        {
          id: 1,
          title: 'Sizin İçin Hazırlamaya Başlayalım',
          subtitle: 'Size En Yakın Coffee Esto Şubesinden Teslim Alın',
          accent: 'ÖNCEDEN SİPARİŞ ET',
          bgColor: '#1c0e07',
          imageUrl: '/latte_art_cup.png',
          btnText: 'BİR ŞUBE SEÇİN',
          btnLink: '/location',
        },
        {
          id: 2,
          title: 'Sipariş Üzerine Taze Kavrulur',
          subtitle: 'Doğrudan temin edilen ve İstanbul kavurmahanemizden gönderilen küçük parti nitelikli kahveler.',
          accent: 'TAZE KAVRUM',
          bgColor: '#1c0e07',
          imageUrl: '/images/hero_roast_order.png',
          btnText: 'KAVRUMLARIMIZI İNCELEYİN',
          btnLink: '/coffee',
        },
        {
          id: 3,
          title: 'Doğrudan Çiftçilerden Tedarik',
          subtitle: 'Her kökende adil ödeme ve sürdürülebilir tarım uygulamalarını güvence altına alıyoruz.',
          accent: 'DOĞRUDAN TİCARET',
          bgColor: '#0f1a0c',
          imageUrl: '/images/hero_direct_farmers.png',
          btnText: 'İLİŞKİLERİMİZİ KEŞFEDİN',
          btnLink: '/about',
        },
        {
          id: 4,
          title: 'Esnek Kahve Abonelikleri',
          subtitle: 'Taze kahveniz hiç bitmesin. Damak tadınıza ve takviminize göre özel.',
          accent: 'ABONELİK',
          bgColor: '#1e1220',
          imageUrl: '/images/hero_subscriptions.png',
          btnText: 'ABONELİK BAŞLATIN',
          btnLink: '/coffee?category=single-origin',
        },
        {
          id: 5,
          title: 'Mükemmel Kavrumu Keşfedin',
          subtitle: 'Kahve kavrum testimizi çözün ve damak tadınıza uygun çekirdeği bulun.',
          accent: 'KAVRUM TESTİ',
          bgColor: '#0d1a10',
          imageUrl: '/images/hero_brewing_gear.png',
          btnText: 'TESTİ ÇÖZMEYE BAŞLAYIN',
          btnLink: '/quiz',
        },
      ]
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';
  const slidesList = t.slides;

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slidesList.length);
  }, [slidesList.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slidesList.length) % slidesList.length);
  }, [slidesList.length]);

  // Set up autoplay
  useEffect(() => {
    if (isAutoplayPlaying) {
      autoplayTimerRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextSlide, isAutoplayPlaying]);

  // Pause autoplay on mouse hover
  const handleMouseEnter = () => {
    if (isAutoplayPlaying && autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isAutoplayPlaying) {
      autoplayTimerRef.current = setInterval(nextSlide, 6000);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  };

  // Scroll visibility for back-to-top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  return (
    <section 
      id="hero-section"
      className={styles.heroContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={sliderRef}
      aria-label="Coffee Esto Roastery Hero Carousel"
    >
      {/* Slide Wrapper for Horizontal Translation */}
      <div className={styles.slidesWrapper}>
        <div 
          className={styles.slidesContainer} 
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slidesList.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div 
                key={slide.id} 
                className={styles.slide} 
                style={{ backgroundColor: slide.bgColor }}
                aria-hidden={!isActive}
              >
                {/* Cinematic Ken Burns Zoom & Panning Background Image */}
                <motion.img 
                  src={slide.imageUrl} 
                  alt="" 
                  className={styles.backgroundImage} 
                  initial={{ scale: 1, x: 0, y: 0 }}
                  animate={isActive ? {
                    scale: 1.12,
                    x: -8,
                    y: -5,
                  } : {
                    scale: 1,
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    duration: 6.5,
                    ease: 'easeOut',
                  }}
                />
                {/* Dark overlay gradient for contrast readability */}
                <div className={styles.overlay} />

                {/* Slide text content overlay (aligned left) with staggered entrance */}
                <div className={styles.contentOverlay}>
                  <motion.p 
                    className={styles.accentText}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  >
                    {slide.accent}
                  </motion.p>
                  <motion.h1 
                    className={styles.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    className={styles.subtitle}
                    initial={{ opacity: 0, x: -25 }}
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div 
                    className={styles.ctaRow}
                    initial={{ opacity: 0, y: 15 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                  >
                    <Link href={`${linkPrefix}${slide.btnLink}`} className={styles.ctaBtn}>
                      {slide.btnText}
                    </Link>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Left/Right Arrow Navigation Controls */}
      <button 
        className={styles.arrowBtnLeft} 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button 
        className={styles.arrowBtnRight} 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Play/Pause Autoplay Control Button */}
      <button 
        className={styles.playPauseBtn} 
        onClick={() => setIsAutoplayPlaying(!isAutoplayPlaying)}
        aria-label={isAutoplayPlaying ? "Pause carousel" : "Play carousel"}
      >
        {isAutoplayPlaying ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <rect x="6" y="4" width="3" height="16" />
            <rect x="15" y="4" width="3" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <polygon points="6 3 20 12 6 21" />
          </svg>
        )}
      </button>

      {/* Floating Back to Top Button */}
      <button 
        className={`${styles.scrollTopBtn} ${showScrollTop ? styles.scrollTopVisible : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </section>
  );
}
