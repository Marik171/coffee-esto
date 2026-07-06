'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LanguageSync() {
  const pathname = usePathname();

  useEffect(() => {
    const isEn = pathname.startsWith('/en') || pathname.includes('/en/');
    document.documentElement.lang = isEn ? 'en' : 'tr';
  }, [pathname]);

  return null;
}
