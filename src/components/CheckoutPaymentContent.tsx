'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import styles from '../app/checkout/payment/payment.module.css';

interface CheckoutPaymentContentProps {
  locale: string;
}

function PaymentForm({ locale }: CheckoutPaymentContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWholesale = searchParams.get('type') === 'wholesale';

  const { cartItems, cartTotal, clearCart, updateQuantity } = useCart();
  const [wholesaleItems, setWholesaleItems] = useState<any[]>([]);
  const [stockIssue, setStockIssue] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'ship' | 'pickup'>('ship');
  const [emailMe, setEmailMe] = useState(false);
  const [textMe, setTextMe] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const t = {
    en: {
      cancel: 'Return to cart',
      expressTitle: 'Express checkout',
      or: 'OR',
      contact: 'Contact',
      signIn: 'Sign in',
      emailPlaceholder: 'Email',
      emailNews: 'Email me with news and offers',
      delivery: 'Delivery',
      ship: 'Ship',
      pickup: 'Pickup',
      country: 'Country/Region',
      firstName: 'First name',
      lastName: 'Last name',
      company: 'Company (optional)',
      address: 'Address',
      apartment: 'Apartment, suite, etc. (optional)',
      city: 'City',
      state: 'State',
      zip: 'ZIP code',
      phone: 'Phone (optional)',
      textNews: 'Text me with news and offers',
      shippingMethod: 'Shipping method',
      shippingMethodInfo: 'Enter your shipping address to view available shipping methods.',
      payment: 'Payment',
      paymentNote: 'All transactions are secure and encrypted.',
      creditCard: 'Credit card',
      cardNumber: 'Card number',
      cardName: 'Name on card',
      expiry: 'Expiration date (MM / YY)',
      cvv: 'Security code',
      sameAsBilling: 'Use shipping address as billing address',
      payBtn: 'Pay now',
      processing: 'Processing...',
      discount: 'Discount code or gift card',
      apply: 'Apply',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      shippingCalc: 'Enter shipping address',
      total: 'Total',
      usd: 'USD',
      refundPolicy: 'Refund policy',
      privacyPolicy: 'Privacy policy',
      terms: 'Terms of service',
      cancellations: 'Cancellations',
      validationErr: 'Please complete all required fields.',
      cardErr: 'Please enter a valid card number.',
      expiryErr: 'Please enter a valid expiry date.',
      cvvErr: 'Please enter a valid security code.',
      freeShipping: 'Free',
    },
    tr: {
      cancel: 'Sepete dön',
      expressTitle: 'Hızlı ödeme',
      or: 'VEYA',
      contact: 'İletişim',
      signIn: 'Giriş yap',
      emailPlaceholder: 'E-posta',
      emailNews: 'Haber ve kampanyaları e-posta ile al',
      delivery: 'Teslimat',
      ship: 'Kargo',
      pickup: 'Mağazadan al',
      country: 'Ülke/Bölge',
      firstName: 'Ad',
      lastName: 'Soyad',
      company: 'Şirket (isteğe bağlı)',
      address: 'Adres',
      apartment: 'Daire, suit, vb. (isteğe bağlı)',
      city: 'Şehir',
      state: 'İlçe',
      zip: 'Posta Kodu',
      phone: 'Telefon (isteğe bağlı)',
      textNews: 'SMS ile haber ve kampanya al',
      shippingMethod: 'Kargo yöntemi',
      shippingMethodInfo: 'Kargo seçeneklerini görmek için teslimat adresinizi girin.',
      payment: 'Ödeme',
      paymentNote: 'Tüm işlemler güvenli ve şifreli.',
      creditCard: 'Kredi kartı',
      cardNumber: 'Kart numarası',
      cardName: 'Kart üzerindeki isim',
      expiry: 'Son kullanma tarihi (AA / YY)',
      cvv: 'Güvenlik kodu',
      sameAsBilling: 'Fatura adresi olarak teslimat adresini kullan',
      payBtn: 'Şimdi öde',
      processing: 'İşleniyor...',
      discount: 'İndirim kodu veya hediye kartı',
      apply: 'Uygula',
      subtotal: 'Ara toplam',
      shipping: 'Kargo',
      shippingCalc: 'Teslimat adresini girin',
      total: 'Toplam',
      usd: 'USD',
      refundPolicy: 'İade politikası',
      privacyPolicy: 'Gizlilik politikası',
      terms: 'Kullanım koşulları',
      cancellations: 'İptal koşulları',
      validationErr: 'Lütfen tüm zorunlu alanları doldurun.',
      cardErr: 'Lütfen geçerli bir kart numarası girin.',
      expiryErr: 'Lütfen geçerli bir son kullanma tarihi girin.',
      cvvErr: 'Lütfen geçerli bir güvenlik kodu girin.',
      freeShipping: 'Ücretsiz',
    },
  }[locale === 'tr' ? 'tr' : 'en'];

  useEffect(() => {
    if (isWholesale) {
      const stored = localStorage.getItem('coffee_esto_wholesale_cart');
      if (stored) setWholesaleItems(JSON.parse(stored));
    }
  }, [isWholesale]);

  useEffect(() => {
    if (isWholesale || cartItems.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/products');
        const d = await res.json();
        if (cancelled || !res.ok || !d.success) return;
        const stockById = new Map<string, number>(d.data.map((p: { id: string; stock: number }) => [p.id, p.stock]));
        const overages = cartItems.filter((item) => item.quantity > (stockById.get(item.id) ?? 0));
        if (overages.length > 0) {
          overages.forEach((item) => updateQuantity(item.id, stockById.get(item.id) ?? 0));
          setStockIssue(
            overages.length === 1
              ? `"${overages[0].name}" stock changed — quantity adjusted.`
              : "Some items' stock changed — quantities adjusted."
          );
        }
      } catch { /* non-fatal */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWholesale]);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const itemsToRender = isWholesale ? wholesaleItems : cartItems;
  const subtotal = isWholesale
    ? wholesaleItems.reduce((acc, item) => acc + item.wholesalePrice * item.quantity, 0)
    : cartTotal;
  const shippingFee = isWholesale ? 0 : (subtotal >= 500 || subtotal === 0 ? 0 : 35);
  const grandTotal = subtotal + shippingFee;
  const totalQty = itemsToRender.reduce((acc: number, item: any) => acc + item.quantity, 0);

  useEffect(() => {
    const len = isWholesale ? wholesaleItems.length : cartItems.length;
    if (len === 0 && !isSubmitting) {
      const t = setTimeout(() => {
        router.push(isWholesale
          ? (locale === 'tr' ? '/wholesale' : '/en/wholesale')
          : (locale === 'tr' ? '/coffee' : '/en/coffee'));
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isWholesale, cartItems, wholesaleItems, router, isSubmitting, locale]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const m = val.match(/.{1,4}/g);
    setCardNumber(m ? m.join(' ') : val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardExpiry(val.length >= 2 ? `${val.substring(0, 2)} / ${val.substring(2, 4)}` : val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !firstName || !lastName || !address || !city || !zipCode) {
      setErrorMessage(t.validationErr); return;
    }
    if (cardNumber.replace(/\s/g, '').length < 15) { setErrorMessage(t.cardErr); return; }
    if (cardExpiry.replace(/[\s/]/g, '').length < 4) { setErrorMessage(t.expiryErr); return; }
    if (cardCvv.length < 3) { setErrorMessage(t.cvvErr); return; }
    setIsSubmitting(true);
    try {
      const parts = cardExpiry.replace(' ', '').split('/');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToRender.map((item) => ({ id: item.id, quantity: item.quantity })),
          isWholesale,
          shippingDetails: { email, fullName: `${firstName} ${lastName}`, address, city, zipCode, phone },
          cardDetails: { cardHolderName: cardName, cardNumber, expireMonth: parts[0], expireYear: parts[1], cvc: cardCvv },
        }),
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) throw new Error(resData.error || 'Payment declined.');
      const { orderId, totalAmount } = resData.data;
      if (isWholesale) localStorage.removeItem('coffee_esto_wholesale_cart');
      else clearCart();
      router.push(`${locale === 'tr' ? '' : '/en'}/checkout/success?orderId=${orderId}&total=${totalAmount}&email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Checkout failed.');
      setIsSubmitting(false);
    }
  };

  const linkPrefix = locale === 'tr' ? '' : '/en';

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <Link href={`${linkPrefix}/cart`} className={styles.backLink}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          {t.cancel}
        </Link>
        <div className={styles.logo}>
          <span className={styles.logoTop}>COFFEE ESTO</span>
          <span className={styles.logoSub}>ROASTERY</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.cartIconWrap}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalQty > 0 && <span className={styles.cartBadge}>{totalQty}</span>}
          </div>
        </div>
      </header>

      {(errorMessage || stockIssue) && (
        <div className={styles.alertBanner}>{errorMessage || stockIssue}</div>
      )}

      <main className={styles.container}>
        <div className={styles.splitLayout}>

          {/* ── LEFT COLUMN ── */}
          <div className={styles.formColumn}>


            <form onSubmit={handlePaymentSubmit} className={styles.checkoutForm}>

              {/* Contact */}
              <section className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{t.contact}</h2>
                  <button type="button" className={styles.signInLink}>{t.signIn}</button>
                </div>
                <div className={styles.inputField}>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder} className={styles.floatInput} />
                  <button type="button" className={styles.fieldIconBtn} aria-label="info">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </button>
                </div>
                <label className={styles.checkboxRow}>
                  <input type="checkbox" checked={emailMe} onChange={(e) => setEmailMe(e.target.checked)} />
                  <span>{t.emailNews}</span>
                </label>
              </section>

              {/* Delivery */}
              <section className={styles.formSection}>
                <h2 className={styles.sectionTitle}>{t.delivery}</h2>
                <div className={styles.deliveryToggle}>
                  <button type="button"
                    className={`${styles.toggleBtn} ${deliveryMode === 'ship' ? styles.toggleActive : ''}`}
                    onClick={() => setDeliveryMode('ship')}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    {t.ship}
                  </button>
                  <button type="button"
                    className={`${styles.toggleBtn} ${deliveryMode === 'pickup' ? styles.toggleActive : ''}`}
                    onClick={() => setDeliveryMode('pickup')}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {t.pickup}
                  </button>
                </div>

                {deliveryMode === 'pickup' ? (
                  /* ── Pickup: store address + map ── */
                  <div className={styles.pickupPanel}>
                    <div className={styles.pickupAddressCard}>
                      <div className={styles.pickupIcon}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className={styles.pickupAddressText}>
                        <strong>Coffee Esto Roastery</strong>
                        <span>Rasimpaşa Mahallesi, Moda Caddesi No:12</span>
                        <span>Kadıköy, İstanbul 34714, Türkiye</span>
                        <span className={styles.pickupHours}>Mon–Sat 08:00–20:00 &nbsp;·&nbsp; Sun 09:00–18:00</span>
                        <a
                          href="https://maps.google.com/?q=Moda+Caddesi+Kadikoy+Istanbul"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pickupDirections}
                        >
                          Get directions ↗
                        </a>
                      </div>
                    </div>
                    <div className={styles.pickupMapWrapper}>
                      <iframe
                        title="Coffee Esto Roastery Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.417!2d29.0302!3d40.9869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a7a8d6c37d%3A0x3b5b5b5b5b5b5b5b!2sModa%20Caddesi%2C%20Kad%C4%B1k%C3%B6y%2C%20%C4%B0stanbul!5e0!3m2!1sen!2str!4v1700000000000"
                        width="100%"
                        height="260"
                        style={{ border: 0, borderRadius: '8px', display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                ) : (
                  /* ── Ship: normal address form ── */
                  <>
                    <div className={styles.selectField}>
                      <label htmlFor="country" className={styles.floatLabel}>{t.country}</label>
                      <select id="country" className={styles.floatSelect}>
                        <option value="TR">Turkey</option>
                        <option value="US">United States</option>
                        <option value="DE">Germany</option>
                        <option value="GB">United Kingdom</option>
                      </select>
                      <span className={styles.selectChevron}>▾</span>
                    </div>

                    <div className={styles.halfRow}>
                      <div className={styles.inputField}>
                        <input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                          placeholder={t.firstName} className={styles.floatInput} />
                      </div>
                      <div className={styles.inputField}>
                        <input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                          placeholder={t.lastName} className={styles.floatInput} />
                      </div>
                    </div>

                    <div className={styles.inputField}>
                      <input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                        placeholder={t.company} className={styles.floatInput} />
                    </div>

                    <div className={styles.inputField}>
                      <input id="address" type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                        placeholder={t.address} className={styles.floatInput} />
                      <button type="button" className={styles.fieldIconBtn} aria-label="search">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      </button>
                    </div>

                    <div className={styles.inputField}>
                      <input id="apartment" type="text" value={apartment} onChange={(e) => setApartment(e.target.value)}
                        placeholder={t.apartment} className={styles.floatInput} />
                    </div>

                    <div className={styles.threeColRow}>
                      <div className={styles.inputField}>
                        <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                          placeholder={t.city} className={styles.floatInput} />
                      </div>
                      <div className={styles.selectField}>
                        <label htmlFor="state" className={styles.floatLabel}>{t.state}</label>
                        <select id="state" value={stateName} onChange={(e) => setStateName(e.target.value)} className={styles.floatSelect}>
                          <option value="">{t.state}</option>
                          <option value="IST">İstanbul</option>
                          <option value="ANK">Ankara</option>
                          <option value="IZM">İzmir</option>
                        </select>
                        <span className={styles.selectChevron}>▾</span>
                      </div>
                      <div className={styles.inputField}>
                        <input id="zip" type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                          placeholder={t.zip} className={styles.floatInput} />
                      </div>
                    </div>

                    <div className={styles.inputField}>
                      <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.phone} className={styles.floatInput} />
                      <button type="button" className={styles.fieldIconBtn} aria-label="phone info">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      </button>
                    </div>

                    <label className={styles.checkboxRow}>
                      <input type="checkbox" checked={textMe} onChange={(e) => setTextMe(e.target.checked)} />
                      <span>{t.textNews}</span>
                    </label>
                  </>
                )}
              </section>

              {/* Shipping Method */}
              <section className={styles.formSection}>
                <h2 className={styles.sectionTitle}>{t.shippingMethod}</h2>
                <div className={styles.shippingMethodBox}>
                  <p>{t.shippingMethodInfo}</p>
                </div>
              </section>

              {/* Payment */}
              <section className={styles.formSection}>
                <h2 className={styles.sectionTitle}>{t.payment}</h2>
                <p className={styles.paymentNote}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px',verticalAlign:'middle'}}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  {t.paymentNote}
                </p>

                <div className={styles.paymentBox}>
                  <div className={styles.paymentBoxHeader}>
                    <label className={styles.radioRow}>
                      <input type="radio" name="paymentMethod" defaultChecked readOnly />
                      <span>{t.creditCard}</span>
                    </label>
                    <div className={styles.cardBrands}>
                      <span className={styles.cardBrandVisa}>VISA</span>
                      <span className={styles.cardBrandMc}>MC</span>
                      <span className={styles.cardBrandAmex}>AMEX</span>
                      <span className={styles.cardBrandMore}>+4</span>
                    </div>
                  </div>

                  <div className={styles.cardFieldsBox}>
                    <div className={styles.inputField}>
                      <input id="cardNumber" type="text" inputMode="numeric" required
                        value={cardNumber} onChange={handleCardNumberChange}
                        placeholder={t.cardNumber} className={styles.floatInput} />
                      <span className={styles.fieldIconBtn}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                      </span>
                    </div>

                    <div className={styles.halfRow}>
                      <div className={styles.inputField}>
                        <input id="cardExpiry" type="text" inputMode="numeric" required
                          value={cardExpiry} onChange={handleExpiryChange}
                          placeholder={t.expiry} className={styles.floatInput} />
                      </div>
                      <div className={styles.inputField}>
                        <input id="cardCvv" type="password" inputMode="numeric" required
                          value={cardCvv} onChange={handleCvvChange}
                          placeholder={t.cvv} className={styles.floatInput} />
                        <button type="button" className={styles.fieldIconBtn} aria-label="cvv info">
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className={styles.inputField}>
                      <input id="cardName" type="text" required
                        value={cardName} onChange={(e) => setCardName(e.target.value)}
                        placeholder={t.cardName} className={styles.floatInput} />
                    </div>

                    <label className={styles.checkboxRow}>
                      <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} />
                      <span>{t.sameAsBilling}</span>
                    </label>
                  </div>
                </div>
              </section>

              <button type="submit" className={styles.payBtn} disabled={isSubmitting || itemsToRender.length === 0}>
                {isSubmitting ? t.processing : t.payBtn}
              </button>
            </form>

            <footer className={styles.formFooter}>
              <a href="#" className={styles.footerLink}>{t.refundPolicy}</a>
              <a href="#" className={styles.footerLink}>{t.privacyPolicy}</a>
              <a href="#" className={styles.footerLink}>{t.terms}</a>
              <a href="#" className={styles.footerLink}>{t.cancellations}</a>
            </footer>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className={styles.summaryColumn}>
            {itemsToRender.map((item: any) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.thumbWrapper}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className={styles.thumbImage} />
                  ) : (
                    <div className={styles.thumbColor} style={{ backgroundColor: item.bagColor || '#e8e4df' }}>
                      <span>{item.emoji}</span>
                    </div>
                  )}
                  <span className={styles.qtyBadge}>{item.quantity}</span>
                </div>
                <div className={styles.summaryItemMeta}>
                  <span className={styles.summaryItemName}>{item.name}</span>
                  {item.size && <span className={styles.summaryItemDetail}>{item.size}</span>}
                  {item.grindType && <span className={styles.summaryItemDetail}>Grind Type: {item.grindType}</span>}
                </div>
                <span className={styles.summaryItemPrice}>
                  ${(isWholesale ? item.wholesalePrice * item.quantity : item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className={styles.discountRow}>
              <input type="text" placeholder={t.discount} value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)} className={styles.discountInput} />
              <button type="button" className={styles.applyBtn}>{t.apply}</button>
            </div>

            <div className={styles.totalsBlock}>
              <div className={styles.totalRow}>
                <span>{t.subtotal}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>{t.shipping}</span>
                <span className={shippingFee === 0 && subtotal > 0 ? '' : styles.shippingCalcText}>
                  {shippingFee === 0 && subtotal > 0 ? t.freeShipping : shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : t.shippingCalc}
                </span>
              </div>
              <div className={styles.grandTotalRow}>
                <span>{t.total}</span>
                <span>
                  <small className={styles.currencyLabel}>{t.usd}&nbsp;</small>
                  <strong>${grandTotal.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function CheckoutPaymentContent({ locale }: CheckoutPaymentContentProps) {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',color:'#888'}}>Loading checkout…</div>}>
      <PaymentForm locale={locale} />
    </Suspense>
  );
}
