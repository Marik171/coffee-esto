import React, { use } from 'react';
import CoffeeDetailContent from '../../../components/CoffeeDetailContent';

export default function CoffeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <CoffeeDetailContent id={resolvedParams.id} locale="tr" />;
}
