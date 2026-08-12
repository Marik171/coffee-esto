import React from 'react';
import type { Metadata } from 'next';
import CartContent from '../../components/CartContent';

export const metadata: Metadata = {
  title: 'Alışveriş Sepeti — Coffee Esto Roastery',
  description: 'Sepetinizdeki ürünleri görüntüleyin, adetleri güncelleyin ve ödemeye geçin.',
  alternates: {
    canonical: 'https://coffeeesto.com/cart',
    languages: {
      'en-US': 'https://coffeeesto.com/en/cart',
      'tr-TR': 'https://coffeeesto.com/cart',
    },
  },
};

export default function CartPage() {
  return <CartContent locale="tr" />;
}
