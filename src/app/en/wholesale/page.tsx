import React from 'react';
import WholesaleContent from '../../../components/WholesaleContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale Coffee B2B | Coffee Esto Roastery',
  description: 'Order freshly-roasted coffee beans in bulk with direct B2B pricing. High-quality single origins and specialty blends for cafes and resellers.',
};

export default function WholesalePage() {
  return <WholesaleContent locale="en" />;
}
