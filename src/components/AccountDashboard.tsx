'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './AccountDashboard.module.css';

type TabType = 'orders' | 'subscriptions' | 'profile';

interface AccountDashboardProps {
    locale?: string;
    email: string;
    onSignOut: () => void;
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface OrderSummary {
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    trackingNumber: string;
    createdAt: string;
    items: OrderItem[];
}

interface AddressEntry {
    id: string;
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
    isDefault: boolean;
}

interface PaymentMethodEntry {
    id: string;
    cardAlias: string;
    lastFourDigits: string;
    cardAssociation: string;
    cardFamily: string;
    cardBankName: string;
    isDefault: boolean;
}

const emptyAddressForm = { fullName: '', address: '', city: '', zipCode: '', phone: '' };
const emptyCardForm = { cardHolderName: '', cardNumber: '', expireMonth: '', expireYear: '', cardAlias: '' };

export default function AccountDashboard({ locale = 'en', email, onSignOut }: AccountDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('orders');
    const [currentEmail, setCurrentEmail] = useState(email);
    const [marketingEmail, setMarketingEmail] = useState(true);

    const [orders, setOrders] = useState<OrderSummary[] | null>(null);
    const [addresses, setAddresses] = useState<AddressEntry[] | null>(null);

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [emailDraft, setEmailDraft] = useState(email);
    const [emailError, setEmailError] = useState('');

    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState(emptyAddressForm);
    const [addressError, setAddressError] = useState('');

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodEntry[] | null>(null);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardForm, setCardForm] = useState(emptyCardForm);
    const [cardError, setCardError] = useState('');
    const [isSavingCard, setIsSavingCard] = useState(false);

    const isTr = locale === 'tr';
    const linkPrefix = isTr ? '' : '/en';

    useEffect(() => {
        fetch('/api/account/me')
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setCurrentEmail(json.data.email);
                    setEmailDraft(json.data.email);
                    setMarketingEmail(json.data.newsOptIn);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (activeTab === 'orders' && orders === null) {
            fetch('/api/account/orders')
                .then((res) => res.json())
                .then((json) => { if (json.success) setOrders(json.data); })
                .catch(() => setOrders([]));
        }
        if (activeTab === 'profile' && addresses === null) {
            fetch('/api/account/addresses')
                .then((res) => res.json())
                .then((json) => { if (json.success) setAddresses(json.data); })
                .catch(() => setAddresses([]));
        }
        if (activeTab === 'profile' && paymentMethods === null) {
            fetch('/api/account/payment-methods')
                .then((res) => res.json())
                .then((json) => { if (json.success) setPaymentMethods(json.data); })
                .catch(() => setPaymentMethods([]));
        }
    }, [activeTab, orders, addresses, paymentMethods]);

    const t = {
        orders: isTr ? 'Siparişler' : 'Orders',
        subscriptions: isTr ? 'Abonelikler' : 'Subscriptions',
        profile: isTr ? 'Profil' : 'Profile',
        welcome: isTr ? 'Hoş geldiniz' : 'Welcome',
        readyToShop: isTr ? 'Alışverişe hazır mısınız?' : 'Ready to shop?',
        shopNow: isTr ? 'Alışverişe başla' : 'Shop now',
        noSubsTitle: isTr ? 'Henüz aboneliğiniz yok' : "You don't have any subscriptions",
        noSubsText: isTr
            ? 'Abonelik ürünleri eklediğinizde onları burada görüntüleyip düzenleyebilirsiniz.'
            : "Once you've added some subscription products, you'll be able to view and edit them here.",
        contact: isTr ? 'İletişim' : 'Contact',
        edit: isTr ? 'Düzenle' : 'Edit',
        save: isTr ? 'Kaydet' : 'Save',
        cancel: isTr ? 'Vazgeç' : 'Cancel',
        add: isTr ? 'Ekle' : 'Add',
        remove: isTr ? 'Kaldır' : 'Remove',
        email: isTr ? 'E-posta' : 'Email',
        addresses: isTr ? 'Adresler' : 'Addresses',
        noAddresses: isTr ? 'Kayıtlı adres yok' : 'No addresses added',
        fullName: isTr ? 'Ad Soyad' : 'Full name',
        addressLine: isTr ? 'Adres' : 'Address',
        city: isTr ? 'Şehir' : 'City',
        zipCode: isTr ? 'Posta kodu' : 'Zip code',
        phone: isTr ? 'Telefon' : 'Phone',
        paymentMethods: isTr ? 'Ödeme yöntemleri' : 'Payment methods',
        noPaymentMethods: isTr ? 'Kayıtlı ödeme yöntemi yok' : 'No payment methods added',
        cardHolderName: isTr ? 'Kart üzerindeki isim' : 'Name on card',
        cardNumber: isTr ? 'Kart numarası' : 'Card number',
        expireMonth: isTr ? 'Ay (AA)' : 'Month (MM)',
        expireYear: isTr ? 'Yıl (YY)' : 'Year (YY)',
        cardAliasLabel: isTr ? 'Kart adı (opsiyonel)' : 'Card nickname (optional)',
        savingCard: isTr ? 'Kaydediliyor…' : 'Saving…',
        marketingPrefs: isTr ? 'Pazarlama tercihleri' : 'Marketing preferences',
        signOut: isTr ? 'Çıkış yap' : 'Sign out',
        signOutAllDevices: isTr ? 'Tüm cihazlardan çıkış yap' : 'Sign out of all devices',
        refundPolicy: isTr ? 'İade politikası' : 'Refund policy',
        privacyPolicy: isTr ? 'Gizlilik politikası' : 'Privacy policy',
        termsOfService: isTr ? 'Hizmet şartları' : 'Terms of service',
        noOrders: isTr ? 'Henüz siparişiniz yok' : 'No orders yet',
        orderPlacedOn: isTr ? 'Sipariş tarihi' : 'Placed on',
        genericError: isTr ? 'Bir şeyler ters gitti.' : 'Something went wrong.',
    };

