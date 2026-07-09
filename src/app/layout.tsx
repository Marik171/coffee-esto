import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import ErrorBoundary from '../components/ErrorBoundary';
import LanguageSync from '../components/LanguageSync';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Coffee Esto Roastery — Small-Batch Specialty Roastery',
  description: 'Freshly roasted, direct-trade specialty coffee. Sourced from single-origin farms and shipped straight to your door from our İstanbul roastery.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Coffee Esto Roastery',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a0e07',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="auto" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <LanguageSync />
        <CartProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <ErrorBoundary fallback={null}>
            <CartDrawer />
          </ErrorBoundary>
        </CartProvider>
      </body>
    </html>
  );
}
