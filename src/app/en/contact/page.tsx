import React from 'react';
import type { Metadata } from 'next';
import ContactContent from '../../../components/ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us — Coffee Esto Roastery',
  description: 'Get in touch with us. Find roastery location details, email addresses, phone lines, and our contact form.',
  alternates: {
    canonical: 'https://coffeesto.com/en/contact',
    languages: {
      'en-US': 'https://coffeesto.com/en/contact',
      'tr-TR': 'https://coffeesto.com/contact',
    },
  },
};

export default function ContactPage() {
  return <ContactContent locale="en" />;
}
