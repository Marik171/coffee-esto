'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../app/checkout/success/success.module.css';

interface CheckoutSuccessContentProps {
  locale: string;
}

function SuccessMessage({ locale }: CheckoutSuccessContentProps) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ESTO-MOCK-ORDER';
  const total = searchParams.get('total') || '0';
  const email = searchParams.get('email') || 'customer@domain.com';

  const t = {
    en: {
      thanks: 'Thank You for Your Order!',
      received: 'Your order has been received and enqueued in our roasting schedule.',
      orderNumber: 'Order Number',
      totalPaid: 'Total Amount Paid',
      confirmationSent: 'Confirmation Sent To',
      nextSteps: '🚚 What Happens Next?',
      roastScheduleTitle: 'Roasting Schedule:',
      roastScheduleText: 'Your beans will be custom profiled and roasted in our next small batch (tomorrow morning).',
      aromaSealTitle: 'Aroma-Locked Seal:',
      aromaSealText: 'Once roasted, your coffee is packed directly into degassing-valved pouches to protect the volatile flavors.',
      dispatchTitle: 'Courier Dispatch:',
      dispatchText: 'Dispatched within 24-48 hours. A live tracking code will be emailed to you immediately.',
      trackBtn: 'Track Your Order Live 📦',
      continueBtn: 'Continue Shopping',
    },
    tr: {
      thanks: 'Siparişiniz İçin Teşekkür Ederiz!',
      received: 'Siparişiniz başarıyla alındı ve kavurma programımıza eklendi.',
      orderNumber: 'Sipariş Numarası',
      totalPaid: 'Toplam Ödenen Tutar',
      confirmationSent: 'Onay E-postası Gönderilen Adres',
      nextSteps: '🚚 Şimdi Ne Olacak?',
      roastScheduleTitle: 'Kavurma Programı:',
      roastScheduleText: 'Çekirdekleriniz yarın sabah ilk küçük ölçekli kavrumumuzda size özel profilde kavrulacaktır.',
      aromaSealTitle: 'Valfli Koruyucu Paketleme:',
      aromaSealText: 'Kavrum sonrası kahveniz, uçucu aromaları korumak için doğrudan tazelik valfli özel paketlere konur.',
      dispatchTitle: 'Kargo Teslimi:',
      dispatchText: 'Kahveniz 24-48 saat içinde kargoya verilir ve takip kodu anında e-postanıza iletilir.',
      trackBtn: 'Siparişinizi Canlı Takip Edin 📦',
      continueBtn: 'Alışverişe Devam Et',
    }
  }[locale === 'tr' ? 'tr' : 'en'];

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        {/* Animated Celebration Icon */}
        <div className={styles.checkmarkWrapper}>
          <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
            <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 className={styles.title}>{t.thanks}</h1>
        <p className={styles.subtitle}>{t.received}</p>

        {/* Transaction Summary Card */}
        <div className={styles.receiptBox}>
          <div className={styles.receiptRow}>
            <span className={styles.label}>{t.orderNumber}</span>
            <span className={styles.valueMono}>{orderId}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.label}>{t.totalPaid}</span>
            <span className={styles.valueTotal}>₺{parseFloat(total).toFixed(2)}</span>
          </div>
          <div className={styles.receiptRow}>
            <span className={styles.label}>{t.confirmationSent}</span>
            <span className={styles.valueEmail}>{email}</span>
          </div>
        </div>

        {/* Roastery Logistics Details */}
        <div className={styles.logisticsBlock}>
          <h3 className={styles.logisticsTitle}>{t.nextSteps}</h3>
          <ul className={styles.logisticsList}>
            <li>
              <span className={styles.logisticsIcon}>🔥</span>
              <span className={styles.logisticsText}>
                <strong>{t.roastScheduleTitle}</strong> {t.roastScheduleText}
              </span>
            </li>
            <li>
              <span className={styles.logisticsIcon}>📦</span>
              <span className={styles.logisticsText}>
                <strong>{t.aromaSealTitle}</strong> {t.aromaSealText}
              </span>
            </li>
            <li>
              <span className={styles.logisticsIcon}>🛵</span>
              <span className={styles.logisticsText}>
                <strong>{t.dispatchTitle}</strong> {t.dispatchText}
              </span>
            </li>
          </ul>
        </div>

        {/* Call to Actions */}
        <div className={styles.actionRow}>
          <Link 
            href={`${locale === 'tr' ? '' : '/en'}/orders/track?orderId=${orderId}&email=${encodeURIComponent(email)}`} 
            className={styles.continueBtn}
          >
            {t.trackBtn}
          </Link>
          <Link href={locale === 'tr' ? '/coffee' : '/en/coffee'} className={styles.homeBtn}>
            {t.continueBtn}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessContent({ locale }: CheckoutSuccessContentProps) {
  return (
    <div className={styles.pageWrapper}>
      {/* Centered navigation logo header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoTop}>COFFEE</span>
            <span className={styles.logoMiddle}>ESTO</span>
            <span className={styles.logoBottom}>ROASTERY</span>
          </div>
        </div>
      </header>

      <Suspense fallback={<div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
        <SuccessMessage locale={locale} />
      </Suspense>
    </div>
  );
}
