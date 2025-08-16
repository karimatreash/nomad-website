'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from './UserContext';

export interface CartItem {
  product_id: string;
  size: string;
  quantity: number;
  product?: any;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product_id: string, size: string, quantity: number) => Promise<void>;
  removeFromCart: (product_id: string, size: string) => Promise<void>;
  updateQuantity: (product_id: string, size: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  loading: true,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  fetchCart: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) return setCart([]);
    setLoading(true);
    const { data, error } = await supabase
      .from('carts')
      .select('product_id, size, quantity, product:product_id(*)')
      .eq('user_id', user.id);
    if (!error && data) setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [user]);

  const addToCart = async (product_id: string, size: string, quantity: number) => {
    if (!user) return;
    await supabase.from('carts').upsert({ user_id: user.id, product_id, size, quantity });
    await fetchCart();
  };

  const removeFromCart = async (product_id: string, size: string) => {
    if (!user) return;
    await supabase.from('carts').delete().eq('user_id', user.id).eq('product_id', product_id).eq('size', size);
    await fetchCart();
  };

  const updateQuantity = async (product_id: string, size: string, quantity: number) => {
    if (!user) return;
    await supabase.from('carts').update({ quantity }).eq('user_id', user.id).eq('product_id', product_id).eq('size', size);
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 