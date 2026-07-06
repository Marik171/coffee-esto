import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CoffeeCatalogContent from '../../../components/CoffeeCatalogContent';

export const metadata: Metadata = {
  title: 'Buy Specialty Coffee Online — Coffee Esto Roastery',
  description: 'Browse our catalog of freshly roasted single origins and espresso blends. Sourced ethically and roasted to order.',
  alternates: {
    canonical: 'https://coffeesto.com/en/coffee',
    languages: {
      'en-US': 'https://coffeesto.com/en/coffee',
      'tr-TR': 'https://coffeesto.com/coffee',
    },
  },
};

export default function CoffeePage() {
  return (
    <div className="pageWrapper">
      <Navbar locale="en" />
      <CoffeeCatalogContent locale="en" />
      <Footer waveColor="#faf8f6" locale="en" />
    </div>
  );
}
