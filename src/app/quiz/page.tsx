import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import QuizContent from '../../components/QuizContent';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Mükemmel Kahve Kavurmunu Bul — Coffee Esto Roastery',
  description: 'Sabah demleme yönteminize en uygun tek kökenli taze kahve çekirdeklerini bulmak için hızlı e-eşleşme testimizi çözün.',
  alternates: {
    canonical: 'https://coffeesto.com/quiz',
    languages: {
      'en-US': 'https://coffeesto.com/en/quiz',
      'tr-TR': 'https://coffeesto.com/quiz',
    },
  },
};

export default function QuizPage() {
  return (
    <main>
      <Navbar locale="tr" />
      <QuizContent locale="tr" />
      <Footer waveColor="#f5ede0" locale="tr" />
    </main>
  );
}
