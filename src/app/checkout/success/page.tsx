import React from 'react';
import CheckoutSuccessContent from '../../../components/CheckoutSuccessContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Siparişiniz Onaylandı | Coffee Esto Roastery',
  description: 'Satın alımınız için teşekkür ederiz. Siparişiniz başarıyla alındı ve taze kavrum sırasına eklendi.',
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent locale="tr" />;
}
