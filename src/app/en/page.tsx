import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import SpecialSection from '../../components/SpecialSection';
import CategoriesBento from '../../components/CategoriesBento';
import NewArrivals from '../../components/NewArrivals';
import Testimonials from '../../components/Testimonials';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Coffee Esto Roastery — Small-Batch Specialty Roastery',
  description: 'Freshly roasted, direct-trade specialty coffee. Sourced from single-origin farms and shipped straight to your door from our İstanbul roastery.',
  alternates: {
    canonical: 'https://coffeesto.com/en',
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
      <Navbar locale="en" />

      {/* Hero Section Carousel */}
      <Hero locale="en" />

      {/* Special 6-Bags Bundle Section */}
      <SpecialSection locale="en" />

      {/* Modern Bento Categories Section */}
      <CategoriesBento locale="en" />

      {/* Modern New Arrivals Section */}
      <NewArrivals locale="en" />

      {/* Modern Testimonials Section */}
      <Testimonials locale="en" />

      {/* Gorgeous Footer Section */}
      <Footer locale="en" />
    </main>
  );
}
