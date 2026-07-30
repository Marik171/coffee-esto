'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../app/cart/cart.module.css';

interface CartContentProps {
  locale?: string;
}

const coffeeCategories = ['single-origin', 'signature-blend', 'limited-edition', 'filter', 'espresso', 'turkish'];

export default function CartContent({ locale = 'en' }: CartContentProps) {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, isSubscriber } = useCart();

  const isTr = locale === 'tr';
  const linkPrefix = isTr ? '' : '/en';

  const t = {
    title: isTr ? 'Alışveriş Sepeti' : 'Shopping Cart',
    assistanceTitle: isTr ? 'Yardım mı Lazım?' : 'Need Assistance?',
    emailVal: 'thecoffeeesto@gmail.com',
    phoneVal: '+90 553 605 31 83',
    linksTitle: isTr ? 'Hızlı Bağlantılar' : 'Quick Links',
    linkWholesale: isTr ? 'Toptan Satış' : 'Wholesale',
    linkCoffee: isTr ? 'Nitelikli Kahveler' : 'Specialty Coffees',
    linkShipping: isTr ? 'Kargo & İadeler' : 'Shipping & Returns',
    
    thItem: isTr ? 'ÜRÜN' : 'ITEM',
    thPrice: isTr ? 'FİYAT' : 'PRICE',
    thQty: isTr ? 'MİKTAR' : 'QUANTITY',
    thTotal: isTr ? 'TOPLAM' : 'TOTAL',
    removeBtn: isTr ? 'kaldır' : 'remove',
    
    subtotalLabel: isTr ? 'ARA TOPLAM' : 'SUBTOTAL',
    shippingNote: isTr ? 'Vergiler ve kargo ödeme sırasında hesaplanır.' : 'Taxes and shipping calculated at checkout.',
    checkoutBtn: isTr ? 'ÖDEMEYE İLERLE' : 'CHECKOUT',
    
    shippingNoticeTitle: isTr ? 'Önemli Kargo Bildirimi' : 'Important Shipping Notice',
    shippingNoticeText: isTr 
      ? 'Siparişlerinizi zamanında hazırlıyoruz. Kargo firmaları her gün Kartal\'daki kavurmahanemizden teslimat almaktadır. En taze kahve deneyimini sunabilmek için teslimat süresi genellikle 1-3 iş günüdür. Sorularınız için thecoffeeesto@gmail.com adresinden bize ulaşabilirsiniz.'
      : 'We are currently processing orders on time, and couriers pick up daily from our Roastery in Kartal, İstanbul. To ensure you receive the freshest coffee possible, standard delivery takes 1-3 business days. For any queries, reach out to thecoffeeesto@gmail.com.',
      
    roastScheduleTitle: isTr ? 'Kavurma Programımız' : 'Our Roasting Schedule',
    roastScheduleText: isTr
      ? 'Kahvelerimizi Pazartesi\'den Perşembe\'ye kadar kavuruyor ve Pazartesi-Cuma günleri arasında kargoluyoruz. En taze kahveyi ulaştırabilmek için kavrum tarihinden sonraki 2-4 gün içinde siparişinizi teslim almayı bekleyebilirsiniz.'
      : 'We currently roast Monday–Thursday and ship Monday–Friday. We aim to send you the freshest coffee available, so depending on your selected shipping method, you can expect your coffee to arrive 2–4 days after roasting.',
      
    emptyCart: isTr ? 'Sepetinizde ürün bulunmamaktadır.' : 'Your shopping cart is empty.',
    shopBtn: isTr ? 'Alışverişe Başla' : 'Continue Shopping'
  };

  // Map product IDs to solid pastel card background colors
  const cardBgColors: Record<string, string> = {
    guatemala: '#e0ebf5',
    ethiopia: '#fef1d2',
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

  return (
    <div className={styles.page}>
      <Navbar locale={locale} />

      {/* ── 1. Page Header Block ──────────────────────────────── */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.headerGrid}>
            <div className={styles.titleCol}>
              <h1 className={styles.mainTitle}>{t.title}</h1>
            </div>

            <div className={styles.infoCols}>
              {/* Assistance */}
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>{t.assistanceTitle}</h3>
                <p className={styles.blockText}>
                  <a href={`mailto:${t.emailVal}`} className={styles.textLink}>{t.emailVal}</a>
                  <br />
                  <a href={`tel:${t.phoneVal.replace(/\s+/g, '')}`} className={styles.textLink}>{t.phoneVal}</a>
                </p>
              </div>

              {/* Quick Links */}
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>{t.linksTitle}</h3>
                <p className={styles.blockText}>
                  <Link href={`${linkPrefix}/wholesale`} className={styles.textLink}>{t.linkWholesale}</Link>
                  <br />
                  <Link href={`${linkPrefix}/coffee`} className={styles.textLink}>{t.linkCoffee}</Link>
                  <br />
                  <Link href={`${linkPrefix}/contact`} className={styles.textLink}>{t.linkShipping}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Table Section ──────────────────────────────────── */}
      <section className={styles.cartSection}>
        <div className={styles.container}>
          {cartItems.length > 0 ? (
            <div className={styles.cartContainer}>
              
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thLeft}>{t.thItem}</th>
                    <th className={styles.thCenter}>{t.thPrice}</th>
                    <th className={styles.thCenter}>{t.thQty}</th>
                    <th className={styles.thRight}>{t.thTotal}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className={styles.trItem}>
                      
                      {/* ITEM Column */}
                      <td className={styles.tdItem}>
                        <div className={styles.itemMetaGroup}>
                          <div className={styles.thumb} style={{ backgroundColor: getBgColor(item.id) }}>
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className={styles.thumbImage} />
                            ) : (
                              <div className={styles.dummyThumb}>★</div>
                            )}
                          </div>
                          <div className={styles.itemTextInfo}>
                            <h4 className={styles.itemName}>{item.name}</h4>
                            <div className={styles.metaLines}>
                              {item.notes.map((n, i) => {
                                const noteLower = n.toLowerCase();
                                if (noteLower.includes('grind') || noteLower.includes('öğütme')) {
                                  return <p key={i} className={styles.metaRow}>{isTr ? 'Öğütme' : 'Grind Type'}: {n}</p>;
                                }
                                if (noteLower.includes('size') || noteLower.includes('boyut') || noteLower.includes('g') || noteLower.includes('oz')) {
                                  return <p key={i} className={styles.metaRow}>{isTr ? 'Boyut' : 'Size'}: {n}</p>;
                                }
                                return <p key={i} className={styles.metaRow}>{n}</p>;
                              })}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PRICE Column */}
                      <td className={styles.tdPrice}>
                        {isSubscriber && item.category && coffeeCategories.includes(item.category) ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '8px' }}>
                              {isTr ? `${item.price} TL` : `₺${item.price}`}
                            </span>
                            <span style={{ color: '#0044ff', fontWeight: 700 }}>
                              {isTr ? `${Math.round(item.price * 0.90)} TL` : `₺${Math.round(item.price * 0.90)}`}
                            </span>
                          </>
                        ) : (
                          isTr ? `${item.price} TL` : `₺${item.price}`
                        )}
                      </td>

                      {/* QUANTITY Column */}
                      <td className={styles.tdQty}>
                        <div className={styles.counter}>
                          <button 
                            className={styles.counterBtn} 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            －
                          </button>
                          <span className={styles.counterVal}>{item.quantity}</span>
                          <button 
                            className={styles.counterBtn} 
                            disabled={item.quantity >= (item.stock ?? Infinity)}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            ＋
                          </button>
                        </div>
                      </td>

                      {/* TOTAL & REMOVE Column */}
                      <td className={styles.tdTotal}>
                        <div className={styles.totalFlex}>
                          <span className={styles.totalVal}>
                            {isSubscriber && item.category && coffeeCategories.includes(item.category) ? (
                              <>
                                <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '8px', fontSize: '12px' }}>
                                  {isTr ? `${item.price * item.quantity} TL` : `₺${item.price * item.quantity}`}
                                </span>
                                <span style={{ color: '#0044ff', fontWeight: 700 }}>
                                  {isTr ? `${Math.round(item.price * 0.90) * item.quantity} TL` : `₺${Math.round(item.price * 0.90) * item.quantity}`}
                                </span>
                              </>
                            ) : (
                              isTr ? `${item.price * item.quantity} TL` : `₺${item.price * item.quantity}`
                            )}
                          </span>
                          <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                            {t.removeBtn}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Checkout subtotal panel */}
              <div className={styles.checkoutPanel}>
                <div className={styles.subtotalRow}>
                  <span className={styles.subtotalLabel}>{t.subtotalLabel}</span>
                  <span className={styles.subtotalValLarge}>
                    {isTr ? `${cartTotal} TL` : `₺${cartTotal}`}
                  </span>
                </div>
                <p className={styles.shippingNote}>{t.shippingNote}</p>
                <button 
                  className={styles.checkoutBtn}
                  onClick={() => router.push(`${linkPrefix}/checkout/payment`)}
                >
                  {t.checkoutBtn}
                </button>
              </div>

            </div>
          ) : (
            <div className={styles.emptyBox}>
              <p className={styles.emptyText}>{t.emptyCart}</p>
              <Link href={`${linkPrefix}/coffee`} className={styles.shopBtn}>
                {t.shopBtn}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Post-cart Information blocks ──────────────────── */}
      <section className={styles.noticesSection}>
        <div className={styles.container}>
          <div className={styles.noticesGrid}>
            <div className={styles.noticeBlock}>
              <h4 className={styles.noticeTitle}>{t.shippingNoticeTitle}</h4>
              <p className={styles.noticeText}>{t.shippingNoticeText}</p>
            </div>
            <div className={styles.noticeBlock}>
              <h4 className={styles.noticeTitle}>{t.roastScheduleTitle}</h4>
              <p className={styles.noticeText}>{t.roastScheduleText}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer waveColor="#111111" locale={locale} />
    </div>
  );
}
