'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import styles from './BagLabel.module.css';

export interface BagLabelProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  altitude: string;
  varietal: string;
  roastLevel: number;
  tastingNotes: string;
}

interface BagLabelProps {
  product: BagLabelProduct;
  size: '250g' | '1kg';
  roastDate: string; // yyyy-mm-dd
  categoryLabel?: string;
  locale?: 'tr' | 'en';
}

const copy = {
  en: {
    altitude: 'Altitude', varietal: 'Varietal',
    roast: 'Roast', light: 'Light', dark: 'Dark',
    notes: 'Tasting notes', roasted: 'Roasted on',
    peak: 'Peak flavor', netWt: 'Net weight', scan: 'Brew guide',
    storage: 'Store sealed, cool & dry.',
  },
  tr: {
    altitude: 'Rakım', varietal: 'Çeşit',
    roast: 'Kavrum', light: 'Açık', dark: 'Koyu',
    notes: 'Tadım notları', roasted: 'Kavrum tarihi',
    peak: 'En taze', netWt: 'Net ağırlık', scan: 'Demleme rehberi',
    storage: 'Serin ve kuru yerde saklayın.',
  },
};

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function fmt(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export function BagLabel({ product, size, roastDate, categoryLabel, locale = 'tr' }: BagLabelProps) {
  const t = copy[locale];
  const [qr, setQr] = useState('');

  useEffect(() => {
    let cancelled = false;
    const url = `${window.location.origin}/coffee/${product.id}`;
    QRCode.toDataURL(url, { margin: 0, width: 240, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
      .then((data) => { if (!cancelled) setQr(data); })
      .catch(() => { if (!cancelled) setQr(''); });
    return () => { cancelled = true; };
  }, [product.id]);

  const roasted = parseDate(roastDate);
  const peakFrom = new Date(roasted); peakFrom.setDate(peakFrom.getDate() + 7);
  const peakTo = new Date(roasted); peakTo.setDate(peakTo.getDate() + 28);

  const yy = String(roasted.getFullYear()).slice(2);
  const mm = String(roasted.getMonth() + 1).padStart(2, '0');
  const dd = String(roasted.getDate()).padStart(2, '0');
  const batch = `${yy}${mm}${dd}-${product.id.slice(0, 4).toUpperCase()}`;

  // Only print what we actually know — never invent origin data.
  const specs = [
    { key: t.altitude, val: product.altitude },
    { key: t.varietal, val: product.varietal },
  ].filter((s) => s.val && s.val.trim());

  const segments = Math.min(5, Math.max(1, Math.ceil((product.roastLevel || 50) / 20)));
  const weight = size === '1kg' ? '1 KG' : '250 G';

  return (
    <div className={styles.label}>
      <div className={styles.header}>
        <img src="/images/logo.png" alt="" className={styles.logo} />
        <div>
          <div className={styles.brand}>The Coffee Esto</div>
          <div className={styles.brandSub}>Roastery · İstanbul</div>
        </div>
        <div className={styles.weight}>
          {weight}
          <div className={styles.weightSub}>{t.netWt}</div>
        </div>
      </div>

      {categoryLabel && <div className={styles.kicker}>{categoryLabel}</div>}
      <h1 className={`${styles.name} ${product.name.length > 22 ? styles.nameLong : ''}`}>{product.name}</h1>
      {product.origin && <div className={styles.origin}>{product.origin}</div>}

      {specs.length > 0 && (
        <div className={styles.specs} style={{ ['--cols' as string]: specs.length }}>
          {specs.map((s) => (
            <div key={s.key} className={styles.spec}>
              <div className={styles.specKey}>{s.key}</div>
              <div className={styles.specVal}>{s.val}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.roast}>
        <div className={styles.specKey}>{t.roast}</div>
        <div className={styles.roastRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`${styles.roastSeg} ${n <= segments ? styles.roastSegOn : ''}`} />
          ))}
        </div>
        <div className={styles.roastEnds}><span>{t.light}</span><span>{t.dark}</span></div>
      </div>

      {product.tastingNotes && product.tastingNotes.trim() && (
        <div className={styles.notes}>
          <div className={styles.notesKey}>{t.notes}</div>
          <div className={styles.notesVal}>{product.tastingNotes}</div>
        </div>
      )}

      <div className={styles.footer}>
        <div>
          <div className={styles.roastedKey}>{t.roasted}</div>
          <div className={styles.roastedVal}>{fmt(roasted)}</div>
          <div className={styles.fresh}>
            {t.peak}: {fmt(peakFrom)} – {fmt(peakTo)}
            <br />
            {t.storage}
          </div>
          <div className={styles.batch}>LOT {batch}</div>
        </div>
        <div className={styles.qr}>
          {qr && <img src={qr} alt="" className={styles.qrImg} />}
          <div className={styles.qrCaption}>{t.scan}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the label into <body> so printing can hide the whole admin UI and
 * output just this element on a 4 x 6 in page.
 */
export function BagLabelPrintLayer(props: BagLabelProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      <style media="print">{`
        @page { size: 4in 6in; margin: 0; }
        html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
        body > *:not([data-bag-label-print]) { display: none !important; }
        [data-bag-label-print], [data-bag-label-print] * { visibility: visible !important; }
        [data-bag-label-print] { display: block !important; }
      `}</style>
      <div data-bag-label-print className={styles.printRoot}>
        <BagLabel {...props} />
      </div>
    </>,
    document.body
  );
}
