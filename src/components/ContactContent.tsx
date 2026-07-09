'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../app/contact/contact.module.css';

interface ContactContentProps {
  locale?: string;
}

export default function ContactContent({ locale = 'en' }: ContactContentProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const translations = {
    en: {
      title: 'Contact Us',
      officeTitle: 'Offices and Roastery',
      officeVal: 'Coffee Esto Roastery\nTopselvi Mh, Kartal\nİstanbul, Turkey',
      touchTitle: 'Get in Touch',
      emailVal: 'hello@coffeesto.com',
      phoneVal: '+90 553 605 31 83',
      linksTitle: 'Quick Links',
      linkShop: 'Shop Products',
      linkWholesale: 'Wholesale Solutions',
      intro: 'We\'re looking forward to hearing from you.',
      labelName: 'NAME *',
      phName: 'Your name',
      labelEmail: 'EMAIL *',
      phEmail: 'your@email.com',
      labelPhone: 'PHONE',
      phPhone: '+90 (553) 605-3183',
      labelMsg: 'MESSAGE *',
      phMsg: 'How can we help?',
      btnSend: 'SEND MESSAGE',
      successMsg: 'Thank you! Your message has been sent. We will get back to you shortly.',
      errorRequired: 'Please fill out all required fields.'
    },
    tr: {
      title: 'Bizimle İletişime Geçin',
      officeTitle: 'Ofis ve Kavurmahane',
      officeVal: 'Coffee Esto Roastery\nTopselvi Mh, Kartal\nİstanbul, Türkiye',
      touchTitle: 'Bize Ulaşın',
      emailVal: 'hello@coffeesto.com',
      phoneVal: '+90 553 605 31 83',
      linksTitle: 'Hızlı Bağlantılar',
      linkShop: 'Ürünlerimizi İnceleyin',
      linkWholesale: 'Toptan Çözümler',
      intro: 'Sizden haber almayı sabırsızlıkla bekliyoruz.',
      labelName: 'ADINIZ *',
      phName: 'Adınız',
      labelEmail: 'E-POSTA ADRESİNİZ *',
      phEmail: 'eposta@adresiniz.com',
      labelPhone: 'TELEFON',
      phPhone: '+90 (553) 605-3183',
      labelMsg: 'MESAJINIZ *',
      phMsg: 'Nasıl yardımcı olabiliriz?',
      btnSend: 'MESAJI GÖNDER',
      successMsg: 'Teşekkürler! Mesajınız gönderildi. En kısa sürede size geri dönüş sağlayacağız.',
      errorRequired: 'Lütfen tüm zorunlu alanları doldurun.'
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert(t.errorRequired);
      return;
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />

      {/* ── 1. Page Header Block ──────────────────────────────── */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.headerGrid}>
            
            {/* Left Title */}
            <div className={styles.titleCol}>
              <h1 className={styles.mainTitle}>{t.title}</h1>
            </div>

            {/* Right Information Columns */}
            <div className={styles.infoCols}>
              
              {/* Col 1: Address */}
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>{t.officeTitle}</h3>
                <p className={styles.blockText}>
                  {t.officeVal.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < t.officeVal.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              {/* Col 2: Direct Contact */}
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>{t.touchTitle}</h3>
                <p className={styles.blockText}>
                  <a href={`mailto:${t.emailVal}`} className={styles.textLink}>
                    {t.emailVal}
                  </a>
                  <br />
                  <a href={`tel:${t.phoneVal.replace(/\s+/g, '')}`} className={styles.textLink}>
                    {t.phoneVal}
                  </a>
                </p>
              </div>

              {/* Col 3: Links */}
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>{t.linksTitle}</h3>
                <p className={styles.blockText}>
                  <Link href={`${linkPrefix}/coffee`} className={styles.textLink}>
                    {t.linkShop}
                  </Link>
                  <br />
                  <Link href={`${linkPrefix}/wholesale`} className={styles.textLink}>
                    {t.linkWholesale}
                  </Link>
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Contact Form Section ──────────────────────────── */}
      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <p className={styles.formIntro}>{t.intro}</p>

          {submitted ? (
            <div className={styles.successBox}>
              <p>{t.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Row 1: Name and Email */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    {t.labelName}
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder={t.phName}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    {t.labelEmail}
                  </label>
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
              </div>

              {/* Row 2: Phone */}
              <div className={styles.formGroupFull}>
                <label htmlFor="phone" className={styles.label}>
                  {t.labelPhone}
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder={t.phPhone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={styles.input}
                />
              </div>

              {/* Row 3: Message */}
              <div className={styles.formGroupFull}>
                <label htmlFor="message" className={styles.label}>
                  {t.labelMsg}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder={t.phMsg}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={styles.textarea}
                  required
                />
              </div>

              {/* Submit button */}
              <button type="submit" className={styles.submitBtn}>
                {t.btnSend}
              </button>

            </form>
          )}
        </div>
      </section>

      <Footer waveColor="#111111" locale={locale} />
    </div>
  );
}
