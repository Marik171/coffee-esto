'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { BrandLogoIcon, AlertTriangleIcon } from '@/components/admin/AdminIcons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kimlik doğrulama başarısız oldu.');
      }

      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Oturum doğrulanırken ağ hatası oluştu.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <BrandLogoIcon size={24} />
          </div>
          <span className={styles.brandTitle}>COFFEE ESTO</span>
          <span className={styles.brandSub}>Özel Kavurma Yönetimi</span>
          <h1 className={styles.title}>Kavurmahane Girişi</h1>
          <p className={styles.subtitle}>Canlı siparişlere ve kavurmahane işlemlerine erişmek için yönetici bilgilerinizi girin.</p>
        </div>

        {errorMsg && (
          <div className={styles.errorBanner} role="alert">
            <AlertTriangleIcon size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputBox}>
            <label htmlFor="admin-email">Yönetici E-postası</label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="örn. yonetici@kavurmahane.com"
            />
          </div>

          <div className={styles.inputBox}>
            <label htmlFor="admin-password">Güvenli Şifre</label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Giriş yapılıyor...' : 'Panele Giriş Yap →'}
          </button>
        </form>

        <Link href="/coffee" className={styles.backBtn}>
          ← Mağazaya Dön
        </Link>
      </div>
    </div>
  );
}
