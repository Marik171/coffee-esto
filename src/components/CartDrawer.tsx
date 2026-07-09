'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

export default function CartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const isMobile = useIsMobile();

  const isTr = !pathname.startsWith('/en');
  const linkPrefix = isTr ? '' : '/en';

  const labels = {
    cart: isTr ? 'Sepet' : 'Cart',
    total: isTr ? 'Toplam' : 'Total',
    shipping: isTr ? 'Vergiler ve kargo ödeme sırasında hesaplanır' : 'Taxes, Shipping are Calculated at Checkout',
    checkout: isTr ? 'ÖDEME YAP' : 'CHECKOUT',
    viewCart: isTr ? 'SEPETİ GÖRÜNTÜLE' : 'VIEW CART DETAILS',
    remove: isTr ? 'Kaldır' : 'Remove',
    emptyTitle: isTr ? 'Sepetiniz boş' : 'Your cart is empty',
    emptySub: isTr ? 'Başlamak için taze kavrulmuş nitelikli kahve ekleyin.' : 'Add freshly roasted specialty coffee to get started.',
    browse: isTr ? 'Kahveleri Keşfet' : 'Browse Coffee',
    size: isTr ? 'Boyut' : 'Size',
    grind: isTr ? 'Öğütme Derecesi' : 'Grind Type'
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, setIsCartOpen]);

  const FREE_THRESHOLD = 500;
  const progress = Math.min((cartTotal / FREE_THRESHOLD) * 100, 100);
  const remaining = FREE_THRESHOLD - cartTotal;

  const drawerVariants = {
    hidden: isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: -16, scale: 0.95 },
    visible: isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
    exit: isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: -16, scale: 0.95 },
  };

  // Map product IDs to solid pastel card background colors
  const cardBgColors: Record<string, string> = {
    guatemala: '#e0ebf5',
    ethiopia: '#fef1d2', // Warm yellow/orange matching screenshot
    'brazil-mogiana': '#e2e4e6',
    colombia: '#eae9e7',
    'velora-signature': '#eaebe6',
    sumatra: '#e0ebf5',
    papua: '#eaebe6',
    nicaragua: '#f7ebec',
  };

  const getBgColor = (id: string) => {
    return cardBgColors[id] || '#f5efe6';
  };

  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={isMobile ? { type: 'spring', damping: 28, stiffness: 280 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Drag handle (mobile only) */}
            {isMobile && <div className={styles.handle} aria-hidden="true" />}

            {/* Header */}
            <div className={styles.header}>
              <h2 className={styles.title}>
                {labels.cart} <span className={styles.qtyBadge}>{totalQuantity}</span>
              </h2>
              <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Free-shipping meter */}
            {cartItems.length > 0 && (
              <div className={styles.meter}>
                <span className={cartTotal >= FREE_THRESHOLD ? styles.meterSuccess : styles.meterAlert}>
                  {cartTotal >= FREE_THRESHOLD
                    ? (isTr ? 'Ücretsiz kargo açıldı! 🚚' : 'Free delivery unlocked 🚚')
                    : (isTr ? `Ücretsiz kargo için ${remaining} TL kaldı` : `₺${remaining} away from free delivery`)}
                </span>
                <div className={styles.meterTrack}>
                  <motion.div
                    className={styles.meterFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
                  />
                </div>
              </div>
            )}

            {/* Items body */}
            <div className={styles.body}>
              {cartItems.length > 0 ? (
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className={styles.cartItem}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      {/* Left: Thumbnail with solid background */}
                      <div className={styles.thumb} style={{ backgroundColor: getBgColor(item.id) }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={styles.thumbImage}
                          />
                        ) : (
                          <svg viewBox="0 0 200 250" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50,40 L150,40 C162,40 168,48 165,65 L150,215 C147,227 138,230 120,230 L80,230 C62,230 53,227 50,215 L35,65 C32,48 38,40 50,40 Z" fill={item.bagColor || '#1a0e07'}/>
                            <rect x="55" y="80" width="90" height="110" rx="3" fill="#ffffff"/>
                            <text x="100" y="145" fill={item.bagColor || '#1a0e07'} fontSize="28" fontWeight="900" textAnchor="middle">★</text>
                          </svg>
                        )}
                      </div>

                      {/* Middle: Details */}
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <span className={styles.itemPrice}>
                          {isTr ? `${item.price} TL` : `₺${item.price}`}
                        </span>
                        
                        <div className={styles.itemMeta}>
                          {item.notes.map((n, idx) => {
                            const noteLower = n.toLowerCase();
                            if (noteLower.includes('grind') || noteLower.includes('öğütme')) {
                              return <p key={idx} className={styles.metaRow}>{labels.grind}: {n}</p>;
                            }
                            if (noteLower.includes('size') || noteLower.includes('boyut') || noteLower.includes('g') || noteLower.includes('oz')) {
                              return <p key={idx} className={styles.metaRow}>{labels.size}: {n}</p>;
                            }
                            return <p key={idx} className={styles.metaRow}>{n}</p>;
                          })}
                        </div>
                      </div>

                      {/* Right: Quantity counter & Remove */}
                      <div className={styles.quantityCol}>
                        <div className={styles.counter}>
                          <motion.button 
                            whileTap={{ scale: 0.78 }} 
                            className={styles.counterBtn} 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            aria-label="Decrease quantity"
                          >
                            －
                          </motion.button>
                          <span className={styles.counterVal}>{item.quantity}</span>
                          <motion.button 
                            whileTap={{ scale: 0.78 }} 
                            className={styles.counterBtn} 
                            disabled={item.quantity >= (item.stock ?? Infinity)} 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            aria-label="Increase quantity"
                          >
                            ＋
                          </motion.button>
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                          {labels.remove}
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div
                  className={styles.empty}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className={styles.emptyEmoji}>☕️</span>
                  <h3 className={styles.emptyTitle}>{labels.emptyTitle}</h3>
                  <p className={styles.emptyText}>{labels.emptySub}</p>
                  <motion.button whileTap={{ scale: 0.97 }} className={styles.shopBtn} onClick={() => setIsCartOpen(false)}>
                    {labels.browse}
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span className={styles.subtotalLabel}>{labels.total}</span>
                  <span className={styles.subtotalAmt}>
                    {isTr ? `${cartTotal} TL` : `₺${cartTotal}`}
                  </span>
                </div>
                
                <p className={styles.shippingNote}>{labels.shipping}</p>
                
                <div className={styles.actionButtons}>
                  <button
                    className={styles.checkoutBtn}
                    onClick={() => { setIsCartOpen(false); router.push(`${linkPrefix}/checkout/payment`); }}
                  >
                    {labels.checkout}
                  </button>
                  <button
                    className={styles.viewCartBtn}
                    onClick={() => { setIsCartOpen(false); router.push(`${linkPrefix}/cart`); }}
                  >
                    {labels.viewCart}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
