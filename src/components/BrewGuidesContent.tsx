'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './BrewGuidesContent.module.css';

interface BrewStep {
  name: string;
  instructions: string;
  duration: number; // in seconds
}

interface BrewMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  ratio: string;
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
  
  // Timer States
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [chimesEnabled, setChimesEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Localized Data
  const methods: Record<string, BrewMethod[]> = {
    en: [
      {
        id: 'v60',
        name: 'V60 Pour Over',
        icon: <img src="/images/dripper.webp" alt="V60" className={styles.customBrewIcon} />,
        desc: 'A clean, highly aromatic cup that highlights the delicate tasting notes and acidity of single-origin coffees.',
        ratio: '15g Coffee / 250g Water',
        grind: 'Medium-Fine',
        temp: '93°C',
        time: '3:00',
        steps: [
          { name: 'Blooming', instructions: 'Pour 50g of water. Swirl the brewer gently. Wait for bubbles to release CO2.', duration: 45 },
          { name: 'First Main Pour', instructions: 'Slowly pour in concentric circles up to 150g. Keep a steady, gentle stream.', duration: 60 },
          { name: 'Final Pour', instructions: 'Slowly pour the remaining water up to 250g. Aim for the center to wash down grinds.', duration: 60 },
          { name: 'Draw Down', instructions: 'Let the water drain completely through the coffee bed. Lift and tap once.', duration: 30 }
        ]
      },
      {
        id: 'frenchpress',
        name: 'French Press',
        icon: <img src="/images/french-press.webp" alt="French Press" className={styles.customBrewIcon} />,
        desc: 'A classic immersion brew yielding a heavy, full-bodied cup with rich chocolate and earthy profiles.',
        ratio: '20g Coffee / 320g Water',
        grind: 'Coarse',
        temp: '95°C',
        time: '4:45',
        steps: [
          { name: 'Infusion', instructions: 'Pour all 320g of water. Cover with the plunger (do not press) and steep.', duration: 240 },
          { name: 'Break Crust', instructions: 'Remove plunger. Stir the top crust of grinds gently 3 times. Let settle.', duration: 30 },
          { name: 'Plunge & Serve', instructions: 'Insert plunger. Press down slowly and steadily (takes ~15s). Serve immediately.', duration: 15 }
        ]
      },
      {
        id: 'aeropress',
        name: 'Aeropress (Inverted)',
        icon: <img src="/images/moka-pot.webp" alt="Aeropress" className={styles.customBrewIcon} />,
        desc: 'A quick, versatile pressure extraction that creates a smooth, concentrated cup with very low acidity.',
        ratio: '16g Coffee / 220g Water',
        grind: 'Medium-Fine',
        temp: '85°C',
        time: '2:00',
        steps: [
          { name: 'Bloom Phase', instructions: 'Pour 50g of water. Stir 5 times to wet all coffee grounds. Wait 30 seconds.', duration: 30 },
          { name: 'Infusion Phase', instructions: 'Add the remaining 170g of water. Put cap on with wet paper filter, seal.', duration: 60 },
          { name: 'Plunge Press', instructions: 'Flip the Aeropress onto your mug. Press down slowly and steadily.', duration: 30 }
        ]
      }
    ],
    tr: [
      {
        id: 'v60',
        name: 'V60 Pour Over',
        icon: <img src="/images/dripper.webp" alt="V60" className={styles.customBrewIcon} />,
        desc: 'Tek kökenli kahvelerin asiditesini ve hassas tadım notalarını öne çıkaran, berrak ve aromatik bir demleme.',
        ratio: '15g Kahve / 250g Su',
        grind: 'Orta-İnce',
        temp: '93°C',
        time: '3:00',
        steps: [
          { name: 'Ön Demleme (Bloom)', instructions: '50g sıcak su dökün. Kahve yatağını dairesel sallayın. Gaz salınımını bekleyin.', duration: 45 },
          { name: 'İlk Büyük Döküş', instructions: 'Merkezden dışa dairesel hareketlerle 150g suya tamamlayın. Sabit akış sağlayın.', duration: 60 },
          { name: 'Son Döküş', instructions: 'Kalan suyu 250g olana kadar dökün. Kenarlardaki tortuları aşağı yıkayın.', duration: 60 },
          { name: 'Süzülme (Draw Down)', instructions: 'Suyun kahve yatağından tamamen süzülmesini bekleyin. Demliği bir kez vurun.', duration: 30 }
        ]
      },
      {
        id: 'frenchpress',
        name: 'French Press',
        icon: <img src="/images/french-press.webp" alt="French Press" className={styles.customBrewIcon} />,
        desc: 'Dolgun, yoğun gövdeli, çikolata ve topraksı profillere sahip zengin bir fincan üreten klasik demleme.',
        ratio: '20g Kahve / 320g Su',
        grind: 'Kalın (Coarse)',
        temp: '95°C',
        time: '4:45',
        steps: [
          { name: 'Demlenme (İnfüzyon)', instructions: '320g suyun tamamını dökün. Kapağı kapatın (bastırmayın) ve bekleyin.', duration: 240 },
          { name: 'Kabuk Kırma', instructions: 'Kapağı açın. Üstteki köpük tabakasını kaşıkla 3 kez karıştırın. Çökmesini bekleyin.', duration: 30 },
          { name: 'Presleme & Servis', instructions: 'Pistonu takıp yavaşça aşağı itin (~15s sürer). Aşırı demlenmeyi önlemek için hemen dökün.', duration: 15 }
        ]
      },
      {
        id: 'aeropress',
        name: 'Aeropress (Ters Yöntem)',
        icon: <img src="/images/moka-pot.webp" alt="Aeropress" className={styles.customBrewIcon} />,
        desc: 'Düşük asiditeli, yoğun ve pürüzsüz bir lezzet sunan, hızlı ve çok yönlü basınçlı demleme tekniği.',
        ratio: '16g Kahve / 220g Su',
        grind: 'Orta-İnce',
        temp: '85°C',
        time: '2:00',
        steps: [
          { name: 'Ön Demleme', instructions: '50g sıcak su dökün. Kahveyi ıslatmak için 5 kez karıştırın. 30 saniye bekleyin.', duration: 30 },
          { name: 'Çözünme Aşaması', instructions: 'Kalan 170g suyu ekleyin. Filtre kağıdını ıslatıp başlığı kapatın, vakumu kilitleyin.', duration: 60 },
          { name: 'Presleme Aşaması', instructions: 'Aeropress\'i bardağın üzerine ters çevirin. Yavaşça ve sabit basınçla aşağı bastırın.', duration: 30 }
        ]
      }
    ]
  };

  const activeT = locale === 'tr' ? methods.tr : methods.en;

  const labels = {
    en: {
      title: 'Coffee Brewing Guides',
      subtitle: 'Elevate your morning ritual. Select a method below to open the interactive brew companion and ensure the perfect extraction.',
      ratio: 'Ratio',
      grind: 'Grind',
      temp: 'Water Temp',
      time: 'Brew Time',
      startBtn: 'Start Extraction',
      pauseBtn: 'Pause Timer',
      resumeBtn: 'Resume Timer',
      resetBtn: 'Reset',
      successMsg: 'Enjoy Your Roast!',
      backBtn: 'All Guides',
      soundToggle: 'Enable Audio Signals',
    },
    tr: {
      title: 'İnteraktif Demleme Rehberi',
      subtitle: 'Sabah ritüelinizi bir üst seviyeye taşıyın. Kusursuz bir özütleme elde etmek için aşağıdan bir demleme yöntemi seçin.',
      ratio: 'Oran',
      grind: 'Öğütüm',
      temp: 'Su Derecesi',
      time: 'Demleme Süresi',
      startBtn: 'Özütlemeyi Başlat',
      pauseBtn: 'Zamanlayıcıyı Duraklat',
      resumeBtn: 'Zamanlayıcıyı Başlat',
      resetBtn: 'Sıfırla',
      successMsg: 'Kahveniz Hazır!',
      backBtn: 'Tüm Rehberler',
      soundToggle: 'Sesli Sinyalleri Etkinleştir',
    }
  };

  const activeL = locale === 'tr' ? labels.tr : labels.en;

  // Web Audio API chimes generator
  const playChime = (type: 'next' | 'done') => {
    if (!chimesEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      if (type === 'next') {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        // Double tone E5 then A5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        
        setTimeout(() => {
          const ctx2 = new AudioContextClass();
          const osc2 = ctx2.createOscillator();
          const gain2 = ctx2.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, ctx2.currentTime);
          gain2.gain.setValueAtTime(0.08, ctx2.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.25);
          osc2.connect(gain2);
          gain2.connect(ctx2.destination);
          osc2.start();
          osc2.stop(ctx2.currentTime + 0.25);
        }, 150);
      }
    } catch (e) {
      console.error('Audio chime play failed:', e);
    }
  };

  // Timer Control Loop
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0 && selectedMethod) {
      // Step completed!
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < selectedMethod.steps.length) {
        // Transition to next phase
        playChime('next');
        setTimeout(() => {
          setCurrentStepIndex(nextIndex);
          setTimeLeft(selectedMethod.steps[nextIndex].duration);
        }, 0);
      } else {
        // Finished everything!
        playChime('done');
        setTimeout(() => {
          setIsRunning(false);
          setIsDone(true);
        }, 0);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, selectedMethod, currentStepIndex]);

  const handleOpenMethod = (method: BrewMethod) => {
    setSelectedMethod(method);
    setCurrentStepIndex(0);
    setTimeLeft(method.steps[0].duration);
    setIsRunning(false);
    setIsDone(false);
  };

  const handleCloseMethod = () => {
    setSelectedMethod(null);
    setIsRunning(false);
    setIsDone(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    if (selectedMethod) {
      setCurrentStepIndex(0);
      setTimeLeft(selectedMethod.steps[0].duration);
      setIsRunning(false);
      setIsDone(false);
    }
  };

  // Calculations for circle offset
  const activeStep = selectedMethod?.steps[currentStepIndex];
  const totalDuration = activeStep?.duration || 1;
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = 502 - (502 * progressRatio);

  return (
    <div className={styles.page}>
      
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="brew-hero-title">
        {/* Floating Coffee Beans */}
        <img src="/images/beans.webp" className="heroBean heroBean1" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean2" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean3" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean4" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean5" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean6" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean7" alt="" />

        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>{locale === 'tr' ? 'ESTO ATÖLYESİ' : 'ESTO WORKSHOP'}</span>
          <h1 id="brew-hero-title" className={styles.heroTitle}>
            {locale === 'tr' ? 'Demleme Sanatında' : 'Master The Art'}<br />
            {locale === 'tr' ? 'Ustalaşın' : 'Of Brewing'}
          </h1>
          <p className={styles.heroSub}>{activeL.subtitle}</p>
        </div>

        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 L1440,100 L1440,45 C1080,5 720,95 360,20 C180,-10 60,40 0,50 Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      <div className={styles.container}>
        {/* Grid of Methods */}
        <div className={styles.grid}>
        {activeT.map((method) => (
          <div 
            key={method.id} 
            className={styles.card}
            onClick={() => handleOpenMethod(method)}
          >
            <div className={styles.cardHeader}>
              <h2 className={styles.methodName}>{method.name}</h2>
              <span className={styles.methodIcon}>{method.icon}</span>
            </div>
            
            <p className={styles.description}>{method.desc}</p>
            
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specIcon}>⚖️</span>
                <div className={styles.specDetails}>
                  <span className={styles.specLabel}>{activeL.ratio}</span>
                  <span className={styles.specValue}>{method.ratio.split('/')[0].trim()}</span>
                </div>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specIcon}>⚙️</span>
                <div className={styles.specDetails}>
                  <span className={styles.specLabel}>{activeL.grind}</span>
                  <span className={styles.specValue}>{method.grind}</span>
                </div>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specIcon}>🌡️</span>
                <div className={styles.specDetails}>
                  <span className={styles.specLabel}>{activeL.temp}</span>
                  <span className={styles.specValue}>{method.temp}</span>
                </div>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specIcon}>⏱️</span>
                <div className={styles.specDetails}>
                  <span className={styles.specLabel}>{activeL.time}</span>
                  <span className={styles.specValue}>{method.time} m</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Active Stepper Split Overlay */}
      {selectedMethod && activeStep && (
        <div className={styles.timerOverlay}>
          <div className={styles.timerContent}>
            <button 
              className={styles.closeBtn} 
              onClick={handleCloseMethod}
              aria-label="Close guides overlay"
            >
              ✕
            </button>

            {/* Left Panel: Visualizer & Circle Progress */}
            <div className={styles.visualizerPanel}>
              <span className={styles.methodLabel}>{selectedMethod.name}</span>
              
              <div className={styles.visualTimer}>
                <svg className={styles.circleSvg}>
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c9963a" />
                      <stop offset="100%" stopColor="#e84d00" />
                    </linearGradient>
                  </defs>
                  <circle cx="125" cy="125" r="100" className={styles.circleBg} />
                  <circle 
                    cx="125" 
                    cy="125" 
                    r="100" 
                    className={styles.circleFill} 
                    strokeDasharray="628" /* 2 * PI * r (100) */
                    strokeDashoffset={isDone ? 0 : 628 - (628 * progressRatio)}
                  />
                </svg>
                <div className={styles.timerNumbers}>
                  <span className={styles.timeLeft}>
                    {isDone ? '🎉' : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                  </span>
                  <span className={`${styles.pulseDot} ${!isRunning ? styles.pulseDotPaused : ''}`} />
                </div>
              </div>
            </div>

            {/* Right Panel: Stepper Timeline & Controls */}
            <div className={styles.stepsPanel}>
              
              {/* Stepper Timeline */}
              <div className={styles.timeline}>
                {selectedMethod.steps.map((step, idx) => {
                  const isActive = idx === currentStepIndex && !isDone;
                  const isCompleted = idx < currentStepIndex || isDone;
                  
                  return (
                    <div 
                      key={step.name} 
                      className={`${styles.timelineStep} ${
                        isActive ? styles.timelineStepActive : ''
                      } ${
                        isCompleted ? styles.timelineStepDone : ''
                      }`}
                    >
                      <div className={styles.stepConnector}>
                        <div className={styles.stepIndicator}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        {idx < selectedMethod.steps.length - 1 && (
                          <div className={styles.lineConnector} />
                        )}
                      </div>
                      
                      <div className={styles.stepText}>
                        <h4 className={styles.stepName}>{step.name}</h4>
                        {isActive && (
                          <p className={styles.stepInstructions}>{step.instructions}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Step Actions */}
              <div className={styles.controlWrapper}>
                <div className={styles.controls}>
                  {!isDone ? (
                    <button 
                      onClick={handleToggleTimer}
                      className={styles.btnPrimary}
                    >
                      {isRunning ? activeL.pauseBtn : activeL.startBtn}
                    </button>
                  ) : (
                    <button 
                      onClick={handleResetTimer}
                      className={styles.btnPrimary}
                    >
                      {locale === 'tr' ? 'Tekrar Demle' : 'Brew Again'}
                    </button>
                  )}
                  <button 
                    onClick={handleResetTimer} 
                    className={styles.btnSecondary}
                    disabled={currentStepIndex === 0 && timeLeft === activeStep.duration}
                  >
                    {activeL.resetBtn}
                  </button>
                </div>

                {/* Chime Settings Checkbox */}
                <label className={styles.soundToggle}>
                  <input 
                    type="checkbox" 
                    checked={chimesEnabled}
                    onChange={(e) => setChimesEnabled(e.target.checked)}
                    className={styles.soundCheckbox}
                  />
                  <span>{activeL.soundToggle}</span>
                </label>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
