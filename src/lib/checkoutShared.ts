// Shared between /api/checkout (initiates a 3DS payment) and
// /api/checkout/callback (finalizes it once the bank redirects back).

// Mirrors the address shown in the checkout page's pickup panel
// (src/components/CheckoutPaymentContent.tsx) — used as the order's stored
// address for pickup orders, and as the address/city/zip iyzico requires
// on the payment request when the customer skips filling in their own.
export const PICKUP_LABEL = 'Store Pickup';
export const PICKUP_ADDRESS = {
  line: 'Coffee Esto Roastery, Topselvi Mahallesi, Kubilay Caddesi, Şht. Ahmet Yalçın Sk. 3/a',
  city: 'İstanbul',
  district: 'Kartal',
  zipCode: '34873',
};

export interface ShippingDetails {
  email: string;
  fullName: string;
  address: string;
  city: string;
  phone: string;
  zipCode: string;
}

export function getProductId(id: string): string {
  const parts = id.split('-');
  const sizeIndex = parts.findIndex((p) => p === '250g' || p === '500g' || p === '1kg');
  if (sizeIndex !== -1) {
    return parts.slice(0, sizeIndex).join('-');
  }
  return id;
}

// Thrown inside the post-payment transaction when stock ran out between the
// pre-charge check and now (a race between two near-simultaneous checkouts).
// Distinguishing it lets us tell the customer "sold out" instead of a generic error.
export class StockConflictError extends Error {
  constructor(public readonly productId: string) {
    super(`Stock for "${productId}" changed before the order could be completed.`);
  }
}

// Everything needed to finish creating the Order once the bank confirms the
// charge — locked-in prices and order-building inputs only, never card data.
export interface PendingCheckoutPayload {
  shippingDetails: ShippingDetails;
  mappedItems: Array<{ id: string; name: string; quantity: number; price: number }>;
  isWholesale: boolean;
  isPickup: boolean;
  calculatedSubtotal: number;
  shippingFee: number;
  cargoProviderName: string;
  discountAmount: number;
  appliedCouponCode: string;
  appliedCouponId: string | null;
  totalAmount: number;
  customerId?: string;
  detectedLocale: string;
  ip: string;
}
