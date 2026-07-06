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

  // Translations
  const t = {
    en: {
      title: 'Secure Checkout',
      cancel: 'Cancel & Return to Shop',
      shippingTitle: '1. Shipping & Contact',
      paymentTitle: '2. Payment Method',
      email: 'Email Address',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Receiver full name',
      address: 'Delivery Address',
      addressPlaceholder: 'Street, apartment, building no',
      city: 'City / District',
      zipCode: 'Zip / Postal Code',
      phone: 'Phone Number',
      cardName: 'Cardholder Name',
      cardNumber: 'Card Number',
      cardExpiry: 'Expiration Date',
      cardCvv: 'CVV Code',
      payBtn: 'Secure Pay ₺{amount}',
      processing: 'Processing payment...',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shippingFee: 'Shipping Fee',
      grandTotal: 'Grand Total',
      loadingOrder: 'Loading order details...',
      qtyLabel: 'Qty',
      kgLabel: 'kg',
      validationErr: 'Please complete all shipping details.',
      cardErr: 'Please enter a valid card number.',
      expiryErr: 'Please enter a valid expiry date (MM/YY).',
      cvvErr: 'Please enter a valid CVV security code.',
      freeShipping: 'FREE',
    },
    tr: {
      title: 'Güvenli Ödeme',
      cancel: 'İptal Et ve Alışverişe Dön',
      shippingTitle: '1. Teslimat & İletişim Bilgileri',
      paymentTitle: '2. Kart ile Ödeme',
      email: 'E-posta Adresi',
      fullName: 'Adı Soyadı',
      fullNamePlaceholder: 'Alıcının adı ve soyadı',
      address: 'Teslimat Adresi',
      addressPlaceholder: 'Sokak, daire, bina no ve detaylar',
      city: 'Şehir / İlçe',
      zipCode: 'Posta Kodu',
      phone: 'Telefon Numarası',
      cardName: 'Kart Üzerindeki İsim',
      cardNumber: 'Kart Numarası',
      cardExpiry: 'Son Kullanma Tarihi',
      cardCvv: 'CVC / CVV Kodu',
      payBtn: 'Güvenli Ödeme Yap ₺{amount}',
      processing: 'Ödeme işleniyor...',
      orderSummary: 'Sipariş Özeti',
      subtotal: 'Ara Toplam',
      shippingFee: 'Kargo Ücreti',
      grandTotal: 'Toplam Tutar',
      loadingOrder: 'Sipariş bilgileri yükleniyor...',
      qtyLabel: 'Adet',
      kgLabel: 'kg',
      validationErr: 'Lütfen teslimat adres bilgilerini eksiksiz doldurun.',
      cardErr: 'Lütfen geçerli bir kart numarası girin.',
      expiryErr: 'Lütfen geçerli bir son kullanma tarihi girin (AA/YY).',
      cvvErr: 'Lütfen geçerli bir CVC güvenlik kodu girin.',
      freeShipping: 'ÜCRETSİZ',
    }
  }[locale === 'tr' ? 'tr' : 'en'];

  // Load wholesale items if applicable
  useEffect(() => {
    if (isWholesale) {
      const stored = localStorage.getItem('coffee_esto_wholesale_cart');
      if (stored) {
        setWholesaleItems(JSON.parse(stored));
      }
    }
  }, [isWholesale]);

  // Re-check live stock on arrival (retail only)
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
          overages.forEach((item) => {
            const available = stockById.get(item.id) ?? 0;
            updateQuantity(item.id, available);
          });
          setStockIssue(
            overages.length === 1
              ? `"${overages[0].name}" stock changed — quantity adjusted to what's available.`
              : "Some items' stock changed — quantities were adjusted to what's available."
          );
        }
      } catch {
        // Non-fatal
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWholesale]);

  // Shipping form
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');

  // Card form
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const itemsToRender = isWholesale ? wholesaleItems : cartItems;
  const subtotal = isWholesale
    ? wholesaleItems.reduce((acc, item) => acc + item.wholesalePrice * item.quantity, 0)
    : cartTotal;
  const shippingFee = isWholesale ? 0 : (subtotal >= 500 || subtotal === 0 ? 0 : 35);
  const grandTotal = subtotal + shippingFee;

  // Redirect if cart is empty
  useEffect(() => {
    const itemsLen = isWholesale ? wholesaleItems.length : cartItems.length;
    if (itemsLen === 0 && !isSubmitting) {
      const timer = setTimeout(() => {
        if (itemsLen === 0 && !isSubmitting) {
          router.push(isWholesale ? (locale === 'tr' ? '/wholesale' : '/en/wholesale') : (locale === 'tr' ? '/coffee' : '/en/coffee'));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isWholesale, cartItems, wholesaleItems, router, isSubmitting, locale]);

  // Format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const matches = val.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : val);
  };

  // Format expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardExpiry(val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2, 4)}` : val);
  };

  // CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !fullName || !address || !city || !zipCode || !phone) {
      setErrorMessage(t.validationErr);
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 15) {
      setErrorMessage(t.cardErr);
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage(t.expiryErr);
      return;
    }
    if (cardCvv.length < 3) {
      setErrorMessage(t.cvvErr);
      return;
    }

    setIsSubmitting(true);
    setSubmitStage(t.processing);

    try {
      const [expireMonth, expireYear] = cardExpiry.split('/');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToRender.map((item) => ({ id: item.id, quantity: item.quantity })),
          isWholesale,
          shippingDetails: {
            email,
            fullName,
            address,
            city,
            zipCode,
            phone,
          },
          cardDetails: {
            cardHolderName: cardName,
            cardNumber,
            expireMonth,
            expireYear,
            cvc: cardCvv,
          },
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Payment was declined. Please check your card details.');
      }

      const { orderId, totalAmount } = resData.data;

      if (isWholesale) {
        localStorage.removeItem('coffee_esto_wholesale_cart');
      } else {
        clearCart();
      }

      router.push(`${locale === 'tr' ? '' : '/en'}/checkout/success?orderId=${orderId}&total=${totalAmount}&email=${encodeURIComponent(email)}`);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      setErrorMessage(message);
      setIsSubmitting(false);
      setSubmitStage('');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={isWholesale ? (locale === 'tr' ? '/wholesale' : '/en/wholesale') : (locale === 'tr' ? '/coffee' : '/en/coffee')} className={styles.backLink}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t.cancel}
          </Link>
          <div className={styles.logo}>
            <span className={styles.logoTop}>COFFEE</span>
            <span className={styles.logoMiddle}>ESTO</span>
            <span className={styles.logoBottom}>ROASTERY</span>
          </div>
          <div className={styles.headerSpacer} />
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.splitLayout}>

          {/* Left: Forms */}
          <div className={styles.formColumn}>
            <h1 className={styles.pageTitle}>{t.title}</h1>

            {errorMessage && (
              <div className={styles.errorAlert} role="alert">
                <span className={styles.errorIcon}>⚠️</span>
                <span className={styles.errorText}>{errorMessage}</span>
              </div>
            )}

            {stockIssue && (
              <div className={styles.errorAlert} role="alert">
                <span className={styles.errorIcon}>⚠️</span>
                <span className={styles.errorText}>{stockIssue}</span>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className={styles.checkoutForm}>

              {/* Shipping */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>{t.shippingTitle}</h2>
                <div className={styles.fieldsGrid}>

                  <div className={styles.inputBox}>
                    <label htmlFor="email">{t.email}</label>
                    <input id="email" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com" />
                  </div>

                  <div className={styles.inputBox}>
                    <label htmlFor="fullName">{t.fullName}</label>
                    <input id="fullName" type="text" required value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.fullNamePlaceholder} />
                  </div>

                  <div className={styles.inputBox}>
                    <label htmlFor="address">{t.address}</label>
                    <input id="address" type="text" required value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.addressPlaceholder} />
                  </div>

                  <div className={styles.inputBoxHalf}>
                    <div className={styles.inputBox}>
                      <label htmlFor="city">{t.city}</label>
                      <input id="city" type="text" required value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="İstanbul" />
                    </div>
                    <div className={styles.inputBox}>
                      <label htmlFor="zipCode">{t.zipCode}</label>
                      <input id="zipCode" type="text" required value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="34000" />
                    </div>
                  </div>

                  <div className={styles.inputBox}>
                    <label htmlFor="phone">{t.phone}</label>
                    <input id="phone" type="tel" required value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 555 123 4567" />
                  </div>

                </div>
              </div>

              {/* Payment */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>{t.paymentTitle}</h2>
                <div className={styles.cardForm}>

                  <div className={styles.inputBox}>
                    <label htmlFor="cardName">{t.cardName}</label>
                    <input id="cardName" type="text" required value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="NAME SURNAME" />
                  </div>

                  <div className={styles.inputBox}>
                    <label htmlFor="cardNumber">{t.cardNumber}</label>
                    <input id="cardNumber" type="text" inputMode="numeric" required
                      value={cardNumber} onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000" />
                  </div>

                  <div className={styles.inputBoxHalf}>
                    <div className={styles.inputBox}>
                      <label htmlFor="cardExpiry">{t.cardExpiry}</label>
                      <input id="cardExpiry" type="text" inputMode="numeric" required
                        value={cardExpiry} onChange={handleExpiryChange}
                        placeholder="MM/YY" />
                    </div>
                    <div className={styles.inputBox}>
                      <label htmlFor="cardCvv">{t.cardCvv}</label>
                      <input id="cardCvv" type="password" inputMode="numeric" required
                        value={cardCvv} onChange={handleCvvChange}
                        placeholder="123" />
                    </div>
                  </div>

                </div>
              </div>

              <button
                type="submit"
                className={styles.payBtn}
                disabled={isSubmitting || itemsToRender.length === 0}
              >
                {isSubmitting ? (
                  <span className={styles.loadingSpinner}>🔒 {submitStage}</span>
                ) : (
                  <span>{t.payBtn.replace('{amount}', grandTotal.toFixed(2))}</span>
                )}
              </button>

            </form>
          </div>

          {/* Right: Order Summary */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>{t.orderSummary}</h3>

              {itemsToRender.length > 0 ? (
                <>
                  <div className={styles.itemsList}>
                    {itemsToRender.map((item) => (
                      <div key={item.id} className={styles.summaryItem}>
                        {item.imageUrl ? (
                          <div className={styles.itemImageThumb}>
                            <img src={item.imageUrl} alt={item.name} className={styles.summaryThumbImage} />
                          </div>
                        ) : (
                          <div className={styles.itemColorThumb} style={{ backgroundColor: item.bagColor }}>
                            {item.emoji}
                          </div>
                        )}
                        <div className={styles.itemMeta}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemQty}>
                            {t.qtyLabel}: {item.quantity} {isWholesale ? t.kgLabel : ''}
                          </span>
                        </div>
                        <span className={styles.itemSubTotal}>
                          ₺{(isWholesale ? item.wholesalePrice * item.quantity : item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.breakdownTable}>
                    <div className={styles.breakdownRow}>
                      <span>{t.subtotal}</span>
                      <span>₺{subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.breakdownRow}>
                      <span>{t.shippingFee}</span>
                      <span>{shippingFee === 0 ? t.freeShipping : `₺${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className={styles.grandTotalRow}>
                      <span>{t.grandTotal}</span>
                      <span>₺{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className={styles.emptyPrompt}>{t.loadingOrder}</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function CheckoutPaymentContent({ locale }: CheckoutPaymentContentProps) {
  return (
    <Suspense fallback={<div className={styles.pageWrapper} style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>}>
      <PaymentForm locale={locale} />
    </Suspense>
  );
}