    const saveEmail = async () => {
        setEmailError('');
        const res = await fetch('/api/account/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailDraft }),
        });
        const json = await res.json();
        if (!json.success) {
            setEmailError(json.error || t.genericError);
            return;
        }
        setCurrentEmail(json.data.email);
        setIsEditingEmail(false);
    };

    const toggleMarketing = async () => {
        const next = !marketingEmail;
        setMarketingEmail(next);
        await fetch('/api/account/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newsOptIn: next }),
        }).catch(() => setMarketingEmail(!next));
    };

    const submitAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddressError('');
        const res = await fetch('/api/account/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressForm),
        });
        const json = await res.json();
        if (!json.success) {
            setAddressError(json.error || t.genericError);
            return;
        }
        setAddresses((prev) => [json.data, ...(prev ?? [])]);
        setAddressForm(emptyAddressForm);
        setIsAddingAddress(false);
    };

    const removeAddress = async (id: string) => {
        setAddresses((prev) => (prev ?? []).filter((a) => a.id !== id));
        await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' }).catch(() => {});
    };

    const submitCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setCardError('');
        setIsSavingCard(true);
        try {
            const res = await fetch('/api/account/payment-methods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardForm),
            });
            const json = await res.json();
            if (!json.success) {
                setCardError(json.error || t.genericError);
                return;
            }
            setPaymentMethods((prev) => [json.data, ...(prev ?? [])]);
            setCardForm(emptyCardForm);
            setIsAddingCard(false);
        } finally {
            setIsSavingCard(false);
        }
    };

    const removeCard = async (id: string) => {
        setPaymentMethods((prev) => (prev ?? []).filter((m) => m.id !== id));
        await fetch(`/api/account/payment-methods/${id}`, { method: 'DELETE' }).catch(() => {});
    };

    return (
        <div className={styles.pageWrapper}>

            {/* ── Dashboard Header ── */}
            <header className={styles.header}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logoText}>COFFEE ESTO</h1>
                    <p className={styles.logoSubtext}>Roastery</p>
                </div>

                {/* User Account Avatar Icon SVG */}
                <div className={styles.avatarWrapper} aria-label={currentEmail}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={styles.avatarIcon}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    </svg>
                </div>
            </header>

            {/* ── Main Layout Split Grid ── */}
            <main className={styles.dashboardContainer}>

                {/* Left Interactive Sidebar Nav */}
                <aside className={styles.sidebar}>
                    <nav className={styles.navigation}>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNav : ''}`}
                        >
                            {t.orders}
                        </button>
                        <button
                            onClick={() => setActiveTab('subscriptions')}
                            className={`${styles.navItem} ${activeTab === 'subscriptions' ? styles.activeNav : ''}`}
                        >
                            {t.subscriptions}
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`${styles.navItem} ${activeTab === 'profile' ? styles.activeNav : ''}`}
                        >
                            {t.profile}
                        </button>
                    </nav>
                </aside>

                {/* Right Dynamic Viewport Panel Content Area */}
                <section className={styles.contentViewport}>

                    {/* VIEW 1: ORDERS TAB */}
                    {activeTab === 'orders' && (
                        orders && orders.length > 0 ? (
                            <div className={styles.profileStack}>
                                {orders.map((order) => (
                                    <div key={order.id} className={styles.infoCardBox}>
                                        <div className={styles.sectionHeaderRow}>
                                            <span className={styles.boldValueText}>{order.id}</span>
                                            <span className={styles.mutedValueText}>{order.status}</span>
                                        </div>
                                        <p className={styles.mutedLabelText}>
                                            {t.orderPlacedOn} {new Date(order.createdAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')}
                                        </p>
                                        <p className={styles.boldValueText}>
                                            {isTr ? `${order.totalAmount} TL` : `₺${order.totalAmount}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.welcomeCard}>
                                <div>
                                    <h2 className={styles.serifHeading}>{orders === null ? t.welcome : t.noOrders}</h2>
                                    <p className={styles.serifSubheading}>{t.readyToShop}</p>
                                </div>
                                <Link href={`${linkPrefix}/coffee`} className={styles.shopNowBtn}>
                                    {t.shopNow}
                                </Link>
                            </div>
                        )
                    )}

                    {/* VIEW 2: SUBSCRIPTIONS TAB */}
                    {activeTab === 'subscriptions' && (
                        <div className={styles.emptyStateContainer}>
                            <h2 className={styles.emptyStateTitle}>{t.noSubsTitle}</h2>
                            <p className={styles.emptyStateText}>
                                {t.noSubsText}
                            </p>
                        </div>
                    )}

                    {/* VIEW 3: PROFILE MANAGEMENT TAB */}
                    {activeTab === 'profile' && (
                        <div className={styles.profileStack}>

                            {/* Contact Information Segment */}
                            <div className={styles.profileSection}>
                                <div className={styles.sectionHeaderRow}>
                                    <h3 className={styles.sectionLabelTitle}>{t.contact}</h3>
                                    {!isEditingEmail && (
                                        <button className={styles.pillActionBtn} onClick={() => { setEmailDraft(currentEmail); setIsEditingEmail(true); }}>{t.edit}</button>
                                    )}
                                </div>
                                <div className={styles.infoCardBox}>
                                    {isEditingEmail ? (
                                        <div className={styles.contactRowLayout}>
                                            <span className={styles.mutedLabelText}>{t.email}</span>
                                            <input
                                                type="email"
                                                value={emailDraft}
                                                onChange={(e) => setEmailDraft(e.target.value)}
                                                style={{ fontSize: '13.5px', fontWeight: 500, padding: '6px 0', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.15)', outline: 'none' }}
                                            />
                                            {emailError && <span className={styles.mutedLabelText} style={{ color: '#c0392b' }}>{emailError}</span>}
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                <button className={styles.pillActionBtn} onClick={saveEmail}>{t.save}</button>
                                                <button className={styles.pillActionBtn} onClick={() => { setIsEditingEmail(false); setEmailError(''); }}>{t.cancel}</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.contactRowLayout}>
                                            <span className={styles.mutedLabelText}>{t.email}</span>
                                            <span className={styles.boldValueText}>{currentEmail}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Saved Shipping Addresses Segment */}
                            <div className={styles.profileSection}>
                                <div className={styles.sectionHeaderRow}>
                                    <h3 className={styles.sectionLabelTitle}>{t.addresses}</h3>
                                    {!isAddingAddress && (
                                        <button className={styles.pillActionBtn} onClick={() => setIsAddingAddress(true)}>{t.add}</button>
                                    )}
                                </div>

                                {isAddingAddress && (
                                    <form onSubmit={submitAddress} className={styles.infoCardBox} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                                        <input required placeholder={t.fullName} value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        <input required placeholder={t.addressLine} value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        <input required placeholder={t.city} value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        <input required placeholder={t.zipCode} value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        <input placeholder={t.phone} value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        {addressError && <span className={styles.mutedLabelText} style={{ color: '#c0392b' }}>{addressError}</span>}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button type="submit" className={styles.pillActionBtn}>{t.save}</button>
                                            <button type="button" className={styles.pillActionBtn} onClick={() => { setIsAddingAddress(false); setAddressError(''); }}>{t.cancel}</button>
                                        </div>
                                    </form>
                                )}

                                {addresses && addresses.length > 0 ? (
                                    addresses.map((addr) => (
                                        <div key={addr.id} className={styles.infoCardBox} style={{ marginBottom: '10px' }}>
                                            <div className={styles.sectionHeaderRow}>
                                                <span className={styles.boldValueText}>{addr.fullName}</span>
                                                <button className={styles.pillActionBtn} onClick={() => removeAddress(addr.id)}>{t.remove}</button>
                                            </div>
                                            <span className={styles.mutedValueText}>{addr.address}, {addr.city} {addr.zipCode}</span>
                                        </div>
                                    ))
                                ) : (
                                    !isAddingAddress && (
                                        <div className={styles.infoCardBox}>
                                            <div className={styles.iconFallbackRow}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.cardIconToken}>
                                                    <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                                                    <circle cx="12" cy="10" r="2" />
                                                </svg>
                                                <span className={styles.mutedValueText}>{t.noAddresses}</span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Payment Profiles Vault Segment */}
                            <div className={styles.profileSection}>
                                <div className={styles.sectionHeaderRow}>
                                    <h3 className={styles.sectionLabelTitle}>{t.paymentMethods}</h3>
                                    {!isAddingCard && (
                                        <button className={styles.pillActionBtn} onClick={() => setIsAddingCard(true)}>{t.add}</button>
                                    )}
                                </div>

                                {isAddingCard && (
                                    <form onSubmit={submitCard} className={styles.infoCardBox} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                                        <input required placeholder={t.cardHolderName} value={cardForm.cardHolderName} onChange={(e) => setCardForm({ ...cardForm, cardHolderName: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        <input required inputMode="numeric" placeholder={t.cardNumber} value={cardForm.cardNumber} onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value.replace(/[^\d\s]/g, '') })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input required inputMode="numeric" maxLength={2} placeholder={t.expireMonth} value={cardForm.expireMonth} onChange={(e) => setCardForm({ ...cardForm, expireMonth: e.target.value.replace(/\D/g, '') })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', width: '50%' }} />
                                            <input required inputMode="numeric" maxLength={2} placeholder={t.expireYear} value={cardForm.expireYear} onChange={(e) => setCardForm({ ...cardForm, expireYear: e.target.value.replace(/\D/g, '') })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', width: '50%' }} />
                                        </div>
                                        <input placeholder={t.cardAliasLabel} value={cardForm.cardAlias} onChange={(e) => setCardForm({ ...cardForm, cardAlias: e.target.value })} style={{ fontSize: '13.5px', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px' }} />
                                        {cardError && <span className={styles.mutedLabelText} style={{ color: '#c0392b' }}>{cardError}</span>}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button type="submit" className={styles.pillActionBtn} disabled={isSavingCard}>{isSavingCard ? t.savingCard : t.save}</button>
                                            <button type="button" className={styles.pillActionBtn} onClick={() => { setIsAddingCard(false); setCardError(''); }}>{t.cancel}</button>
                                        </div>
                                    </form>
                                )}

                                {paymentMethods && paymentMethods.length > 0 ? (
                                    paymentMethods.map((method) => (
                                        <div key={method.id} className={styles.infoCardBox} style={{ marginBottom: '10px' }}>
                                            <div className={styles.sectionHeaderRow}>
                                                <span className={styles.boldValueText}>
                                                    {[method.cardAssociation, method.cardBankName].filter(Boolean).join(' · ') || method.cardAlias} •••• {method.lastFourDigits}
                                                </span>
                                                <button className={styles.pillActionBtn} onClick={() => removeCard(method.id)}>{t.remove}</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    !isAddingCard && (
                                        <div className={styles.infoCardBox}>
                                            <div className={styles.iconFallbackRow}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.cardIconToken}>
                                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                                    <line x1="2" y1="10" x2="22" y2="10" />
                                                </svg>
                                                <span className={styles.mutedValueText}>{t.noPaymentMethods}</span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Marketing Communications Preferences Segment */}
                            <div className={styles.profileSection}>
                                <div className={styles.sectionHeaderRow}>
                                    <h3 className={styles.sectionLabelTitle}>{t.marketingPrefs}</h3>
                                </div>
                                <div className={styles.infoCardBox}>
                                    <div className={styles.toggleRowLayout} onClick={toggleMarketing}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.cardIconToken}>
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            <span className={styles.boldValueText} style={{ fontSize: '14px' }}>{t.email}</span>
                                        </div>

                                        {/* Morphic iOS Style Inline Check Toggle Switch */}
                                        <div className={`${styles.toggleSwitch} ${marketingEmail ? styles.toggleOn : ''}`}>
                                            <div className={styles.toggleIndicator}>
                                                {marketingEmail && <span className={styles.toggleCheck}>✓</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sign Out Trigger Boundary Button Row */}
                            <div className={styles.signOutRowBlock}>
                                <button className={styles.signOutBtnBox} onClick={onSignOut}>{t.signOut}</button>
                                <span className={styles.signOutSublabel}>{t.signOutAllDevices}</span>
                            </div>

                        </div>
                    )}

                </section>
            </main>

            {/* ── Global Bottom Legal Fine Print Footer ── */}
            <footer className={styles.footer}>
                <nav className={styles.footerNavLinks}>
                    <Link href={`${linkPrefix}/refunds`} className={styles.footerLink}>{t.refundPolicy}</Link>
                    <Link href={`${linkPrefix}/privacy`} className={styles.footerLink}>{t.privacyPolicy}</Link>
                    <Link href={`${linkPrefix}/terms`} className={styles.footerLink}>{t.termsOfService}</Link>
                </nav>
            </footer>

        </div>
    );
}
