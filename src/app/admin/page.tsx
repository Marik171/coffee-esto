
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

/* ── Types ────────────────────────────────────────────────────── */
interface OrderItem { id: string; name: string; quantity: number; price: number; }
interface Order {
  id: string; email: string; phone: string; address: string;
  subtotal: number; shippingFee: number; totalAmount: number;
  status: string; payment_status: string; fulfillment_status: string;
  trackingNumber: string; shippingProvider: string;
  items: OrderItem[]; createdAt: string;
}
interface CoffeeProduct {
  id: string; name: string; category: string; origin: string; altitude: string;
  varietal: string; roastLevel: number; tastingNotes: string; description: string;
  price: number; price1kg: number; stock: number; imageUrl: string; videoUrl: string; isActive: boolean;
}
interface Category { id: string; slug: string; label: string; productCount?: number; }
interface CargoProvider { id: string; name: string; fee: number; isActive: boolean; sortOrder: number; }

/* ── Helpers ───────────────────────────────────────────────────── */
const emptyProduct = (): Partial<CoffeeProduct> => ({
  id: '', name: '', category: '', origin: '', altitude: '', varietal: '',
  roastLevel: 50, tastingNotes: '', description: '', price: 0, price1kg: 0, stock: 0,
  imageUrl: '', videoUrl: '', isActive: true,
});

function fmtStatus(type: 'order' | 'payment' | 'fulfillment', value: string): string {
  const map: Record<string, Record<string, string>> = {
    order: { pending: 'Pending', completed: 'Completed', canceled: 'Canceled' },
    payment: { awaiting: 'Awaiting Payment', captured: 'Paid', refunded: 'Refunded', canceled: 'Canceled' },
    fulfillment: { not_fulfilled: 'Awaiting Fulfillment', roasting: 'Roasting', fulfilled: 'Packed', shipped: 'Shipped', canceled: 'Canceled' },
  };
  return map[type]?.[value] ?? value.replace(/_/g, ' ');
}

