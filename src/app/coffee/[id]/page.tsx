import React from 'react';
import type { Metadata } from 'next';
import CoffeeDetailContent from '../../../components/CoffeeDetailContent';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

async function getProduct(id: string) {
  try {
    const cleanId = id.trim().toLowerCase();
    const cacheKey = `product_${cleanId}`;
    let product = getCached<any>(cacheKey);
    if (!product) {
      product = await db.product.findUnique({ where: { id: cleanId } });
      if (product) setCached(cacheKey, product, 60);
    }
    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Nitelikli Kahve — Coffee Esto Roastery' };
  return {
    title: `${product.name} — Coffee Esto Roastery`,
    description: product.description || `${product.name} taze kavrulmuş nitelikli kahve.`,
  };
}

export default async function CoffeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return <CoffeeDetailContent id={id} initialProduct={product} locale="tr" />;
}
