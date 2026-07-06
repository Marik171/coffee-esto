'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const isMobile = useIsMobile();

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
    hidden: isMobile ? { y: '100%' } : { x: '100%' },
    visible: isMobile ? { y: 0 } : { x: 0 },
    exit: isMobile ? { y: '100%' } : { x: '100%' },
  };

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
            transition={{ type: 'spring', damping: 28, stiffness: 280, restDelta: 0.01 }}
          >
            {/* Drag handle (mobile only) */}
            {isMobile && <div className={styles.handle} aria-hidden="true" />}

            {/* Header */}
            <div className={styles.header}>
              <h2 className={styles.title}>My Cart</h2>
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
                    ? 'Free delivery unlocked 🚚'
                    : `₺${remaining} away from free delivery`}
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
                      <div className={styles.thumb} style={{ background: item.imageUrl ? 'radial-gradient(circle, #fbfaf5 0%, #e3ddd3 100%)' : `${item.bagColor}15` }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={styles.thumbImage}
                          />
                        ) : (
                          <svg viewBox="0 0 200 250" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50,40 L150,40 C162,40 168,48 165,65 L150,215 C147,227 138,230 120,230 L80,230 C62,230 53,227 50,215 L35,65 C32,48 38,40 50,40 Z" fill={item.bagColor}/>
                            <rect x="55" y="80" width="90" height="110" rx="3" fill="#ffffff"/>
                            <text x="100" y="145" fill={item.bagColor} fontSize="28" fontWeight="900" textAnchor="middle">★</text>
                          </svg>
                        )}
                      </div>

                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <p className={styles.itemNotes}>{item.notes.join(' • ')}</p>
                        <div className={styles.itemActions}>
                          <div className={styles.counter}>
                            <motion.button whileTap={{ scale: 0.78 }} className={styles.counterBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">－</motion.button>
                            <span className={styles.counterVal}>{item.quantity}</span>
                            <motion.button whileTap={{ scale: 0.78 }} className={styles.counterBtn} disabled={item.quantity >= (item.stock ?? Infinity)} onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">＋</motion.button>
                          </div>
                          <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                        {item.quantity >= (item.stock ?? Infinity) && (
                          <p className={styles.stockNote}>Only {item.stock} in stock — max reached</p>
                        )}
                      </div>

                      <div className={styles.priceCol}>
                        <span className={styles.price}>₺{item.price * item.quantity}</span>
                        {item.quantity > 1 && <span className={styles.priceUnit}>₺{item.price} each</span>}
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
                  <h3 className={styles.emptyTitle}>Your cart is empty</h3>
                  <p className={styles.emptyText}>Add freshly roasted specialty coffee to get started.</p>
                  <motion.button whileTap={{ scale: 0.97 }} className={styles.shopBtn} onClick={() => setIsCartOpen(false)}>
                    Browse Coffee
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span className={styles.subtotalAmt}>₺{cartTotal}</span>
                </div>
                <p className={styles.shippingNote}>Shipping calculated at checkout.</p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className={styles.checkoutBtn}
                  onClick={() => { setIsCartOpen(false); router.push('/checkout/payment'); }}
                >
                  Checkout →
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
