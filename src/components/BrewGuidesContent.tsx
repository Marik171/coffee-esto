'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './BrewGuidesContent.module.css';
import { motion } from 'framer-motion';

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
        icon: '/images/quiz/v60_dripper.png',
        desc: 'A clean, highly aromatic cup that highlights the delicate tasting notes and acidity of single-origin coffees. The spiral ridges allow precise control over your extraction.',
        coffeeGrams: 15, waterGrams: 250, grind: 'Medium-Fine', temp: '93°C', time: '3:00',
        steps: [
          { name: 'Bloom', instructions: 'Pour 50g of water evenly over the grounds. Gently swirl the brewer. Wait 45 seconds for CO₂ to release.', duration: 45 },
          { name: 'First Pour', instructions: 'Pour slowly in concentric circles up to 150g. Keep a steady stream 5cm above the bed.', duration: 60 },
          { name: 'Final Pour', instructions: 'Continue pouring up to 250g. Aim for the center to wash down any dry grounds on the filter walls.', duration: 60 },
          { name: 'Draw Down', instructions: 'Let water drain completely. The coffee bed should be flat when done. Give the carafe one final swirl.', duration: 15 },
        ],
      },
      {
        id: 'chemex', name: 'Chemex', tagline: 'Smooth & clean body',
        icon: '/images/quiz/chemex.png',
        desc: 'An elegant immersion-filtration method yielding an exceptionally clean and bright cup. The thick proprietary filters trap bitter oils and sediments.',
        coffeeGrams: 30, waterGrams: 500, grind: 'Medium', temp: '92°C', time: '4:00',
        steps: [
          { name: 'Rinse Filter', instructions: 'Place the Chemex paper filter and rinse with hot water. Discard rinse water before adding coffee.', duration: 30 },
          { name: 'Bloom', instructions: 'Add coffee grounds. Pour 90g of water to saturate. Swirl gently and wait 45 seconds.', duration: 45 },
          { name: 'Main Pour', instructions: 'Slowly pour remaining water in circles up to 500g, keeping the level well below the top rim.', duration: 120 },
          { name: 'Draw Down', instructions: 'Allow the water to drop completely through the bed. Remove filter and swirl the carafe to aerate.', duration: 45 },
        ],
      },
      {
        id: 'moka-pot', name: 'Moka Pot', tagline: 'Intense & bold character',
        icon: '/images/quiz/moka_pot.png',
        desc: 'A classic stovetop steam extraction yielding a strong, heavy-bodied cup close to espresso intensity. Highly rich and aromatic.',
        coffeeGrams: 18, waterGrams: 150, grind: 'Fine', temp: '95°C', time: '5:00',
        steps: [
          { name: 'Preheat Water', instructions: 'Fill bottom chamber with hot water up to the safety valve. Preheating prevents coffee from tasting burnt.', duration: 60 },
          { name: 'Fill Basket', instructions: 'Fill filter basket with fine coffee. Level the top without pressing or tamping. Insert into chamber.', duration: 45 },
          { name: 'Stovetop Heat', instructions: 'Assemble pot tightly and place on low-medium heat. Keep the lid open to monitor the extraction.', duration: 150 },
          { name: 'Cool Down', instructions: 'As soon as the coffee stream turns light yellow/blond, remove from heat. Run cold water over the bottom to stop brewing.', duration: 45 },
        ],
      },
      {
        id: 'espresso', name: 'Espresso Machine', tagline: 'Rich crema & heavy body',
        icon: '/images/quiz/espresso_machine.png',
        desc: 'High-pressure extraction yielding a highly concentrated shot of coffee topped with a rich, golden layer of crema.',
        coffeeGrams: 18, waterGrams: 36, grind: 'Very Fine', temp: '92°C', time: '0:30',
        steps: [
          { name: 'Dosing & Tamping', instructions: 'Fill portafiltre with 18g coffee. Level and tamp flat with 15kg of vertical pressure.', duration: 15 },
          { name: 'Pre-infusion', instructions: 'Flush group head. Insert portafilter and start pump. Wait for low-pressure pre-wetting.', duration: 5 },
          { name: 'Extraction', instructions: 'Raise pressure to 9 bars. Extract 36g of liquid espresso. Flow should look like warm honey.', duration: 10 },
        ],
      },
      {
        id: 'turkish-cezve', name: 'Turkish Cezve', tagline: 'Traditional & thick foam',
        icon: '/images/quiz/turkish_cezve.png',
        desc: 'The oldest brewing method. Powder-fine coffee simmered slowly in a copper pot, serving a rich, velvety cup with thick foam.',
        coffeeGrams: 8, waterGrams: 70, grind: 'Powder Fine', temp: '90°C', time: '2:30',
        steps: [
          { name: 'Mix Ingredients', instructions: 'Add 8g coffee, water, and sugar (optional) to cezve. Stir gently to dissolve coffee, then place on stove.', duration: 30 },
          { name: 'Slow Heat', instructions: 'Heat slowly on lowest fire. Do not stir after this point. Watch for foam rising at edges.', duration: 90 },
          { name: 'Share Foam', instructions: 'Just as foam rises, remove from heat. Spoon the top layer of foam into cup, return cezve to stove.', duration: 20 },
          { name: 'Double Boil', instructions: 'Simmer for 10 more seconds to rise once more. Pour slowly into cup, allowing grounds to settle before drinking.', duration: 10 },
        ],
      },
      {
        id: 'frenchpress', name: 'French Press', tagline: 'Full body & rich oils',
        icon: '/images/french-press.webp',
        desc: 'A classic immersion brew yielding a heavy, full-bodied cup with rich chocolate and earthy profiles. Preservation of natural oils.',
        coffeeGrams: 20, waterGrams: 320, grind: 'Coarse', temp: '95°C', time: '4:45',
        steps: [
          { name: 'Infusion', instructions: 'Pour hot water over the grounds in one steady pour. Swirl gently, cover with plunger up, and steep.', duration: 240 },
          { name: 'Break Crust', instructions: 'Remove lid. Stir top crust of grounds gently 3 times with a spoon to let sediment settle.', duration: 30 },
          { name: 'Plunge & Serve', instructions: 'Lower the plunger slowly and steadily. Pour coffee immediately to prevent over-extraction.', duration: 15 },
        ],
      },
    ],
    tr: [
      {
        id: 'v60', name: 'V60 Pour Over', tagline: 'Berraklık ve parlaklık',
        icon: '/images/quiz/v60_dripper.png',
        desc: 'Tek kökenli kahvelerin asiditesini ve hassas tadım notalarını öne çıkaran, berrak ve aromatik bir fincan. Spiral kanallar, özütleme üzerinde hassas kontrol sağlar.',
        coffeeGrams: 15, waterGrams: 250, grind: 'Orta-İnce', temp: '93°C', time: '3:00',
        steps: [
          { name: 'Ön Demleme', instructions: 'Sıcak suyu kahvenin üzerine eşit şekilde dökün (yaklaşık 50g). Demliği nazikçe sallayın. CO₂ salınımı için 45 saniye bekleyin.', duration: 45 },
          { name: 'İlk Döküş', instructions: 'Merkezden dışa doğru dairelerde yavaşça 150g\'a tamamlayın. Kahve yatağının 5cm üzerinde sabit döküş sağlayın.', duration: 60 },
          { name: 'Son Döküş', instructions: 'Toplam 250g ağırlığa ulaşana kadar daireler çizerek dökün. Kenarlardaki kuru tortuları temizlemek için merkeze dökün.', duration: 60 },
          { name: 'Süzülme', instructions: 'Suyun tamamen süzülmesini bekleyin. Kahve yatağı düz olmalıdır. Sürahiyi son bir kez nazikçe sallayın.', duration: 15 },
        ],
      },
      {
        id: 'chemex', name: 'Chemex', tagline: 'Yumuşak ve temiz gövde',
        icon: '/images/quiz/chemex.png',
        desc: 'Kağıt filtrenin acı yağları ve tortuları süzdüğü, olağanüstü berrak ve aromatik bir gövde sunan zarif süzme yöntemi.',
        coffeeGrams: 30, waterGrams: 500, grind: 'Orta', temp: '92°C', time: '4:00',
        steps: [
          { name: 'Filtreyi Yıka', instructions: 'Chemex kağıt filtresini yerleştirin ve sıcak suyla durulayın. Kahve eklemeden önce durulama suyunu dökün.', duration: 30 },
          { name: 'Ön Demleme', instructions: 'Kahveyi ekleyin. 90g sıcak su dökerek ıslatın. Nazikçe sallayın ve 45 saniye bekleyin.', duration: 45 },
          { name: 'Ana Demleme', instructions: 'Kalan suyu daireler çizerek yavaşça 500g\'a tamamlayın. Su seviyesini Chemex ağzının altında tutun.', duration: 120 },
          { name: 'Süzülme', instructions: 'Suyun kahve yatağından tamamen geçmesini bekleyin. Filtreyi çıkarın ve sürahiyi sallayarak servis edin.', duration: 45 },
        ],
      },
      {
        id: 'moka-pot', name: 'Moka Pot', tagline: 'Güçlü karakter ve gövde',
        icon: '/images/quiz/moka_pot.png',
        desc: 'Espresso yoğunluğuna yakın, basınçlı buhar gücüyle hazırlanan, dolgun gövdeli geleneksel ocak üstü kahve demleme yöntemi.',
        coffeeGrams: 18, waterGrams: 150, grind: 'İnce', temp: '95°C', time: '5:00',
        steps: [
          { name: 'Su Ön Isıtma', instructions: 'Alt hazneye emniyet valfinin altına kadar sıcak su doldurun. Sıcak su kullanmak kahvenin yanmasını engeller.', duration: 60 },
          { name: 'Sepeti Doldur', instructions: 'Metal sepeti ince kahveyle doldurun. Espresso gibi sıkıştırmadan üzerini düzleştirip alt hazneye yerleştirin.', duration: 45 },
          { name: 'Ocakta Isıtma', instructions: 'Üst hazneyi sıkıca kapatıp orta-kısık ateşe yerleştirin. Akışı izlemek için kapağı açık tutun.', duration: 150 },
          { name: 'Soğutma', instructions: 'Kahve akışı sarı/açık köpüğe dönüştüğünde ocaktan alın. Akışı durdurmak için alt hazneyi musluk suyunda soğutun.', duration: 45 },
        ],
      },
      {
        id: 'espresso', name: 'Espresso Makinesi', tagline: 'Zengin krema ve yoğun gövde',
        icon: '/images/quiz/espresso_machine.png',
        desc: 'Yüksek basınçlı su gücüyle hazırlanan, üzerinde altın sarısı kadifemsi krema tabakası bulunan yoğun ve konsantre kahve.',
        coffeeGrams: 18, waterGrams: 36, grind: 'Çok İnce', temp: '92°C', time: '0:30',
        steps: [
          { name: 'Dozlama ve Tamp', instructions: 'Portafiltre sepetine 18g ince kahve koyun. Düzleştirip 15kg dikey kuvvetle dik bir şekilde bastırın (tamping).', duration: 15 },
          { name: 'Ön Islatma', instructions: 'Grup başlığını durulayın. Portafiltreyi takıp tuşa basın. Düşük basınçlı ilk ön ıslatmayı bekleyin.', duration: 5 },
          { name: 'Özütleme', instructions: 'Basınç 9 bara ulaştığında 36g sıvı espresso elde edene kadar akışı sürdürün. Akış sıcak süzme bal kıvamında olmalıdır.', duration: 10 },
        ],
      },
      {
        id: 'turkish-cezve', name: 'Türk Kahvesi (Cezve)', tagline: 'Geleneksel ve yoğun köpük',
        icon: '/images/quiz/turkish_cezve.png',
        desc: 'Dünyanın en eski demleme yöntemi. Çok ince pudra gibi öğütülmüş kahve çekirdeklerinin bakır cezvede köpük köpük demlenmesi.',
        coffeeGrams: 8, waterGrams: 70, grind: 'Çok İnce (Pudra)', temp: '90°C', time: '2:30',
        steps: [
          { name: 'Malzemeleri Karıştır', instructions: 'Cezveye 8g ince kahve, su ve isteğe bağlı şeker ekleyin. Kahve çözünene kadar karıştırıp ocağa alın.', duration: 30 },
          { name: 'Yavaş Pişirme', instructions: 'Çok kısık ateşte yavaşça pişmeye bırakın. Bu aşamadan sonra karıştırmayın. Köpüklerin yükselişini izleyin.', duration: 90 },
          { name: 'Köpük Paylaşımı', instructions: 'Köpük kenarlardan yükseldiğinde ocaktan alın. Köpüğü fincana paylaştırıp cezveyi tekrar ocağa yerleştirin.', duration: 20 },
          { name: 'Son Kabarma', instructions: 'Kahveyi 10 saniye daha kabartıp ocaktan alın. Kenarından fincana yavaşça dökerek servis edin.', duration: 10 },
        ],
      },
      {
        id: 'frenchpress', name: 'French Press', tagline: 'Dolgun gövde ve zengin yağlar',
        icon: '/images/french-press.webp',
        desc: 'Klasik daldırma demleme yöntemi. Metal filtre kahvedeki doğal aromatik yağları koruyarak dolgun ve çikolatamsı bir içim sunar.',
        coffeeGrams: 20, waterGrams: 320, grind: 'Kalın', temp: '95°C', time: '4:45',
        steps: [
          { name: 'Demlenme', instructions: 'Sıcak suyun tamamını kahvenin üzerine tek seferde dökün. Nazikçe karıştırıp piston yukarıda şekilde bekleyin.', duration: 240 },
          { name: 'Kabuk Kırma', instructions: 'Kapağı açın. Üstte biriken kahve tortularını kaşıkla 3 kez karıştırarak dibe çökmesini sağlayın.', duration: 30 },
          { name: 'Presleme', instructions: 'Pistonu yavaş ve dengeli şekilde aşağıya bastırın. Demlemeyi sonlandırmak için hemen servis edin.', duration: 15 },
        ],
      },
    ],
  };

  const activeT = locale === 'tr' ? methods.tr : methods.en;

  const L = locale === 'tr' ? {
    eyebrow: 'ESTO WORKSHOP', heroTitle: 'Demleme Rehberleri',
    heroSub: 'Baristalarımızdan interaktif, adım adım kılavuzlar. Ekipmanınıza uygun bir demleme yöntemi seçin ve yerleşik zamanlayıcıyı başlatın.',
    methodsLabel: 'Yöntemler', methodsHeading: 'Zanaat ve Demleme',
    methodsSub: 'Her demleme yöntemi çekirdeğin farklı tatlarını fincana yansıtır.',
    ratio: 'Oran', grind: 'Öğütüm', temp: 'Sıcaklık', time: 'Süre',
    beginGuide: 'Kılavuzu Aç', tipsLabel: 'Altın İpuçları', tipsHeading: 'İyi Kahvenin Püf Noktaları',
    startBtn: 'Zamanlayıcıyı Başlat', pauseBtn: 'Duraklat', resumeBtn: 'Devam Et', resetBtn: 'Sıfırla',
    brewAgain: 'Tekrar Demle', doneMsg: 'Afiyet olsun!',
    soundToggle: 'Ses Sinyalleri', step: 'Adım', stepsHeading: 'Demleme Adımları',
    ctaLabel: 'Destek mi gerekiyor?', ctaTitle: 'Mükemmel kahveyi demlemek artık çok kolay.',
    ctaShop: 'Kahveleri İncele', ctaContact: 'Baristaya Yazın',
    servingSize: 'Demleme Porsiyonu', singleServing: '1 Fincan (Standart)', doubleServing: '2 Fincan (Çift Kat)'
  } : {
    eyebrow: 'ESTO WORKSHOP', heroTitle: 'Interactive Brew Guides',
    heroSub: 'Step-by-step interactive brewing logs curated by our baristas. Select a method below to launch the companion timer.',
    methodsLabel: 'Methods', methodsHeading: 'Select Your Gear',
    methodsSub: 'Each brewing device coaxes distinct flavor profiles from the roasted beans.',
    ratio: 'Ratio', grind: 'Grind Size', temp: 'Water Temp', time: 'Total Time',
    beginGuide: 'Launch Guide', tipsLabel: 'Pro Tips', tipsHeading: 'Fundamentals of Great Coffee',
    startBtn: 'Start Timer', pauseBtn: 'Pause', resumeBtn: 'Resume', resetBtn: 'Reset',
    brewAgain: 'Brew Again', doneMsg: 'Enjoy your cup.',
    soundToggle: 'Audio Signals', step: 'Step', stepsHeading: 'Brew Steps',
    ctaLabel: 'Need Assistance?', ctaTitle: 'Exceptional coffee brewed right, every single time.',
    ctaShop: 'Shop Beans', ctaContact: 'Ask a Barista',
    servingSize: 'Yield Target', singleServing: '1 Cup (Standard)', doubleServing: '2 Cups (Double Yield)'
  };

  const tips = locale === 'tr' ? [
    { label: 'Su Kalitesi', text: 'Filtreli su kullanın. Mineraller özütlemeyi önemli ölçüde etkiler — damıtılmış ve musluk suyu kullanmaktan kaçının.' },
    { label: 'Taze Öğütme', text: 'En iyi aroma için kahvenizi demlemeden hemen önce öğütün. Taze öğütülmüş kahve, fincanda daha canlı ve dengeli bir lezzet sunar.' },
    { label: 'Demlemeye Hazırlanın', text: 'Demlemeye başlamadan önce ekipmanınızı ve fincanınızı sıcak suyla önceden ısıtın. Bu işlem demleme sıcaklığını korur, filtre kâğıdının tadını giderir ve kahvenizin aroma notalarının fincana daha dengeli şekilde aktarılmasını sağlar. Küçük bir hazırlık, fincanınızdaki lezzette büyük bir fark yaratır.' },
    { label: 'Hassas Ölçüm Yapın', text: 'Her demlemede kahve ve su miktarını hassas bir terazi ile ölçün. Kaşıkla yapılan ölçümler tutarsız sonuçlar verebilir. Doğru oranlar ise her fincanda aynı kaliteyi ve dengeli lezzeti elde etmenizi sağlar.' },
  ] : [
    { label: 'Water Quality', text: 'Use filtered water. Minerals significantly affect extraction — avoid distilled and tap water.' },
    { label: 'Fresh Grind', text: 'For the best aroma, grind your coffee right before brewing. Freshly ground coffee offers a livelier and more balanced flavor in the cup.' },
    { label: 'Prepare to Brew', text: 'Preheat your equipment and cup with hot water before starting to brew. This maintains the brewing temperature, removes the paper taste from the filter, and ensures that the aroma notes of your coffee are transferred more evenly into the cup. A little preparation makes a big difference in the flavor of your cup.' },
    { label: 'Measure Precisely', text: 'Weigh your coffee and water quantity with a precise scale for every brew. Volume measurements with spoons can produce inconsistent results, whereas correct ratios ensure you get the same quality and balanced taste in every cup.' },
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
    } catch { /* ignore */ }
  };

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

  useEffect(() => {
    let wakeLock: any = null;
    async function requestWakeLock() {
      if ('wakeLock' in navigator && isRunning) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch { /* ignore */ }
      }
    }
    if (isRunning) {
      requestWakeLock();
    } else if (wakeLock) {
      wakeLock.release().then(() => { wakeLock = null; });
    }
    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => { wakeLock = null; });
      }
    };
  }, [isRunning]);

  const selectMethod = (method: BrewMethod) => {
    setSelectedMethod(method);
    setCurrentStepIndex(0);
    setTimeLeft(method.steps[0].duration);
    setIsRunning(false);
    setIsDone(false);
    setYieldMultiplier(1);
  };

  const closeMethod = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedMethod(null);
    setIsRunning(false);
    setIsDone(false);
  };

  const activeStep = selectedMethod ? selectedMethod.steps[currentStepIndex] : null;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      timerRef.current = window.setInterval(() => {
        const remaining = Math.max(0, Math.round((targetEndTimeRef.current! - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          handleStepComplete();
        }
      }, 200) as unknown as number;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, currentStepIndex]);

  const handleStepComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!selectedMethod) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < selectedMethod.steps.length) {
      playChime('next');
      setCurrentStepIndex(nextIndex);
      setTimeLeft(selectedMethod.steps[nextIndex].duration);
    } else {
      playChime('done');
      setIsRunning(false);
      setIsDone(true);
      setTimeLeft(0);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsDone(false);
    if (selectedMethod) {
      setCurrentStepIndex(0);
      setTimeLeft(selectedMethod.steps[0].duration);
    }
  };

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const linkPrefix = locale === 'tr' ? '' : '/en';

  return (
    <div className={styles.pageWrapper}>

      {/* ── HERO BANNER ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroInner}>
          <span className={styles.heroLabel}>{L.eyebrow}</span>
          <h1 className={styles.heroTitle}>{L.heroTitle}</h1>
          <p className={styles.heroSub}>{L.heroSub}</p>
        </div>
      </section>

      {/* ── METHODS GRID ── */}
      <section className={styles.methodsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>{L.methodsLabel}</span>
            <h2 className={styles.sectionHeading}>{L.methodsHeading}</h2>
            <p className={styles.sectionSub}>{L.methodsSub}</p>
          </div>

          <div className={styles.grid}>
            {activeT.map((method) => (
              <article
                key={method.id}
                className={styles.methodCard}
                onClick={() => selectMethod(method)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') selectMethod(method); }}
                aria-label={`View brew guide for ${method.name}`}
              >
                <div className={styles.cardImageContainer}>
                  <img
                    src={method.icon}
                    alt={method.name}
                    className={styles.cardIconImage}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{method.name}</h3>
                  <p className={styles.cardTagline}>{method.tagline}</p>
                  <p className={styles.cardDesc}>{method.desc}</p>
                  <div className={styles.cardSpecs}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{L.ratio}</span>
                      <span className={styles.specValue}>
                        {method.coffeeGrams}g / {method.waterGrams}g
                      </span>
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

      {/* ── TIPS EDITORIAL GRID ── */}
      <section className={styles.infoFeedSection}>
        <div className={styles.container}>
          <span className={styles.tipsLabel}>{L.tipsLabel}</span>
          <h2 className={styles.tipsHeading}>{L.tipsHeading}</h2>
          
          <div className={styles.tipsGrid}>
            {tips.map((tip, i) => (
              <div key={tip.label} className={styles.tipGridCard}>
                <div className={styles.tipImageContainer}>
                  <img
                    src={[
                      '/images/coffee_grouped.webp', 
                      '/images/brand-grounds.webp', 
                      '/images/barista-chemex.webp', 
                      '/images/barista-class.webp'
                    ][i]}
                    alt={tip.label}
                    className={styles.tipCardImage}
                  />
                  <div className={styles.tipCardBadge}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className={styles.tipCardBody}>
                  <span className={styles.tipCardEyebrow}>{L.tipsLabel}</span>
                  <h3 className={styles.tipCardTitle}>{tip.label}</h3>
                  <p className={styles.tipCardText}>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CINEMATIC CTA SECTION ── */}
      <section className={styles.ctaBannerSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCardBg} />
            <div className={styles.ctaCardContent}>
              <span className={styles.ctaBannerLabel}>{L.ctaLabel}</span>
              <h2 className={styles.ctaBannerTitle}>{L.ctaTitle}</h2>
              <div className={styles.ctaContainer}>
                <Link href={`${linkPrefix}/coffee`} className={styles.ctaLink}>{L.ctaShop}</Link>
                <Link href={`${linkPrefix}/contact`} className={styles.ctaLink}>{L.ctaContact}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BREW GUIDE MODAL — PremiumRedesign
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
                      <stop offset="0%" stopColor="#c9963a" />
                      <stop offset="100%" stopColor="#e5c158" />
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

                  {/* Arc Progress Ring */}
                  <circle
                    cx="110"
                    cy="110"
                    r="87"
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="110"
                    cy="110"
                    r="87"
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 87}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 87 * (1 - timeLeft / activeStep.duration)
                    }}
                    transition={{ duration: isRunning ? 0.25 : 0.5, ease: 'linear' }}
                    strokeLinecap="round"
                    transform="rotate(-90 110 110)"
                  />
                </svg>

                {/* Numeric timer overlays inside arc */}
                <div className={styles.arcCenterContent}>
                  <div className={styles.timeValue} aria-live="polite">
                    {isDone ? '✓' : formatMinSec(timeLeft)}
                  </div>
                  <div className={styles.activeStepLabel}>
                    {isDone ? L.doneMsg : activeStep.name}
                  </div>
                </div>
              </div>

              {/* Multiplier / Yield Selector */}
              <div className={styles.servingSelectorRow}>
                <span className={styles.servingTitleLabel}>{L.servingSize}</span>
                <div className={styles.servingButtonGroup}>
                  <button
                    className={`${styles.servingBtn} ${yieldMultiplier === 1 ? styles.servingBtnActive : ''}`}
                    onClick={() => { setYieldMultiplier(1); resetTimer(); }}
                  >
                    {L.singleServing}
                  </button>
                  <button
                    className={`${styles.servingBtn} ${yieldMultiplier === 2 ? styles.servingBtnActive : ''}`}
                    onClick={() => { setYieldMultiplier(2); resetTimer(); }}
                  >
                    {L.doubleServing}
                  </button>
                </div>
              </div>

              {/* Timer interactive button row */}
              <div className={styles.timerActionRow}>
                {!isRunning && !isDone && (
                  <button className={styles.playBtn} onClick={startTimer}>
                    {L.startBtn}
                  </button>
                )}
                {isRunning && (
                  <button className={styles.pauseBtn} onClick={pauseTimer}>
                    {L.pauseBtn}
                  </button>
                )}
                {isDone && (
                  <button className={styles.playAgainBtn} onClick={resetTimer}>
                    {L.brewAgain}
                  </button>
                )}
                <button className={styles.resetBtn} onClick={resetTimer} disabled={!isRunning && timeLeft === activeStep.duration}>
                  {L.resetBtn}
                </button>
              </div>

              {/* Accessibility options bar */}
              <div className={styles.accessibilityRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={chimesEnabled}
                    onChange={(e) => setChimesEnabled(e.target.checked)}
                  />
                  <span>{L.soundToggle}</span>
                </label>
              </div>

            </div>

            {/* ═══ RIGHT — Light panel: step directions list ═══ */}
            <div className={styles.timerRight}>
              <div className={styles.rightHeader}>
                <h3 className={styles.stepsHeading}>{L.stepsHeading}</h3>
                <div className={styles.yieldInfoBlock}>
                  <span>{L.ratio}: <strong>{selectedMethod.coffeeGrams * yieldMultiplier}g</strong> kahve / <strong>{selectedMethod.waterGrams * yieldMultiplier}g</strong> su</span>
                </div>
              </div>

              <div className={styles.stepsScroller}>
                {selectedMethod.steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isPast = index < currentStepIndex;
                  return (
                    <div
                      key={step.name}
                      className={`${styles.stepRowItem} ${isActive ? styles.stepRowActive : ''} ${isPast ? styles.stepRowPast : ''}`}
                    >
                      <div className={styles.stepMarkerCol}>
                        <div className={styles.markerCircle}>
                          {isPast ? '✓' : index + 1}
                        </div>
                        {index < selectedMethod.steps.length - 1 && (
                          <div className={styles.markerConnector} />
                        )}
                      </div>
                      <div className={styles.stepInstructionsCol}>
                        <div className={styles.stepHeaderRow}>
                          <h4 className={styles.stepNameText}>{step.name}</h4>
                          <span className={styles.stepTimeDuration}>{step.duration}s</span>
                        </div>
                        <p className={styles.stepInstructionsText}>{step.instructions}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}