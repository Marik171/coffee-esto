import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CoffeeCatalogContent from '../../components/CoffeeCatalogContent';

export const metadata: Metadata = {
  title: 'Nitelikli Kahve Satın Al — Coffee Esto Roastery',
  description: 'Taze kavrulmuş tek kökenli ve espresso harmanı kahve kataloğumuzu inceleyin. Etik kaynaklı ve sipariş üzerine taze kavrulmuş.',
  alternates: {
    canonical: 'https://coffeesto.com/coffee',
    languages: {
      'en-US': 'https://coffeesto.com/en/coffee',
      'tr-TR': 'https://coffeesto.com/coffee',
    },
  },
};

export default function CoffeePage() {
  return (
    <div className="pageWrapper">
      <Navbar locale="tr" />
      <CoffeeCatalogContent locale="tr" />
      <Footer waveColor="#faf8f6" locale="tr" />
    </div>
  );
}
