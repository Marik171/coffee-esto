import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CoffeeCatalogContent from '../../../components/CoffeeCatalogContent';
import styles from '../../coffee/coffee.module.css';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

export const metadata: Metadata = {
  title: 'Buy Specialty Coffee Online — Coffee Esto Roastery',
  description: 'Browse our catalog of freshly roasted single origins and espresso blends. Sourced ethically and roasted to order.',
  alternates: {
    canonical: 'https://coffeeesto.com/en/coffee',
    languages: {
      'en-US': 'https://coffeeesto.com/en/coffee',
      'tr-TR': 'https://coffeeesto.com/coffee',
    },
  },
};

async function getInitialCatalogData() {
  try {
    let products = getCached<any[]>('products_public');
    let categories = getCached<any[]>('categories_public');

    if (!products) {
      products = await db.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      setCached('products_public', products, 60);
    }

    if (!categories) {
      categories = await db.category.findMany({
        orderBy: { label: 'asc' },
      });
      setCached('categories_public', categories, 60);
    }

    return { products, categories };
  } catch (err) {
    console.error('Failed to pre-render catalog server data:', err);
    return { products: [], categories: [] };
  }
}

export default async function CoffeePage() {
  const { products, categories } = await getInitialCatalogData();

  return (
    <div className={styles.pageWrapper}>
      <Navbar locale="en" />
      <CoffeeCatalogContent
        initialProducts={products}
        initialCategories={categories}
        locale="en"
      />
      <Footer waveColor="#faf8f6" locale="en" />
    </div>
  );
}
