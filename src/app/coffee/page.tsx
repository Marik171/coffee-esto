import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CoffeeCatalogContent from '../../components/CoffeeCatalogContent';
import styles from './coffee.module.css';
import db from '@/lib/db';
import { getCached, setCached } from '@/lib/cache';

// Reads live DB data; must never be prerendered at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nitelikli Kahve Satın Al — Coffee Esto Roastery',
  description: 'Taze kavrulmuş tek kökenli ve espresso harmanı kahve kataloğumuzu inceleyin. Etik kaynaklı ve sipariş üzerine taze kavrulmuş.',
  alternates: {
    canonical: 'https://coffeeesto.com/coffee',
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
      <Navbar locale="tr" />
      <CoffeeCatalogContent
        initialProducts={products}
        initialCategories={categories}
        locale="tr"
      />
      <Footer waveColor="#faf8f6" locale="tr" />
    </div>
  );
}
