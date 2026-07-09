import React from 'react';
import type { Metadata } from 'next';
import CartContent from '../../../components/CartContent';

export const metadata: Metadata = {
  title: 'Shopping Cart — Coffee Esto Roastery',
  description: 'View your shopping cart items, update quantities, and proceed to checkout.',
  alternates: {
    canonical: 'https://coffeesto.com/en/cart',
    languages: {
      'en-US': 'https://coffeesto.com/en/cart',
      'tr-TR': 'https://coffeesto.com/cart',
    },
  },
};

export default function CartPage() {
  return <CartContent locale="en" />;
}
