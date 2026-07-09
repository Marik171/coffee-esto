'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './BrewGuidesContent.module.css';

interface BrewStep {
  name: string;
  instructions: string;
  duration: number;
}

interface BrewMethod {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  desc: string;
  coffeeGrams: number;
  waterGrams: number;
  grind: string;
  temp: string;
  time: string;
  steps: BrewStep[];
}

interface BrewGuidesContentProps {
  locale?: string;
}

export default function BrewGuidesContent({ locale = 'en' }: BrewGuidesContentProps) {
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [chimesEnabled, setChimesEnabled] = useState(true);
  const [yieldMultiplier, setYieldMultiplier] = useState<1 | 2>(1);

  const timerRef = useRef<number | null>(null);
  const targetEndTimeRef = useRef<number | null>(null);

  const methods: Record<string, BrewMethod[]> = {
    en: [
      {
        id: 'v60', name: 'V60 Pour Over', tagline: 'Clarity & brightness',
        icon: '/images/dripper.webp',
        desc: 'A clean, highly aromatic cup that highlights the delicate tasting notes and acidity of single-origin coffees. The spiral ridges allow precise control over your extraction.',
        coffeeGrams: 15, waterGrams: 250, grind: 'Medium-Fine', temp: '93°C', time: '3:00',
        steps: [
          { name: 'Bloom', instructions: 'Pour water evenly over the grounds (approx. 3x the coffee weight). Gently swirl the brewer. Wait 45 seconds for CO₂ to release — you\'ll see beautiful bubbling.', duration: 45 },
          { name: 'First Pour', instructions: 'Pour slowly in tight concentric circles from center outward up to 60% of total volume. Keep a steady stream 5cm above the bed.', duration: 60 },
          { name: 'Final Pour', instructions: 'Continue pouring in circles to reach your total target weight. Aim for the center to wash down any dry grounds on the walls.', duration: 60 },
          { name: 'Draw Down', instructions: 'Let water drain completely through the coffee bed. The bed should be flat when done. Lift and tap once.', duration: 30 },
        ],
      },
      {
        id: 'frenchpress', name: 'French Press', tagline: 'Full body & rich oils',
        icon: '/images/french-press.webp',
        desc: 'A classic immersion brew yielding a heavy, full-bodied cup with rich chocolate and earthy profiles. The metal filter preserves natural oils that paper filters strip away.',
        coffeeGrams: 20, waterGrams: 320, grind: 'Coarse', temp: '95°C', time: '4:45',
        steps: [
          { name: 'Infusion', instructions: 'Pour all hot water over the grounds in one steady pour. Give a quick stir, cover (plunger up — do not press yet), and steep.', duration: 240 },
          { name: 'Break Crust', instructions: 'Remove the lid. Stir the top crust of grounds gently 3 times with a spoon to allow sediment to settle.', duration: 30 },
          { name: 'Plunge & Serve', instructions: 'Lower the plunger slowly and steadily — it should take about 15 seconds. Pour immediately to stop extraction.', duration: 15 },
        ],
      },
      {
        id: 'aeropress', name: 'Aeropress', tagline: 'Smooth & low acidity',
        icon: '/images/moka-pot.webp',
        desc: 'A quick, versatile pressure extraction that creates a smooth, concentrated cup with very low acidity. Ideal for travel and recipe experimentation.',
        coffeeGrams: 16, waterGrams: 220, grind: 'Medium-Fine', temp: '85°C', time: '2:00',
        steps: [
          { name: 'Bloom', instructions: 'Set Aeropress inverted. Add grounds, pour a small splash of water. Stir vigorously 5 times to saturate all the grounds. Wait 30 seconds.', duration: 30 },
          { name: 'Infuse', instructions: 'Pour the remaining water smoothly. Wet a paper filter, lock the cap tightly to create a vacuum seal. Steep undisturbed.', duration: 60 },
          { name: 'Press', instructions: 'Carefully flip the Aeropress onto your mug. Press slowly and steadily. Stop pressing when you hear a slight hiss.', duration: 30 },
        ],
      },
    ],
    tr: [
      {
        id: 'v60', name: 'V60 Pour Over', tagline: 'Berraklık ve parlaklık',
        icon: '/images/dripper.webp',
        desc: 'Tek kökenli kahvelerin asiditesini ve hassas tadım notalarını öne çıkaran, berrak ve aromatik bir fincan. Spiral kanallar, özütleme üzerinde hassas kontrol sağlar.',
        coffeeGrams: 15, waterGrams: 250, grind: 'Orta-İnce', temp: '93°C', time: '3:00',
        steps: [
          { name: 'Ön Demleme', instructions: 'Sıcak suyu kahvenin üzerine eşit şekilde dökün (kahve miktarının yaklaşık 3 katı). Demliği nazikçe sallayın. CO₂ salınımı için 45 saniye bekleyin.', duration: 45 },
          { name: 'İlk Döküş', instructions: 'Merkezden dışa doğru dar dairelerde yavaşça toplam hacmin %60\'ına tamamlayın. Kahve yatağının 5cm üzerinde sabit akış sağlayın.', duration: 60 },
          { name: 'Son Döküş', instructions: 'Toplam hedef ağırlığa ulaşana kadar daireler çizerek dökün. Kenarlardaki kuru tortuları yıkamak için merkeze doğru dökün.', duration: 60 },
          { name: 'Süzülme', instructions: 'Suyun kahve yatağından tamamen süzülmesini bekleyin. Kahve yatağı düz olmalıdır. Demliği kaldırıp bir kez nazikçe vurun.', duration: 30 },
        ],
      },
      {
        id: 'frenchpress', name: 'French Press', tagline: 'Dolgun gövde ve zengin yağlar',
        icon: '/images/french-press.webp',
        desc: 'Dolgun, yoğun gövdeli, çikolata ve topraksı profillere sahip zengin bir fincan. Metal filtre, kağıt filtrelerin uzaklaştırdığı doğal yağları korur.',
        coffeeGrams: 20, waterGrams: 320, grind: 'Kalın', temp: '95°C', time: '4:45',
        steps: [
          { name: 'Demlenme', instructions: 'Suyun tamamını kahvenin üzerine tek seferde dökün. Hızlıca karıştırın, kapağı kapatın (pistonu bastırmadan) ve bekleyin.', duration: 240 },
          { name: 'Kabuk Kırma', instructions: 'Kapağı açın. Üstteki kabuksu tabakayı kaşıkla 3 kez nazikçe karıştırın. Tortuların çökmesi için bekleyin.', duration: 30 },
          { name: 'Presleme', instructions: 'Pistonu yavaşça ve sabit şekilde aşağı itin (yaklaşık 15 saniye). Demlenmeyi durdurmak için hemen dökün.', duration: 15 },
        ],
      },
      {
        id: 'aeropress', name: 'Aeropress', tagline: 'Pürüzsüz ve düşük asidite',
        icon: '/images/moka-pot.webp',
        desc: 'Çok düşük asidite ile pürüzsüz, konsantre bir fincan üreten hızlı ve çok yönlü basınçlı demleme. Seyahat ve tarif denemeleri için idealdir.',
        coffeeGrams: 16, waterGrams: 220, grind: 'Orta-İnce', temp: '85°C', time: '2:00',
        steps: [
          { name: 'Ön Demleme', instructions: 'Aeropress\'i ters çevirin. Kahveyi ekleyip az miktarda su dökün. 5 kez kuvvetlice karıştırın. 30 saniye bekleyin.', duration: 30 },
          { name: 'Çözünme', instructions: 'Kalan suyu pürüzsüzce dökün. Filtre kağıdını ıslatıp kapağı sıkıca kilitleyin. Bekleyin.', duration: 60 },
          { name: 'Presleme', instructions: 'Aeropress\'i bardağınızın üzerine dikkatli çevirin. Yavaş ve sabit şekilde preslemeye başlayın. Hafif tıslama sesinde durun.', duration: 30 },
        ],
      },
    ],
  };

  const activeT = locale === 'tr' ? methods.tr : methods.en;

  const L = locale === 'tr' ? {
    eyebrow: 'ESTO ATÖLYESİ', heroTitle: 'Demleme Rehberleri',
    heroSub: 'Baristalarımızdan adım adım demleme yöntemleri. Yerleşik zamanlayıcıyla interaktif demleme asistanını açmak için bir yöntem seçin.',
    methodsLabel: 'Yöntemlerimiz', methodsHeading: 'Üç Farklı Demleme',
    methodsSub: 'Her yöntem çekirdekten farklı bir boyut ortaya çıkarır. Ekipmanınıza uygun olan yöntemle başlayın.',
    ratio: 'Oran', grind: 'Öğütüm', temp: 'Su Sıcaklığı', time: 'Demleme Süresi',
    beginGuide: 'Başla', tipsLabel: 'İpuçları', tipsHeading: 'İyi Kahvenin Prensipleri',
    startBtn: 'Başlat', pauseBtn: 'Duraklat', resumeBtn: 'Devam', resetBtn: 'Sıfırla',
    brewAgain: 'Tekrar Demle', doneMsg: 'Kahvenizin tadını çıkarın.',
    soundToggle: 'Sesli sinyal', step: 'Adım', stepsHeading: 'Demleme Adımları',
    ctaLabel: 'Hazır mısınız?', ctaTitle: 'Her seferinde doğru demlenen kahve.',
    ctaShop: 'Kahvelere Göz At', ctaContact: 'Baristaya Sor',
    servingSize: 'Porsiyon', singleServing: 'Tek Kişilik', doubleServing: 'Çift Kişilik'
  } : {
    eyebrow: 'ESTO WORKSHOP', heroTitle: 'Brew Guides',
    heroSub: 'Step-by-step methods from our baristas. Select a method to open the interactive brew companion with a built-in timer.',
    methodsLabel: 'Our Methods', methodsHeading: 'Three Ways to Brew',
    methodsSub: 'Each method brings out a different dimension of the bean. Start with the one that matches your equipment.',
    ratio: 'Ratio', grind: 'Grind Size', temp: 'Water Temp', time: 'Brew Time',
    beginGuide: 'Begin Guide', tipsLabel: 'Step Tips', tipsHeading: 'Principles of Great Coffee',
    startBtn: 'Start Timer', pauseBtn: 'Pause', resumeBtn: 'Resume', resetBtn: 'Reset',
    brewAgain: 'Brew Again', doneMsg: 'Enjoy your cup.',
    soundToggle: 'Audio signals', step: 'Step', stepsHeading: 'Brew Steps',
    ctaLabel: 'Ready to start?', ctaTitle: 'Coffee brewed right, every time.',
    ctaShop: 'Shop Coffee', ctaContact: 'Ask a Barista',
    servingSize: 'Yield Size', singleServing: 'Single Batch', doubleServing: 'Double Batch'
  };

  const tips = locale === 'tr' ? [
    { label: 'Su Kalitesi', text: 'Filtreli su kullanın. Mineraller özütlemeyi önemli ölçüde etkiler — damıtılmış ve musluk suyu kullanmaktan kaçının.' },
    { label: 'Taze Öğütme', text: 'Kahvenizi demleme öncesinde öğütün. Öğütülmüş kahve, havaya maruz kaldıktan 15 dakika içinde aromasını kaybeder.' },
    { label: 'Her Şeyi Isıtın', text: 'Kabınızı ve filtrenizi önce sıcak suyla durulayın. Bu demleme sıcaklığını korur ve kağıt tadını giderir.' },
    { label: 'Tartı, Kaşık Değil', text: 'Her seferinde kahvenizi ve suyunuzu tartın. Hacimsel ölçümler öğütüm boyutuna göre değişir.' },
  ] : [
    { label: 'Water Quality', text: 'Use filtered water. Minerals significantly affect extraction — avoid distilled and tap water.' },
    { label: 'Fresh Grind', text: 'Grind coffee right before brewing. Ground coffee loses aromatics within 15 minutes of exposure to air.' },
    { label: 'Preheat Everything', text: 'Rinse your vessel and filter with hot water first. This maintains brew temperature and removes paper taste.' },
    { label: 'Scale, Not Scoops', text: 'Weigh your coffee and water on a scale every time. Volume measurements vary by grind size.' },
  ];

  const playChime = (type: 'next' | 'done') => {
    if (!chimesEnabled) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine';
      if (type === 'next') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(659, ctx.currentTime);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
        setTimeout(() => {
          const c2 = new AC(); const o2 = c2.createOscillator(); const g2 = c2.createGain();
          o2.type = 'sine'; o2.frequency.setValueAtTime(880, c2.currentTime);
          g2.gain.setValueAtTime(0.07, c2.currentTime);
          g2.gain.exponentialRampToValueAtTime(0.001, c2.currentTime + 0.25);
          o2.connect(g2); g2.connect(c2.destination); o2.start(); o2.stop(c2.currentTime + 0.25);
        }, 160);
      }
    } catch { /* non-fatal */ }
  };

  // ── HIGH VISIBILITY ACCESSIBILITY MODAL SIDE-EFFECTS ──
  useEffect(() => {
    if (selectedMethod) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeMethod();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedMethod]);

  // ── HTML5 WAKE LOCK API Integration ──
  useEffect(() => {
    let wakeLock: any = null;
    async function requestWakeLock() {
      if ('wakeLock' in navigator && isRunning) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch { /* Un-supported/denied execution silently handled */ }
      }
    }
    if (isRunning) {
      requestWakeLock();
    } else if (wakeLock) {
      wakeLock.release().then(() => { wakeLock = null; });
    }
    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, [isRunning]);

  // ── BULLETPROOF TIMESTAMP REFRESH LOOP (Prevents Background Tab Drifting) ──
  useEffect(() => {
    if (isRunning && timeLeft > 0 && selectedMethod) {
      targetEndTimeRef.current = Date.now() + timeLeft * 1000;

      const tick = () => {
        if (!targetEndTimeRef.current) return;
        const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));

        if (remaining !== timeLeft) {
          setTimeLeft(remaining);
        }

        if (remaining > 0) {
          timerRef.current = requestAnimationFrame(tick);
        } else {
          const next = currentStepIndex + 1;
          if (next < selectedMethod.steps.length) {
            playChime('next');
            setCurrentStepIndex(next);
            setTimeLeft(selectedMethod.steps[next].duration);
          } else {
            playChime('done');
            setIsRunning(false);
            setIsDone(true);
          }
        }
      };

      timerRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isRunning, timeLeft, selectedMethod, currentStepIndex]);

  const openMethod = (m: BrewMethod) => {
    setSelectedMethod(m);
    setCurrentStepIndex(0);
    setYieldMultiplier(1);
    setTimeLeft(m.steps[0].duration);
    setIsRunning(false);
    setIsDone(false);
  };

  const closeMethod = () => {
    setSelectedMethod(null);
    setIsRunning(false);
    setIsDone(false);
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  };

  const resetTimer = () => {
    if (selectedMethod) {
      setCurrentStepIndex(0);
      setTimeLeft(selectedMethod.steps[0].duration);
      setIsRunning(false);
      setIsDone(false);
    }
  };

  const activeStep = selectedMethod?.steps[currentStepIndex];
  const CIRC = 2 * Math.PI * 96;
  const progressRatio = activeStep
    ? (activeStep.duration - timeLeft) / activeStep.duration
    : 0;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <img src="/images/beans.webp" className="heroBean heroBean1" alt="" aria-hidden="true" />
        <img src="/images/beans.webp" className="heroBean heroBean3" alt="" aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>{L.eyebrow}</span>
          <h1 className={styles.heroTitle}>{L.heroTitle}</h1>
          <p className={styles.heroSub}>{L.heroSub}</p>
        </div>
      </section>

      {/* ── METHODS GRID ── */}
      <section className={styles.methodsSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>{L.methodsLabel}</span>
          <h2 className={styles.sectionHeading}>{L.methodsHeading}</h2>
          <p className={styles.sectionSub}>{L.methodsSub}</p>

          <div className={styles.grid}>
            {activeT.map((method) => (
              <article
                key={method.id}
                className={styles.card}
                onClick={() => openMethod(method)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openMethod(method)}
                aria-label={`Open ${method.name} brew guide`}
              >
                <div className={styles.cardImageWrap}>
                  <img src={method.icon} alt={method.name} className={styles.cardImage} />
                  <div className={styles.cardImageOverlay} />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardTagline}>{method.tagline}</p>
                  <h3 className={styles.cardTitle}>{method.name}</h3>
                  <p className={styles.cardDesc}>{method.desc}</p>
                  <div className={styles.specsTable}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{L.ratio}</span>
                      <span className={styles.specValue}>{method.coffeeGrams}g / {method.waterGrams}g</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{L.grind}</span>
                      <span className={styles.specValue}>{method.grind}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{L.temp}</span>
                      <span className={styles.specValue}>{method.temp}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{L.time}</span>
                      <span className={styles.specValue}>{method.time}</span>
                    </div>
                  </div>
                  <button className={styles.cardCta} tabIndex={-1}>{L.beginGuide}</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPS EDITORIAL ROWS ── */}
      <section className={styles.infoFeedSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>{L.tipsLabel}</span>
          <h2 className={styles.sectionHeading}>{L.tipsHeading}</h2>
          <div className={styles.infoFeed} style={{ marginTop: '56px' }}>
            {tips.map((tip, i) => (
              <div key={tip.label} className={i % 2 === 0 ? styles.infoRow : styles.infoRowReverse}>
                <div className={styles.infoImageWrap}>
                  <img
                    src={['/images/coffee_grouped.webp', '/images/beans.webp', '/images/dripper.webp', '/images/french-press.webp'][i]}
                    alt={tip.label}
                    className={styles.infoImage}
                  />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoStepNumber}>{String(i + 1).padStart(2, '0')} — {L.tipsLabel}</span>
                  <h3 className={styles.infoHeading}>{tip.label}</h3>
                  <p className={styles.infoText}>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLACK CTA BANNER ── */}
      <div className={styles.ctaBannerSection}>
        <div className={styles.container}>
          <span className={styles.ctaBannerLabel}>{L.ctaLabel}</span>
          <p className={styles.ctaBannerTitle}>{L.ctaTitle}</p>
          <div className={styles.ctaContainer}>
            <Link href={`${linkPrefix}/coffee`} className={styles.ctaLink}>{L.ctaShop}</Link>
            <Link href={`${linkPrefix}/contact`} className={styles.ctaLink}>{L.ctaContact}</Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          BREW GUIDE MODAL — Premium Redesign
      ══════════════════════════════════════════════ */}
      {selectedMethod && activeStep && (
        <div
          className={styles.timerOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMethod.name} Brew Guide`}
          onClick={(e) => { if (e.target === e.currentTarget) closeMethod(); }}
        >
          <div className={styles.timerContent}>

            {/* ═══ LEFT — Dark panel: identity + arc timer + controls ═══ */}
            <div className={styles.timerLeft}>

              {/* Close button */}
              <button className={styles.closeBtn} onClick={closeMethod} aria-label="Close guide">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Method identity */}
              <div className={styles.timerIdentity}>
                <span className={styles.timerEyebrow}>{L.eyebrow}</span>
                <h2 className={styles.timerMethodName}>{selectedMethod.name}</h2>
                <p className={styles.timerMethodTagline}>{selectedMethod.tagline}</p>
              </div>

              {/* Watchface-style arc timer */}
              <div className={styles.arcWrap}>
                <svg viewBox="0 0 220 220" className={styles.arcSvg} aria-hidden="true">
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0051a8" />
                      <stop offset="100%" stopColor="#0066cc" />
                    </linearGradient>
                  </defs>
                  {/* Subtle minute-tick marks */}
                  {Array.from({ length: 60 }).map((_, i) => {
                    const ang = (i / 60) * 2 * Math.PI - Math.PI / 2;
                    const major = i % 5 === 0;
                    return (
                      <line
                        key={i}
                        x1={110 + (major ? 80 : 84) * Math.cos(ang)}
                        y1={110 + (major ? 80 : 84) * Math.sin(ang)}
                        x2={110 + 90 * Math.cos(ang)}
                        y2={110 + 90 * Math.sin(ang)}
                        stroke={major ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
                        strokeWidth={major ? 1.5 : 1}
                      />
                    );
                  })}
                  {/* Track */}
                  <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  {/* Progress — Colored with your sleek cobalt blue theme */}
                  <circle
                    cx="110" cy="110" r="96"
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="5"
                    strokeLinecap="butt"
                    strokeDasharray={CIRC}
                    strokeDashoffset={isDone ? 0 : CIRC - CIRC * progressRatio}
                    transform="rotate(-90 110 110)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>

                {/* Center content */}
                <div className={styles.arcCenter}>
                  {isDone ? (
                    <>
                      <span className={styles.arcDoneCheck} style={{ color: '#0051a8' }}>✓</span>
                      <span className={styles.arcDoneLabel}>{L.doneMsg}</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.arcTime}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                      <span className={styles.arcMeta}>
                        {L.step} {currentStepIndex + 1} / {selectedMethod.steps.length}
                      </span>
                      <span className={styles.arcCurrentStep} style={{ color: '#0051a8' }}>{activeStep.name}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Play/Pause + Reset buttons */}
              <div className={styles.timerBtns}>
                {!isDone ? (
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={isRunning ? styles.btnPause : styles.btnStart}
                  >
                    {isRunning ? (
                      <>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                        </svg>
                        {L.pauseBtn}
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        {currentStepIndex > 0 ? L.resumeBtn : L.startBtn}
                      </>
                    )}
                  </button>
                ) : (
                  <button onClick={resetTimer} className={styles.btnStart}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                    {L.brewAgain}
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className={styles.btnReset}
                  disabled={currentStepIndex === 0 && timeLeft === activeStep.duration && !isDone}
                >
                  {L.resetBtn}
                </button>
              </div>

              {/* Dynamic Batch Scaling Interface Controls */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '-4px' }}>
                <button
                  onClick={() => { if (!isRunning) { setYieldMultiplier(1); setTimeLeft(selectedMethod.steps[currentStepIndex].duration); } }}
                  disabled={isRunning}
                  style={{
                    flex: 1, padding: '6px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, cursor: isRunning ? 'not-allowed' : 'pointer',
                    background: yieldMultiplier === 1 ? '#0051a8' : 'transparent', color: yieldMultiplier === 1 ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  {L.singleServing}
                </button>
                <button
                  onClick={() => { if (!isRunning) { setYieldMultiplier(2); setTimeLeft(selectedMethod.steps[currentStepIndex].duration); } }}
                  disabled={isRunning}
                  style={{
                    flex: 1, padding: '6px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, cursor: isRunning ? 'not-allowed' : 'pointer',
                    background: yieldMultiplier === 2 ? '#0051a8' : 'transparent', color: yieldMultiplier === 2 ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  {L.doubleServing}
                </button>
              </div>

              {/* Specs strip */}
              <div className={styles.timerSpecsRow}>
                {[
                  { label: L.ratio, value: `${selectedMethod.coffeeGrams * yieldMultiplier}g / ${selectedMethod.waterGrams * yieldMultiplier}g` },
                  { label: L.temp, value: selectedMethod.temp },
                  { label: L.grind, value: selectedMethod.grind },
                ].map((s) => (
                  <div key={s.label} className={styles.timerSpec}>
                    <span className={styles.timerSpecLabel}>{s.label}</span>
                    <span className={styles.timerSpecValue}>{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Audio toggle */}
              <label className={styles.soundToggle}>
                <input type="checkbox" checked={chimesEnabled} onChange={(e) => setChimesEnabled(e.target.checked)} />
                <span className={styles.soundToggleLabel}>{L.soundToggle}</span>
              </label>
            </div>

            {/* ═══ RIGHT — Light panel: all steps always visible ═══ */}
            <div className={styles.timerRight}>
              <div className={styles.timerRightHeader}>
                <h3 className={styles.timerRightTitle}>{L.stepsHeading}</h3>
                <span className={styles.timerRightMethod}>{selectedMethod.name}</span>
              </div>

              <ol className={styles.stepsList}>
                {selectedMethod.steps.map((step, idx) => {
                  const isActive = idx === currentStepIndex && !isDone;
                  const isCompleted = idx < currentStepIndex || isDone;
                  return (
                    <li
                      key={step.name}
                      className={`${styles.stepsItem} ${isActive ? styles.stepsItemActive : ''} ${isCompleted ? styles.stepsItemDone : ''}`}
                    >
                      {/* Vertical timeline connector */}
                      <div className={styles.stepsConnector}>
                        <div className={styles.stepsNum}>
                          {isCompleted ? (
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        {idx < selectedMethod.steps.length - 1 && (
                          <div className={`${styles.stepsLine} ${isCompleted ? styles.stepsLineDone : ''}`} />
                        )}
                      </div>

                      {/* Step body */}
                      <div className={styles.stepsBody}>
                        <div className={styles.stepsMeta}>
                          <h4 className={styles.stepsName}>{step.name}</h4>
                          <span className={styles.stepsDuration}>{step.duration}s</span>
                        </div>
                        <p className={styles.stepsInstructions}>{step.instructions}</p>
                        {/* Progress bar — only on active step */}
                        {isActive && !isDone && (
                          <div className={styles.stepsProgressTrack}>
                            <div
                              className={styles.stepsProgressFill}
                              style={{ width: `${Math.round(progressRatio * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}