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
      heroLabel: 'WHOLESALE PARTNERSHIPS',
      heroTitle: 'Serve Coffee Esto\nWherever You Are',
      heroSub: 'Learn more about our wholesale opportunities and how we can support your business with specialty coffee, equipment, and training.',
      
      feed1Label: 'WHOLESALE',
      feed1Title: 'Cafes',
      feed1Text: 'We roast micro-lots to order and design specific blends to fit your cafe\'s workflow. Partner with us for coffee that elevates your brand and keeps customers coming back.',
      
      feed2Label: 'EQUIPMENT',
      feed2Title: 'Espresso Machinery & Project Setup',
      feed2Text: 'We supply commercial espresso machines, grinders, and custom bar setups. Benefit from end-to-end consulting, delivery, and professional installation under one roof.',
      
      feed3Label: 'EDUCATION',
      feed3Title: 'Barista Training',
      feed3Text: 'Training is key to consistency. We provide hands-on barista classes, recipe mapping, and ongoing tasting cuppings for all our wholesale accounts.',
      
      feed4Label: 'DIRECT TRADE',
      feed4Title: 'Our Sourcing & Values',
      feed4Text: 'Ethical micro-lots sourced directly from farms in Colombia, Brazil, and Ethiopia. We pay quality premiums that directly support grower communities.',
      
      feed5Label: 'OFFICES & COMMERCIAL',
      feed5Title: 'Office Coffee Programs',
      feed5Text: 'Bring specialty coffee to your workplace. We offer modular equipment leases, brewers, and recurring fresh-roasted whole bean deliveries tailored for your office size.',
      
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
      heroLabel: 'TOPTAN ORTAKLIKLAR',
      heroTitle: 'Nerede Olursanız Olun\nCoffee Esto Sunun',
      heroSub: 'Toptan satış fırsatlarımız ve işletmenizi nitelikli kahve, ekipman ve eğitimlerle nasıl destekleyebileceğimiz hakkında daha fazla bilgi edinin.',
      
      feed1Label: 'TOPTAN SATIŞ',
      feed1Title: 'Kafeler',
      feed1Text: 'Kafelerinizin iş akışına uyması için mikro lotları sipariş üzerine kavuruyor ve özel harmanlar tasarlıyoruz. Markanızı yükselten kahveler için bizimle ortak olun.',
      
      feed2Label: 'EKİPMAN',
      feed2Title: 'Espresso Makineleri & Kurulum',
      feed2Text: 'Ticari espresso makineleri, öğütücüler ve özel bar kurulumları sağlıyoruz. Uçtan uca proje danışmanlığı, teslimat ve profesyonel kurulumdan tek çatı altında yararlanın.',
      
      feed3Label: 'EĞİTİM',
      feed3Title: 'Barista Eğitimi',
      feed3Text: 'Eğitim, tutarlılığın anahtarıdır. Tüm toptan satış ortaklarımız için uygulamalı barista dersleri, reçete çıkarma ve sürekli tadım seansları sunuyoruz.',
      
      feed4Label: 'DOĞRUDAN TEDARİK',
      feed4Title: 'Kaynaklarımız & Değerlerimiz',
      feed4Text: 'Kolombiya, Brezilya ve Etiyopya\'daki çiftliklerden doğrudan temin edilen etik mikro lotlar. Üretici topluluklarını doğrudan destekleyen kalite primleri ödüyoruz.',
      
      feed5Label: 'OFİS & TİCARİ',
      feed5Title: 'Ofis Kahve Programları',
      feed5Text: 'Nitelikli kahveyi iş yerinize taşıyın. Ofis büyüklüğünüze göre uyarlanmış modüler ekipman kiralama, demleyiciler ve düzenli taze kahve gönderimleri sunuyoruz.',
      
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

      {/* ── 1. Split Hero Section ────────────────────────────── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <motion.div
              ref={heroRef}
              className={styles.heroContent}
              initial={{ opacity: 0, y: 28 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className={styles.heroLabel}>{t.heroLabel}</span>
              <h1 className={styles.heroTitle}>
                {t.heroTitle.split('\n')[0]}<br />{t.heroTitle.split('\n')[1]}
              </h1>
              <p className={styles.heroSub}>{t.heroSub}</p>
            </motion.div>
            
            <div className={styles.heroImageFrame}>
              <img
                src="/images/about/about-7.webp"
                alt="Serve Coffee Esto"
                className={styles.heroImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Alternating Feed Grid ─────────────────────────── */}
      <section className={styles.feedSection}>
        <div className={styles.container}>
          <div className={styles.feed}>

            {/* Row 1: Cafes */}
            <div className={styles.feedRow}>
              <FadeUp className={styles.feedColImage}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-2.webp" alt="Cafes" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.feedColContent} delay={0.08}>
                <span className={styles.feedLabel}>{t.feed1Label}</span>
                <h2 className={styles.feedHeading}>{t.feed1Title}</h2>
                <p className={styles.feedText}>{t.feed1Text}</p>
              </FadeUp>
            </div>

            {/* Row 2: Equipment */}
            <div className={styles.feedRowReverse}>
              <FadeUp className={styles.feedColContent}>
                <span className={styles.feedLabel}>{t.feed2Label}</span>
                <h2 className={styles.feedHeading}>{t.feed2Title}</h2>
                <p className={styles.feedText}>{t.feed2Text}</p>
              </FadeUp>
              <FadeUp className={styles.feedColImage} delay={0.08}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-4.webp" alt="Espresso Equipment Setup" className={styles.feedImg} />
                </div>
              </FadeUp>
            </div>

            {/* Row 3: Barista Training */}
            <div className={styles.feedRow}>
              <FadeUp className={styles.feedColImage}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-6.webp" alt="Barista Training" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.feedColContent} delay={0.08}>
                <span className={styles.feedLabel}>{t.feed3Label}</span>
                <h2 className={styles.feedHeading}>{t.feed3Title}</h2>
                <p className={styles.feedText}>{t.feed3Text}</p>
              </FadeUp>
            </div>

            {/* Row 4: Sourcing & Values */}
            <div className={styles.feedRowReverse}>
              <FadeUp className={styles.feedColContent}>
                <span className={styles.feedLabel}>{t.feed4Label}</span>
                <h2 className={styles.feedHeading}>{t.feed4Title}</h2>
                <p className={styles.feedText}>{t.feed4Text}</p>
              </FadeUp>
              <FadeUp className={styles.feedColImage} delay={0.08}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-3.webp" alt="Sourcing & Values" className={styles.feedImg} />
                </div>
              </FadeUp>
            </div>

            {/* Row 5: Offices */}
            <div className={styles.feedRow}>
              <FadeUp className={styles.feedColImage}>
                <div className={styles.imageFrame}>
                  <img src="/images/about/about-1.webp" alt="Office Coffee Setup" className={styles.feedImg} />
                </div>
              </FadeUp>
              <FadeUp className={styles.feedColContent} delay={0.08}>
                <span className={styles.feedLabel}>{t.feed5Label}</span>
                <h2 className={styles.feedHeading}>{t.feed5Title}</h2>
                <p className={styles.feedText}>{t.feed5Text}</p>
              </FadeUp>
            </div>

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
