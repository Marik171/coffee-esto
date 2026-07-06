import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import QuizContent from '../../../components/QuizContent';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Find Your Perfect Coffee Roast — Coffee Esto Roastery',
  description: 'Take our coffee matcher quiz to find the perfect single-origin roasted beans for your morning brewing method.',
  alternates: {
    canonical: 'https://coffeesto.com/en/quiz',
    languages: {
      'en-US': 'https://coffeesto.com/en/quiz',
      'tr-TR': 'https://coffeesto.com/quiz',
    },
  },
};

export default function QuizPage() {
  return (
    <main>
      <Navbar locale="en" />
      <QuizContent locale="en" />
      <Footer locale="en" />
    </main>
  );
}
