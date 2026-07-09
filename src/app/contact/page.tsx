import React from 'react';
import type { Metadata } from 'next';
import ContactContent from '../../components/ContactContent';

export const metadata: Metadata = {
  title: 'İletişim — Coffee Esto Roastery',
  description: 'Bizimle iletişime geçin. Ofis ve kavurmahanemizin bilgileri, telefon, e-posta detayları ve mesaj formu.',
  alternates: {
    canonical: 'https://coffeesto.com/contact',
    languages: {
      'en-US': 'https://coffeesto.com/en/contact',
      'tr-TR': 'https://coffeesto.com/contact',
    },
  },
};

export default function ContactPage() {
  return <ContactContent locale="tr" />;
}
