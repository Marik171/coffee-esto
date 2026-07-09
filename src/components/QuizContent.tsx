'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CoffeeBag, { PRODUCT_STYLES, DEFAULT_STYLE } from './CoffeeBag';
import styles from './QuizContent.module.css';
import { localizeProduct } from '../lib/localize';

interface ProductData {
  id: string;
  name: string;
  category: string;
  origin: string;
  altitude: string;
  varietal: string;
  roastLevel: number;
  tastingNotes: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
}

/* ── Inline SVG Professional Minimalist Icons ── */
const IconEspresso = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <path d="M6 2v2M10 2v2M14 2v2" />
  </svg>
);

const IconFilter = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 3H6L4 10h16Z" />
    <path d="M12 10v7" />
    <path d="M8 21h8" />
    <path d="M12 10l-4 7h8Z" fill="currentColor" fillOpacity="0.08" />
  </svg>
);

const IconPress = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 21h14" />
    <path d="M17 6V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6" />
    <path d="M12 2v4" />
    <path d="M8 2h8" />
    <path d="M7 11h10M7 15h10" strokeOpacity="0.5" />
  </svg>
);

const IconAeropress = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="7" y="2" width="10" height="16" rx="1" />
    <path d="M6 18h12M8 22h8" />
    <path d="M10 6h4M10 10h4M10 14h4" strokeOpacity="0.4" />
  </svg>
);

const IconTurkish = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 21h10M7 21v-7a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v7" />
    <path d="M14 11l8-4" />
    <path d="M10 11V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" strokeOpacity="0.3" />
  </svg>
);

const IconFruity = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20" strokeOpacity="0.3" />
    <path d="M12 12l7-7M12 12l-7 7M12 12l7 7M12 12L5 5" strokeOpacity="0.3" />
  </svg>
);

const IconBalanced = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeOpacity="0.3" />
  </svg>
);

const IconBold = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L3 17h18Z" />
    <path d="M12 7l-6 10h12" strokeOpacity="0.4" />
    <path d="M12 17v5" />
  </svg>
);

const IconLight = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const IconMedium = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18" />
    <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" fillOpacity="0.12" />
  </svg>
);

const IconDark = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.35" />
    <path d="M12 3v18" />
  </svg>
);

const IconAny = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" strokeDasharray="4 3" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
);

const IconSlow = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 6v6l4 2" />
    <path d="M12 2a10 10 0 0 1 0 20" strokeOpacity="0.15" />
  </svg>
);

const IconCompanion = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 18a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10Z" />
    <path d="M5 8h14M8 12h8" strokeOpacity="0.4" />
  </svg>
);

const IconJumpstart = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
);

interface QuizContentProps {
  locale?: string;
}

