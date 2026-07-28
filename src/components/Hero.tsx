'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero({ locale = 'en' }: { locale?: string }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const translations = {
    en: {
      accent: 'THE COFFEE ESTO ROASTERY',
      title: "The Spirit of Coffee Craft",
      subtitle: "Discover masterfully roasted single-origin coffees and signature blends, curated by the queen of Coffee Esto.",
      btnText: 'SHOP OUR ROASTS',
      btnLink: '/coffee',
    },
    tr: {
      accent: 'THE COFFEE ESTO ROASTERY',
      title: "Kahve Zanaatinin Ruhu",
      subtitle: "Coffee Esto'nun kraliçesi tarafından kürate edilen, ustalıkla kavrulmuş tek köken kahveleri ve imza harmanları keşfedin.",
      btnText: 'KAVRUMLARIMIZI İNCELEYİN',
      btnLink: '/coffee',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  // Handle video playback and unmuting (with user interaction fallback for browser policies)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set volume to be not too loud (25% volume)
    video.volume = 0.25;

    let cleanupListeners: (() => void) | null = null;

    // Try playing unmuted
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked unmuted autoplay. Fallback to playing muted.
        video.muted = true;
        video.play();

        // Unmute on the first user interaction anywhere on the document
        const unmuteOnInteraction = () => {
          video.muted = false;
          video.volume = 0.25;
        };

        window.addEventListener('click', unmuteOnInteraction, { once: true });
        window.addEventListener('keydown', unmuteOnInteraction, { once: true });

        cleanupListeners = () => {
          window.removeEventListener('click', unmuteOnInteraction);
          window.removeEventListener('keydown', unmuteOnInteraction);
        };
      });
    }

    return () => {
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []);

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
      aria-label="Coffee Esto Roastery Hero Section"
    >
      {/* Looping background video */}
      <video 
        ref={videoRef}
        src="/videos/hero_queen_ambassador.mp4"
        autoPlay
        loop
        playsInline
        className={styles.backgroundVideo}
      />
      
      {/* Dark overlay gradient for contrast readability */}
      <div className={styles.overlay} />

      {/* Hero content overlay */}
      <div className={styles.contentOverlay}>
        <motion.p 
          className={styles.accentText}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {t.accent}
        </motion.p>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {t.title}
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          {t.subtitle}
        </motion.p>
        <motion.div 
          className={styles.ctaRow}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <Link href={`${linkPrefix}${t.btnLink}`} className={styles.ctaBtn}>
            {t.btnText}
          </Link>
        </motion.div>
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
