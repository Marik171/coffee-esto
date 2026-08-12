import React from 'react';
import type { Metadata } from 'next';
import AboutContent from '../../components/AboutContent';

export const metadata: Metadata = {
  title: 'Hikayemiz & Zanaatımız — Coffee Esto Roastery',
  description: 'Doğrudan ticari tedarik süreçlerimiz, küçük partili kavrum yöntemlerimiz ve İstanbul\'a nitelikli kahveyi taşıma yolculuğumuz hakkında bilgi edinin.',
  alternates: {
    canonical: 'https://coffeeesto.com/about',
    languages: {
      'en-US': 'https://coffeeesto.com/en/about',
      'tr-TR': 'https://coffeeesto.com/about',
    },
  },
};

export default function AboutPage() {
  return <AboutContent locale="tr" />;
}
