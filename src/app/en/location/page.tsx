import React from 'react';
import type { Metadata } from 'next';
import LocationContent from '../../../components/LocationContent';

export const metadata: Metadata = {
  title: 'Visit Our İstanbul Roastery — Coffee Esto Roastery',
  description: 'Find directions, opening hours, and transport info to visit our main roastery and coffee shop in Kartal, İstanbul.',
  alternates: {
    canonical: 'https://coffeesto.com/en/location',
    languages: {
      'en-US': 'https://coffeesto.com/en/location',
      'tr-TR': 'https://coffeesto.com/location',
    },
  },
};

export default function LocationPage() {
  return <LocationContent locale="en" />;
}
