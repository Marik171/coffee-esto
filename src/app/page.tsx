import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SpecialSection from '../components/SpecialSection';
import CategoriesBento from '../components/CategoriesBento';
import NewArrivals from '../components/NewArrivals';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Coffee Esto Roastery — Taze Nitelikli Kahve Kavurmahanesi',
  description: 'Taze kavrulmuş, doğrudan ticaret nitelikli kahveler. Tek kökenli çiftliklerden tedarik edilip İstanbul kavurmahanemizden kapınıza gönderilir.',
  alternates: {
    canonical: 'https://coffeesto.com',
    languages: {
      'en-US': 'https://coffeesto.com/en',
      'tr-TR': 'https://coffeesto.com',
    },
  },
};

export default function Home() {
  return (
    <main>
      {/* Centralized Navigation Header */}
      <Navbar locale="tr" />

      {/* Hero Section Carousel */}
      <Hero locale="tr" />

      {/* Special 6-Bags Bundle Section */}
      <SpecialSection locale="tr" />

      {/* Modern Bento Categories Section */}
      <CategoriesBento locale="tr" />

      {/* Modern New Arrivals Section */}
      <NewArrivals locale="tr" />

      {/* Modern Testimonials Section */}
      <Testimonials locale="tr" />

      {/* Gorgeous Footer Section */}
      <Footer waveColor="#f5ede0" locale="tr" />
    </main>
  );
}
