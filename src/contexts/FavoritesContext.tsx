'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from './UserContext';

export interface FavoriteItem {
  product_id: string;
  product?: any;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  loading: boolean;
  addFavorite: (product_id: string) => Promise<void>;
  removeFavorite: (product_id: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loading: true,
  addFavorite: async () => {},
  removeFavorite: async () => {},
  fetchFavorites: async () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return setFavorites([]);
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id, product:product_id(*)')
      .eq('user_id', user.id);
    if (!error && data) setFavorites(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, [user]);

  const addFavorite = async (product_id: string) => {
    if (!user) return;
    await supabase.from('favorites').upsert({ user_id: user.id, product_id });
    await fetchFavorites();
  };

  const removeFavorite = async (product_id: string) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product_id);
    await fetchFavorites();
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
} 