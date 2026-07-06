import React from 'react';
import type { Metadata } from 'next';
import LocationContent from '../../components/LocationContent';

export const metadata: Metadata = {
  title: 'Kavurmahanemizi Ziyaret Edin — Coffee Esto Roastery',
  description: 'Kartal, İstanbul\'daki ana kavurmahanemizi ve kafemizi ziyaret etmek için yol tarifleri, çalışma saatleri ve ulaşım bilgilerini bulun.',
  alternates: {
    canonical: 'https://coffeesto.com/location',
    languages: {
      'en-US': 'https://coffeesto.com/en/location',
      'tr-TR': 'https://coffeesto.com/location',
    },
  },
};

export default function LocationPage() {
  return <LocationContent locale="tr" />;
}
