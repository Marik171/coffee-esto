import React from 'react';
import type { Metadata } from 'next';
import AboutContent from '../../components/AboutContent';

export const metadata: Metadata = {
  title: 'Hikayemiz & Zanaatımız — Coffee Esto Roastery',
  description: 'Doğrudan ticari tedarik süreçlerimiz, küçük partili kavrum yöntemlerimiz ve İstanbul\'a nitelikli kahveyi taşıma yolculuğumuz hakkında bilgi edinin.',
  alternates: {
    canonical: 'https://coffeesto.com/about',
    languages: {
      'en-US': 'https://coffeesto.com/en/about',
      'tr-TR': 'https://coffeesto.com/about',
    },
  },
};

export default function AboutPage() {
  return <AboutContent locale="tr" />;
}
