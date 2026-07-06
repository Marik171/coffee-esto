'use client';

import React, { useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../app/orders/track/track.module.css';

/* ── Types ───────────────────────────────────────────────────── */
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SanitizedOrder {
  id: string;
  email: string;
  address: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'canceled';
  payment_status: 'awaiting' | 'captured' | 'refunded' | 'canceled';
  fulfillment_status: 'not_fulfilled' | 'roasting' | 'fulfilled' | 'shipped' | 'canceled';
  trackingNumber: string;
  shippingProvider: string;
  items: OrderItem[];
  createdAt: string;
}

/* ── SVG icons ───────────────────────────────────────────────── */
const IconCard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="22" height="16" x="1" y="4" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const IconFlame = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3Z"/>
  </svg>
);

const IconPackage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

const IconTruck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
    <rect width="7" height="7" x="14" y="10" rx="1"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);

/* ── FadeUp helper ───────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

interface TrackPageContentProps {
  locale: string;
}

/* ── Main content (needs Suspense for useSearchParams) ───────── */
function TrackPageContent({ locale }: TrackPageContentProps) {
  const searchParams = useSearchParams();

  /* Track state */
  const [trackId, setTrackId]     = useState(searchParams.get('orderId') || '');
  const [trackEmail, setTrackEmail] = useState(searchParams.get('email') || '');
  const [order, setOrder]           = useState<SanitizedOrder | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError]     = useState('');

  /* Cancel state */
  const [cancelId, setCancelId]       = useState('');
  const [cancelEmail, setCancelEmail] = useState('');
  const [cancelState, setCancelState] = useState<'idle' | 'confirming' | 'loading' | 'done' | 'error'>('idle');
  const [cancelError, setCancelError] = useState('');

  const translations = {
    en: {
      trackingEyebrow: 'Real-Time Tracking',
      trackingTitle: 'Track Your Delivery',
      trackingSub: 'Enter your order reference and email to see roast and shipping progress.',
      formErrorMissing: 'Enter both your Order ID and email address.',
      fieldRef: 'Order Reference ID',
      fieldEmail: 'Email Address',
      fieldEmailPlaceholder: 'The email used at checkout',
      trackBtn: 'Track My Order',
      trackBtnLoading: 'Locating Order…',
      backBtn: 'Track Another Order',
      canceledBannerTitle: 'Order Canceled',
      canceledBannerSub: 'This order has been canceled. Please allow 3–5 business days for the refund to appear.',
      progressTitle: 'Roast & Ship Progress',
      progressCanceled: 'Order Canceled',
      progressTransit: 'In Transit',
      progressRoasting: 'Roasting',
      progressProcessing: 'Processing',
      shipDetails: 'Shipment Details',
      shipDetailsText: 'Shipped via {provider} — tracking reference:',
      enRoute: 'En Route',
      receiptTitle: 'Order Receipt',
      summary: 'Summary',
      summaryOrderId: 'Order ID',
      summaryPlaced: 'Placed',
      summaryShipTo: 'Ship To',
      itemsOrdered: 'Items Ordered',
      each: 'each',
      totalPaid: 'Total Paid',
      cancelEyebrow: 'Order Cancellation',
      cancelTitle: 'Cancel Your Order',
      cancelSub: 'Cancellations are only possible before we begin roasting. Once your beans are on the drum, the process cannot be reversed — all coffee is freshly roasted to order.',
      cancelWarning: 'Cancellations are irreversible. Your payment will be voided and a refund will be issued within 3–5 business days.',
      cancelSuccessTitle: 'Order Canceled Successfully',
      cancelSuccessDesc: 'Your payment has been voided. Please allow 3–5 business days for the refund to appear in your account.',
      cancelConfirmText: 'Are you sure you want to cancel order {id}? This action cannot be undone.',
      cancelYesBtn: 'Yes, Cancel My Order',
      cancelNoBtn: 'Keep My Order',
      cancelFailedTitle: 'Cancellation Failed',
      cancelRetryBtn: 'Try Again',
      cancelRequestBtn: 'Request Cancellation',
      cancelFormError: 'Enter both your Order ID and email to proceed.',
      supportText: 'Need help? {visitLink} or call {phoneLink}.',
      visitUs: 'Visit us in person',
      timeline: {
        paymentConf: 'Payment Confirmed',
        paymentConfActive: 'Payment successfully captured by the roastery.',
        paymentConfInactive: 'Awaiting payment verification.',
        roasting: 'Artisanal Roasting',
        roastingActive: 'Beans custom-roasted and sealed in degassing valved bags.',
        roastingInactive: 'Awaiting scheduled roast profile.',
        dispatched: 'Dispatched',
        dispatchedActive: 'Package handed to courier and on its way to you.',
        dispatchedInactive: 'Awaiting courier handoff.',
      }
    },
    tr: {
      trackingEyebrow: 'Gerçek Zamanlı Takip',
      trackingTitle: 'Teslimatınızı Takip Edin',
      trackingSub: 'Kavurma ve nakliye sürecini görmek için sipariş referansınızı ve e-postanızı girin.',
      formErrorMissing: 'Lütfen Sipariş ID ve e-posta adresinizi girin.',
      fieldRef: 'Sipariş Referans ID',
      fieldEmail: 'E-posta Adresi',
      fieldEmailPlaceholder: 'Ödeme sırasında kullanılan e-posta',
      trackBtn: 'Siparişimi Takip Et',
      trackBtnLoading: 'Sipariş Aranıyor…',
      backBtn: 'Başka Bir Siparişi Takip Et',
      canceledBannerTitle: 'Sipariş İptal Edildi',
      canceledBannerSub: 'Bu sipariş iptal edilmiştir. İadenin görünmesi için lütfen 3-5 iş günü bekleyin.',
      progressTitle: 'Kavrum & Kargo Durumu',
      progressCanceled: 'Sipariş İptal Edildi',
      progressTransit: 'Yolda',
      progressRoasting: 'Kavruluyor',
      progressProcessing: 'İşleniyor',
      shipDetails: 'Gönderi Detayları',
      shipDetailsText: '{provider} ile gönderildi — takip numarası:',
      enRoute: 'Yolda',
      receiptTitle: 'Sipariş Makbuzu',
      summary: 'Özet',
      summaryOrderId: 'Sipariş ID',
      summaryPlaced: 'Tarih',
      summaryShipTo: 'Teslimat Adresi',
      itemsOrdered: 'Sipariş Edilen Ürünler',
      each: 'adet',
      totalPaid: 'Toplam Ödenen',
      cancelEyebrow: 'Sipariş İptali',
      cancelTitle: 'Siparişinizi İptal Edin',
      cancelSub: 'İptaller yalnızca kavurma işlemine başlamadan önce mümkündür. Çekirdekleriniz tambura girdiğinde işlem geri alınamaz — tüm kahveler sipariş üzerine taze kavrulur.',
      cancelWarning: 'İptal işlemleri geri alınamaz. Ödemeniz iptal edilecek ve 3-5 iş günü içinde iade yapılacaktır.',
      cancelSuccessTitle: 'Sipariş Başarıyla İptal Edildi',
      cancelSuccessDesc: 'Ödemeniz iptal edildi. İadenin hesabınızda görünmesi için lütfen 3-5 iş günü bekleyin.',
      cancelConfirmText: '{id} numaralı siparişi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      cancelYesBtn: 'Evet, Siparişimi İptal Et',
      cancelNoBtn: 'Siparişimi Koru',
      cancelFailedTitle: 'İptal İşlemi Başarısız Oldu',
      cancelRetryBtn: 'Tekrar Deneyin',
      cancelRequestBtn: 'İptal Talebi Gönder',
      cancelFormError: 'Devam etmek için Sipariş ID ve e-postanızı girin.',
      supportText: 'Yardıma mı ihtiyacınız var? {visitLink} veya {phoneLink} numaralı telefonu arayın.',
      visitUs: 'Bizi şubemizde ziyaret edin',
      timeline: {
        paymentConf: 'Ödeme Onaylandı',
        paymentConfActive: 'Ödeme kavurmahane tarafından başarıyla alındı.',
        paymentConfInactive: 'Ödeme doğrulaması bekleniyor.',
        roasting: 'Nitelikli Kavurma',
        roastingActive: 'Çekirdekler özel olarak kavruldu ve gaz tahliye valfli torbalarda mühürlendi.',
        roastingInactive: 'Planlanan kavurma profili bekleniyor.',
        dispatched: 'Kargoya Verildi',
        dispatchedActive: 'Paket kuryeye teslim edildi ve size doğru yolda.',
        dispatchedInactive: 'Kurye teslimatı bekleniyor.',
      }
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  /* ── Track submit ────────────────────────────────────────── */
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setOrder(null);
    if (!trackId || !trackEmail) { setTrackError(t.formErrorMissing); return; }
    setTrackLoading(true);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: trackId.trim(), email: trackEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || (locale === 'tr' ? 'Sipariş bulunamadı.' : 'Order not found.'));
      setOrder(data.data);
      setCancelId(trackId.trim());
      setCancelEmail(trackEmail.trim());
    } catch (err: unknown) {
      setTrackError(err instanceof Error ? err.message : (locale === 'tr' ? 'Sorgulama başarısız. Bilgileri kontrol edip tekrar deneyin.' : 'Lookup failed. Check your details and try again.'));
    } finally {
      setTrackLoading(false);
    }
  };

  /* ── Cancel submit ───────────────────────────────────────── */
  const handleCancelConfirm = async () => {
    if (!cancelId || !cancelEmail) { setCancelError(t.cancelFormError); return; }
    setCancelState('loading');
    setCancelError('');
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: cancelId.trim(), email: cancelEmail.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setCancelState('done');
      if (order?.id === cancelId.trim()) {
        setOrder(prev => prev ? { ...prev, status: 'canceled', fulfillment_status: 'canceled', payment_status: 'refunded' } : prev);
      }
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : (locale === 'tr' ? 'İptal işlemi başarısız. Destek ekibiyle iletişime geçin.' : 'Cancellation failed. Contact support.'));
      setCancelState('error');
    }
  };

  const isPaid       = order ? ['captured', 'refunded'].includes(order.payment_status) : false;
  const isRoasting   = order ? ['roasting', 'fulfilled', 'shipped'].includes(order.fulfillment_status) : false;
  const isDispatched = order ? order.fulfillment_status === 'shipped' : false;
  const isCanceled   = order ? order.status === 'canceled' : false;

  const timelineSteps = [
    {
      icon: <IconCard />,
      label: t.timeline.paymentConf,
      isActive: isPaid,
      activeDesc: t.timeline.paymentConfActive,
      inactiveDesc: t.timeline.paymentConfInactive,
    },
    {
      icon: <IconFlame />,
      label: t.timeline.roasting,
      isActive: isRoasting,
      activeDesc: t.timeline.roastingActive,
      inactiveDesc: t.timeline.roastingInactive,
    },
    {
      icon: <IconPackage />,
      label: t.timeline.dispatched,
      isActive: isDispatched,
      activeDesc: t.timeline.dispatchedActive,
      inactiveDesc: t.timeline.dispatchedInactive,
    },
  ];

  return (
    <>
      {/* ── 1. Track Order Section ─────────────────────────── */}
      <section className={styles.trackSection} aria-labelledby="track-title">
        <div className={styles.container}>
          <FadeUp className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t.trackingEyebrow}</span>
            <h2 id="track-title" className={styles.sectionTitle}>{t.trackingTitle}</h2>
            <p className={styles.sectionSub}>{t.trackingSub}</p>
          </FadeUp>

          <AnimatePresence mode="wait">
            {!order ? (
              /* Search form */
              <motion.div key="track-form"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={styles.formWrap}
              >
                <div className={styles.formCard}>
                  {trackError && (
                    <div className={styles.errorAlert} role="alert">
                      <IconX />
                      {trackError}
                    </div>
                  )}
                  <form onSubmit={handleTrack} className={styles.form}>
                    <div className={styles.field}>
                      <label htmlFor="track-id" className={styles.fieldLabel}>{t.fieldRef}</label>
                      <input id="track-id" type="text" required value={trackId}
                        onChange={e => setTrackId(e.target.value)}
                        placeholder="e.g. ESTO-L7B9C-1F04"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="track-email" className={styles.fieldLabel}>{t.fieldEmail}</label>
                      <input id="track-email" type="email" required value={trackEmail}
                        onChange={e => setTrackEmail(e.target.value)}
                        placeholder={t.fieldEmailPlaceholder}
                        className={styles.input}
                      />
                    </div>
                    <button type="submit" disabled={trackLoading} className={styles.submitBtn}>
                      {trackLoading
                        ? <><span className={styles.btnSpinner} aria-hidden="true" /> {t.trackBtnLoading}</>
                        : t.trackBtn}
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              /* Results */
              <motion.div key="track-results"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={styles.resultsWrap}
              >
                <button onClick={() => setOrder(null)} className={styles.backBtn}>
                  <IconArrowLeft /> {t.backBtn}
                </button>

                {isCanceled && (
                  <div className={styles.canceledBanner}>
                    <IconX />
                    <div>
                      <strong>{t.canceledBannerTitle}</strong>
                      <p>{t.canceledBannerSub}</p>
                    </div>
                  </div>
                )}

                <div className={styles.resultsGrid}>
                  {/* Timeline */}
                  <div className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardEyebrow}>{t.progressTitle}</span>
                      <h3 className={styles.cardTitle}>
                        {isCanceled
                          ? t.progressCanceled
                          : isDispatched
                            ? t.progressTransit
                            : isRoasting
                              ? t.progressRoasting
                              : t.progressProcessing}
                      </h3>
                    </div>

                    <div className={styles.timeline}>
                      {timelineSteps.map((step, i) => (
                        <div key={step.label} className={`${styles.timelineItem} ${step.isActive && !isCanceled ? styles.timelineItemActive : ''}`}>
                          <div className={styles.timelineLeft}>
                            <div className={`${styles.timelineDot} ${step.isActive && !isCanceled ? styles.timelineDotActive : ''}`}>
                              {step.icon}
                            </div>
                            {i < timelineSteps.length - 1 && (
                              <div className={`${styles.timelineLine} ${step.isActive && timelineSteps[i + 1]?.isActive && !isCanceled ? styles.timelineLineActive : ''}`} />
                            )}
                          </div>
                          <div className={styles.timelineContent}>
                            <h4 className={styles.timelineLabel}>{step.label}</h4>
                            <p className={styles.timelineDesc}>
                              {isCanceled ? (locale === 'tr' ? 'Sipariş bu aşamadan önce iptal edildi.' : 'Order was canceled before this stage.') : step.isActive ? step.activeDesc : step.inactiveDesc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isDispatched && order.trackingNumber && (
                      <div className={styles.trackingBox}>
                        <div className={styles.trackingBoxHeader}>
                          <IconTruck />
                          <span>{t.shipDetails}</span>
                        </div>
                        <p className={styles.trackingBoxText}>
                          {t.shipDetailsText.replace('{provider}', order.shippingProvider)}
                        </p>
                        <code className={styles.trackingCode}>{order.trackingNumber}</code>
                        <span className={styles.enRouteBadge}>{t.enRoute}</span>
                      </div>
                    )}
                  </div>

                  {/* Order summary */}
                  <div className={styles.summaryCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardEyebrow}>{t.receiptTitle}</span>
                      <h3 className={styles.cardTitle}>{t.summary}</h3>
                    </div>

                    <div className={styles.metaList}>
                      <div className={styles.metaRow}>
                        <span className={styles.metaKey}>{t.summaryOrderId}</span>
                        <code className={styles.metaVal}>{order.id}</code>
                      </div>
                      <div className={styles.metaRow}>
                        <span className={styles.metaKey}>{t.summaryPlaced}</span>
                        <span className={styles.metaVal}>{new Date(order.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span className={styles.metaKey}>{t.summaryShipTo}</span>
                        <span className={styles.metaVal}>{order.address}</span>
                      </div>
                    </div>

                    <div className={styles.itemsList}>
                      <span className={styles.itemsHeader}>{t.itemsOrdered}</span>
                      {order.items.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                          <div>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemPrice}>₺{item.price} {t.each}</span>
                          </div>
                          <span className={styles.itemQty}>× {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>{t.totalPaid}</span>
                      <span className={styles.totalValue}>₺{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className={styles.sectionDivider} aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--color-parchment,#ede5d0)" />
        </svg>
      </div>

      {/* ── 2. Cancel Order Section ────────────────────────── */}
      <section className={styles.cancelSection} aria-labelledby="cancel-title">
        <div className={styles.container}>
          <FadeUp className={styles.cancelHeader}>
            <div className={styles.cancelEyebrowRow}>
              <span className={styles.cancelEyebrow}>{t.cancelEyebrow}</span>
            </div>
            <h2 id="cancel-title" className={styles.cancelTitle}>{t.cancelTitle}</h2>
            <p className={styles.cancelSub}>
              {t.cancelSub}
            </p>
          </FadeUp>

          <FadeUp delay={0.08} className={styles.cancelCardWrap}>
            <div className={styles.cancelCard}>

              <div className={styles.cancelWarningBanner}>
                <IconAlertTriangle />
                <span>{t.cancelWarning}</span>
              </div>

              <AnimatePresence mode="wait">
                {cancelState === 'done' ? (
                  <motion.div key="cancel-done"
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    className={styles.cancelSuccess}
                  >
                    <div className={styles.cancelSuccessIcon}><IconCheck /></div>
                    <div>
                      <strong>{t.cancelSuccessTitle}</strong>
                      <p>{t.cancelSuccessDesc}</p>
                    </div>
                  </motion.div>
                ) : cancelState === 'confirming' ? (
                  <motion.div key="cancel-confirm"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={styles.cancelConfirmBox}
                  >
                    <p className={styles.confirmQuestion}>
                      {t.cancelConfirmText.replace('{id}', cancelId)}
                    </p>
                    {cancelState === 'confirming' && cancelError && (
                      <p className={styles.cancelErrMsg}>{cancelError}</p>
                    )}
                    <div className={styles.confirmBtns}>
                      <button onClick={handleCancelConfirm} className={styles.confirmYesBtn}>
                        {t.cancelYesBtn}
                      </button>
                      <button onClick={() => setCancelState('idle')} className={styles.confirmNoBtn}>
                        {t.cancelNoBtn}
                      </button>
                    </div>
                  </motion.div>
                ) : cancelState === 'error' ? (
                  <motion.div key="cancel-error"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={styles.cancelErrBox}
                  >
                    <IconX />
                    <div>
                      <strong>{t.cancelFailedTitle}</strong>
                      <p>{cancelError}</p>
                    </div>
                    <button onClick={() => { setCancelState('idle'); setCancelError(''); }} className={styles.cancelRetryBtn}>
                      {t.cancelRetryBtn}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="cancel-form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    {cancelError && <p className={styles.cancelErrMsg}>{cancelError}</p>}
                    <div className={styles.cancelFormGrid}>
                      <div className={styles.field}>
                        <label htmlFor="cancel-id" className={styles.fieldLabel}>{t.fieldRef}</label>
                        <input id="cancel-id" type="text" required value={cancelId}
                          onChange={e => setCancelId(e.target.value)}
                          placeholder="e.g. ESTO-L7B9C-1F04"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="cancel-email" className={styles.fieldLabel}>{t.fieldEmail}</label>
                        <input id="cancel-email" type="email" required value={cancelEmail}
                          onChange={e => setCancelEmail(e.target.value)}
                          placeholder={t.fieldEmailPlaceholder}
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!cancelId || !cancelEmail) { setCancelError(t.cancelFormError); return; }
                        setCancelError('');
                        setCancelState('confirming');
                      }}
                      className={styles.cancelSubmitBtn}
                    >
                      {t.cancelRequestBtn}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          <FadeUp delay={0.14} className={styles.cancelFootnote}>
            <p>
              {t.supportText
                .replace('{visitLink}', '')
                .replace('{phoneLink}', '')}
              {locale === 'tr' ? 'Yardıma mı ihtiyacınız var? ' : 'Need help? '}
              <Link href={`${linkPrefix}/location`} className={styles.cancelLink}>{t.visitUs}</Link>
              {locale === 'tr' ? ' veya ' : ' or call '}
              <a href="tel:+905536053183" className={styles.cancelLink}>+90 553 605 31 83</a>
              {locale === 'tr' ? ' arayın.' : '.'}
            </p>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

interface OrderTrackerContentProps {
  locale?: string;
}

export default function OrderTrackerContent({ locale = 'en' }: OrderTrackerContentProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const translations = {
    en: {
      eyebrow: 'Order Support',
      title: 'Track & Manage\nYour Order',
      sub: 'Real-time roast progress and delivery status — or request a cancellation before we start roasting.',
    },
    tr: {
      eyebrow: 'Sipariş Desteği',
      title: 'Siparişinizi\nTakip Edin & Yönetin',
      sub: 'Gerçek zamanlı kavrum ve teslimat durumu — veya biz kavurmaya başlamadan önce iptal talebinde bulunun.',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />

      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-title">
        {/* Floating Coffee Beans */}
        <img src="/images/beans.webp" className="heroBean heroBean1" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean2" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean3" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean4" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean5" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean6" alt="" />
        <img src="/images/beans.webp" className="heroBean heroBean7" alt="" />

        <motion.div
          ref={heroRef}
          className={styles.heroInner}
          initial={{ opacity: 0, y: 32 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.heroEyebrow}>{t.eyebrow}</span>
          <h1 id="hero-title" className={styles.heroTitle}>{t.title.split('\n')[0]}<br />{t.title.split('\n')[1]}</h1>
          <p className={styles.heroSub}>{t.sub}</p>
        </motion.div>
        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 L1440,100 L1440,45 C1080,5 720,95 360,20 C180,-10 60,40 0,50 Z" fill="var(--color-cream,#fdf8f0)" />
          </svg>
        </div>
      </section>

      <Suspense fallback={
        <div className={styles.suspenseFallback}>
          <div className={styles.suspenseSpinner} aria-hidden="true" />
          <p>{locale === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
        </div>
      }>
        <TrackPageContent locale={locale} />
      </Suspense>

      <Footer waveColor="#2c1a0e" locale={locale} />
    </div>
  );
}
