'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number; // Always holds the original base price
  quantity: number;
  stock: number;
  bagColor: string;
  notes: string[];
  emoji: string;
  imageUrl?: string;
  size?: string;
  grindType?: string;
  category?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isSubscriber: boolean;
  refreshUserStatus: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const coffeeCategories = ['single-origin', 'signature-blend', 'limited-edition', 'filter', 'espresso', 'turkish'];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);

  const fetchUserStatus = async () => {
    try {
      const res = await fetch('/api/account/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setIsSubscriber(json.data.isSubscriber || false);
        } else {
          setIsSubscriber(false);
        }
      } else {
        setIsSubscriber(false);
      }
    } catch {
      setIsSubscriber(false);
    }
  };

  // Load cart from localStorage and fetch subscriber status on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('coffee_esto_roastery_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        requestAnimationFrame(() => {
          setCartItems(parsed);
          setIsInitialized(true);
        });
      } else {
        requestAnimationFrame(() => {
          setIsInitialized(true);
        });
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      requestAnimationFrame(() => {
        setIsInitialized(true);
      });
    }

    fetchUserStatus();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('coffee_esto_roastery_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, stock: item.stock, quantity: Math.min(i.quantity + quantity, item.stock) }
            : i
        );
      }
      return [...prevItems, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
    // Auto open drawer when adding item
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity: Math.min(quantity, i.stock ?? Infinity) } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const refreshUserStatus = async () => {
    await fetchUserStatus();
  };

  // Derive cartCount and cartTotal with dynamic subscriber pricing
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const isCoffee = item.category && coffeeCategories.includes(item.category);
    const effectivePrice = (isSubscriber && isCoffee) ? Math.round(item.price * 0.90) : item.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isSubscriber,
        refreshUserStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
