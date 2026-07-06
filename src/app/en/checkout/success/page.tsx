import React from 'react';
import CheckoutSuccessContent from '../../../../components/CheckoutSuccessContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed | Coffee Esto Roastery',
  description: 'Thank you for your purchase. Your order has been placed successfully and has been queued for roasting.',
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent locale="en" />;
}
