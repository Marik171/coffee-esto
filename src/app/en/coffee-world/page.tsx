import React from 'react';
import { Metadata } from 'next';
import CoffeeWorldContent from '../../../components/CoffeeWorldContent';

export const metadata: Metadata = {
  title: 'Coffee World — Coffee Esto Roastery',
  description: 'Specialty coffee industry news, brewing guides, equipment reviews, and roasting techniques.',
  alternates: {
    canonical: 'https://coffeeesto.com/en/coffee-world',
    languages: {
      'en-US': 'https://coffeeesto.com/en/coffee-world',
      'tr-TR': 'https://coffeeesto.com/coffee-world',
    },
  },
};

export default function CoffeeWorldEnPage() {
  return <CoffeeWorldContent locale="en" />;
}
