import React from 'react';
import { Metadata } from 'next';
import CoffeeWorldContent from '../../components/CoffeeWorldContent';

export const metadata: Metadata = {
  title: 'Kahve Dünyası — Coffee Esto Roastery',
  description: 'Kahve sektörü haberleri, demleme rehberleri, ekipman incelemeleri ve kavurma teknikleri.',
  alternates: {
    canonical: 'https://coffeesto.com/coffee-world',
    languages: {
      'en-US': 'https://coffeesto.com/en/coffee-world',
      'tr-TR': 'https://coffeesto.com/coffee-world',
    },
  },
};

export default function CoffeeWorldPage() {
  return <CoffeeWorldContent locale="tr" />;
}
