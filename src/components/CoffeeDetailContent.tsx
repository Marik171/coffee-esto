'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from './Footer';
import Navbar from './Navbar';
import { useCart } from '../context/CartContext';
import styles from '../app/coffee/[id]/detail.module.css';
import { localizeProduct } from '../lib/localize';

interface CoffeeProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  altitude: string;
  varietal: string;
  roastLevel: number;
  tastingNotes: string;
  description: string;
  price: number;
  price1kg: number;
  stock: number;
  imageUrl: string;
  videoUrl: string;
  isActive: boolean;
  process?: string;
  body?: string;
  acidity?: string;
}

interface CoffeeBagProps {
  coffeeName: string;
  origin: string;
  bagColor: string;
  illustration: React.ReactNode;
  emoji: string;
  locale?: string;
}

function CoffeeBag({ coffeeName, origin, bagColor, illustration, emoji, locale = 'en' }: CoffeeBagProps) {
  const safeId = coffeeName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <filter id={`bagShadow-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-2" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.16" />
        </filter>
        <linearGradient id={`gussetGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
          <stop offset="35%" stopColor="rgba(0, 0, 0, 0.12)" />
          <stop offset="70%" stopColor="rgba(255, 255, 255, 0.08)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.35)" />
        </linearGradient>
        <linearGradient id={`frontShade-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.08)" />
          <stop offset="15%" stopColor="rgba(255, 255, 255, 0.22)" />
          <stop offset="90%" stopColor="rgba(255, 255, 255, 0.0)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.06)" />
        </linearGradient>
        <linearGradient id={`goldGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="30%" stopColor="#f3e5ab" />
          <stop offset="55%" stopColor="#aa7c11" />
          <stop offset="85%" stopColor="#e5c158" />
          <stop offset="100%" stopColor="#966d00" />
        </linearGradient>
      </defs>

      <g filter={`url(#bagShadow-${safeId})`}>
        <path d="M35,35 L65,24 L65,236 L35,248 Z" fill={bagColor} />
        <path d="M35,35 L65,24 L65,236 L35,248 Z" fill={`url(#gussetGrad-${safeId})`} />
        <g transform="translate(47, 135) rotate(-90)">
          <text textAnchor="middle" fill="rgba(255, 255, 255, 0.3)" fontSize="8.5" fontWeight="800" letterSpacing="2.5">
            COFFEE ESTO
          </text>
        </g>

        <path d="M65,24 L165,29 L165,231 L65,236 Z" fill="#faf9f3" />
        <path d="M65,24 L165,29 L165,231 L65,236 Z" fill={`url(#frontShade-${safeId})`} />

        <path d="M35,20 L65,10 L165,15 L135,25 Z" fill={bagColor} opacity="0.9" />
        <path d="M35,20 L65,10 L165,15 M35,23 L65,13 L165,18 M35,26 L65,16 L165,21" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />

        <g transform="matrix(1 0.047 -0.047 1 0 0)">
          <path d="M102,28 H128 V64 C128,72 102,72 102,64 Z" fill={`url(#goldGrad-${safeId})`} />
          <circle cx="115" cy="45" r="8.5" fill="none" stroke="#2a170c" strokeWidth="0.8" />
          <circle cx="115" cy="45" r="6.5" fill="none" stroke="#2a170c" strokeWidth="0.5" strokeDasharray="1.5 1" />
          <path d="M115,41 C112.5,43 112.5,47 115,49 C117.5,47 117.5,43 115,41 Z" fill="#2a170c" />
          <path d="M113.8,44 C114.5,44.5 115.5,45.5 116.2,46" stroke="#faf9f3" strokeWidth="0.4" fill="none" />

          <text x="115" y="82" textAnchor="middle" fill="#c9963a" fontSize="6.5" fontWeight="800" letterSpacing="0.8">ESTO ROASTERY</text>
          <text x="115" y="93" textAnchor="middle" fill="#2a170c" fontSize="9.5" fontWeight="900" letterSpacing="0.2" fontFamily="var(--font-family-display, 'Playfair Display', Georgia, serif)">THE BEAN</text>

          <g transform="translate(15, 22) scale(0.85)" stroke="#423229" strokeWidth="1.2" fill="none">
            {illustration}
          </g>

          <g transform="translate(101, 168)" fill="#423229" stroke="none">
            <ellipse cx="6" cy="4" rx="3.5" ry="2.2" transform="rotate(25 6 4)" />
            <ellipse cx="14" cy="2" rx="3" ry="1.8" transform="rotate(-35 14 2)" />
            <ellipse cx="-4" cy="3" rx="3.2" ry="2" transform="rotate(60 -4 3)" />
          </g>

          <text x="115" y="190" textAnchor="middle" fill="rgba(66, 50, 41, 0.45)" fontSize="5.5" fontWeight="700" letterSpacing="0.5">
            {locale === 'tr' ? 'TAZE KAVRULMUŞ • 250G' : 'FRESHLY ROASTED • 250G'}
          </text>
        </g>
      </g>
    </svg>
  );
}

const PRODUCT_STYLES: Record<string, { bagColor: string; themeBg: string; sensoryBg: string; sensoryName: string; textColor: string; accentColor: string; illustration: React.ReactNode; emoji: string }> = {
  guatemala: {
    bagColor: '#523e3e',
    themeBg: 'linear-gradient(135deg, #e0ebf5 0%, #edf4fa 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(230,215,200,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Warm Cocoa',
    textColor: '#ffffff',
    accentColor: '#ebdada',
    emoji: '🌋',
    illustration: (
      <g opacity="0.85">
        <circle cx="100" cy="95" r="18" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M100,85 L135,145 L65,145 Z" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M92,98 L100,85 L108,98" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M92,98 L100,105 L108,98" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M125,120 L150,145 L100,145" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinejoin="round" />
        <path d="M100,75 Q105,65 98,58 Q92,50 102,42" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M104,78 Q109,70 104,63" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <line x1="50" y1="145" x2="150" y2="145" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="75" cy="152" r="1" fill="#ffffff" />
        <circle cx="100" cy="152" r="1.5" fill="#ffffff" />
        <circle cx="125" cy="152" r="1" fill="#ffffff" />
      </g>
    )
  },
  ethiopia: {
    bagColor: '#74a57f',
    themeBg: 'linear-gradient(135deg, #fbf1c9 0%, #fffdf0 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(247,231,168,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Bright Yellow',
    textColor: '#ffffff',
    accentColor: '#c7edd0',
    emoji: '🍋',
    illustration: (
      <g opacity="0.9">
        <path d="M100,145 L100,80" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M100,120 C70,110 65,85 100,75 C100,75 100,120 100,120 Z" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M100,95 Q80,95 72,102" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <path d="M100,105 Q85,108 78,114" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <path d="M100,130 C130,120 135,95 100,85 C100,85 100,130 100,130 Z" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M100,105 Q120,105 128,112" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <path d="M100,115 Q115,118 122,124" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.7" />
        <circle cx="100" cy="80" r="4" fill="none" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M96,80 Q90,74 96,68 Q100,62 104,68 Q110,74 104,80" fill="none" stroke="#ffffff" strokeWidth="1" />
        <circle cx="100" cy="80" r="1" fill="#ffffff" />
      </g>
    )
  },
  nicaragua: {
    bagColor: '#f4a261',
    themeBg: 'linear-gradient(135deg, #fdf0e2 0%, #fffcf8 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(250,220,185,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Warm Amber',
    textColor: '#2c2626',
    accentColor: '#ffe2cd',
    emoji: '🍯',
    illustration: (
      <g opacity="0.9" stroke="#2c2626">
        <circle cx="100" cy="100" r="28" fill="none" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="22" fill="rgba(44, 38, 38, 0.05)" strokeWidth="1.2" />
        <path d="M60,128 C80,120 120,120 140,128" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50,136 C80,126 120,126 150,136" fill="none" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M65,120 C85,115 115,115 135,120" fill="none" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <line x1="100" y1="68" x2="100" y2="60" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="77" y1="77" x2="71" y2="71" strokeWidth="1" strokeLinecap="round" />
        <line x1="123" y1="77" x2="129" y2="71" strokeWidth="1" strokeLinecap="round" />
        <line x1="68" y1="100" x2="60" y2="100" strokeWidth="1" strokeLinecap="round" />
        <line x1="132" y1="100" x2="140" y2="100" strokeWidth="1" strokeLinecap="round" />
      </g>
    )
  },
  sumatra: {
    bagColor: '#3d4b5c',
    themeBg: 'linear-gradient(135deg, #e3ebf2 0%, #f4f8fb 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(202,219,232,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Deep Moss',
    textColor: '#ffffff',
    accentColor: '#cbd6e2',
    emoji: '🌲',
    illustration: (
      <g opacity="0.85">
        <circle cx="100" cy="95" r="20" fill="none" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="4 2" />
        <path d="M60,145 L95,85 L130,145" fill="rgba(255,255,255,0.03)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M90,145 L115,102 L140,145" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" strokeLinejoin="round" />
        <line x1="95" y1="85" x2="95" y2="145" stroke="#ffffff" strokeWidth="1" />
        <line x1="115" y1="102" x2="115" y2="145" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
        <path d="M55,145 Q65,115 85,110" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60,135 Q70,120 80,122" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M57,125 Q68,118 74,124" fill="none" stroke="#ffffff" strokeWidth="1" />
        <line x1="45" y1="145" x2="155" y2="145" stroke="#ffffff" strokeWidth="1.5" />
      </g>
    )
  },
  colombia: {
    bagColor: '#b23b3b',
    themeBg: 'linear-gradient(135deg, #e0ebd5 0%, #f3f9ee 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(248,212,217,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Ruby Red',
    textColor: '#ffffff',
    accentColor: '#fcd3d3',
    emoji: '🍒',
    illustration: (
      <g opacity="0.85">
        <path d="M70,95 Q100,105 130,90" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70,95 C60,75 80,60 100,82 C90,87 75,92 70,95 Z" fill="rgba(255,255,255,0.05)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M85,78 Q78,82 72,88" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />
        <circle cx="95" cy="115" r="11" fill="rgba(255,255,255,0.05)" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M90,110 A6,6 0 0,0 90,120" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.75" />
        <circle cx="98" cy="111" r="1.2" fill="#ffffff" />
        <circle cx="112" cy="118" r="9.5" fill="rgba(255,255,255,0.05)" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M108,114 A5,5 0 0,0 108,122" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.75" />
        <circle cx="114" cy="115" r="1" fill="#ffffff" />
        <circle cx="104" cy="104" r="8" fill="rgba(0,0,0,0.15)" stroke="#ffffff" strokeWidth="1" />
        <circle cx="106" cy="102" r="0.8" fill="#ffffff" />
        <path d="M95,104 L95,110" stroke="#ffffff" strokeWidth="1" />
        <path d="M112,100 L112,109" stroke="#ffffff" strokeWidth="1" />
      </g>
    )
  },
  papua: {
    bagColor: '#206a5d',
    themeBg: 'linear-gradient(135deg, #e1f0ec 0%, #f2faf8 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(198,231,223,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Crisp Jade',
    textColor: '#ffffff',
    accentColor: '#c5ebd6',
    emoji: '🕊️',
    illustration: (
      <g opacity="0.85">
        <path d="M100,65 L125,95 L108,98 L135,115 L102,118 L120,135 L90,125 Z" fill="rgba(255,255,255,0.04)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M60,132 C80,122 95,142 115,132 C125,127 135,135 145,130" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50,140 C75,130 90,150 115,140 C130,135 140,143 150,138" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
        <circle cx="70" cy="80" r="1.2" fill="#ffffff" />
        <circle cx="85" cy="70" r="1.5" fill="#ffffff" />
        <circle cx="130" cy="75" r="1" fill="#ffffff" opacity="0.7" />
      </g>
    )
  },
  'brazil-mogiana': {
    bagColor: '#6f4e37',
    themeBg: 'linear-gradient(135deg, #ebdbe8 0%, #faf3f9 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(235,219,232,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Sweet Nut',
    textColor: '#ffffff',
    accentColor: '#ebdbe8',
    emoji: '🥜',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'velora-signature': {
    bagColor: '#b08d57',
    themeBg: 'linear-gradient(135deg, #f5e2d6 0%, #fffbf7 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(245,226,214,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Rich Berry',
    textColor: '#ffffff',
    accentColor: '#f5e2d6',
    emoji: '✨',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  kenya: {
    bagColor: '#457b9d',
    themeBg: 'linear-gradient(135deg, #e3edf5 0%, #f0f7fc 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(227,237,245,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Citrus Zest',
    textColor: '#ffffff',
    accentColor: '#e3edf5',
    emoji: '🦁',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'turk-kahvesi': {
    bagColor: '#7a5c43',
    themeBg: 'linear-gradient(135deg, #e8e2db 0%, #f5f2ee 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(232,226,219,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Spiced Velvet',
    textColor: '#ffffff',
    accentColor: '#e8e2db',
    emoji: '☕️',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'italian-blend': {
    bagColor: '#2b2b2b',
    themeBg: 'linear-gradient(135deg, #e5e5e5 0%, #f7f7f7 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(229,229,229,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Dark Cacao',
    textColor: '#ffffff',
    accentColor: '#e5e5e5',
    emoji: '🇮🇹',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'espresso-gold': {
    bagColor: '#b89c30',
    themeBg: 'linear-gradient(135deg, #f7ebd3 0%, #fffcf5 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(247,235,211,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Golden Honey',
    textColor: '#ffffff',
    accentColor: '#f7ebd3',
    emoji: '🌟',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'premium-blend': {
    bagColor: '#8c6d58',
    themeBg: 'linear-gradient(135deg, #e8dcd0 0%, #f7f3ee 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(232,220,208,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Classic Roast',
    textColor: '#ffffff',
    accentColor: '#e8dcd0',
    emoji: '👑',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'house-blend': {
    bagColor: '#5c483a',
    themeBg: 'linear-gradient(135deg, #ebdcd5 0%, #faf3f0 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(235,220,213,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Daily Comfort',
    textColor: '#ffffff',
    accentColor: '#ebdcd5',
    emoji: '🏠',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'special-blend': {
    bagColor: '#6b7a42',
    themeBg: 'linear-gradient(135deg, #e8ebd5 0%, #f5f7ee 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(232,235,213,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Curated Notes',
    textColor: '#ffffff',
    accentColor: '#e8ebd5',
    emoji: '🍃',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  },
  'esto-blend': {
    bagColor: '#803d3b',
    themeBg: 'linear-gradient(135deg, #ebdcdb 0%, #faf2f2 100%)',
    sensoryBg: 'radial-gradient(circle, rgba(235,220,219,0.7) 0%, rgba(255,255,255,0) 70%)',
    sensoryName: 'Esto Special',
    textColor: '#ffffff',
    accentColor: '#ebdcdb',
    emoji: '🎒',
    illustration: (
      <g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>
    )
  }
};

const DEFAULT_STYLE = {
  bagColor: '#6c5ce7',
  themeBg: 'linear-gradient(135deg, #e1e9f0 0%, #f0f4f8 100%)',
  sensoryBg: 'radial-gradient(circle, rgba(225,233,240,0.7) 0%, rgba(255,255,255,0) 70%)',
  sensoryName: 'Balanced Tone',
  textColor: '#ffffff',
  accentColor: '#e0dbff',
  emoji: '☕️',
  illustration: (<g opacity="0.8"><circle cx="100" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" /><path d="M90,115H110" stroke="#ffffff" strokeWidth="1.5" /></g>)
};

interface CoffeeDetailContentProps {
  id: string;
  locale?: string;
  initialProduct?: any;
}

interface CustomerData {
  id: string;
  email: string;
  name: string;
  phone: string;
  isSubscriber: boolean;
}

interface ReviewData {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  displayName: string;
  initials: string;
}

interface ReviewStats {
  total: number;
  avgRating: number;
  distribution: Record<number, number>;
}

export default function CoffeeDetailContent({ id: coffeeId, locale = 'en', initialProduct }: CoffeeDetailContentProps) {
  const { addToCart, refreshUserStatus } = useCart();
  const [coffee, setCoffee] = useState<CoffeeProduct | null>(() =>
    initialProduct ? localizeProduct(initialProduct, locale) : null
  );
  const [isLoading, setIsLoading] = useState(() => !initialProduct);
  const [qty, setQty] = useState(() => (initialProduct ? Math.min(1, initialProduct.stock) : 1));
  const [inView, setInView] = useState(() => Boolean(initialProduct));
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [size, setSize] = useState('250g');
  const [grindType, setGrindType] = useState(locale === 'tr' ? 'Çekirdek (Öğütülmemiş)' : 'Whole Bean');
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            video.pause();
          } else {
            video.play().catch((err) => console.log("Video autoplay blocked:", err));
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [coffee?.videoUrl]);

  // ── Related products state ──────────────────────────────────────
  const [relatedProducts, setRelatedProducts] = useState<CoffeeProduct[]>([]);

  // ── Reviews state ──────────────────────────────────────────────
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ total: 0, avgRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', body: '' });
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const getGrindOptions = (category: string, lang: string) => {
    const isTr = lang === 'tr';
    switch (category) {
      case 'turkish':
        return isTr
          ? ['Çekirdek (Öğütülmemiş)', 'Türk Kahvesi']
          : ['Whole Bean', 'Turkish Coffee'];
      case 'single-origin':
      case 'limited-edition':
        return isTr
          ? [
              'Çekirdek (Öğütülmemiş)',
              'Türk Kahvesi',
              'Espresso Makinesi',
              'Moka Pot',
              'V60',
              'Chemex',
              'Filtre Kahve Makinesi',
              'French Press'
            ]
          : [
              'Whole Bean',
              'Turkish Coffee',
              'Espresso Machine',
              'Moka Pot',
              'V60',
              'Chemex',
              'Filter Coffee Machine',
              'French Press'
            ];
      case 'filter':
        return isTr
          ? [
              'Çekirdek (Öğütülmemiş)',
              'Moka Pot',
              'V60',
              'Chemex',
              'Filtre Kahve Makinesi',
              'French Press'
            ]
          : [
              'Whole Bean',
              'Moka Pot',
              'V60',
              'Chemex',
              'Filter Coffee Machine',
              'French Press'
            ];
      case 'espresso':
        return isTr
          ? ['Çekirdek (Öğütülmemiş)', 'Espresso Makinesi', 'Moka Pot']
          : ['Whole Bean', 'Espresso Machine', 'Moka Pot'];
      default:
        return isTr
          ? ['Çekirdek (Öğütülmemiş)', 'Filtre Kahve Makinesi']
          : ['Whole Bean', 'Filter Coffee Machine'];
    }
  };

  const translations = {
    en: {
      loadingText: 'Loading roast parameters...',
      notFoundTitle: 'Roast Profile Unavailable',
      notFoundSub: 'This specialty origin could not be located in our inventory.',
      backBtn: 'Return to Coffee Catalog',
      breadcrumbCatalog: 'Catalog',
      wholeBean: '250g / Whole Bean',
      tastingNotes: 'Tasting Notes',
      origin: 'Origin',
      altitude: 'Altitude',
      varietal: 'Varietal',
      roastLevel: 'Roast Level',
      light: 'Light',
      medium: 'Medium',
      dark: 'Dark',
      sensoryProfile: 'Sensory Profile',
      acidity: 'Acidity',
      sweetness: 'Sweetness',
      body: 'Body',
      process: 'Process',
      beanSpecsTitle: 'Bean Specifications',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      onlyXLeft: 'Only {n} left in stock',
      categorySingleOrigin: 'Single Origin',
      categoryEspresso: 'Espresso Blends',
      brewGuideCTA: '📖 Open Coffee Brewing Companion',
      shippingNote: 'Free shipping on orders over ₺2,000. For orders below ₺2,000, shipping cost is paid by the buyer.',
      inquireStock: 'Inquire About Stock',
      youMayAlsoLike: 'You May Also Like',
    },
    tr: {
      loadingText: 'Kavrum parametreleri yükleniyor...',
      notFoundTitle: 'Kavrum Profili Bulunamadı',
      notFoundSub: 'Bu özel kahve stoklarımızda bulunamadı.',
      backBtn: 'Katalog\'a Geri Dön',
      breadcrumbCatalog: 'Katalog',
      wholeBean: '250g / Çekirdek Kahve',
      tastingNotes: 'Tadım Notları',
      origin: 'Menşe',
      altitude: 'Rakım',
      varietal: 'Varyete',
      roastLevel: 'Kavrum Derecesi',
      light: 'Açık',
      medium: 'Orta',
      dark: 'Koyu',
      sensoryProfile: 'Duyusal Profil',
      acidity: 'Asidite',
      sweetness: 'Tatlılık',
      body: 'Gövde',
      process: 'İşlem',
      beanSpecsTitle: 'Çekirdek Özellikleri',
      addToCart: 'Sepete Ekle',
      outOfStock: 'Stokta Yok',
      onlyXLeft: 'Stokta sadece {n} adet kaldı',
      categorySingleOrigin: 'Tek Köken',
      categoryEspresso: 'Espresso Harmanları',
      brewGuideCTA: '📖 Kahve Demleme Asistanını Aç',
      shippingNote: '2.000 TL üzeri siparişlerde kargo ücretsizdir. 2.000 TL altındaki siparişlerde kargo ücreti alıcıya aittir.',
      inquireStock: 'Stok Sorgulayın',
      youMayAlsoLike: 'Bunlar da İlginizi Çekebilir',
    }
  };

  const t = locale === 'tr' ? translations.tr : translations.en;
  const linkPrefix = locale === 'tr' ? '' : '/en';

  const getCategoryLabel = (label: string) => {
    if (locale === 'tr') {
      if (label.toLowerCase() === 'single origin' || label.toLowerCase() === 'single-origin') return t.categorySingleOrigin;
      if (label.toLowerCase() === 'espresso') return t.categoryEspresso;
    }
    return label;
  };

  useEffect(() => {
    if (initialProduct) return;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${coffeeId}`);
        const d = await res.json();
        if (res.ok && d.success) {
          setCoffee(localizeProduct(d.data, locale));
          setQty(Math.min(1, d.data.stock));
          setInView(true);
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [coffeeId, initialProduct, locale]);

  // Same-category products, excluding this one and anything out of stock —
  // cross-sell block shown further down the page.
  useEffect(() => {
    if (!coffee) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/products');
        const d = await res.json();
        if (cancelled || !res.ok || !d.success) return;
        const related = (d.data as CoffeeProduct[])
          .filter((p) => p.id !== coffee.id && p.category === coffee.category && p.stock > 0)
          .slice(0, 4)
          .map((p) => localizeProduct(p, locale));
        setRelatedProducts(related);
      } catch {
        /* non-fatal — section just doesn't render */
      }
    })();
    return () => { cancelled = true; };
  }, [coffee, locale]);

  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setReviews(json.data.reviews);
        setReviewStats(json.data.stats);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch reviews once product id is known
  useEffect(() => {
    if (coffeeId) fetchReviews(coffeeId);
  }, [coffeeId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.rating) {
      setReviewError(locale === 'tr' ? 'Lütfen bir puan seçin.' : 'Please select a star rating.');
      return;
    }
    if (reviewForm.body.trim().length < 5) {
      setReviewError(locale === 'tr' ? 'Yorum en az 5 karakter olmalıdır.' : 'Review must be at least 5 characters.');
      return;
    }
    try {
      setReviewSubmitting(true);
      setReviewError('');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: coffeeId,
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          body: reviewForm.body.trim(),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setReviewSuccess(true);
        setReviewForm({ rating: 0, title: '', body: '' });
        await fetchReviews(coffeeId);
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
        }, 1800);
      } else {
        setReviewError(json.error || (locale === 'tr' ? 'Yorum gönderilemedi.' : 'Failed to submit review.'));
      }
    } catch {
      setReviewError(locale === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/account/me');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setCustomer(json.data);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (coffee) {
      const options = getGrindOptions(coffee.category, locale);
      if (options.length > 0) {
        setGrindType(options[0]);
      }
    }
  }, [coffee, locale]);

  const increment = () => setQty(p => Math.min(coffee?.stock ?? p, p + 1));
  const decrement = () => setQty(p => Math.max(1, p - 1));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 15;
    const rotateY = (x / (box.width / 2)) * 15;
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`, transition: 'transform 0.05s ease-out' });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)', transition: 'transform 0.5s ease-out' });
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar locale={locale} />
        <div className={styles.loadingWrapper}><span className={styles.spinner}>☕️</span><p>{t.loadingText}</p></div>
        <Footer locale={locale} />
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar locale={locale} />
        <div className={styles.notFoundWrapper}>
          <span className={styles.notFoundIcon}>☕️</span>
          <h2>{t.notFoundTitle}</h2>
          <p>{t.notFoundSub}</p>
          <Link href={`${linkPrefix}/coffee`} className={styles.backBtnLink}>{t.backBtn}</Link>
        </div>
        <Footer locale={locale} />
      </div>
    );
  }

  const style = PRODUCT_STYLES[coffee.id] || DEFAULT_STYLE;

  const isCoffeeProduct = ['single-origin', 'limited-edition', 'signature-blend', 'filter', 'espresso', 'turkish'].includes(coffee.category);
  const unitPrice = size === '1kg' ? coffee.price1kg : coffee.price;
  const showDiscount = isCoffeeProduct && customer?.isSubscriber;
  const discountedPrice = showDiscount ? Math.round(unitPrice * 0.90) : unitPrice;

  return (
    <div className={styles.pageWrapper}>
      <Navbar locale={locale} />
      <div className={styles.navOffset} aria-hidden="true" />

      {/* ── 1. Hero Checkout Container Section ── */}
      <section
        ref={detailRef}
        className={`${styles.detailSection} ${inView ? styles.inView : ''}`}
        style={{ '--product-theme-bg': style.themeBg } as React.CSSProperties}
        aria-label={`Coffee details for ${coffee.name}`}
      >
        <div className={styles.container}>
          <div className={styles.splitLayout}>

            {/* Visual Media Column */}
            <div className={styles.visualCol}>
              {coffee.imageUrl ? (
                <div className={styles.mediaCol}>
                  <img src={coffee.imageUrl} alt={coffee.name} className={styles.productPhoto} />
                  {coffee.videoUrl && (
                    <video
                      ref={videoRef}
                      src={coffee.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={styles.productVideo}
                      aria-label={`Product video for ${coffee.name}`}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={styles.perspectiveContainer}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.tiltCard} style={{ ...tiltStyle, backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <div className={styles.cardVector}>
                      <CoffeeBag
                        coffeeName={coffee.name}
                        origin={coffee.origin}
                        bagColor={style.bagColor}
                        illustration={style.illustration}
                        emoji={style.emoji}
                        locale={locale}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Details & Purchase Logic Column */}
            <div className={styles.detailsCol}>
              <div className={styles.categoryBreadcrumb}>
                <Link href={`${linkPrefix}/coffee`}>{t.breadcrumbCatalog}</Link> / <span style={{ textTransform: 'capitalize' }}>{getCategoryLabel(coffee.category.replace('-', ' '))}</span>
              </div>

              <h1 className={styles.productName}>{coffee.name}</h1>
              <div className={styles.subtitleNotes}>
                {isCoffeeProduct
                  ? <>{coffee.varietal || 'Single Origin Blend'} • {coffee.altitude || '1500m'}</>
                  : coffee.origin}
              </div>

              {isCoffeeProduct ? (
                <>
                  <div className={styles.priceRow}>
                    <span className={styles.priceVal}>
                      {showDiscount ? (
                        <>
                          <span style={{ textDecoration: 'line-through', marginRight: '8px', color: '#999', fontSize: '0.8em' }}>
                            ₺{unitPrice * qty}
                          </span>
                          <span style={{ color: '#0051a8' }}>
                            ₺{discountedPrice * qty}
                          </span>
                        </>
                      ) : (
                        `₺${unitPrice * qty}`
                      )}
                    </span>
                    {showDiscount && (
                      <span className={styles.discountBadge}>
                        {locale === 'tr' ? '%10 Abone İndirimi' : '10% Subscriber Discount'}
                      </span>
                    )}
                  </div>

                  <p className={styles.shippingNote}>🚚 {t.shippingNote}</p>

                  <div className={styles.quantitySection}>
                    <label className={styles.quantityLabel}>Quantity</label>
                    <div className={styles.qtyBox}>
                      <button onClick={decrement} className={styles.qtyBtn} disabled={qty <= 1} aria-label="Decrease quantity">–</button>
                      <span className={styles.qtyVal}>{qty}</span>
                      <button onClick={increment} className={styles.qtyBtn} disabled={qty >= coffee.stock} aria-label="Increase quantity">+</button>
                    </div>
                  </div>

                  <div className={styles.selectControl}>
                    <label className={styles.selectLabel}>Size</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)} className={styles.selectInput}>
                      <option value="250g">250g</option>
                      <option value="1kg">1kg</option>
                    </select>
                  </div>

                  <div className={styles.selectControl}>
                    <label className={styles.selectLabel}>{locale === 'tr' ? 'Öğütme Seçeneği' : 'Grind Type'}</label>
                    <select value={grindType} onChange={(e) => setGrindType(e.target.value)} className={styles.selectInput}>
                      {getGrindOptions(coffee.category, locale).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: `${coffee.id}-${size}-${grindType}`,
                      name: coffee.name,
                      price: unitPrice,
                      category: coffee.category,
                      stock: coffee.stock,
                      emoji: style.emoji,
                      bagColor: style.bagColor,
                      notes: [
                        ...coffee.tastingNotes.split(',').map(n => n.trim()),
                        `${locale === 'tr' ? 'Boyut' : 'Size'}: ${size}`,
                        `${locale === 'tr' ? 'Öğütme' : 'Grind'}: ${grindType}`
                      ],
                      imageUrl: coffee.imageUrl,
                      size,
                      grindType,
                    }, qty)}
                    className={styles.addToCartBtn}
                    disabled={coffee.stock === 0}
                  >
                    {coffee.stock === 0 ? t.outOfStock : t.addToCart}
                  </button>

                  {(coffee.process || coffee.body || coffee.acidity || coffee.varietal || coffee.altitude) && (
                    <div className={styles.beanSpecs}>
                      <h3 className={styles.beanSpecsTitle}>{t.beanSpecsTitle}</h3>
                      <div className={styles.beanSpecGrid}>
                        {coffee.varietal && (
                          <div className={styles.beanSpecItem}>
                            <span className={styles.beanSpecLabel}>{t.varietal}</span>
                            <span className={styles.beanSpecValue}>{coffee.varietal}</span>
                          </div>
                        )}
                        {coffee.altitude && (
                          <div className={styles.beanSpecItem}>
                            <span className={styles.beanSpecLabel}>{t.altitude}</span>
                            <span className={styles.beanSpecValue}>{coffee.altitude}</span>
                          </div>
                        )}
                        {coffee.process && (
                          <div className={styles.beanSpecItem}>
                            <span className={styles.beanSpecLabel}>{t.process}</span>
                            <span className={styles.beanSpecValue}>{coffee.process}</span>
                          </div>
                        )}
                        {coffee.body && (
                          <div className={styles.beanSpecItem}>
                            <span className={styles.beanSpecLabel}>{t.body}</span>
                            <span className={styles.beanSpecValue}>{coffee.body}</span>
                          </div>
                        )}
                        {coffee.acidity && (
                          <div className={styles.beanSpecItem}>
                            <span className={styles.beanSpecLabel}>{t.acidity}</span>
                            <span className={styles.beanSpecValue}>{coffee.acidity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.equipmentSpecs}>
                  <p className={styles.priceVal} style={{ fontSize: '1.1em' }}>
                    {coffee.price > 0
                      ? (locale === 'tr' ? `${coffee.price} TL` : `₺${coffee.price}`)
                      : (locale === 'tr' ? 'Fiyat için iletişime geçin' : 'Contact us for pricing')}
                  </p>
                  <ul className={styles.equipmentSpecList}>
                    {coffee.tastingNotes.split(',').map((spec, i) => (
                      <li key={i}>{spec.trim()}</li>
                    ))}
                  </ul>

                  {coffee.price > 0 && (
                    <>
                      <div className={styles.quantitySection}>
                        <label className={styles.quantityLabel}>Quantity</label>
                        <div className={styles.qtyBox}>
                          <button onClick={decrement} className={styles.qtyBtn} disabled={qty <= 1} aria-label="Decrease quantity">–</button>
                          <span className={styles.qtyVal}>{qty}</span>
                          <button onClick={increment} className={styles.qtyBtn} disabled={qty >= coffee.stock} aria-label="Increase quantity">+</button>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart({
                          id: coffee.id,
                          name: coffee.name,
                          price: coffee.price,
                          category: coffee.category,
                          stock: coffee.stock,
                          emoji: style.emoji,
                          bagColor: style.bagColor,
                          notes: [],
                          imageUrl: coffee.imageUrl,
                        }, qty)}
                        className={styles.addToCartBtn}
                        disabled={coffee.stock === 0}
                      >
                        {coffee.stock === 0 ? t.outOfStock : t.addToCart}
                      </button>
                    </>
                  )}
                </div>
              )}

              {!isCoffeeProduct && (
                <div className={styles.inquireStockNote}>
                  <span>
                    {locale === 'tr' ? (
                      <>
                        Güncel stok durumu için{' '}
                        <Link href={`${linkPrefix}/contact`} style={{ textDecoration: 'underline', fontWeight: '600', color: 'inherit' }}>
                          bizimle iletişime geçin
                        </Link>
                        .
                      </>
                    ) : (
                      <>
                        Please{' '}
                        <Link href={`${linkPrefix}/contact`} style={{ textDecoration: 'underline', fontWeight: '600', color: 'inherit' }}>
                          contact us
                        </Link>{' '}
                        for current stock availability.
                      </>
                    )}
                  </span>
                </div>
              )}

              {customer && !customer.isSubscriber && isCoffeeProduct && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/account/me', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isSubscriber: true })
                      });
                      if (res.ok) {
                        const json = await res.json();
                        if (json.success) {
                          setCustomer(json.data);
                          refreshUserStatus();
                        }
                      }
                    } catch (err) {
                      console.error('Failed to subscribe:', err);
                    }
                  }}
                  className={styles.subscribeBtn}
                >
                  {locale === 'tr'
                    ? 'Coffee Esto Abonesi Ol — Kahvelerde %10 İndirim Kazan'
                    : 'Become a Coffee Esto Subscriber — Save 10% on Coffees'}
                </button>
              )}

              {!customer && isCoffeeProduct && (
                <div className={styles.guestPromoBanner}>
                  <span>
                    {locale === 'tr' ? (
                      <>
                        Üyelere özel %10 indirimden faydalanmak için{' '}
                        <Link href={`${linkPrefix}/account`} style={{ textDecoration: 'underline', fontWeight: '600', color: 'inherit' }}>
                          giriş yapın
                        </Link>{' '}
                        veya hesap oluşturun!
                      </>
                    ) : (
                      <>
                        Please{' '}
                        <Link href={`${linkPrefix}/account`} style={{ textDecoration: 'underline', fontWeight: '600', color: 'inherit' }}>
                          sign in
                        </Link>{' '}
                        or create an account to get a 10% subscriber discount!
                      </>
                    )}
                  </span>
                </div>
              )}

              {coffee.stock > 0 && coffee.stock <= 5 && (
                <span className={`${styles.stockNote} ${styles.stockNoteLow}`} style={{ marginTop: '8px', display: 'block' }}>
                  {t.onlyXLeft.replace('{n}', coffee.stock.toString())}
                </span>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Product Reviews Section ── */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          <h2 className={styles.reviewsMainTitle}>
            {locale === 'tr' ? 'Ürün Değerlendirmeleri' : 'Product Reviews'}
          </h2>

          {/* Reviews Summary Dashboard */}
          <div className={styles.reviewsDashboard}>
            <div className={styles.dashboardScore}>
              <span className={styles.scoreNumber}>
                {reviewStats.total > 0 ? `${reviewStats.avgRating.toFixed(1)} / 5` : '—'}
              </span>
              <div className={styles.scoreStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= Math.round(reviewStats.avgRating) ? '#1a1a1a' : '#cccccc' }}>★</span>
                ))}
              </div>
              <span className={styles.scoreCount}>
                {reviewStats.total === 0
                  ? (locale === 'tr' ? 'Henüz değerlendirme yok' : 'No reviews yet')
                  : locale === 'tr'
                    ? `${reviewStats.total} değerlendirmeye dayalı`
                    : `Based on ${reviewStats.total} review${reviewStats.total !== 1 ? 's' : ''}`
                }
              </span>
            </div>

            <div className={styles.dashboardBars}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviewStats.distribution[stars] ?? 0;
                const pct = reviewStats.total > 0 ? Math.round((count / reviewStats.total) * 100) : 0;
                return (
                  <div key={stars} className={styles.barRow}>
                    <span className={styles.barLabel}>★ {stars}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.barCount}>({count})</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.dashboardActions}>
              {customer ? (
                <button
                  className={styles.secondarySharpBtn}
                  onClick={() => { setShowReviewModal(true); setReviewError(''); setReviewSuccess(false); }}
                >
                  {locale === 'tr' ? 'Değerlendirme Yaz' : 'Write a Review'}
                </button>
              ) : (
                <Link href={`${linkPrefix}/account`} className={styles.secondarySharpBtn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  {locale === 'tr' ? 'Değerlendirmek için Giriş Yap' : 'Sign In to Review'}
                </Link>
              )}
            </div>
          </div>

          {/* Individual Reviews Feed */}
          <div className={styles.reviewsFeed}>
            {reviewsLoading ? (
              <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', padding: '24px 0' }}>
                {locale === 'tr' ? 'Değerlendirmeler yükleniyor…' : 'Loading reviews…'}
              </p>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>☕️</p>
                <p style={{ fontSize: '14px' }}>
                  {locale === 'tr'
                    ? 'Henüz değerlendirme yok. Bu kahveyi ilk değerlendiren siz olun!'
                    : 'No reviews yet. Be the first to review this coffee!'}
                </p>
                {customer && (
                  <button
                    className={styles.secondarySharpBtn}
                    style={{ marginTop: '16px', padding: '0 24px' }}
                    onClick={() => { setShowReviewModal(true); setReviewError(''); setReviewSuccess(false); }}
                  >
                    {locale === 'tr' ? 'Değerlendirme Yaz' : 'Write a Review'}
                  </button>
                )}
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard} style={{ borderBottom: '1px solid #eeeeee' }}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerBadge}>{review.initials}</div>
                    <div>
                      <h4 className={styles.reviewerName}>{review.displayName}</h4>
                      <div className={styles.reviewMeta}>
                        {new Date(review.createdAt).toLocaleDateString(
                          locale === 'tr' ? 'tr-TR' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ color: s <= review.rating ? '#1a1a1a' : '#dddddd', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                  {review.title && <h5 className={styles.reviewTitle}>{review.title}</h5>}
                  <p className={styles.reviewBody}>{review.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Write Review Modal ── */}
      {showReviewModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowReviewModal(false); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div style={{
            background: '#fff', width: '100%', maxWidth: '520px',
            padding: '36px', position: 'relative',
          }}>
            <button
              onClick={() => setShowReviewModal(false)}
              aria-label="Close review modal"
              style={{
                position: 'absolute', top: '16px', right: '20px',
                background: 'none', border: 'none', fontSize: '22px',
                cursor: 'pointer', color: '#555', lineHeight: 1,
              }}
            >×</button>

            <h3 id="review-modal-title" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
              {locale === 'tr' ? 'Değerlendirme Yaz' : 'Write a Review'}
            </h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '24px' }}>
              {coffee?.name}
            </p>

            {reviewSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '36px' }}>✅</p>
                <p style={{ fontWeight: 600, marginTop: '12px' }}>
                  {locale === 'tr' ? 'Değerlendirmeniz kaydedildi!' : 'Review submitted successfully!'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                {/* Star picker */}
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {locale === 'tr' ? 'Puan' : 'Rating'}
                </label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      id={`review-star-${s}`}
                      onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                      onMouseEnter={() => setReviewHoverRating(s)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      aria-label={`${s} star${s !== 1 ? 's' : ''}`}
                      style={{
                        background: 'none', border: 'none', fontSize: '32px',
                        cursor: 'pointer', padding: '0 2px',
                        color: s <= (reviewHoverRating || reviewForm.rating) ? '#1a1a1a' : '#dddddd',
                        transition: 'color 0.1s',
                      }}
                    >★</button>
                  ))}
                </div>

                {/* Title */}
                <label htmlFor="review-title" style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {locale === 'tr' ? 'Başlık (isteğe bağlı)' : 'Title (optional)'}
                </label>
                <input
                  id="review-title"
                  type="text"
                  maxLength={120}
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder={locale === 'tr' ? 'Kısa bir başlık yazın…' : 'Give your review a headline…'}
                  style={{
                    width: '100%', height: '40px', padding: '0 12px',
                    border: '1px solid rgba(0,0,0,0.15)', marginBottom: '16px',
                    fontSize: '13px', boxSizing: 'border-box', outline: 'none',
                  }}
                />

                {/* Body */}
                <label htmlFor="review-body" style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {locale === 'tr' ? 'Yorum' : 'Review'} *
                </label>
                <textarea
                  id="review-body"
                  maxLength={1000}
                  rows={4}
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder={locale === 'tr' ? 'Bu kahve hakkında düşüncelerinizi paylaşın…' : 'Share your thoughts about this coffee…'}
                  style={{
                    width: '100%', padding: '10px 12px', resize: 'vertical',
                    border: '1px solid rgba(0,0,0,0.15)', marginBottom: '4px',
                    fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box',
                    outline: 'none', lineHeight: 1.6,
                  }}
                />
                <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'right', marginBottom: '16px' }}>
                  {reviewForm.body.length}/1000
                </p>

                {reviewError && (
                  <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '12px' }}>{reviewError}</p>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{
                    width: '100%', height: '44px',
                    background: reviewSubmitting ? '#888' : '#1a1a1a',
                    color: '#fff', border: 'none',
                    fontWeight: 600, fontSize: '12px',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    cursor: reviewSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {reviewSubmitting
                    ? (locale === 'tr' ? 'Gönderiliyor…' : 'Submitting…')
                    : (locale === 'tr' ? 'Değerlendirmeyi Gönder' : 'Submit Review')
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 96px' }}>
          <h2 style={{
            fontSize: '22px', fontWeight: 600, marginBottom: '28px',
            textAlign: 'center', letterSpacing: '0.02em',
          }}>
            {t.youMayAlsoLike}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`${linkPrefix}/coffee/${p.id}`}
                style={{
                  display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit',
                  border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                <div style={{ aspectRatio: '1 / 1', background: '#f6f3ee', overflow: 'hidden' }}>
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {p.origin}
                  </span>
                  <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, margin: '4px 0' }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: '14px', color: '#555' }}>
                    {locale === 'tr' ? `${p.price} TL` : `₺${p.price}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer waveColor="#ffffff" locale={locale} />
    </div>
  );
}