'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import CoffeeBag, { PRODUCT_STYLES } from './CoffeeBag';
import { localizeProduct } from '../lib/localize';
import styles from './WholesaleContent.module.css';

interface Product {
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
  wholesalePrice: number;
  stock: number;
  imageUrl: string;
  videoUrl: string;
}

interface WholesaleContentProps {
  locale: string;
}

const DEFAULT_STYLE = {
  bagColor: '#1a0e07',
  textColor: '#ffffff',
  accentColor: '#d97706',
  emoji: '☕️',
  illustration: null
};

export default function WholesaleContent({ locale }: WholesaleContentProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const getStyle = (id: string) => {
    return PRODUCT_STYLES[id] || DEFAULT_STYLE;
  };

  // Translations
  const t = {
    en: {
      title: 'Wholesale B2B Portal',
      subtitle: 'Premium freshly-roasted coffee with direct B2B pricing',
      description: 'Select your coffee requirements below. A minimum total order of 50kg is required to unlock wholesale reseller rates.',
      product: 'Product',
      specifications: 'Specifications & Profile',
      retailPrice: 'Retail (250g)',
      wholesalePrice: 'Wholesale (1kg)',
      qty: 'Quantity (kg)',
      totalWeight: 'Total Weight',
      minRequired: 'Min. 50kg required to checkout',
      addMore: 'Add {amount}kg more',
      eligible: 'Eligible for wholesale rates! 🎉',
      subtotal: 'Order Subtotal',
      checkoutBtn: 'Proceed to Checkout',
      freeShipping: 'Free B2B Cargo Delivery Included 🚚',
      loading: 'Loading pricing sheet...',
      categoryLabels: {
        'single-origin': 'Single Origin',
        'espresso': 'Espresso Blend',
        'filter': 'Filter Coffee',
        'turkish': 'Turkish Coffee',
        'limited-edition': 'Limited Edition',
      }
    },
    tr: {
      title: 'Toptan Satış B2B Portalı',
      subtitle: 'Taze kavrum nitelikli kahveler ve B2B fiyatları',
      description: 'Sipariş etmek istediğiniz miktarları kilogram (kg) bazında giriniz. Toptan bayi fiyatlarından yararlanmak için toplam sipariş miktarı en az 50 kg olmalıdır.',
      product: 'Ürün',
      specifications: 'Özellikler ve Profil',
      retailPrice: 'Perakende (250g)',
      wholesalePrice: 'Bayi Fiyatı (1kg)',
      qty: 'Miktar (kg)',
      totalWeight: 'Toplam Ağırlık',
      minRequired: 'Ödeme için en az 50kg gereklidir',
      addMore: 'En az {amount}kg daha ekleyin',
      eligible: 'Bayi fiyatları için uygunsunuz! 🎉',
      subtotal: 'Sipariş Tutarı',
      checkoutBtn: 'Ödeme Sayfasına İlerle',
      freeShipping: 'Ücretsiz B2B Kargo Gönderimi 🚚',
      loading: 'Fiyat listesi yükleniyor...',
      categoryLabels: {
        'single-origin': 'Tek Köken',
        'espresso': 'Espresso Harmanı',
        'filter': 'Filtre Kahve',
        'turkish': 'Türk Kahvesi',
        'limited-edition': 'Özel Seri (Sınırlı Üretim)',
      }
    }
  }[locale === 'tr' ? 'tr' : 'en'];

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          const localized = data.data.map((p: any) => localizeProduct(p, locale));
          setProducts(localized);
        }
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setIsLoading(false));
  }, [locale]);

  const handleQtyChange = (productId: string, val: string) => {
    const num = Math.max(0, parseInt(val.replace(/\D/g, '')) || 0);
    setQuantities((prev) => ({ ...prev, [productId]: num }));
  };

  const handleAdjust = (productId: string, diff: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: Math.max(0, current + diff) };
    });
  };

  // Calculations
  const totalWeight = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const isEligible = totalWeight >= 50;
  const remaining = 50 - totalWeight;

  const totalAmount = products.reduce((sum, p) => {
    const qty = quantities[p.id] || 0;
    return sum + qty * p.wholesalePrice;
  }, 0);

  const handleCheckout = () => {
    if (!isEligible) return;

    // Filter items with quantity > 0
    const checkoutItems = products
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.wholesalePrice, // For cart logic integration
        wholesalePrice: p.wholesalePrice,
        quantity: quantities[p.id],
        stock: 9999, // Wholesale bypasses retail stock
        bagColor: p.id === 'turk-kahvesi' ? '#e07a5f' : '#2c1a0e', // Fallback colors matching design
        notes: ['Wholesale 1kg Bulk Packaging'],
        emoji: '★',
        imageUrl: p.imageUrl,
      }));

    localStorage.setItem('coffee_esto_wholesale_cart', JSON.stringify(checkoutItems));
    router.push(`${locale === 'tr' ? '' : '/en'}/checkout/payment?type=wholesale`);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar locale={locale} />

      {/* Hero Banner Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.b2bTag}
          >
            B2B WHOLESALE
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.title}
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className={styles.subtitle}
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Decorative Falling Beans WebP */}
        <div className={styles.beansContainer} aria-hidden="true">
          <img src="/images/beans.webp" alt="" className={`${styles.bean} ${styles.bean1}`} />
          <img src="/images/beans.webp" alt="" className={`${styles.bean} ${styles.bean2}`} />
          <img src="/images/beans.webp" alt="" className={`${styles.bean} ${styles.bean3}`} />
          <img src="/images/beans.webp" alt="" className={`${styles.bean} ${styles.bean4}`} />
          <img src="/images/beans.webp" alt="" className={`${styles.bean} ${styles.bean5}`} />
        </div>

        {/* Wave Divider SVG */}
        <div className={styles.heroWave} aria-hidden="true">
          <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,100 L0,100 Z" fill="var(--color-cream)" />
          </svg>
        </div>
      </section>

      {/* Main Form Section */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.instructionsCard}>
            <p className={styles.instructionText}>{t.description}</p>
            
            {/* Real-time Threshold Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressText}>
                <span>{t.totalWeight}: <strong>{totalWeight} kg / 50 kg</strong></span>
                <span className={isEligible ? styles.progressSuccess : styles.progressAlert}>
                  {isEligible ? t.eligible : t.addMore.replace('{amount}', remaining.toString())}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${isEligible ? styles.successFill : ''}`} 
                  style={{ width: `${Math.min((totalWeight / 50) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner} />
              <span>{t.loading}</span>
            </div>
          ) : (
            <div className={styles.coffeeGrid}>
              {products.map((product) => {
                const qty = quantities[product.id] || 0;
                const style = getStyle(product.id);
                return (
                  <motion.div
                    key={product.id}
                    className={`${styles.coffeeCard} ${qty > 0 ? styles.activeCard : ''}`}
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
                    }}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    {/* B2B Ribbon Badge */}
                    <div className={styles.b2bBadge}>
                      WHOLESALE 1KG
                    </div>

                    {/* Product visual wrapper */}
                    <div className={styles.bagWrapper}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.vectorArt}>
                          <CoffeeBag
                            coffeeName={product.name}
                            origin={product.origin}
                            bagColor={style.bagColor}
                            illustration={style.illustration}
                            emoji={style.emoji}
                            locale={locale}
                          />
                        </div>
                      )}
                    </div>

                    {/* Meta info details */}
                    <div className={styles.cardDetails}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardName}>{product.name}</h3>
                        <div className={styles.priceContainer}>
                          <span className={styles.cardPrice}>₺{product.wholesalePrice}</span>
                          <span className={styles.priceUnit}>/kg</span>
                        </div>
                      </div>

                      <div className={styles.comparisonRow}>
                        <span className={styles.retailCompare}>
                          {locale === 'tr' ? `Perakende: ₺${product.price} (250g)` : `Retail: ₺${product.price} (250g)`}
                        </span>
                      </div>

                      <p className={styles.cardOrigin}>{product.origin} • {product.altitude}</p>

                      <div className={styles.cardNotes}>
                        {product.tastingNotes.split(',').map((note) => (
                          <span key={note.trim()} className={styles.noteTag}>{note.trim()}</span>
                        ))}
                      </div>

                      {/* B2B Quantity Controller directly on card */}
                      <div className={styles.cardActions}>
                        <div className={styles.quantityPicker}>
                          <button 
                            className={styles.pickerBtn} 
                            onClick={() => handleAdjust(product.id, -5)}
                            aria-label="Decrease by 5kg"
                          >
                            -5
                          </button>
                          <input
                            type="text"
                            className={styles.pickerInput}
                            value={qty === 0 ? '' : `${qty}`}
                            onChange={(e) => handleQtyChange(product.id, e.target.value)}
                            placeholder="0 kg"
                          />
                          <button 
                            className={styles.pickerBtn} 
                            onClick={() => handleAdjust(product.id, 5)}
                            aria-label="Increase by 5kg"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Order Summary Drawer */}
      {totalWeight > 0 && (
        <div className={styles.summaryBar}>
          <div className={styles.summaryBarInner}>
            <div className={styles.summaryStats}>
              <div className={styles.summaryStatItem}>
                <span className={styles.statLabel}>{t.totalWeight}</span>
                <span className={styles.statVal}>{totalWeight} kg</span>
              </div>
              <div className={styles.summaryStatItem}>
                <span className={styles.statLabel}>{t.subtotal}</span>
                <span className={styles.statVal}>₺{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className={styles.summaryAction}>
              {!isEligible && (
                <span className={styles.lockWarning}>
                  ⚠️ {t.minRequired}
                </span>
              )}
              <button
                disabled={!isEligible}
                onClick={handleCheckout}
                className={`${styles.checkoutBtn} ${isEligible ? styles.checkoutBtnActive : ''}`}
              >
                {t.checkoutBtn}
              </button>
            </div>
          </div>
          <div className={styles.shippingBar}>{t.freeShipping}</div>
        </div>
      )}

      <Footer />
    </div>
  );
}
