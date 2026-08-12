import React from 'react';
import type { Metadata } from 'next';
import AboutContent from '../../../components/AboutContent';

export const metadata: Metadata = {
  title: 'Our Story & Craft — Coffee Esto Roastery',
  description: 'Learn about our direct-trade sourcing, small-batch roasting methods, and our journey to bring exceptional specialty coffee to İstanbul.',
  alternates: {
    canonical: 'https://coffeeesto.com/en/about',
    languages: {
      'en-US': 'https://coffeeesto.com/en/about',
      'tr-TR': 'https://coffeeesto.com/about',
    },
  },
};

export default function AboutPage() {
  return <AboutContent locale="en" />;
}
