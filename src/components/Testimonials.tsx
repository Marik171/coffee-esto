'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.css';

interface TestimonialData {
  id: number;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export default function Testimonials({ locale = 'en' }: { locale?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const translations = {
    en: {
      ariaLabel: 'Customer Reviews',
      badge: 'TESTIMONIALS',
      title: 'Loved By Coffee Lovers',
      testimonials: [
        {
          id: 1,
          quote: "A newly opened spot that I visited upon recommendation. When it comes to coffee, all kinds of knowledge, taste, and experience make themselves known from A-Z. A place where you can see the process transparently from production to cup 👍 The place that will make you fall in love with coffee in my opinion 👏",
          author: "Kaan Y.",
          role: "Local Guide",
          rating: 5
        },
        {
          id: 2,
          quote: "The place is very sweet, there is a machine inside that looks like a locomotive. The coffees are very good in taste and the prices are very affordable.",
          author: "Ebubekir Demir",
          role: "Local Guide",
          rating: 5
        },
        {
          id: 3,
          quote: "A wonderful place with fresh coffees. A magnificent place that gives peace to people, satisfies the palate with its coffee, and offers another world with the atmosphere of the place. I highly recommend it to everyone.",
          author: "Ali Hasan Akdağ",
          role: "Local Guide",
          rating: 5
        },
        {
          id: 4,
          quote: "Their coffees were very delicious and good, and Mr. Bekir was very polite and kind.",
          author: "Eda Moğulkanlı",
          role: "Coffee Lover",
          rating: 5
        }
      ]
    },
    tr: {
      ariaLabel: 'Müşteri Değerlendirmeleri',
      badge: 'MÜŞTERİ YORUMLARI',
      title: 'Kahveseverlerin Favorisi',
      testimonials: [
        {
          id: 1,
          quote: "YENİ AÇILMIŞ VE TAVSİYE ÜZERİNE GİTTİĞİM KAHVE DEDİĞİNDE A-Z YE HER TÜRLÜ BİLGİ, LEZZET VE TECRÜBE KENDİNİ BELLİ EDİYOR ÜRETİMDEN FİNCANA ŞEFFAF OLARAK GÖRE BİLDİĞİNİZ BİR MEKAN 👍 KAHVEYİ BENİMSEYECEĞİNİZ NOKTA BENCE 👏",
          author: "Kaan Y.",
          role: "Yerel Rehber",
          rating: 5
        },
        {
          id: 2,
          quote: "Mekan çok tatli icerde bi makina var lokomotife benziyor. Kahveler tat olarak çok iyi fiyatlarda çok uygun.",
          author: "Ebubekir Demir",
          role: "Yerel Rehber",
          rating: 5
        },
        {
          id: 3,
          quote: "Kahveleri taze harika bir mekan insana huzur veren muhteşem bir yer kahvesiyle damaklari doyuran mekanın atmosferiyle başka bir dünya yaşatan bir yer olmuş herkese tavsiye ederim.",
          author: "Ali Hasan Akdağ",
          role: "Yerel Rehber",
          rating: 5
        },
        {
          id: 4,
          quote: "Kahveleri çok lezzetli iyidi ve bekir bey çok kibar ve nazikti.",
          author: "Eda Moğulkanlı",
          role: "Kahve Sever",
          rating: 5
        }
      ]
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const testimonials = t.testimonials;

  // Carousel transition handlers
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Scroll Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
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

  // Autoplay functionality
  useEffect(() => {
    autoplayTimerRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextSlide]);

  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    autoplayTimerRef.current = setInterval(nextSlide, 6000);
  };

  // Keyboard navigation on dots
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  };

  // Coffee Bean Rating helper
  const renderCoffeeBeans = (rating: number) => {
    return Array.from({ length: rating }).map((_, idx) => (
      <svg
        key={idx}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="#c9963a"
        className={styles.coffeeBeanStar}
        aria-hidden="true"
      >
        {/* Roasted Bean Outer Body */}
        <ellipse cx="12" cy="12" rx="10" ry="6.5" transform="rotate(-28 12 12)" />
        {/* Organic Crease Wave Line */}
        <path
          d="M4.5,14 C7.5,13.5 9,10.5 12,12 C15,13.5 16.5,10.5 19.5,10"
          stroke="#1c120c"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ));
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.inView : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      aria-label={t.ariaLabel}
    >
      {/* Wavy top transition (Overlay from previous slate-blue section #3d4b5c) */}
      <div className={styles.waveTopContainer} aria-hidden="true">
        <svg
          viewBox="0 0 1440 180"
          className={styles.waveSvg}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 L1440,0 L1440,80 C1080,180 720,20 360,160 C180,230 60,110 0,90 Z"
            fill="#3d4b5c"
          />
        </svg>
      </div>



      {/* Real Scattered Coffee Beans */}
      <img src="/images/beans.webp" className={`${styles.testimonialBean} ${styles.testimonialBean1}`} alt="" aria-hidden="true" />
      <img src="/images/beans.webp" className={`${styles.testimonialBean} ${styles.testimonialBean2}`} alt="" aria-hidden="true" />
      <img src="/images/beans.webp" className={`${styles.testimonialBean} ${styles.testimonialBean3}`} alt="" aria-hidden="true" />
      <img src="/images/beans.webp" className={`${styles.testimonialBean} ${styles.testimonialBean4}`} alt="" aria-hidden="true" />

      <div className={styles.container}>
        {/* Typographic Title Block */}
        <div className={styles.titleBlock}>
          <span className={styles.badge}>{t.badge}</span>
          <h2 className={styles.title}>{t.title}</h2>
          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerBean}>☕</span>
            <span className={styles.dividerLine}></span>
          </div>
        </div>

        {/* Coffee-Themed Testimonial Card */}
        <div className={styles.card}>

          {/* Circular Roastery Stamp Seal */}
          <div className={styles.sealStamp} aria-hidden="true">
            <svg viewBox="0 0 100 100" width="90" height="90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#c9963a" strokeWidth="1.2" strokeDasharray="3 2" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#c9963a" strokeWidth="0.8" />
              <path id="sealCurve" d="M16,50 A34,34 0 1,1 84,50" fill="none" />
              <text fontSize="6.5" fontWeight="800" fill="#c9963a" letterSpacing="0.8">
                <textPath href="#sealCurve" startOffset="50%" textAnchor="middle">
                  COFFEE ESTO ROASTERY
                </textPath>
              </text>
              <text x="50" y="54" fontSize="7" fontWeight="bold" fill="#ff3601" textAnchor="middle" letterSpacing="0.5">
                EST. 2018
              </text>
              <path d="M45,68 L50,62 L55,68 L53,74 L47,74 Z" fill="#c9963a" opacity="0.75" />
            </svg>
          </div>

          {/* Steaming Coffee Mug (Real steam vapor + 3D Shaded Ceramic SVG cup) */}
          <div className={styles.mugSteamingContainer} aria-hidden="true">
            <svg viewBox="0 0 120 200" className={styles.combinedMugSvg} preserveAspectRatio="none">
              <defs>
                {/* Ceramic cup body shading */}
                <linearGradient id="cupBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e8ded0" />
                  <stop offset="15%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="85%" stopColor="#eae1d4" />
                  <stop offset="100%" stopColor="#bfae99" />
                </linearGradient>

                {/* Handle shading */}
                <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#c5b7a5" />
                </linearGradient>

                {/* Coffee liquid radial gradient (Espresso crema) */}
                <radialGradient id="coffeeLiquidGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dfbe6b" /> {/* light crema center */}
                  <stop offset="35%" stopColor="#aa713b" /> {/* warm ring */}
                  <stop offset="80%" stopColor="#4a2511" /> {/* dark espresso */}
                  <stop offset="100%" stopColor="#210e05" />
                </radialGradient>

                {/* Saucer 3D shadow */}
                <radialGradient id="saucerShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(28, 14, 7, 0.45)" />
                  <stop offset="100%" stopColor="rgba(28, 14, 7, 0)" />
                </radialGradient>

                {/* Saucer surface gradient */}
                <linearGradient id="saucerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#eee6da" />
                  <stop offset="100%" stopColor="#c7b8a3" />
                </linearGradient>
              </defs>

              {/* Rising Steam Lines */}
              <g className={styles.steamLines}>
                <path d="M53,132 C47,100 57,70 53,40 C47,10 57,-20 53,-50" className={styles.steamLine1} />
                <path d="M60,132 C65,100 55,70 60,40 C65,10 55,-20 60,-50" className={styles.steamLine2} />
                <path d="M67,132 C61,100 71,70 67,40 C61,10 71,-20 67,-50" className={styles.steamLine3} />
              </g>

              {/* Saucer Shadow & Plate */}
              <ellipse cx="60" cy="183" rx="44" ry="7.5" fill="url(#saucerShadow)" />
              <ellipse cx="60" cy="179" rx="40" ry="8" fill="url(#saucerGrad)" stroke="#eee6da" strokeWidth="0.5" />
              <ellipse cx="60" cy="177" rx="33" ry="5" fill="#fdfaf6" stroke="#eae1d4" strokeWidth="0.5" />

              {/* Handle */}
              <path d="M84,142 C94,142 98,148 98,154 C98,160 94,165 84,165" fill="none" stroke="url(#handleGrad)" strokeWidth="4.5" strokeLinecap="round" />

              {/* Cup Body */}
              <path d="M28,135 C28,135 30,172 60,172 C90,172 92,135 92,135 Z" fill="url(#cupBodyGrad)" stroke="#eae1d4" strokeWidth="0.75" strokeLinejoin="round" />

              {/* Cup inner rim and coffee fill */}
              <ellipse cx="60" cy="135" rx="32" ry="8" fill="#ffffff" />
              <ellipse cx="60" cy="135.8" rx="29.5" ry="6.5" fill="url(#coffeeLiquidGrad)" />

              {/* Glossy ceramic glare overlay */}
              <path d="M32,138 C32,138 34,166 60,166 C57,166 36,163 34,138 Z" fill="#ffffff" opacity="0.22" />
            </svg>
          </div>

          {/* Large decorative quotation mark */}
          <div className={styles.quoteMark} aria-hidden="true">“</div>

          {/* Custom Coffee Bean Rating */}
          <div className={styles.starsRow} aria-label={locale === 'tr' ? `${activeTestimonial.rating} kahve çekirdeği` : `Rated ${activeTestimonial.rating} out of 5 coffee beans`}>
            {renderCoffeeBeans(activeTestimonial.rating)}
          </div>

          {/* Active Testimonial quote with crossfade wrapper */}
          <div className={styles.quoteContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={styles.quoteSlide}
              >
                <blockquote className={styles.blockquote}>
                  <p>&ldquo;{activeTestimonial.quote}&rdquo;</p>
                </blockquote>
                <cite className={styles.cite}>
                  <span className={styles.author}>{activeTestimonial.author}</span>
                  <span className={styles.role}>{activeTestimonial.role}</span>
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel controls / Dots */}
        <div
          className={styles.dotsContainer}
          role="tablist"
          aria-label={locale === 'tr' ? 'Yorum kontrol noktaları' : 'Review page controls'}
          onKeyDown={handleKeyDown}
        >
          {testimonials.map((t, idx) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeIndex === idx}
              aria-controls={`review-${t.id}`}
              aria-label={locale === 'tr' ? `${t.author} tarafından yapılan yorumu göster` : `Go to review ${idx + 1} by ${t.author}`}
              className={`${styles.dot} ${activeIndex === idx ? styles.dotActive : ''}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
