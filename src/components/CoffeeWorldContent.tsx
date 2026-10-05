'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from '../app/coffee-world/world.module.css';

interface BlogPost {
  id: string;
  titleEn: string;
  titleTr: string;
  contentEn: string;
  contentTr: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

// Article bodies are stored as HTML (text, images, videos) — card excerpts need plain text only.
const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

interface CoffeeWorldContentProps {
  locale?: string;
}

export default function CoffeeWorldContent({ locale = 'tr' }: CoffeeWorldContentProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile filter dropdown

  const categories = [
    { slug: 'all', labelTr: 'Tümü', labelEn: 'All' },
    { slug: 'news', labelTr: 'Sektör Haberleri', labelEn: 'Industry News' },
    { slug: 'updates', labelTr: 'Kavurmahaneden Gelişmeler', labelEn: 'Roastery Updates' },
    { slug: 'introduction', labelTr: 'Yeni Kahveler', labelEn: 'New Coffee Arrivals' },
    { slug: 'guides', labelTr: 'Demleme Rehberleri', labelEn: 'Brewing Guides' },
    { slug: 'reviews', labelTr: 'Ekipman İncelemeleri', labelEn: 'Equipment Reviews' },
    { slug: 'techniques', labelTr: 'Kavurma Teknikleri', labelEn: 'Roasting Techniques' },
    { slug: 'barista', labelTr: 'Barista İpuçları', labelEn: 'Barista Tips' },
    { slug: 'horeca', labelTr: 'Horeca & Kafe İşletmeciliği', labelEn: 'Horeca & Business' },
    { slug: 'culture', labelTr: 'Kahve Kültürü', labelEn: 'Coffee Culture' },
  ];

  const t = {
    tr: {
      label: 'THE COFFEE ESTO DERGİ & REHBER',
      title: 'Kahve Dünyası',
      subtitle: 'Kavurma tekniklerinden demleme reçetelerine, barista eğitimlerinden ekipman kullanımına kadar kahveye dair güncel bilgiler, profesyonel öneriler ve sektörel içerikler.',
      filtersTitle: 'Kategoriler',
      loading: 'İçerikler yükleniyor...',
      noPosts: 'Bu kategoride henüz bir yazı bulunmamaktadır.',
      readMore: 'Devamını Oku',
      close: 'Kapat',
      by: 'Yazar:',
      date: 'Tarih:',
      author: 'The Coffee Esto Roastery',
    },
    en: {
      label: 'THE COFFEE ESTO JOURNAL & GUIDE',
      title: 'Coffee World',
      subtitle: 'From roasting techniques to brewing recipes, barista training to equipment use — up-to-date coffee knowledge, professional tips, and industry content.',
      filtersTitle: 'Categories',
      loading: 'Loading content...',
      noPosts: 'No posts available in this category yet.',
      readMore: 'Read More',
      close: 'Close',
      by: 'Written by:',
      date: 'Date:',
      author: 'The Coffee Esto Roastery',
    },
  }[locale === 'tr' ? 'tr' : 'en'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/blog');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setPosts(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter((post) => post.category === activeCategory);

  // A post may exist in only one language — fall back to the other so it never renders blank.
  const postTitle = (p: BlogPost) =>
    (locale === 'tr' ? p.titleTr || p.titleEn : p.titleEn || p.titleTr);
  const postContent = (p: BlogPost) =>
    (locale === 'tr' ? p.contentTr || p.contentEn : p.contentEn || p.contentTr);

  const getCategoryLabel = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return slug;
    return locale === 'tr' ? cat.labelTr : cat.labelEn;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar locale={locale} />
      <div className={styles.navOffset} aria-hidden="true" />

      {/* Hero Banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroInner}>
          <span className={styles.heroLabel}>{t.label}</span>
          <h1 className={styles.heroTitle}>{t.title}</h1>
          <p className={styles.heroSubtitle}>{t.subtitle}</p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className={styles.mainContainer}>
        <div className={styles.worldLayout}>
          {/* Left sidebar: category filters (dropdown on mobile) */}
          <aside className={styles.sidebar} aria-label={t.filtersTitle}>
            <button
              type="button"
              className={styles.filtersToggle}
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
            >
              <span>{activeCategory === 'all' ? t.filtersTitle : getCategoryLabel(activeCategory)}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`${styles.sidebarBody} ${filtersOpen ? styles.sidebarBodyOpen : ''}`}>
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupLabel}>{t.filtersTitle}</span>
                <div className={styles.filterTags} role="tablist" aria-label="Blog Categories">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      className={`${styles.tagBtn} ${activeCategory === cat.slug ? styles.tagBtnActive : ''}`}
                      onClick={() => { setActiveCategory(cat.slug); setFiltersOpen(false); }}
                      role="tab"
                      aria-selected={activeCategory === cat.slug}
                    >
                      {locale === 'tr' ? cat.labelTr : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.worldMain}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner}>☕️</span>
            <p>{t.loading}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t.noPosts}</p>
          </div>
        ) : (
          <div className={styles.magazineGrid}>
            {filteredPosts.map((post) => (
              <article key={post.id} className={styles.articleCard} onClick={() => setSelectedPost(post)}>
                <div className={styles.cardMedia}>
                  <img
                    src={post.imageUrl || '/images/blog/beans.png'}
                    alt={postTitle(post)}
                    className={styles.cardImage}
                  />
                  <span className={styles.cardBadge}>
                    {getCategoryLabel(post.category)}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardDate}>{formatDate(post.createdAt)}</span>
                  <h2 className={styles.cardTitle}>
                    {postTitle(post)}
                  </h2>
                  <p className={styles.cardExcerpt}>
                    {stripHtml(postContent(post)).substring(0, 160)}...
                  </p>
                  <button type="button" className={styles.readMoreBtn}>
                    {t.readMore} →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
          </div>
        </div>
      </main>

      {/* Article Detail Modal */}
      {selectedPost && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setSelectedPost(null)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className={styles.modalHero}>
              <img
                src={selectedPost.imageUrl || '/images/blog/beans.png'}
                alt={postTitle(selectedPost)}
                className={styles.modalHeroImage}
              />
            </div>
            <div className={styles.modalBody}>
              <span className={styles.modalCategory}>
                {getCategoryLabel(selectedPost.category)}
              </span>
              <h1 className={styles.modalTitle}>
                {postTitle(selectedPost)}
              </h1>
              <div className={styles.modalMeta}>
                <span>{t.by} <strong>{t.author}</strong></span>
                <span className={styles.metaDivider}>|</span>
                <span>{t.date} {formatDate(selectedPost.createdAt)}</span>
              </div>
              <div className={styles.modalText}>
                {postContent(selectedPost)
                  .split('\n\n')
                  .map((para, i) => {
                    if (para.includes('<') && para.includes('>')) {
                      return <div key={i} dangerouslySetInnerHTML={{ __html: para }} style={{ marginBottom: '1.25em' }} />;
                    }
                    return <p key={i}>{para}</p>;
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer locale={locale} />
    </div>
  );
}