/* ── Component ─────────────────────────────────────────────────── */
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const blogImageInputRef = useRef<HTMLInputElement>(null);
  const contentTrRef = useRef<HTMLDivElement>(null);
  const contentEnRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'categories' | 'customers' | 'blog' | 'shipping'>('orders');

  // Blog CMS
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isAddingBlogPost, setIsAddingBlogPost] = useState(false);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    titleEn: '', titleTr: '', contentEn: '', contentTr: '', category: 'news', imageUrl: ''
  });
  const [blogImagePreview, setBlogImagePreview] = useState('');
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({
    bold: false, italic: false, underline: false, strikeThrough: false, h2: false, h3: false, blockquote: false, ul: false, ol: false
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shippingProvider, setShippingProvider] = useState('Esto Express Courier');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Customers
  const [customerSearch, setCustomerSearch] = useState('');

  // Products
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CoffeeProduct | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<CoffeeProduct>>(emptyProduct());
  const [imagePreview, setImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLabel, setCatLabel] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editCatLabel, setEditCatLabel] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  // Shipping settings + cargo providers
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [cargoProviders, setCargoProviders] = useState<CargoProvider[]>([]);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CargoProvider | null>(null);
  const [providerForm, setProviderForm] = useState({ name: '', fee: 0 });

  // Shared UI
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  /* ── Data fetchers ─────────────────────────────────────────── */
  const fetchOrders = async () => {
    setIsLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/orders');
      const d = await res.json();
      if (d.success) setOrders(d.data);
      else setErrorMsg(d.error);
    } catch { setErrorMsg('Network error loading orders.'); }
    finally { setIsLoading(false); }
  };

  const fetchProducts = async () => {
    setIsLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/products');
      const d = await res.json();
      if (d.success) setProducts(d.data);
      else setErrorMsg(d.error);
    } catch { setErrorMsg('Network error loading products.'); }
    finally { setIsLoading(false); }
  };

  const fetchCategories = async () => {
    setIsLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/categories');
      const d = await res.json();
      if (d.success) setCategories(d.data);
      else setErrorMsg(d.error);
    } catch { setErrorMsg('Network error loading categories.'); }
    finally { setIsLoading(false); }
  };

  const fetchShippingSettings = async () => {
    setIsLoading(true); setErrorMsg('');
    try {
      const [settingsRes, providersRes] = await Promise.all([
        fetch('/api/admin/shipping-settings'),
        fetch('/api/admin/cargo-providers'),
      ]);
      const settingsData = await settingsRes.json();
      const providersData = await providersRes.json();
      if (settingsData.success) setShippingEnabled(settingsData.data.enabled);
      else setErrorMsg(settingsData.error);
      if (providersData.success) setCargoProviders(providersData.data);
      else setErrorMsg(providersData.error);
    } catch { setErrorMsg('Network error loading shipping settings.'); }
    finally { setIsLoading(false); }
  };

  const fetchBlogPosts = async () => {
    setIsLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/blog');
      const d = await res.json();
      if (d.success) setBlogPosts(d.data);
      else setErrorMsg(d.error);
    } catch { setErrorMsg('Network error loading blog posts.'); }
    finally { setIsLoading(false); }
  };

  const openAddBlogPost = () => {
    setSelectedBlogPost(null);
    setBlogForm({
      titleEn: '', titleTr: '', contentEn: '', contentTr: '', category: 'news', imageUrl: ''
    });
    setBlogImagePreview('');
    setIsAddingBlogPost(true);
  };

  const openEditBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setBlogForm(post);
    setBlogImagePreview(post.imageUrl || '');
    setIsAddingBlogPost(true);
  };

  const handleBlogImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBlogImage(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setBlogImagePreview(d.data.url);
      setBlogForm(prev => ({ ...prev, imageUrl: d.data.url }));
    } catch (err: unknown) {
      setErrorMsg(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploadingBlogImage(false);
    }
  };

  const updateActiveFormats = () => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        h2: document.queryCommandValue('formatBlock') === 'h2',
        h3: document.queryCommandValue('formatBlock') === 'h3',
        blockquote: document.queryCommandValue('formatBlock') === 'blockquote',
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // Ignored
    }
  };

  const handleEditorInput = (lang: 'en' | 'tr') => {
    const ref = lang === 'tr' ? contentTrRef : contentEnRef;
    if (ref.current) {
      const html = ref.current.innerHTML;
      setBlogForm(prev => ({
        ...prev,
        [lang === 'tr' ? 'contentTr' : 'contentEn']: html
      }));
      updateActiveFormats();
    }
  };

  const execEditorCommand = (lang: 'en' | 'tr', cmd: string, val: string = '') => {
    const el = lang === 'tr' ? contentTrRef.current : contentEnRef.current;
    if (el) {
      el.focus();
      document.execCommand(cmd, false, val);
      handleEditorInput(lang);
      updateActiveFormats();
    }
  };

  const insertLink = (lang: 'en' | 'tr') => {
    const url = window.prompt(lang === 'tr' ? 'Bağlantı adresi girin (URL):' : 'Enter link URL:');
    if (!url) return;
    execEditorCommand(lang, 'createLink', url);
  };

  useEffect(() => {
    if (isAddingBlogPost) {
      if (contentTrRef.current) {
        contentTrRef.current.innerHTML = blogForm.contentTr || '';
      }
      if (contentEnRef.current) {
        contentEnRef.current.innerHTML = blogForm.contentEn || '';
      }
      updateActiveFormats();
    }
  }, [isAddingBlogPost, selectedBlogPost]);

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true); setErrorMsg('');
    const isEdit = !!selectedBlogPost;
    const url = '/api/admin/blog';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: selectedBlogPost.id, ...blogForm } : blogForm),
      });
      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || 'Failed to save blog post.');
        return;
      }
      setIsAddingBlogPost(false);
      setSelectedBlogPost(null);
      fetchBlogPosts();
    } catch {
      setErrorMsg('Failed to connect to server.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || 'Failed to delete blog post.');
        return;
      }
      fetchBlogPosts();
    } catch {
      setErrorMsg('Failed to delete blog post due to server error.');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (activeTab === 'orders' || activeTab === 'customers') fetchOrders();
      else if (activeTab === 'inventory') { fetchProducts(); fetchCategories(); }
      else if (activeTab === 'categories') fetchCategories();
      else if (activeTab === 'blog') fetchBlogPosts();
      else if (activeTab === 'shipping') fetchShippingSettings();
    });
  }, [activeTab]);

  /* ── Auth ──────────────────────────────────────────────────── */
  const handleLogout = async () => {
    const res = await fetch('/api/admin/logout', { method: 'POST' });
    if (res.ok) router.push('/admin/login');
  };

  /* ── Tab reset helper ──────────────────────────────────────── */
  const switchTab = (tab: 'orders' | 'inventory' | 'categories' | 'customers' | 'blog' | 'shipping') => {
    setActiveTab(tab);
    setSelectedOrder(null);
    setSelectedProduct(null);
    setIsAddingProduct(false);
    setShowCatModal(false);
    setSelectedBlogPost(null);
    setIsAddingBlogPost(false);
    setShowProviderModal(false);
    setEditingProvider(null);
    setErrorMsg('');
  };

  const viewCustomerOrders = (email: string) => {
    setActiveTab('orders');
    setOrderSearch(email);
    setOrderStatusFilter('all');
  };

  /* ── Orders actions ─────────────────────────────────────────── */
  const handleOrderAction = async (action: string) => {
    if (!selectedOrder) return;
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id, action,
          shippingProvider: action === 'create_fulfillment' ? shippingProvider : undefined,
          trackingNumber: action === 'ship_fulfillment' ? trackingNumber : undefined,
        }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setSelectedOrder(d.data);
      setOrders(prev => prev.map(o => o.id === d.data.id ? d.data : o));
      setTrackingNumber('');
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  /* ── Product form helpers ───────────────────────────────────── */
  const openAddProduct = () => {
    setProdForm(emptyProduct());
    setImagePreview('');
    setVideoPreview('');
    setSelectedProduct(null);
    setIsAddingProduct(true);
  };

  const openEditProduct = (p: CoffeeProduct) => {
    setProdForm({ ...p });
    setImagePreview(p.imageUrl || '');
    setVideoPreview(p.videoUrl || '');
    setSelectedProduct(p);
    setIsAddingProduct(false);
  };

  const handleFieldChange = (field: keyof CoffeeProduct, value: string | number | boolean) => {
    setProdForm(prev => ({ ...prev, [field]: value }));
  };

  /* ── File upload helper ─────────────────────────────────────── */
  const uploadFile = async (file: File, type: 'image' | 'video') => {
    const setter = type === 'image' ? setUploadingImage : setUploadingVideo;
    setter(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      if (type === 'image') {
        setImagePreview(d.data.url);
        setProdForm(prev => ({ ...prev, imageUrl: d.data.url }));
      } else {
        setVideoPreview(d.data.url);
        setProdForm(prev => ({ ...prev, videoUrl: d.data.url }));
      }
    } catch (err: unknown) {
      setErrorMsg(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setter(false);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, 'image');
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, 'video');
  };

  /* ── Product CRUD ───────────────────────────────────────────── */
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true); setErrorMsg('');
    try {
      const method = selectedProduct ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodForm),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchProducts();
      setSelectedProduct(null);
      setIsAddingProduct(false);
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(`Deactivate "${id}"? It will be hidden from the store but order history is preserved.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchProducts();
      setSelectedProduct(null);
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  /* ── Category CRUD ──────────────────────────────────────────── */
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: catLabel }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setCatLabel('');
      setShowCatModal(false);
      fetchCategories();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCat.id, label: editCatLabel }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setEditingCat(null);
      fetchCategories();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchCategories();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  /* ── Shipping settings + cargo provider CRUD ──────────────────── */
  const handleToggleShipping = async (enabled: boolean) => {
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/shipping-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setShippingEnabled(d.data.enabled);
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/cargo-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: providerForm.name, fee: providerForm.fee }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setShowProviderModal(false);
      setProviderForm({ name: '', fee: 0 });
      fetchShippingSettings();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleUpdateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/cargo-providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProvider.id, name: providerForm.name, fee: providerForm.fee }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setEditingProvider(null);
      setShowProviderModal(false);
      fetchShippingSettings();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleToggleProviderActive = async (provider: CargoProvider) => {
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch('/api/admin/cargo-providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: provider.id, isActive: !provider.isActive }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchShippingSettings();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Delete this cargo provider?')) return;
    setActionLoading(true); setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/cargo-providers?id=${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchShippingSettings();
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.'); }
    finally { setActionLoading(false); }
  };

  /* ── KPIs + filtered orders ─────────────────────────────────── */
  const grossRevenue = orders.filter(o => o.payment_status === 'captured').reduce((a, o) => a + o.totalAmount, 0);
  const pendingFulfillments = orders.filter(o => o.fulfillment_status === 'not_fulfilled' || o.fulfillment_status === 'roasting').length;
  const pendingPayments = orders.filter(o => o.payment_status === 'awaiting').length;

  const filteredOrders = orders.filter(o => {
    const q = orderSearch.toLowerCase();
    const matchesSearch = !q || o.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    const matchesStatus = orderStatusFilter === 'all' || o.fulfillment_status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ── Customers (derived from orders — no separate table yet) ─── */
  interface CustomerRow {
    email: string; phone: string; address: string;
    orderCount: number; lifetimeSpend: number;
    firstOrderAt: string; lastOrderAt: string;
  }
  const customers = Object.values(
    orders.reduce((acc, o) => {
      const key = o.email.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          email: o.email, phone: o.phone, address: o.address,
          orderCount: 0, lifetimeSpend: 0,
          firstOrderAt: o.createdAt, lastOrderAt: o.createdAt,
        };
      }
      const c = acc[key];
      if (o.status !== 'canceled') c.orderCount += 1;
      if (o.payment_status === 'captured') c.lifetimeSpend += o.totalAmount;
      if (o.createdAt < c.firstOrderAt) c.firstOrderAt = o.createdAt;
      if (o.createdAt > c.lastOrderAt) { c.lastOrderAt = o.createdAt; c.phone = o.phone; c.address = o.address; }
      return acc;
    }, {} as Record<string, CustomerRow>)
  ).sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);

  const filteredCustomers = customers.filter(c => {
    const q = customerSearch.toLowerCase();
    return !q || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
  });

  const repeatCustomers = customers.filter(c => c.orderCount > 1).length;

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className={styles.adminWrapper}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoTop}>COFFEE</span>
          <span className={styles.logoMiddle}>ESTO</span>
          <span className={styles.logoBottom}>ROASTERY</span>
          <span className={styles.adminTag}>COMMERCE CORE</span>
        </div>
        <nav className={styles.sidebarNav}>
          <button onClick={() => switchTab('orders')} className={`${styles.navItem} ${activeTab === 'orders' ? styles.navItemActive : ''}`}>
            📦 Orders Queue
          </button>
          <button onClick={() => switchTab('inventory')} className={`${styles.navItem} ${activeTab === 'inventory' ? styles.navItemActive : ''}`}>
            ☕️ Coffee Inventory
          </button>
          <button onClick={() => switchTab('categories')} className={`${styles.navItem} ${activeTab === 'categories' ? styles.navItemActive : ''}`}>
            🏷️ Categories
          </button>
          <button onClick={() => switchTab('customers')} className={`${styles.navItem} ${activeTab === 'customers' ? styles.navItemActive : ''}`}>
            👤 Customers
          </button>
          <button onClick={() => switchTab('blog')} className={`${styles.navItem} ${activeTab === 'blog' ? styles.navItemActive : ''}`}>
            📰 Blog CMS
          </button>
          <button onClick={() => switchTab('shipping')} className={`${styles.navItem} ${activeTab === 'shipping' ? styles.navItemActive : ''}`}>
            🚚 Shipping
          </button>
          <Link href="/coffee" className={styles.navItem}>☕️ View Storefront</Link>
          <Link href="/" className={styles.navItem}>🏠 Homepage</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>🚪 Sign Out</button>
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className={styles.mainContent}>

        {/* ───── Tab: Orders ───── */}
        {activeTab === 'orders' && (
          <>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>Orders Administration</h1>
              <button onClick={fetchOrders} className={styles.refreshBtn}>🔄 Refresh</button>
            </header>
            {errorMsg && <div className={styles.errorBanner} role="alert"><span>⚠️ {errorMsg}</span></div>}
            <section className={styles.kpiGrid}>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Net Revenue</span><span className={styles.kpiVal}>₺{grossRevenue.toFixed(2)}</span></div>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Total Orders</span><span className={styles.kpiVal}>{orders.length}</span></div>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Awaiting Fulfillment</span><span className={styles.kpiVal} style={{ color: pendingFulfillments > 0 ? '#ff3601' : '#4aa57f' }}>{pendingFulfillments}</span></div>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Awaiting Payment</span><span className={styles.kpiVal} style={{ color: pendingPayments > 0 ? '#e5c158' : '#4aa57f' }}>{pendingPayments}</span></div>
            </section>
            <div className={styles.filterRow}>
              <input
                type="search"
                placeholder="Search by email or order ID…"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Orders</option>
                <option value="not_fulfilled">Awaiting Fulfillment</option>
                <option value="roasting">Roasting</option>
                <option value="fulfilled">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="canceled">Canceled</option>
              </select>
              {(orderSearch || orderStatusFilter !== 'all') && (
                <span className={styles.filterCount}>{filteredOrders.length} of {orders.length}</span>
              )}
            </div>
            <section className={styles.tableCard}>
              {isLoading ? (
                <div className={styles.loadingBox}><span className={styles.loadingSpinner}>☕️</span><p>Loading orders...</p></div>
              ) : orders.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.ordersTable}>
                    <thead><tr><th>Reference ID</th><th>Date</th><th>Email</th><th>Total</th><th>Status</th><th>Payment</th><th>Fulfillment</th></tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id} onClick={() => setSelectedOrder(o)} className={`${styles.orderRow} ${selectedOrder?.id === o.id ? styles.orderRowSelected : ''}`}>
                          <td className={styles.idCol}>{o.id}</td>
                          <td>{new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                          <td>{o.email}</td>
                          <td className={styles.totalCol}>₺{o.totalAmount.toFixed(2)}</td>
                          <td><span className={`${styles.badge} ${styles[`status_${o.status}`]}`}>{fmtStatus('order', o.status)}</span></td>
                          <td><span className={`${styles.badge} ${styles[`status_${o.payment_status}`]}`}>{fmtStatus('payment', o.payment_status)}</span></td>
                          <td><span className={`${styles.badge} ${styles[`status_${o.fulfillment_status}`]}`}>{fmtStatus('fulfillment', o.fulfillment_status)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyRegistry}><span className={styles.emptyIcon}>📦</span><h3>No Orders Yet</h3></div>
              )}
            </section>
          </>
        )}

        {/* ───── Tab: Customers ───── */}
        {activeTab === 'customers' && (
          <>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>Customers</h1>
              <button onClick={fetchOrders} className={styles.refreshBtn}>🔄 Refresh</button>
            </header>
            {errorMsg && <div className={styles.errorBanner} role="alert"><span>⚠️ {errorMsg}</span></div>}
            <section className={styles.kpiGrid}>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Total Customers</span><span className={styles.kpiVal}>{customers.length}</span></div>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Repeat Customers</span><span className={styles.kpiVal}>{repeatCustomers}</span></div>
              <div className={styles.kpiCard}><span className={styles.kpiLabel}>Avg. Lifetime Spend</span><span className={styles.kpiVal}>₺{(customers.reduce((a, c) => a + c.lifetimeSpend, 0) / (customers.length || 1)).toFixed(2)}</span></div>
            </section>
            <div className={styles.filterRow}>
              <input
                type="search"
                placeholder="Search by email or phone…"
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
                className={styles.searchInput}
              />
              {customerSearch && (
                <span className={styles.filterCount}>{filteredCustomers.length} of {customers.length}</span>
              )}
            </div>
            <section className={styles.tableCard}>
              {isLoading ? (
                <div className={styles.loadingBox}><span className={styles.loadingSpinner}>☕️</span><p>Loading customers...</p></div>
              ) : filteredCustomers.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.ordersTable}>
                    <thead><tr><th>Email</th><th>Phone</th><th>Orders</th><th>Lifetime Spend</th><th>Last Order</th><th>Type</th></tr></thead>
                    <tbody>
                      {filteredCustomers.map(c => (
                        <tr key={c.email} onClick={() => viewCustomerOrders(c.email)} className={styles.orderRow}>
                          <td>{c.email}</td>
                          <td>{c.phone || '—'}</td>
                          <td>{c.orderCount}</td>
                          <td className={styles.totalCol}>₺{c.lifetimeSpend.toFixed(2)}</td>
                          <td>{new Date(c.lastOrderAt).toLocaleDateString([], { dateStyle: 'medium' })}</td>
                          <td>
                            <span className={`${styles.badge} ${c.orderCount > 1 ? styles.status_fulfilled : styles.status_not_fulfilled}`}>
                              {c.orderCount > 1 ? 'Repeat' : 'New'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyRegistry}><span className={styles.emptyIcon}>👤</span><h3>No Customers Yet</h3></div>
              )}
            </section>
          </>
        )}

        {/* ───── Tab: Inventory ───── */}
        {activeTab === 'inventory' && (
          <>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>Coffee Roast Inventory</h1>
              <div className={styles.headerActions}>
                <button onClick={openAddProduct} className={styles.addBtn}>➕ Add Coffee Roast</button>
                <button onClick={fetchProducts} className={styles.refreshBtn}>🔄 Refresh</button>
              </div>
            </header>
            {errorMsg && <div className={styles.errorBanner} role="alert"><span>⚠️ {errorMsg}</span></div>}
            <section className={styles.tableCard}>
              {isLoading ? (
                <div className={styles.loadingBox}><span className={styles.loadingSpinner}>☕️</span><p>Loading inventory...</p></div>
              ) : products.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.ordersTable}>
                    <thead><tr><th>Product ID</th><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Roast</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className={styles.orderRow} onClick={() => openEditProduct(p)}>
                          <td className={styles.idCol}>{p.id}</td>
                          <td>
                            {p.imageUrl
                              ? <img src={p.imageUrl} alt={p.name} className={styles.thumbPreview} />
                              : <span className={styles.noThumb}>—</span>}
                          </td>
                          <td style={{ fontWeight: 700 }}>{p.name}</td>
                          <td style={{ textTransform: 'capitalize' }}>{p.category.replace('-', ' ')}</td>
                          <td className={styles.totalCol}>₺{p.price}</td>
                          <td style={{ color: p.stock === 0 ? '#ff3601' : p.stock <= 5 ? '#e5c158' : 'inherit', fontWeight: p.stock <= 5 ? 700 : 400 }}>
                            {p.stock === 0 ? '⚠ Out' : p.stock}
                          </td>
                          <td>{p.roastLevel}%</td>
                          <td><span className={`${styles.badge} ${p.isActive ? styles.status_captured : styles.status_canceled}`}>{p.isActive ? 'Active' : 'Hidden'}</span></td>
                          <td>
                            <div className={styles.actionCell} onClick={e => e.stopPropagation()}>
                              <button onClick={() => openEditProduct(p)} className={styles.editIconBtn}>✏️ Edit</button>
                              <button onClick={() => handleDeleteProduct(p.id)} className={styles.deleteIconBtn}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyRegistry}><span className={styles.emptyIcon}>☕️</span><h3>No Products</h3></div>
              )}
            </section>
          </>
        )}

        {/* ───── Tab: Categories ───── */}
        {activeTab === 'categories' && (
          <>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>Category Management</h1>
              <div className={styles.headerActions}>
                <button onClick={() => { setShowCatModal(true); setCatLabel(''); setErrorMsg(''); }} className={styles.addBtn}>➕ Add Category</button>
                <button onClick={fetchCategories} className={styles.refreshBtn}>🔄 Refresh</button>
              </div>
            </header>
            {errorMsg && <div className={styles.errorBanner} role="alert"><span>⚠️ {errorMsg}</span></div>}
            <section className={styles.tableCard}>
              {isLoading ? (
                <div className={styles.loadingBox}><span className={styles.loadingSpinner}>🏷️</span><p>Loading categories...</p></div>
              ) : categories.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.ordersTable}>
                    <thead><tr><th>Slug ID</th><th>Display Label</th><th>Products Using</th><th>Actions</th></tr></thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id} className={styles.orderRow}>
                          <td className={styles.idCol}>{cat.slug}</td>
                          <td>
                            {editingCat?.id === cat.id ? (
                              <form onSubmit={handleRenameCategory} className={styles.inlineEditForm}>
                                <input
                                  autoFocus
                                  value={editCatLabel}
                                  onChange={e => setEditCatLabel(e.target.value)}
                                  className={styles.inlineInput}
                                />
                                <button type="submit" className={styles.editIconBtn} disabled={actionLoading}>✓</button>
                                <button type="button" onClick={() => setEditingCat(null)} className={styles.deleteIconBtn}>✕</button>
                              </form>
                            ) : (
                              <span style={{ fontWeight: 600 }}>{cat.label}</span>
                            )}
                          </td>
                          <td>
                            <span className={`${styles.badge} ${(cat.productCount ?? 0) > 0 ? styles.status_captured : styles.status_pending}`}>
                              {cat.productCount ?? 0} product{(cat.productCount ?? 0) !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionCell}>
                              <button
                                onClick={() => { setEditingCat(cat); setEditCatLabel(cat.label); }}
                                className={styles.editIconBtn}
                              >✏️ Rename</button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className={styles.deleteIconBtn}
                                disabled={(cat.productCount ?? 0) > 0}
                                title={(cat.productCount ?? 0) > 0 ? 'Reassign products before deleting' : ''}
                              >🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyRegistry}><span className={styles.emptyIcon}>🏷️</span><h3>No Categories</h3></div>
              )}
            </section>
          </>
        )}
        {/* ───── Tab: Shipping ───── */}
        {activeTab === 'shipping' && (
          <>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>Shipping Settings</h1>
              <div className={styles.headerActions}>
                <button
                  onClick={() => { setShowProviderModal(true); setEditingProvider(null); setProviderForm({ name: '', fee: 0 }); setErrorMsg(''); }}
                  className={styles.addBtn}
                >➕ Add Cargo Provider</button>
                <button onClick={fetchShippingSettings} className={styles.refreshBtn}>🔄 Refresh</button>
              </div>
            </header>
            {errorMsg && <div className={styles.errorBanner} role="alert"><span>⚠️ {errorMsg}</span></div>}

            <section className={styles.tableCard} style={{ marginBottom: 24 }}>
              <div className={styles.checkboxBox}>
                <input
                  type="checkbox"
                  id="shipping-enabled"
                  checked={shippingEnabled}
                  disabled={actionLoading}
                  onChange={(e) => handleToggleShipping(e.target.checked)}
                />
                <label htmlFor="shipping-enabled">
                  Charge shipping costs at checkout {shippingEnabled ? '(customers pick a cargo provider and pay its fee)' : '(shipping is currently free for all orders)'}
                </label>
              </div>
            </section>

            <section className={styles.tableCard}>
              {isLoading ? (
                <div className={styles.loadingBox}><span className={styles.loadingSpinner}>🚚</span><p>Loading cargo providers...</p></div>
              ) : cargoProviders.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.ordersTable}>
                    <thead><tr><th>Provider</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {cargoProviders.map(provider => (
                        <tr key={provider.id} className={styles.orderRow}>
                          <td style={{ fontWeight: 600 }}>{provider.name}</td>
                          <td>₺{provider.fee.toFixed(2)}</td>
                          <td>
                            <span className={`${styles.badge} ${provider.isActive ? styles.status_captured : styles.status_pending}`}>
                              {provider.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionCell}>
                              <button
                                onClick={() => { setEditingProvider(provider); setProviderForm({ name: provider.name, fee: provider.fee }); setShowProviderModal(true); }}
                                className={styles.editIconBtn}
                              >✏️ Edit</button>
                              <button
                                onClick={() => handleToggleProviderActive(provider)}
                                className={styles.editIconBtn}
                              >{provider.isActive ? '⏸️ Disable' : '▶️ Enable'}</button>
                              <button
                                onClick={() => handleDeleteProvider(provider.id)}
                                className={styles.deleteIconBtn}
                              >🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyRegistry}><span className={styles.emptyIcon}>🚚</span><h3>No Cargo Providers</h3></div>
              )}
            </section>
          </>
        )}
        {/* ───── Tab: Blog CMS ───── */}
        {activeTab === 'blog' && (
          <>
            <header className={styles.header}>
              <h1 className={styles.pageTitle}>Blog & Magazine CMS</h1>
              <div className={styles.headerActions}>
                <button onClick={openAddBlogPost} className={styles.addBtn}>➕ Add Blog Post</button>
                <button onClick={fetchBlogPosts} className={styles.refreshBtn}>🔄 Refresh</button>
              </div>
            </header>
            {errorMsg && <div className={styles.errorBanner} role="alert"><span>⚠️ {errorMsg}</span></div>}
            
            <section className={styles.tableCard}>
              {isLoading ? (
                <div className={styles.loadingBox}><span className={styles.loadingSpinner}>📰</span><p>Loading blog posts...</p></div>
              ) : blogPosts.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.ordersTable}>
                    <thead>
                      <tr>
                        <th>Title (TR)</th>
                        <th>Title (EN)</th>
                        <th>Category</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map(post => (
                        <tr key={post.id} className={styles.orderRow} onClick={() => openEditBlogPost(post)}>
                          <td style={{ fontWeight: 600 }}>{post.titleTr}</td>
                          <td>{post.titleEn}</td>
                          <td style={{ textTransform: 'capitalize' }}>{post.category}</td>
                          <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className={styles.actionCell} onClick={e => e.stopPropagation()}>
                              <button onClick={() => openEditBlogPost(post)} className={styles.editIconBtn}>✏️ Edit</button>
                              <button onClick={() => handleDeleteBlogPost(post.id)} className={styles.deleteIconBtn}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyRegistry}><span className={styles.emptyIcon}>📰</span><h3>No Blog Posts Yet</h3></div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Drawer: Order Details                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {selectedOrder && activeTab === 'orders' && (
        <div className={styles.drawerBackdrop} onClick={() => setSelectedOrder(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()} role="dialog">
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Order Specifications</h2>
              <button onClick={() => setSelectedOrder(null)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.metaSection}>
                <span className={styles.metaLabel}>Reference ID</span>
                <span className={styles.metaValMono}>{selectedOrder.id}</span>
                <span className={styles.metaSubText}>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>Customer</h3>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone || '—'}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
              </div>
              <div className={styles.infoBlock}>
                <h3 className={styles.blockTitle}>Line Items</h3>
                <div className={styles.itemsBox}>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className={styles.itemRow}>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemPrice}>₺{item.price.toFixed(2)} × {item.quantity}</span>
                      </div>
                      <span className={styles.itemSub}>₺{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className={styles.drawerTotals}>
                    <div className={styles.totalRow}><span>Subtotal</span><span>₺{selectedOrder.subtotal.toFixed(2)}</span></div>
                    <div className={styles.totalRow}><span>Shipping</span><span>{selectedOrder.shippingFee === 0 ? 'FREE' : `₺${selectedOrder.shippingFee.toFixed(2)}`}</span></div>
                    <div className={`${styles.totalRow} ${styles.grandTotal}`}><span>Grand Total</span><span>₺{selectedOrder.totalAmount.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
              <div className={styles.actionsBlock}>
                <h3 className={styles.blockTitle}>Workflow</h3>
                {/* Payment */}
                <div className={styles.opBox}>
                  <h4 className={styles.opTitle}>Payment Status</h4>
                  <span className={`${styles.badge} ${styles[`status_${selectedOrder.payment_status}`]}`}>{fmtStatus('payment', selectedOrder.payment_status)}</span>
                </div>
                {/* Fulfillment */}
                <div className={styles.opBox}>
                  <h4 className={styles.opTitle}>Fulfillment</h4>
                  <span className={`${styles.badge} ${styles[`status_${selectedOrder.fulfillment_status}`]}`}>{fmtStatus('fulfillment', selectedOrder.fulfillment_status)}</span>
                  {selectedOrder.fulfillment_status === 'not_fulfilled' && selectedOrder.status !== 'canceled' && (
                    <div className={styles.fulfillmentForm}>
                      <p className={styles.carrierInfo}>Order is queued for the next roast batch.</p>
                      <button onClick={() => handleOrderAction('start_roasting')} className={styles.opActionBtn} disabled={actionLoading}>
                        {actionLoading ? 'Starting...' : '🔥 Start Roasting'}
                      </button>
                    </div>
                  )}
                  {selectedOrder.fulfillment_status === 'roasting' && selectedOrder.status !== 'canceled' && (
                    <div className={styles.fulfillmentForm}>
                      <p className={styles.carrierInfo}>Beans are roasting — let them rest before packing for freshness.</p>
                      <div className={styles.dropdownBox}>
                        <label htmlFor="provider-select">Shipping Carrier</label>
                        <select id="provider-select" value={shippingProvider} onChange={e => setShippingProvider(e.target.value)}>
                          <option>Esto Express Courier</option>
                          <option>Yurtiçi Kargo</option>
                          <option>Aras Kargo</option>
                          <option>MNG Kargo</option>
                          <option>Sürat Kargo</option>
                          <option>PTT Kargo</option>
                          <option>UPS Kargo</option>
                          <option>Trendyol Express</option>
                        </select>
                      </div>
                      <button onClick={() => handleOrderAction('create_fulfillment')} className={styles.opActionBtn} disabled={actionLoading}>
                        {actionLoading ? 'Assigning...' : '📦 Create Fulfillment'}
                      </button>
                    </div>
                  )}
                  {selectedOrder.fulfillment_status === 'fulfilled' && selectedOrder.status !== 'canceled' && (
                    <div className={styles.fulfillmentForm}>
                      <p className={styles.carrierInfo}>Carrier: <strong>{selectedOrder.shippingProvider}</strong></p>
                      <div className={styles.inputBox}>
                        <label htmlFor="tracking-input">Tracking Number</label>
                        <input id="tracking-input" type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g. YK-927192" />
                      </div>
                      <button onClick={() => handleOrderAction('ship_fulfillment')} className={styles.opActionBtn} disabled={actionLoading || !trackingNumber}>
                        {actionLoading ? 'Dispatching...' : '🛵 Ship Order'}
                      </button>
                    </div>
                  )}
                  {selectedOrder.fulfillment_status === 'shipped' && (
                    <div className={styles.fulfillmentInfoCard}>
                      <p>🚚 <strong>Via:</strong> {selectedOrder.shippingProvider}</p>
                      <p>🔑 <strong>Tracking:</strong> <code className={styles.code}>{selectedOrder.trackingNumber}</code></p>
                    </div>
                  )}
                </div>
                {selectedOrder.status !== 'canceled' && selectedOrder.status !== 'completed' && selectedOrder.fulfillment_status !== 'shipped' && (
                  <button onClick={() => handleOrderAction('cancel_order')} className={styles.cancelBtn} disabled={actionLoading}>
                    {actionLoading ? 'Cancelling...' : '🚫 Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Drawer: Product Create / Edit                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {(selectedProduct || isAddingProduct) && activeTab === 'inventory' && (
        <div className={styles.drawerBackdrop} onClick={() => { setSelectedProduct(null); setIsAddingProduct(false); }}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()} role="dialog">
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>{selectedProduct ? 'Edit Coffee Roast' : 'Add New Coffee Roast'}</h2>
              <button onClick={() => { setSelectedProduct(null); setIsAddingProduct(false); }} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              {errorMsg && <div className={styles.errorBanner}><span>⚠️ {errorMsg}</span></div>}
              <form onSubmit={handleSaveProduct} className={styles.inventoryForm}>

                {/* Slug */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-slug">Unique Slug ID <span className={styles.hint}>(lowercase, no spaces)</span></label>
                  <input id="prod-slug" type="text" required value={prodForm.id || ''} onChange={e => handleFieldChange('id', e.target.value)} placeholder="e.g. costa-rica-tarrazu" disabled={!!selectedProduct} />
                </div>

                {/* Name */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-name">Coffee Name</label>
                  <input id="prod-name" type="text" required value={prodForm.name || ''} onChange={e => handleFieldChange('name', e.target.value)} placeholder="e.g. Costa Rica Tarrazú" />
                </div>

                {/* Category — dynamic from DB */}
                <div className={styles.dropdownBox}>
                  <label htmlFor="prod-cat">Category</label>
                  <select id="prod-cat" value={prodForm.category || ''} onChange={e => handleFieldChange('category', e.target.value)} required>
                    <option value="" disabled>Select a category…</option>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </select>
                </div>

                {/* Price */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-price">250g Price (₺)</label>
                  <input id="prod-price" type="number" required value={prodForm.price || ''} onChange={e => handleFieldChange('price', e.target.value)} placeholder="e.g. 180" />
                </div>

                {/* 1kg Price */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-price-1kg">1kg Price (₺)</label>
                  <input id="prod-price-1kg" type="number" value={prodForm.price1kg || ''} onChange={e => handleFieldChange('price1kg', e.target.value)} placeholder="e.g. 1000" />
                </div>

                {/* Stock */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-stock">Stock (units available)</label>
                  <input id="prod-stock" type="number" min="0" required value={prodForm.stock ?? 0} onChange={e => handleFieldChange('stock', Number(e.target.value))} placeholder="e.g. 50" />
                </div>

                {/* Origin */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-origin">Origin / Province</label>
                  <input id="prod-origin" type="text" value={prodForm.origin || ''} onChange={e => handleFieldChange('origin', e.target.value)} placeholder="e.g. Tarrazú, San José" />
                </div>

                {/* Altitude */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-alt">Altitude</label>
                  <input id="prod-alt" type="text" value={prodForm.altitude || ''} onChange={e => handleFieldChange('altitude', e.target.value)} placeholder="e.g. 1500m - 1800m" />
                </div>

                {/* Varietal */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-var">Varietal</label>
                  <input id="prod-var" type="text" value={prodForm.varietal || ''} onChange={e => handleFieldChange('varietal', e.target.value)} placeholder="e.g. Caturra, Catuai" />
                </div>

                {/* Roast level */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-roast">Roast Level ({prodForm.roastLevel}%)</label>
                  <input id="prod-roast" type="range" min="10" max="100" value={prodForm.roastLevel || 50} onChange={e => handleFieldChange('roastLevel', Number(e.target.value))} className={styles.rangeInput} />
                  <div className={styles.rangeMarkers}><span>Light (10%)</span><span>Medium (50%)</span><span>Dark (100%)</span></div>
                </div>

                {/* Tasting notes */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-notes">Tasting Notes <span className={styles.hint}>(comma-separated)</span></label>
                  <input id="prod-notes" type="text" value={prodForm.tastingNotes || ''} onChange={e => handleFieldChange('tastingNotes', e.target.value)} placeholder="e.g. Milk Chocolate, Citrus, Honey" />
                </div>

                {/* Description */}
                <div className={styles.inputBox}>
                  <label htmlFor="prod-desc">Description</label>
                  <textarea id="prod-desc" rows={3} value={prodForm.description || ''} onChange={e => handleFieldChange('description', e.target.value)} placeholder="Brief sensory description..." />
                </div>

                {/* ── Image Upload ── */}
                <div className={styles.mediaBlock}>
                  <label className={styles.mediaLabel}>Product Image</label>
                  {imagePreview && (
                    <div className={styles.mediaPreview}>
                      <img src={imagePreview} alt="Preview" className={styles.mediaPreviewImg} />
                      <button type="button" className={styles.clearMediaBtn} onClick={() => { setImagePreview(''); setProdForm(p => ({ ...p, imageUrl: '' })); }}>✕ Remove</button>
                    </div>
                  )}
                  <div
                    className={styles.uploadZone}
                    onClick={() => imageInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadFile(f, 'image'); }}
                  >
                    <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={styles.hiddenInput} onChange={handleImageFile} />
                    {uploadingImage
                      ? <span className={styles.uploadingText}>⏳ Uploading image...</span>
                      : <><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Drop image here or <u>click to browse</u></span><span className={styles.uploadHint}>JPG, PNG, WebP, GIF — max 20 MB</span></>
                    }
                  </div>
                  {/* OR paste URL fallback */}
                  <div className={styles.inputBox} style={{ marginTop: 8 }}>
                    <label htmlFor="prod-imgurl">Or paste an image URL</label>
                    <input id="prod-imgurl" type="text" value={prodForm.imageUrl || ''} onChange={e => { handleFieldChange('imageUrl', e.target.value); setImagePreview(e.target.value); }} placeholder="https://example.com/image.jpg" />
                  </div>
                </div>

                {/* ── Video Upload ── */}
                <div className={styles.mediaBlock}>
                  <label className={styles.mediaLabel}>Product Video <span className={styles.hint}>(optional)</span></label>
                  {videoPreview && (
                    <div className={styles.mediaPreview}>
                      <video src={videoPreview} controls muted className={styles.mediaPreviewVideo} />
                      <button type="button" className={styles.clearMediaBtn} onClick={() => { setVideoPreview(''); setProdForm(p => ({ ...p, videoUrl: '' })); }}>✕ Remove</button>
                    </div>
                  )}
                  <div
                    className={styles.uploadZone}
                    onClick={() => videoInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadFile(f, 'video'); }}
                  >
                    <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className={styles.hiddenInput} onChange={handleVideoFile} />
                    {uploadingVideo
                      ? <span className={styles.uploadingText}>⏳ Uploading video...</span>
                      : <><span className={styles.uploadIcon}>🎥</span><span className={styles.uploadText}>Drop video here or <u>click to browse</u></span><span className={styles.uploadHint}>MP4, WebM, MOV — max 20 MB</span></>
                    }
                  </div>
                  <div className={styles.inputBox} style={{ marginTop: 8 }}>
                    <label htmlFor="prod-vidurl">Or paste a video URL</label>
                    <input id="prod-vidurl" type="text" value={prodForm.videoUrl || ''} onChange={e => { handleFieldChange('videoUrl', e.target.value); setVideoPreview(e.target.value); }} placeholder="https://example.com/video.mp4" />
                  </div>
                </div>

                {/* Active toggle */}
                <div className={styles.checkboxBox}>
                  <input id="prod-active" type="checkbox" checked={!!prodForm.isActive} onChange={e => handleFieldChange('isActive', e.target.checked)} />
                  <label htmlFor="prod-active">Show in storefront catalog</label>
                </div>

                <button type="submit" className={styles.opActionBtn} disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : '☕️ Save Roast'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Modal: Add Category                                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {showCatModal && activeTab === 'categories' && (
        <div className={styles.modalBackdrop} onClick={() => setShowCatModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="cat-modal-title">
            <div className={styles.modalHeader}>
              <h2 id="cat-modal-title" className={styles.modalTitle}>New Category</h2>
              <button onClick={() => setShowCatModal(false)} className={styles.closeBtn}>✕</button>
            </div>
            {errorMsg && <div className={styles.errorBanner}><span>⚠️ {errorMsg}</span></div>}
            <form onSubmit={handleAddCategory} className={styles.modalForm}>
              <div className={styles.inputBox}>
                <label htmlFor="cat-label">Category Display Label</label>
                <input id="cat-label" type="text" required autoFocus value={catLabel} onChange={e => setCatLabel(e.target.value)} placeholder="e.g. Cold Brew, Decaf, Limited Edition" />
                {catLabel && (
                  <span className={styles.slugPreview}>
                    Slug: <strong>{catLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}</strong>
                  </span>
                )}
              </div>
              <button type="submit" className={styles.opActionBtn} disabled={actionLoading}>
                {actionLoading ? 'Creating...' : '🏷️ Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Modal: Add/Edit Cargo Provider                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {showProviderModal && activeTab === 'shipping' && (
        <div className={styles.modalBackdrop} onClick={() => { setShowProviderModal(false); setEditingProvider(null); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="provider-modal-title">
            <div className={styles.modalHeader}>
              <h2 id="provider-modal-title" className={styles.modalTitle}>{editingProvider ? 'Edit Cargo Provider' : 'New Cargo Provider'}</h2>
              <button onClick={() => { setShowProviderModal(false); setEditingProvider(null); }} className={styles.closeBtn}>✕</button>
            </div>
            {errorMsg && <div className={styles.errorBanner}><span>⚠️ {errorMsg}</span></div>}
            <form onSubmit={editingProvider ? handleUpdateProvider : handleAddProvider} className={styles.modalForm}>
              <div className={styles.inputBox}>
                <label htmlFor="provider-name">Provider Name</label>
                <input
                  id="provider-name" type="text" required autoFocus
                  value={providerForm.name}
                  onChange={e => setProviderForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Yurtici Kargo, Aras Kargo"
                />
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="provider-fee">Shipping Fee (₺)</label>
                <input
                  id="provider-fee" type="number" required min={0} step="0.01"
                  value={providerForm.fee}
                  onChange={e => setProviderForm(prev => ({ ...prev, fee: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <button type="submit" className={styles.opActionBtn} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : (editingProvider ? '🚚 Save Provider' : '🚚 Create Provider')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Modal: Add/Edit Blog Post                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isAddingBlogPost && activeTab === 'blog' && (
        <div className={styles.modalBackdrop} onClick={() => setIsAddingBlogPost(false)}>
          <div className={styles.wideModal} onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="blog-modal-title">
            <div className={styles.modalHeader}>
              <h2 id="blog-modal-title" className={styles.modalTitle}>
                {selectedBlogPost ? 'Editorial Blog Post — Editor' : 'New Editorial Blog Post — Editor'}
              </h2>
              <button onClick={() => setIsAddingBlogPost(false)} className={styles.closeBtn}>✕</button>
            </div>
            {errorMsg && <div className={styles.errorBanner}><span>⚠️ {errorMsg}</span></div>}
            
            <form onSubmit={handleSaveBlogPost} className={styles.modalForm}>
              
              {/* Category selector row */}
              <div className={styles.inputBox}>
                <label htmlFor="blog-cat">Publication Category</label>
                <select id="blog-cat" value={blogForm.category || 'news'} onChange={e => setBlogForm(prev => ({ ...prev, category: e.target.value }))} className={styles.editorField}>
                  <option value="news">Sektör Haberleri / Industry News</option>
                  <option value="updates">Bizden Gelişmeler / Roastery Updates</option>
                  <option value="introduction">Yeni Kahveler / New Arrivals</option>
                  <option value="guides">Demleme Rehberleri / Brew Guides</option>
                  <option value="reviews">Ekipman İncelemeleri / Equipment Reviews</option>
                  <option value="techniques">Kavurma Teknikleri / Roasting Techniques</option>
                  <option value="barista">Barista İpuçları / Barista Tips</option>
                  <option value="horeca">Horeca / Horeca & Business</option>
                  <option value="culture">Kahve Kültürü / Coffee Culture</option>
                </select>
              </div>

              {/* ── Side-by-side Bilingual Editorial Workspace ── */}
              <div className={styles.editorSplit}>
                
                {/* Turkish Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className={styles.blockTitle}>Türkçe İçerik (Turkish Content)</h3>
                  
                  <div className={styles.inputBox}>
                    <label htmlFor="blog-title-tr">Başlık / Turkish Title</label>
                    <input id="blog-title-tr" type="text" required value={blogForm.titleTr || ''} onChange={e => setBlogForm(prev => ({ ...prev, titleTr: e.target.value }))} placeholder="Örn: Kahve Kavurma Sanatı" className={styles.editorField} />
                  </div>
                  
                  <div className={styles.inputBox}>
                    <label>Metin Biçimlendirme / Format Content</label>
                    <div className={styles.editorToolbar}>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'bold'); }} className={`${styles.toolbarBtn} ${activeFormats.bold ? styles.toolbarBtnActive : ''}`} title="Bold Text"><b>B</b></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'italic'); }} className={`${styles.toolbarBtn} ${activeFormats.italic ? styles.toolbarBtnActive : ''}`} title="Italic Text"><i>I</i></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'underline'); }} className={`${styles.toolbarBtn} ${activeFormats.underline ? styles.toolbarBtnActive : ''}`} title="Underline Text"><u>U</u></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'strikeThrough'); }} className={`${styles.toolbarBtn} ${activeFormats.strikeThrough ? styles.toolbarBtnActive : ''}`} title="Strikethrough"><s>S</s></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'formatBlock', '<h2>'); }} className={`${styles.toolbarBtn} ${activeFormats.h2 ? styles.toolbarBtnActive : ''}`} title="Heading H2">H2</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'formatBlock', '<h3>'); }} className={`${styles.toolbarBtn} ${activeFormats.h3 ? styles.toolbarBtnActive : ''}`} title="Heading H3">H3</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'formatBlock', '<blockquote>'); }} className={`${styles.toolbarBtn} ${activeFormats.blockquote ? styles.toolbarBtnActive : ''}`} title="Quote Block">“ Quote</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'insertUnorderedList'); }} className={`${styles.toolbarBtn} ${activeFormats.ul ? styles.toolbarBtnActive : ''}`} title="Bullet List">List •</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'insertOrderedList'); }} className={`${styles.toolbarBtn} ${activeFormats.ol ? styles.toolbarBtnActive : ''}`} title="Numbered List">List 1.</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); insertLink('tr'); }} className={styles.toolbarBtn} title="Insert Link">🔗 Link</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'justifyCenter'); }} className={styles.toolbarBtn} title="Center Align">Center</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'justifyFull'); }} className={styles.toolbarBtn} title="Justified Text">Justify</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('tr', 'insertHorizontalRule'); }} className={styles.toolbarBtn} title="Horizontal Divider Line">--- Line</button>
                    </div>
                    <div
                      id="blog-content-tr"
                      contentEditable={true}
                      ref={contentTrRef}
                      onInput={() => handleEditorInput('tr')}
                      onMouseUp={updateActiveFormats}
                      onKeyUp={updateActiveFormats}
                      onBlur={updateActiveFormats}
                      className={styles.visualEditor}
                    />
                  </div>
                </div>

                {/* English Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className={styles.blockTitle}>English Content</h3>
                  
                  <div className={styles.inputBox}>
                    <label htmlFor="blog-title-en">Title / English Title</label>
                    <input id="blog-title-en" type="text" required value={blogForm.titleEn || ''} onChange={e => setBlogForm(prev => ({ ...prev, titleEn: e.target.value }))} placeholder="e.g. The Art of Coffee Roasting" className={styles.editorField} />
                  </div>
                  
                  <div className={styles.inputBox}>
                    <label>Format Content / Text Styles</label>
                    <div className={styles.editorToolbar}>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'bold'); }} className={`${styles.toolbarBtn} ${activeFormats.bold ? styles.toolbarBtnActive : ''}`} title="Bold Text"><b>B</b></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'italic'); }} className={`${styles.toolbarBtn} ${activeFormats.italic ? styles.toolbarBtnActive : ''}`} title="Italic Text"><i>I</i></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'underline'); }} className={`${styles.toolbarBtn} ${activeFormats.underline ? styles.toolbarBtnActive : ''}`} title="Underline Text"><u>U</u></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'strikeThrough'); }} className={`${styles.toolbarBtn} ${activeFormats.strikeThrough ? styles.toolbarBtnActive : ''}`} title="Strikethrough"><s>S</s></button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'formatBlock', '<h2>'); }} className={`${styles.toolbarBtn} ${activeFormats.h2 ? styles.toolbarBtnActive : ''}`} title="Heading H2">H2</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'formatBlock', '<h3>'); }} className={`${styles.toolbarBtn} ${activeFormats.h3 ? styles.toolbarBtnActive : ''}`} title="Heading H3">H3</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'formatBlock', '<blockquote>'); }} className={`${styles.toolbarBtn} ${activeFormats.blockquote ? styles.toolbarBtnActive : ''}`} title="Quote Block">“ Quote</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'insertUnorderedList'); }} className={`${styles.toolbarBtn} ${activeFormats.ul ? styles.toolbarBtnActive : ''}`} title="Bullet List">List •</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'insertOrderedList'); }} className={`${styles.toolbarBtn} ${activeFormats.ol ? styles.toolbarBtnActive : ''}`} title="Numbered List">List 1.</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); insertLink('en'); }} className={styles.toolbarBtn} title="Insert Link">🔗 Link</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'justifyCenter'); }} className={styles.toolbarBtn} title="Center Align">Center</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'justifyFull'); }} className={styles.toolbarBtn} title="Justified Text">Justify</button>
                      <button type="button" onMouseDown={e => { e.preventDefault(); execEditorCommand('en', 'insertHorizontalRule'); }} className={styles.toolbarBtn} title="Horizontal Divider Line">--- Line</button>
                    </div>
                    <div
                      id="blog-content-en"
                      contentEditable={true}
                      ref={contentEnRef}
                      onInput={() => handleEditorInput('en')}
                      onMouseUp={updateActiveFormats}
                      onKeyUp={updateActiveFormats}
                      onBlur={updateActiveFormats}
                      className={styles.visualEditor}
                    />
                  </div>
                </div>

              </div>

              {/* ── Image Upload Workspace Zone ── */}
              <div className={styles.mediaBlock} style={{ marginTop: 12 }}>
                <label className={styles.mediaLabel}>Cover Image (Kapak Görseli)</label>
                {blogImagePreview && (
                  <div className={styles.mediaPreview} style={{ marginBottom: 12 }}>
                    <img src={blogImagePreview} alt="Blog Cover Preview" className={styles.mediaPreviewImg} style={{ maxHeight: '200px', objectFit: 'contain' }} />
                    <button type="button" className={styles.clearMediaBtn} onClick={() => { setBlogImagePreview(''); setBlogForm(p => ({ ...p, imageUrl: '' })); }}>✕ Remove</button>
                  </div>
                )}
                <div
                  className={styles.uploadZone}
                  onClick={() => blogImageInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleBlogImageFile({ target: { files: [f] } } as any); }}
                >
                  <input ref={blogImageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={styles.hiddenInput} onChange={handleBlogImageFile} />
                  {uploadingBlogImage
                    ? <span className={styles.uploadingText}>⏳ Uploading cover image...</span>
                    : <><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Drop image here or <u>click to browse</u></span><span className={styles.uploadHint}>JPG, PNG, WebP — max 20 MB</span></>
                  }
                </div>
                <div className={styles.inputBox} style={{ marginTop: 10 }}>
                  <label htmlFor="blog-image">Or paste Image URL directly</label>
                  <input id="blog-image" type="text" value={blogForm.imageUrl || ''} onChange={e => { setBlogForm(prev => ({ ...prev, imageUrl: e.target.value })); setBlogImagePreview(e.target.value); }} placeholder="/images/blog/roaster.png or other URL" className={styles.editorField} />
                </div>
              </div>

              <button type="submit" className={styles.opActionBtn} style={{ marginTop: 16 }} disabled={actionLoading}>
                {actionLoading ? 'Publishing...' : '📰 Publish Editorial Post'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
