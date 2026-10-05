'use client';

import React, { useState } from 'react';
import { findCarrier } from '../../lib/cargoCarriers';

/** Carrier logo for a provider name — falls back to a coloured monogram for custom carriers. */
export default function CargoLogo({ name, size = 40 }: { name: string; size?: number }) {
  const carrier = findCarrier(name);
  const [failed, setFailed] = useState(false);

  const box: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.22),
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  // Real logos sit in a wider white tile — many are wordmarks that would be unreadable in a square.
  if (carrier?.logo && !failed) {
    return (
      <span style={{ ...box, width: Math.round(size * 2.6), padding: Math.round(size * 0.12), background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>
        <img
          src={carrier.logo}
          alt={carrier.name}
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </span>
    );
  }

  const initials = (carrier?.name ?? name).trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toLocaleUpperCase('tr') ?? '').join('') || '?';
  return (
    <span
      aria-label={carrier?.name ?? name}
      style={{ ...box, background: carrier?.color ?? '#e9e4dc', color: carrier?.textColor ?? '#5b4a3a', fontWeight: 800, fontSize: Math.round(size * 0.38), letterSpacing: '0.02em' }}
    >
      {initials}
    </span>
  );
}
