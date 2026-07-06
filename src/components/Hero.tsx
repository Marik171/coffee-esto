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
}

export default function Hero({ locale = 'en' }: { locale?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const translations = {
    en: {
      shopRoasts: 'Shop Our Roasts',
      trackOrder: 'Track Order',
      slides: [
        {
          id: 1,
          title: 'Freshly Roasted to Order',
          subtitle: 'Small-batch specialty coffee, sourced direct and shipped from our İstanbul roastery.',
          accent: 'Free Delivery on orders over ₺500',
          bgColor: '#1c0e07',
          imageUrl: '/images/hero_roast_order.png',
        },
        {
          id: 2,
          title: 'Sourced Direct from Farmers',
          subtitle: 'Ensuring fair pay and sustainable farming practices at every origin.',
          accent: 'Ethically traded, direct relationship coffee.',
          bgColor: '#0f1a0c',
          imageUrl: '/images/hero_direct_farmers.png',
        },
        {
          id: 3,
          title: 'Convenient Coffee Brew Bags',
          subtitle: 'Get coffee shop quality coffee on the go, no equipment needed.',
          accent: 'Just add hot water and enjoy.',
          bgColor: '#1e1309',
          imageUrl: '/images/hero_brew_bags.png',
        },
        {
          id: 4,
          title: 'Flexible Coffee Subscriptions',
          subtitle: 'Never run out of fresh coffee. Tailored to your taste and schedule.',
          accent: 'Save 10% and cancel anytime.',
          bgColor: '#1e1220',
          imageUrl: '/images/hero_subscriptions.png',
        },
        {
          id: 5,
          title: 'Premium Brewing Gear & Merch',
          subtitle: 'Everything you need to brew the perfect cup and show your love.',
          accent: 'Explore cups, grinders, and apparel.',
          bgColor: '#0d1a10',
          imageUrl: '/images/hero_brewing_gear.png',
        },
      ]
    },
    tr: {
      shopRoasts: 'Kavrumlarımızı İnceleyin',
      trackOrder: 'Sipariş Takibi',
      slides: [
        {
          id: 1,
          title: 'Sipariş Üzerine Taze Kavrulur',
          subtitle: 'Doğrudan temin edilen ve İstanbul kavurmahanemizden gönderilen küçük parti nitelikli kahveler.',
          accent: '₺500 Üzeri Siparişlerde Ücretsiz Kargo',
          bgColor: '#1c0e07',
          imageUrl: '/images/hero_roast_order.png',
        },
        {
          id: 2,
          title: 'Doğrudan Çiftçilerden Tedarik',
          subtitle: 'Her kökende adil ödeme ve sürdürülebilir tarım uygulamalarını güvence altına alıyoruz.',
          accent: 'Etik ticaret, doğrudan ilişkili kahve.',
          bgColor: '#0f1a0c',
          imageUrl: '/images/hero_direct_farmers.png',
        },
        {
          id: 3,
          title: 'Pratik Filtre Kahve Paketleri',
          subtitle: 'Ekipman gerektirmeden, hareket halindeyken kafe kalitesinde kahve deneyimi.',
          accent: 'Sadece sıcak su ekleyin ve tadını çıkarın.',
          bgColor: '#1e1309',
          imageUrl: '/images/hero_brew_bags.png',
        },
        {
          id: 4,
          title: 'Esnek Kahve Abonelikleri',
          subtitle: 'Taze kahveniz hiç bitmesin. Damak tadınıza ve takviminize göre özel.',
          accent: 'Her zaman iptal edilebilir, %10 tasarruf edin.',
          bgColor: '#1e1220',
          imageUrl: '/images/hero_subscriptions.png',
        },
        {
          id: 5,
          title: 'Seçkin Demleme Ekipmanları & Aksesuarlar',
          subtitle: 'Mükemmel bardağı demlemek ve sevginizi göstermek için ihtiyacınız olan her şey.',
          accent: 'Fincanları, değirmenleri ve giyim ürünlerini keşfedin.',
          bgColor: '#0d1a10',
          imageUrl: '/images/hero_brewing_gear.png',
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
    autoplayTimerRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextSlide]);

  // Pause autoplay on mouse hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    autoplayTimerRef.current = setInterval(nextSlide, 6000);
  };

  // Keyboard navigation on slider dots
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


      {/* Slide Wrapper for Vertical Translation */}
      <div className={styles.slidesWrapper}>
        <div 
          className={styles.slidesContainer} 
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
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
                    scale: 1.18,
                    x: -15,
                    y: -10,
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

                {/* Slide text content overlay */}
                <motion.div
                  className={styles.contentOverlay}
                  key={slide.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <p className={styles.accentText}>
                    {slide.accent}
                  </p>
                  <h1 className={styles.title}>
                    {slide.title}
                  </h1>
                  <p className={styles.subtitle}>
                    {slide.subtitle}
                  </p>
                  <div className={styles.ctaRow}>
                    <Link href={`${linkPrefix}/coffee`} className={styles.ctaBtn}>
                      {t.shopRoasts}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                    {slide.id === 1 ? (
                      <Link href={`${linkPrefix}/quiz`} className={styles.ctaSecondary} style={{ borderColor: 'var(--color-orange)', color: 'var(--color-orange)' }}>
                        {locale === 'tr' ? 'Kavrum Testi' : 'Find Your Roast'}
                      </Link>
                    ) : (
                      <Link href={`${linkPrefix}/orders/track`} className={styles.ctaSecondary}>
                        {t.trackOrder}
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wavy bottom pattern transition */}
      <div className={styles.waveContainer} aria-hidden="true">
        <svg 
          viewBox="0 0 1440 200" 
          className={styles.waveSvg} 
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 C360,220 720,20 1080,160 C1260,230 1380,120 1440,90 L1440,200 L0,200 Z"
            fill="#fdf8f0"
          />
        </svg>
      </div>

      {/* Vertical slider dots navigation (Right side) */}
      <div 
        className={styles.dotsContainer} 
        role="tablist" 
        aria-label="Carousel slide controls"
        onKeyDown={handleKeyDown}
      >
        {slidesList.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`slide-${slide.id}`}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

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
