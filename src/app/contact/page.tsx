import React from 'react';
import type { Metadata } from 'next';
import ContactContent from '../../components/ContactContent';

export const metadata: Metadata = {
  title: 'İletişim — Coffee Esto Roastery',
  description: 'Bizimle iletişime geçin. Ofis ve kavurmahanemizin bilgileri, telefon, e-posta detayları ve mesaj formu.',
  alternates: {
    canonical: 'https://coffeeesto.com/contact',
    languages: {
      'en-US': 'https://coffeeesto.com/en/contact',
      'tr-TR': 'https://coffeeesto.com/contact',
    },
  },
};

export default function ContactPage() {
  return <ContactContent locale="tr" />;
}
