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
          quote: "A newly opened spot that I visited upon recommendation. When it comes to coffee, all kinds of knowledge, taste, and experience make themselves known from A-Z. A place where you can see the process transparently from production to cup. The place that will make you fall in love with coffee in my opinion.",
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
          quote: "Yeni açılmış ve tavsiye üzerine gittiğim kahve dediğinde A-Z'ye her türlü bilgi, lezzet ve tecrübe kendini belli ediyor. Üretimden fincana şeffaf olarak görebildiğiniz bir mekan. Kahveyi benimseyeceğiniz nokta bence.",
          author: "Kaan Y.",
          role: "Yerel Rehber",
          rating: 5
        },
        {
          id: 2,
          quote: "Mekan çok tatlı içeride bir makina var lokomotife benziyor. Kahveler tat olarak çok iyi fiyatlar da çok uygun.",
          author: "Ebubekir Demir",
          role: "Yerel Rehber",
          rating: 5
        },
        {
          id: 3,
          quote: "Kahveleri taze, harika bir mekan. İnsana huzur veren muhteşem bir yer kahvesiyle damakları doyuran, mekanın atmosferiyle başka bir dünya yaşatan bir yer olmuş. Herkese tavsiye ederim.",
          author: "Ali Hasan Akdağ",
          role: "Yerel Rehber",
          rating: 5
        },
        {
          id: 4,
          quote: "Kahveleri çok lezzetli ve iyiydi, Bekir Bey çok kibar ve nazikti.",
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

  // Elegant Vector Rating Stars helper
  const renderStars = (rating: number) => {
    return Array.from({ length: rating }).map((_, idx) => (
      <svg
        key={idx}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="#c9963a"
        stroke="#c9963a"
        strokeWidth="1"
        style={{ margin: '0 2px' }}
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
      <div className={styles.container}>
        {/* Typographic Title Block */}
        <div className={styles.titleBlock}>
          <span className={styles.badge}>{t.badge}</span>
          <h2 className={styles.title}>{t.title}</h2>
        </div>

        {/* Minimalist Editorial Testimonial Panel */}
        <div className={styles.card}>
          {/* Custom Elegant Stars Rating Row */}
          <div className={styles.starsRow} aria-label={locale === 'tr' ? `${activeTestimonial.rating} yıldızlı değerlendirme` : `Rated ${activeTestimonial.rating} out of 5 stars`}>
            {renderStars(activeTestimonial.rating)}
          </div>

          {/* Active Testimonial quote with crossfade wrapper */}
          <div className={styles.quoteContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
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