export default function QuizContent({ locale = 'en' }: QuizContentProps) {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<ProductData[]>([
    { id: 'guatemala', name: 'Guatemala', category: 'single-origin', origin: 'Antigua, Guatemala', altitude: '1500m - 1700m', varietal: 'Bourbon, Caturra', roastLevel: 50, tastingNotes: 'Chocolate, Orange, Sweet Acidity', description: 'Grown in high-altitude volcanic soils, this Guatemalan origin delivers rich cocoa and sweet citrus orange finish.', price: 337.50, stock: 100, isActive: true },
    { id: 'ethiopia', name: 'Etiyopya Sidamo', category: 'single-origin', origin: 'Sidamo, Ethiopia', altitude: '1800m - 2000m', varietal: 'Heirloom Typica', roastLevel: 35, tastingNotes: 'Bergamot, Citrus, Tea Notes', description: 'Traditional washed Sidamo profile displaying sweet bergamot, lemon-lime citrus, and a black tea-like body.', price: 325.00, stock: 100, isActive: true },
    { id: 'velora-signature', name: 'Velora Signature Espresso', category: 'limited-edition', origin: 'Single Estate Micro-Lot', altitude: '1800m - 2100m', varietal: 'Heirloom Typica', roastLevel: 35, tastingNotes: 'Floral, Winey, Tropical Fruit, Honey, Bergamot', description: 'Exclusive limited edition signature profile with highly complex floral, winey, and tropical fruit notes. 100% Arabica.', price: 350.00, stock: 50, isActive: true },
    { id: 'brazil-cerrado', name: 'Brezilya Cerrado', category: 'single-origin', origin: 'Cerrado, Brazil', altitude: '900m - 1100m', varietal: 'Mundo Novo', roastLevel: 60, tastingNotes: 'Chocolate, Hazelnut, Low Acidity', description: 'Classic natural processed Cerrado crop. Very low in acidity with rich creamy chocolate and toasted hazelnut notes.', price: 312.50, stock: 100, isActive: true },
    { id: 'colombia', name: 'Colombia Supremo', category: 'single-origin', origin: 'Huila, Colombia', altitude: '1600m - 1800m', varietal: 'Caturra', roastLevel: 55, tastingNotes: 'Chocolate, Hazelnut, Caramel', description: 'Supremo grade single origin from Colombia offering classic sweet chocolate, rich hazelnut, and caramel notes.', price: 350.00, stock: 100, isActive: true },
    { id: 'brazil-mogiana', name: 'Brezilya Mogiana', category: 'single-origin', origin: 'Alta Mogiana, Brazil', altitude: '1000m - 1200m', varietal: 'Mundo Novo, Catuai', roastLevel: 55, tastingNotes: 'Caramel, Hazelnut, Balanced', description: 'Sweet, balanced Mogiana origin highlighting toasted nuts, light citrus brightness, and a caramel finish.', price: 325.00, stock: 100, isActive: true }
  ]);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Synced Internal Translation Tables
  const t = {
    en: {
      title: 'Find Your Perfect Roast',
      subtitle: 'Answer 4 simple questions to discover your personalized coffee pairing.',
      stepOf: 'Step {current} of {total}',
      next: 'Next Question',
      prev: 'Back',
      calculating: 'Analyzing your flavor profile...',
      recommendation: 'Your Perfect Match',
      roastLevel: 'Roast Level',
      tastingNotes: 'Tasting Notes',
      origin: 'Origin',
      altitude: 'Altitude',
      varietal: 'Varietal',
      addToCart: 'Add to Cart — ₺{price}',
      added: 'Added to Cart!',
      retake: 'Take Quiz Again',
      outOfStock: 'Out of Stock',
      stepLabels: ['Brew', 'Flavor', 'Roast', 'Ritual'],
      roastScale: ['Light', 'Medium', 'Dark'],
      questions: [
        {
          id: 'brewMethod',
          title: 'How do you usually brew your coffee?',
          options: [
            { value: 'espresso', label: 'Espresso / Latte', desc: 'Fine grind, rich & pressurized brew.', icon: <img src="/images/latte-art.webp" alt="Espresso" className={styles.customQuizIcon} /> },
            { value: 'filter', label: 'Filter / V60', desc: 'Medium-fine, bright & clean pour-over.', icon: <img src="/images/dripper.webp" alt="Filter" className={styles.customQuizIcon} /> },
            { value: 'press', label: 'French Press', desc: 'Coarse, full-bodied immersion brew.', icon: <img src="/images/french-press.webp" alt="French Press" className={styles.customQuizIcon} /> },
            { value: 'moka', label: 'Moka Pot / Aeropress', desc: 'Versatile, intense & textured cup.', icon: <img src="/images/moka-pot.webp" alt="Moka Pot" className={styles.customQuizIcon} /> },
            { value: 'turkish', label: 'Turkish Coffee', desc: 'Ultra-fine, traditional unfiltered cup.', icon: <img src="/images/coffee-pot.webp" alt="Turkish Coffee" className={styles.customQuizIcon} /> }
          ]
        },
        {
          id: 'tasteProfile',
          title: 'What flavors appeal to you most in the morning?',
          options: [
            { value: 'fruity', label: 'Citrusy & Fruity', desc: 'Bright, sweet, floral and tea-like notes.', icon: <IconFruity /> },
            { value: 'balanced', label: 'Chocolatey & Rich', desc: 'Sweet caramel, toasted nuts, and balance.', icon: <IconBalanced /> },
            { value: 'bold', label: 'Earthy & Smoky', desc: 'Deep cedarwood, dark cocoa, and bold spices.', icon: <IconBold /> }
          ]
        },
        {
          id: 'roastPreference',
          title: 'Which roast profile do you prefer?',
          options: [
            { value: 'light', label: 'Light Roast', desc: 'Retains original origin acidity & brightness.', icon: <IconLight /> },
            { value: 'medium', label: 'Medium Roast', desc: 'Balanced sweetness, body, and acidity.', icon: <IconMedium /> },
            { value: 'dark', label: 'Dark Roast', desc: 'Heavy body, low acidity, and toasted flavors.', icon: <IconDark /> },
            { value: 'any', label: 'No Preference', desc: 'Show me whatever fits my flavor profile.', icon: <IconAny /> }
          ]
        },
        {
          id: 'coffeeVibe',
          title: 'What is your coffee drinking philosophy?',
          options: [
            { value: 'slow', label: 'A Slow Ritual', desc: 'I love tasting subtle notes and single-origins.', icon: <IconSlow /> },
            { value: 'steady', label: 'Daily Companion', desc: 'I need a smooth, reliable blend to get me through.', icon: <IconCompanion /> },
            { value: 'kick', label: 'Morning Jumpstart', desc: 'Give me something bold, strong, and highly energizing.', icon: <IconJumpstart /> }
          ]
        }
      ]
    },
    tr: {
      title: 'Mükemmel Kavrumunu Bul',
      subtitle: 'Kişisel kahve eşleşmeni keşfetmek için 4 basit soruyu yanıtla.',
      stepOf: 'Soru {current} / {total}',
      next: 'Sonraki Soru',
      prev: 'Geri',
      calculating: 'Lezzet profiliniz analiz ediliyor...',
      recommendation: 'Sizin İçin Mükemmel Eşleşme',
      roastLevel: 'Derecesi',
      tastingNotes: 'Tadım Notaları',
      origin: 'Kök',
      altitude: 'Rakım',
      varietal: 'Varyete',
      addToCart: 'Sepete Ekle — ₺{price}',
      added: 'Sepete Eklendi!',
      retake: 'Testi Yeniden Çöz',
      outOfStock: 'Tükendi',
      stepLabels: ['Demleme', 'Lezzet', 'Kavrum', 'Ritüel'],
      roastScale: ['Açık', 'Orta', 'Koyu'],
      questions: [
        {
          id: 'brewMethod',
          title: 'Kahvenizi genellikle nasıl demlersiniz?',
          options: [
            { value: 'espresso', label: 'Espresso / Latte', desc: 'İnce öğütüm, yoğun ve basınçlı demleme.', icon: <img src="/images/latte-art.webp" alt="Espresso" className={styles.customQuizIcon} /> },
            { value: 'filter', label: 'Filtre Kahve / V60', desc: 'Orta-ince, berrak ve gövdeli demleme.', icon: <img src="/images/dripper.webp" alt="Filtre" className={styles.customQuizIcon} /> },
            { value: 'press', label: 'French Press', desc: 'Kalın öğütüm, dolgun ve gövdeli dinlendirme.', icon: <img src="/images/french-press.webp" alt="French Press" className={styles.customQuizIcon} /> },
            { value: 'moka', label: 'Moka Pot / Aeropress', desc: 'Çok yönlü, yoğun ve dokulu sert fincan.', icon: <img src="/images/moka-pot.webp" alt="Moka Pot" className={styles.customQuizIcon} /> },
            { value: 'turkish', label: 'Türk Kahvesi', desc: 'Çok ince öğütüm, geleneksel telveli lezzet.', icon: <img src="/images/coffee-pot.webp" alt="Türk Kahvesi" className={styles.customQuizIcon} /> }
          ]
        },
        {
          id: 'tasteProfile',
          title: 'Sabahları en çok hangi tatlar ilginizi çeker?',
          options: [
            { value: 'fruity', label: 'Meyvemsi & Narenciye', desc: 'Asidik, çiçeksi, canlı ve çay benzeri notalar.', icon: <IconFruity /> },
            { value: 'balanced', label: 'Çikolatalı & Dengeli', desc: 'Karamel tatlılığı, kavrulmuş fındık ve denge.', icon: <IconBalanced /> },
            { value: 'bold', label: 'Topraksı & Baharatlı', desc: 'Sedir ağacı, kakao ve zengin baharat tonları.', icon: <IconBold /> }
          ]
        },
        {
          id: 'roastPreference',
          title: 'Hangi kavrum derecesini tercih edersiniz?',
          options: [
            { value: 'light', label: 'Açık Kavrum (Light)', desc: 'Kahvenin özgün meyvemsi asiditesini korur.', icon: <IconLight /> },
            { value: 'medium', label: 'Orta Kavrum (Medium)', desc: 'Dengeli tatlılık, gövde og asidite sunar.', icon: <IconMedium /> },
            { value: 'dark', label: 'Koyu Kavrum (Dark)', desc: 'Yoğun gövde, düşük asidite ve kakao tonları.', icon: <IconDark /> },
            { value: 'any', label: 'Fark Etmez', desc: 'Lezzet profilime uyan herhangi birini göster.', icon: <IconAny /> }
          ]
        },
        {
          id: 'coffeeVibe',
          title: 'Kahve içme felsefeniz hangisidir?',
          options: [
            { value: 'slow', label: 'Yavaş Bir Ritüel', desc: 'Hassas tadım notalarını keşfetmeyi seviyorum.', icon: <IconSlow /> },
            { value: 'steady', label: 'Günlük Eşlikçi', desc: 'Günü kurtaracak yumuşak, güvenilir bir tada ihtiyacım var.', icon: <IconCompanion /> },
            { value: 'kick', label: 'Sabah Enerjisi', desc: 'Günü başlamak için sert, gövdeli ve uyarıcı bir fincan.', icon: <IconJumpstart /> }
          ]
        }
      ]
    }
  };

  const activeT = locale === 'tr' ? t.tr : t.en;

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          setProducts(data.data.map((p: any) => localizeProduct(p, locale)));
        }
      })
      .catch((err) => {
        console.error('Failed to sync products in background:', err);
      });
  }, [locale]);

  const handleSelectOption = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleNext = () => {
    if (currentStep < activeT.questions.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  const getRecommendedCoffee = () => {
    const scores: Record<string, number> = {
      'velora-signature': 0,
      ethiopia: 0,
      colombia: 0,
      guatemala: 0,
      'brazil-mogiana': 0,
      'brazil-cerrado': 0,
    };

    const brew = answers.brewMethod;
    const taste = answers.tasteProfile;
    const roast = answers.roastPreference;
    const vibe = answers.coffeeVibe;

    if (brew === 'espresso' || brew === 'turkish') {
      scores['brazil-cerrado'] += 3;
      scores.guatemala += 2;
      scores.colombia += 1;
    } else if (brew === 'filter') {
      scores['velora-signature'] += 3;
      scores.ethiopia += 3;
      scores['brazil-mogiana'] += 2;
    } else if (brew === 'press') {
      scores['brazil-cerrado'] += 2;
      scores.colombia += 3;
      scores['brazil-mogiana'] += 2;
    } else if (brew === 'moka') {
      scores.guatemala += 3;
      scores.colombia += 2;
      scores['velora-signature'] += 1;
    }

    if (taste === 'fruity') {
      scores['velora-signature'] += 4;
      scores.ethiopia += 4;
      scores['brazil-mogiana'] += 2;
    } else if (taste === 'balanced') {
      scores.colombia += 4;
      scores.guatemala += 4;
      scores['brazil-mogiana'] += 2;
    } else if (taste === 'bold') {
      scores['brazil-cerrado'] += 5;
      scores.guatemala += 1;
    }

    if (roast === 'light') {
      scores['velora-signature'] += 4;
      scores.ethiopia += 3;
    } else if (roast === 'medium') {
      scores.colombia += 4;
      scores.guatemala += 4;
      scores['brazil-mogiana'] += 3;
    } else if (roast === 'dark') {
      scores['brazil-cerrado'] += 5;
    } else {
      Object.keys(scores).forEach((key) => {
        scores[key] += 1;
      });
    }

    if (vibe === 'slow') {
      scores.ethiopia += 3;
      scores['velora-signature'] += 3;
      scores['brazil-mogiana'] += 2;
    } else if (vibe === 'steady') {
      scores.colombia += 3;
      scores.guatemala += 3;
    } else if (vibe === 'kick') {
      scores['brazil-cerrado'] += 4;
      scores.guatemala += 2;
    }

    let bestId = 'colombia';
    let highestScore = -1;

    Object.entries(scores).forEach(([id, val]) => {
      if (val > highestScore) {
        highestScore = val;
        bestId = id;
      }
    });

    return products.find((p) => p.id === bestId) || products[0];
  };

  const handleAddToCart = (coffee: ProductData) => {
    if (!coffee || coffee.stock === 0) return;
    setAddingToCart(true);

    const style = PRODUCT_STYLES[coffee.id] || DEFAULT_STYLE;

    setTimeout(() => {
      addToCart({
        id: coffee.id,
        name: coffee.name,
        price: coffee.price,
        stock: coffee.stock,
        emoji: style.emoji,
        bagColor: style.bagColor,
        notes: coffee.tastingNotes.split(',').map((n) => n.trim()),
        imageUrl: coffee.imageUrl,
      }, 1);
      setAddingToCart(false);
    }, 600);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#767676' }}>
          <p className={styles.loadingText}>{activeT.calculating}</p>
        </div>
      </div>
    );
  }

  const isCompleted = currentStep === activeT.questions.length;
  const recommendedCoffee = isCompleted ? getRecommendedCoffee() : null;
  const currentQuestion = !isCompleted ? activeT.questions[currentStep] : null;
  const isNextDisabled = currentQuestion ? !answers[currentQuestion.id] : false;

  return (
    <div className={styles.page}>

      {/* ── HERO SECTION ── */}
      <section className={styles.hero} aria-labelledby="quiz-hero-title">
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>{locale === 'tr' ? 'KAVRUM BULUCU' : 'COFFEE FINDER'}</span>
          <h1 id="quiz-hero-title" className={styles.heroTitle}>
            {locale === 'tr' ? 'Mükemmel Profilini' : 'Find Your Perfect'}<br />
            {locale === 'tr' ? 'Keşfet' : 'Flavor Profile'}
          </h1>
          <p className={styles.heroSub}>{activeT.subtitle}</p>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.inner}>

          {/* Minimal Step Indicator Timeline */}
          {!isCompleted && (
            <nav
              className={styles.stepRail}
              aria-label={activeT.stepOf
                .replace('{current}', (currentStep + 1).toString())
                .replace('{total}', activeT.questions.length.toString())}
            >
              {activeT.questions.map((q, idx) => {
                const state = idx < currentStep ? 'done' : idx === currentStep ? 'active' : 'upcoming';
                return (
                  <div key={q.id} className={`${styles.stepItem} ${styles[`step_${state}`]}`}>
                    <span className={styles.stepNumber}>{String(idx + 1).padStart(2, '0')}</span>
                    <span className={styles.stepName}>{activeT.stepLabels[idx]}</span>
                  </div>
                );
              })}
            </nav>
          )}

          {/* Dynamic Interactive Workflows */}
          <AnimatePresence mode="wait">
            {!isCompleted && currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
              >
                <h2 className={styles.questionTitle}>{currentQuestion.title}</h2>
                <div className={styles.optionsGrid}>
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.value;
                    return (
                      <div
                        key={opt.value}
                        className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectOption(currentQuestion.id, opt.value)}
                      >
                        <span className={styles.optionIcon}>{opt.icon}</span>
                        <span className={styles.optionLabel}>{opt.label}</span>
                        <p className={styles.optionDesc}>{opt.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.footerButtons}>
                  <button
                    onClick={handlePrev}
                    className={styles.btnPrev}
                    disabled={currentStep === 0}
                  >
                    {activeT.prev}
                  </button>

                  <button
                    onClick={handleNext}
                    className={styles.btnNext}
                    disabled={isNextDisabled}
                  >
                    {activeT.next}
                  </button>
                </div>
              </motion.div>
            )}

            {isCompleted && recommendedCoffee && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={styles.resultCard}
              >
                {/* Left Column: 3D SVG Coffee Bag Showcase */}
                <div className={styles.bagContainer}>
                  <CoffeeBag
                    coffeeName={recommendedCoffee.name}
                    origin={recommendedCoffee.origin}
                    bagColor={PRODUCT_STYLES[recommendedCoffee.id]?.bagColor || DEFAULT_STYLE.bagColor}
                    illustration={PRODUCT_STYLES[recommendedCoffee.id]?.illustration || DEFAULT_STYLE.illustration}
                    emoji={PRODUCT_STYLES[recommendedCoffee.id]?.emoji || DEFAULT_STYLE.emoji}
                    locale={locale}
                  />
                </div>

                {/* Right Column: Editorial Recommendation Details */}
                <div className={styles.resultDetails}>
                  <span className={styles.celebrationText}>{activeT.recommendation}</span>
                  <h2 className={styles.matchName}>{recommendedCoffee.name}</h2>
                  <p className={styles.matchDesc}>{recommendedCoffee.description}</p>

                  <dl className={styles.specList}>
                    <div className={styles.specRow}>
                      <dt>{activeT.origin}</dt>
                      <dd>{recommendedCoffee.origin}</dd>
                    </div>
                    <div className={styles.specRow}>
                      <dt>{activeT.altitude}</dt>
                      <dd>{recommendedCoffee.altitude}</dd>
                    </div>
                    <div className={styles.specRow}>
                      <dt>{activeT.varietal}</dt>
                      <dd>{recommendedCoffee.varietal}</dd>
                    </div>
                    <div className={styles.specRow}>
                      <dt>{activeT.tastingNotes}</dt>
                      <dd className={styles.specNotes}>{recommendedCoffee.tastingNotes}</dd>
                    </div>
                  </dl>

                  {/* Minimal Cobalt Blue Profile Slider Dial */}
                  <div className={styles.roastDial}>
                    <span className={styles.roastDialLabel}>{activeT.roastLevel}</span>
                    <div className={styles.roastDialTrack}>
                      <span
                        className={styles.roastDialMarker}
                        style={{
                          left: `${recommendedCoffee.roastLevel}%`,
                          backgroundColor: '#0051a8'
                        }}
                      />
                    </div>
                    <div className={styles.roastDialScale}>
                      <span>{activeT.roastScale[0]}</span>
                      <span>{activeT.roastScale[1]}</span>
                      <span>{activeT.roastScale[2]}</span>
                    </div>
                  </div>

                  <div className={styles.priceTag}>₺{recommendedCoffee.price}</div>

                  <div className={styles.actionsRow}>
                    <button
                      onClick={() => handleAddToCart(recommendedCoffee)}
                      disabled={recommendedCoffee.stock === 0 || addingToCart}
                      className={styles.btnAddToCart}
                    >
                      {recommendedCoffee.stock === 0
                        ? activeT.outOfStock
                        : addingToCart
                          ? activeT.added
                          : activeT.addToCart.replace('{price}', recommendedCoffee.price.toString())}
                    </button>

                    <button
                      onClick={handleRetake}
                      className={styles.btnRetake}
                    >
                      {activeT.retake}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}