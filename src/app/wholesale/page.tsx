import React from 'react';
import WholesaleContent from '../../components/WholesaleContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toptan B2B Kahve Siparişi | Coffee Esto Roastery',
  description: 'Taze kavrulmuş nitelikli kahveleri en uygun toptan bayi fiyatlarıyla sipariş verin. Kafeler ve işletmeler için özel harmanlar.',
};

export default function WholesalePage() {
  return <WholesaleContent locale="tr" />;
}
