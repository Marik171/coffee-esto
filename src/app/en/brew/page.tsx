import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import BrewGuidesContent from '../../../components/BrewGuidesContent';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Interactive Coffee Brewing Guides — Coffee Esto Roastery',
  description: 'Learn how to brew coffee at home using V60 Pour Over, French Press, or Aeropress. Try our step-by-step extraction timer helper.',
  alternates: {
    canonical: 'https://coffeesto.com/en/brew',
    languages: {
      'en-US': 'https://coffeesto.com/en/brew',
      'tr-TR': 'https://coffeesto.com/brew',
    },
  },
};

export default function BrewGuidesPage() {
  return (
    <main>
      <Navbar locale="en" />
      <BrewGuidesContent locale="en" />
      <Footer locale="en" />
    </main>
  );
}
