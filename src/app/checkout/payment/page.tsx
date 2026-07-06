import React from 'react';
import CheckoutPaymentContent from '../../../components/CheckoutPaymentContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Güvenli Ödeme | Coffee Esto Roastery',
  description: 'Siparişinizi güvenle tamamlayın. Kargo ve ödeme bilgilerinizi girerek taze kavrulmuş kahvenizi hemen sipariş edin.',
};

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentContent locale="tr" />;
}
