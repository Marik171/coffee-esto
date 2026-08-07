'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './WholesaleContent.module.css';

/* ── Scroll-triggered fade-up wrapper ───────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-72px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

interface WholesaleContentProps {
  locale: string;
}

export default function WholesaleContent({ locale }: WholesaleContentProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    zip: '',
    company: '',
    website: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const translations = {
    en: {
      heroLabel: 'WHOLESALE COFFEE SOLUTIONS',
      heroTitle: 'Wherever You Are,\nCoffee Esto Is With You',
      heroSub: 'We support your business with custom coffee blends, freshly roasted quality beans, equipment support, and professional barista training.',
      heroContact: 'Get in touch for wholesale coffee and business partnerships.',
      heroContactName: 'Hakan Akdağ',
      heroContactPhone: '0553 605 31 83',

      feed1Label: 'WHOLESALE',
      feed1Title: 'Cafes',
      feed1Text: 'We work together to analyze your cafe\'s target audience and select the coffee that best suits their palate. By creating custom recipes and roast profiles for your business, we strengthen your product standard and maximize customer satisfaction and sales potential.',
      
      feed2Label: 'EQUIPMENT',
      feed2Title: 'Espresso Machinery & Project Setup',
      feed2Text: 'We supply commercial espresso machines, grinders, and custom bar setups. Benefit from end-to-end consulting, delivery, and professional installation under one roof.',
      
      feed3Label: 'EDUCATION',
      feed3Title: 'Barista Training',
      feed3Text: 'Sustainable quality starts with proper training. For our wholesale partners, we offer hands-on barista training, equipment usage guidance, recipe standardization, and periodic tasting support. This helps you maintain the same quality in every cup and boost customer satisfaction.',
      
      feed4Label: 'DIRECT TRADE',
      feed4Title: 'Our Sourcing & Values',
      feed4Text: 'We source our coffee from growers and trusted suppliers who meet our quality standards. We carefully select every bean based on flavor profile, quality, and intended use, keeping sustainable quality at the forefront of every stage of the roasting process.',
      
      feed5Label: 'OFFICES & COMMERCIAL',
      feed5Title: 'Office Coffee Programs',
      feed5Text: 'We offer coffee solutions tailored to your workplace. Based on your office size and consumption needs, we set up the right equipment, coffee supply, and a regular delivery schedule, giving your employees a fresh, consistent-quality coffee experience every day.',
      
      quote: '“At Coffee Esto, we work to embody the idea that coffee should be something special through our sourcing, roasting, and wholesale partnerships. We strive to bring you exceptional coffees that reflect and honor the tremendous risk and effort put into growing and cultivating this seemingly simple yet dynamic product.”',
      quoteAuthor: 'SERVICE WITH VALUES / COFFEE ESTO ROASTERY',
      
      formTitle: 'Sign Me Up',
      formSub: 'Connect with our wholesale team to start a partnership.',
      labelFirstName: 'FIRST NAME *',
      phFirstName: 'First Name',
      labelLastName: 'LAST NAME *',
      phLastName: 'Last Name',
      labelEmail: 'EMAIL *',
      phEmail: 'Email',
      labelPhone: 'PHONE NUMBER',
      phPhone: 'Phone number',
      labelCity: 'CITY *',
      phCity: 'City',
      labelZip: 'ZIP CODE',
      phZip: 'Zip/Postal code',
      labelCompany: 'COMPANY NAME',
      phCompany: 'Company name',
      labelWebsite: 'WEBSITE',
      phWebsite: 'Website / URL',
      labelMessage: 'TELL US MORE *',
      phMessage: 'Tell us about your project/business',
      btnSubmit: 'SUBMIT',
      successMsg: 'Thank you! Your inquiry has been sent. Our wholesale team will get in touch with you shortly.',
      errorMsg: 'Please fill out all required fields.'
    },
    tr: {
      heroLabel: 'TOPTAN KAHVE ÇÖZÜMLERİ',
      heroTitle: 'Nerede Olursanız Olun,\nCoffee Esto Yanınızda',
      heroSub: 'İşletmenize özel kahve harmanları, taze kavrulmuş nitelikli çekirdekler, ekipman desteği ve profesyonel barista eğitimleriyle yanınızdayız.',
      heroContact: 'Toptan kahve ve iş ortaklığı için iletişime geçin.',
      heroContactName: 'Hakan Akdağ',
      heroContactPhone: '0553 605 31 83',

      feed1Label: 'TOPTAN SATIŞ',
      feed1Title: 'Kafeler',
      feed1Text: 'Kafenizin hedef müşteri kitlesini birlikte analiz ediyor, damak zevkine en uygun kahve seçimini gerçekleştiriyoruz. İşletmenize özel reçete ve kavurma profilleri oluşturarak ürün standardınızı güçlendiriyor, müşteri memnuniyetini ve satış potansiyelinizi en üst seviyeye taşıyoruz.',
      
      feed2Label: 'EKİPMAN',
      feed2Title: 'Espresso Makineleri & Kurulum',
      feed2Text: 'Ticari espresso makineleri, öğütücüler ve özel bar kurulumları sağlıyoruz. Uçtan uca proje danışmanlığı, teslimat ve profesyonel kurulumdan tek çatı altında yararlanın.',
      
      feed3Label: 'EĞİTİM',
      feed3Title: 'Barista Eğitimi',
      feed3Text: 'Sürdürülebilir kalite, doğru eğitimle başlar. Toptan iş ortaklarımıza; uygulamalı barista eğitimi, ekipman kullanımı, reçete standardizasyonu ve periyodik tadım desteği sunuyoruz. Böylece her fincanda aynı kaliteyi korumanızı ve müşteri memnuniyetini artırmanızı sağlıyoruz.',
      
      feed4Label: 'DOĞRUDAN TEDARİK',
      feed4Title: 'Kaynaklarımız & Değerlerimiz',
      feed4Text: 'Kahvelerimizi üretici çiftçilerden ve güvenilir tedarikçilerden, kalite standartlarına uygun şekilde temin ediyoruz. Her çekirdeği tat profili, kalite ve kullanım amacına göre özenle seçiyor; kavurma sürecinin her aşamasında sürdürülebilir kaliteyi ön planda tutuyoruz.',
      
      feed5Label: 'OFİS & TİCARİ',
      feed5Title: 'Ofis Kahve Programları',
      feed5Text: 'Çalışma ortamınıza özel kahve çözümleri sunuyoruz. Ofisinizin büyüklüğü ve tüketim ihtiyacına göre uygun ekipman, kahve tedariki ve düzenli teslimat planı oluşturuyor; çalışanlarınıza her gün taze ve standart kalitede kahve deneyimi sağlıyoruz.',
      
      quote: '“Coffee Esto olarak, kahvenin tedarik, kavurma ve toptan satış ortaklıklarımız aracılığıyla özel bir şey olması gerektiği fikrini somutlaştırmak için çalışıyoruz. Bu görünüşte basit ama dinamik ürünü yetiştirmek ve işlemek için harcanan muazzam riski ve emeği onurlandıran olağanüstü kahveleri size sunmak için çaba gösteriyoruz.”',
      quoteAuthor: 'DEĞERLERLE HİZMET / COFFEE ESTO ROASTERY',
      
      formTitle: 'Kayıt Olun',
      formSub: 'Ortaklık başlatmak için toptan satış ekibimizle iletişime geçin.',
      labelFirstName: 'ADINIZ *',
      phFirstName: 'Adınız',
      labelLastName: 'SOYADINIZ *',
      phLastName: 'Soyadınız',
      labelEmail: 'E-POSTA ADRESİNİZ *',
      phEmail: 'E-posta',
      labelPhone: 'TELEFON NUMARASI',
      phPhone: 'Telefon numaranız',
      labelCity: 'ŞEHİR *',
      phCity: 'Şehir',
      labelZip: 'POSTA KODU',
      phZip: 'Posta kodu',
      labelCompany: 'ŞİRKET ADI',
      phCompany: 'Şirket adı',
      labelWebsite: 'WEB SİTESİ',
      phWebsite: 'Web sitesi / URL',
      labelMessage: 'BİZE DETAYLARDAN BAHSEDİN *',
      phMessage: 'Projeniz veya işletmeniz hakkında bilgi verin',
      btnSubmit: 'GÖNDER',
      successMsg: 'Teşekkürler! Talebiniz iletildi. Toptan satış ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      errorMsg: 'Lütfen tüm zorunlu alanları doldurun.'
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.city || !formData.message) {
      alert(t.errorMsg);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />
      <div className={styles.navOffset} />

      {/* ── 1. Split Hero Section ────────────────────────────── */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        
        <motion.div
          ref={heroRef}
          className={styles.heroInner}
          initial={{ opacity: 0, y: 28 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.heroLabel}>{t.heroLabel}</span>
          <h1 className={styles.heroTitle}>
            {t.heroTitle.split('\n')[0]}<br />{t.heroTitle.split('\n')[1]}
          </h1>
          <p className={styles.heroSub}>{t.heroSub}</p>
          <div className={styles.heroContact}>
            <p className={styles.heroContactText}>{t.heroContact}</p>
            <a href={`tel:${t.heroContactPhone.replace(/\s+/g, '')}`} className={styles.heroContactLink}>
              {t.heroContactName} — {t.heroContactPhone}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Bento Grid Showcase ───────────────────────────── */}
      <section className={styles.feedSection}>
        <div className={styles.container}>
          <div className={styles.bentoGrid}>

            {/* Card 1: Cafes (Wide) */}
            <FadeUp className={`${styles.bentoCard} ${styles.cardWide}`}>
              <div className={styles.cardBg}>
                <img src="/images/brand-carrier.webp" alt="Cafes" className={styles.cardImg} />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>{t.feed1Label}</span>
                <h2 className={styles.cardHeading}>{t.feed1Title}</h2>
                <p className={styles.cardText}>{t.feed1Text}</p>
              </div>
            </FadeUp>

            {/* Card 2: Equipment (Standard) */}
            <FadeUp className={styles.bentoCard} delay={0.06}>
              <div className={styles.cardBg}>
                <img src="/images/about/about-4.webp" alt="Equipment" className={styles.cardImg} />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>{t.feed2Label}</span>
                <h2 className={styles.cardHeading}>{t.feed2Title}</h2>
                <p className={styles.cardText}>{t.feed2Text}</p>
              </div>
            </FadeUp>

            {/* Card 3: Barista Training (Standard) */}
            <FadeUp className={styles.bentoCard}>
              <div className={styles.cardBg}>
                <img src="/images/barista-class.webp" alt="Barista Training" className={styles.cardImg} />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>{t.feed3Label}</span>
                <h2 className={styles.cardHeading}>{t.feed3Title}</h2>
                <p className={styles.cardText}>{t.feed3Text}</p>
              </div>
            </FadeUp>

            {/* Card 4: Sourcing & Values (Standard) */}
            <FadeUp className={styles.bentoCard} delay={0.06}>
              <div className={styles.cardBg}>
                <img src="/images/hero_direct_farmers.png" alt="Sourcing & Values" className={styles.cardImg} />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>{t.feed4Label}</span>
                <h2 className={styles.cardHeading}>{t.feed4Title}</h2>
                <p className={styles.cardText}>{t.feed4Text}</p>
              </div>
            </FadeUp>

            {/* Card 5: Office Programs (Standard) */}
            <FadeUp className={styles.bentoCard} delay={0.12}>
              <div className={styles.cardBg}>
                <img src="/images/brand-sacks.webp" alt="Office Coffee Setup" className={styles.cardImg} />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>{t.feed5Label}</span>
                <h2 className={styles.cardHeading}>{t.feed5Title}</h2>
                <p className={styles.cardText}>{t.feed5Text}</p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── 3. Blockquote Section ────────────────────────────── */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <FadeUp className={styles.quoteContainer}>
            <blockquote className={styles.quoteText}>{t.quote}</blockquote>
            <div className={styles.quoteRule} />
            <span className={styles.quoteAuthor}>{t.quoteAuthor}</span>
          </FadeUp>
        </div>
      </section>

      {/* ── 4. B2B Wholesale Signup Form ─────────────────────── */}
      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>{t.formTitle}</h2>
          <p className={styles.formSub}>{t.formSub}</p>

          {submitted ? (
            <div className={styles.successBox}>
              <p>{t.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Row 1: Name */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>{t.labelFirstName}</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder={t.phFirstName}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>{t.labelLastName}</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder={t.phLastName}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>{t.labelEmail}</label>
                  <input
                    type="email"
                    id="email"
                    placeholder={t.phEmail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>{t.labelPhone}</label>
                  <input
                    type="text"
                    id="phone"
                    placeholder={t.phPhone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Row 3: City & Zip */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.label}>{t.labelCity}</label>
                  <input
                    type="text"
                    id="city"
                    placeholder={t.phCity}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="zip" className={styles.label}>{t.labelZip}</label>
                  <input
                    type="text"
                    id="zip"
                    placeholder={t.phZip}
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Row 4: Company & Website */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>{t.labelCompany}</label>
                  <input
                    type="text"
                    id="company"
                    placeholder={t.phCompany}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="website" className={styles.label}>{t.labelWebsite}</label>
                  <input
                    type="text"
                    id="website"
                    placeholder={t.phWebsite}
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Row 5: Message */}
              <div className={styles.formGroupFull}>
                <label htmlFor="message" className={styles.label}>{t.labelMessage}</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder={t.phMessage}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={styles.textarea}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>{t.btnSubmit}</button>

            </form>
          )}
        </div>
      </section>

      <Footer waveColor="#111111" locale={locale} />
    </div>
  );
}
