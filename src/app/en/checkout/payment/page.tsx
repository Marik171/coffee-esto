import React from 'react';
import CheckoutPaymentContent from '../../../../components/CheckoutPaymentContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout | Coffee Esto Roastery',
  description: 'Complete your purchase securely. Enter shipping and payment details to finish ordering your custom roasted coffee.',
};

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentContent locale="en" />;
}
