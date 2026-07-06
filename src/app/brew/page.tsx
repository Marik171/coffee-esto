import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import BrewGuidesContent from '../../components/BrewGuidesContent';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'İnteraktif Kahve Demleme Rehberleri — Coffee Esto Roastery',
  description: 'Evde V60 Pour Over, French Press veya Aeropress ile kahve demlemeyi öğrenin. Adım adım demleme asistanı kronometremizi deneyin.',
  alternates: {
    canonical: 'https://coffeesto.com/brew',
    languages: {
      'en-US': 'https://coffeesto.com/en/brew',
      'tr-TR': 'https://coffeesto.com/brew',
    },
  },
};

export default function BrewGuidesPage() {
  return (
    <main>
      <Navbar locale="tr" />
      <BrewGuidesContent locale="tr" />
      <Footer waveColor="#f5ede0" locale="tr" />
    </main>
  );
}
