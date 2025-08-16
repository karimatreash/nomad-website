'use client';
import { useState, useEffect } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';

interface FavoriteItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
    price: number;
    original_price: number;
    image_url: string;
    category_id: string;
  };
}

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (favorites.length > 0) {
          const { data } = await supabase
            .from('favorites')
            .select(`
              id,
              product_id,
              user_id,
              created_at,
              product:product_id(*)
            `)
            .in('product_id', favorites);

          if (data) {
            setFavoriteProducts(data as unknown as FavoriteItem[]);
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFavorite(productId);
      setFavoriteProducts(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-cairo">
        <div className="container-responsive section-padding">
          <div className="text-center mb-12">
            <div className="skeleton-title mx-auto mb-4"></div>
            <div className="skeleton-text mx-auto max-w-2xl"></div>
          </div>
          
          <div className="card-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton-image mb-4"></div>
                <div className="skeleton-title mb-2"></div>
                <div className="skeleton-text mb-2"></div>
                <div className="skeleton-text w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-cairo">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4 font-cairo">
            لا توجد منتجات مفضلة
          </h2>
          <p className="text-text-secondary mb-8 font-cairo">
            لم تقم بإضافة أي منتجات إلى المفضلة بعد
          </p>
          <a href="/products" className="btn-primary font-cairo">
            تصفح المنتجات
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              المنتجات المفضلة
            </h1>
            <p className="text-xl text-text-secondary">
              احتفظ بمنتجاتك المفضلة للوصول إليها بسهولة
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive section-padding">
        {/* Favorites Count */}
        <div className="mb-8 text-center">
          <p className="text-text-secondary font-cairo">
            لديك {favoriteProducts.length} منتج في المفضلة
          </p>
        </div>

        {/* Favorites Grid */}
        <div className="card-grid">
          {favoriteProducts.map((favorite) => (
            <div key={favorite.id} className="relative group">
              <ProductCard product={favorite.product} />
              
              {/* Remove Favorite Button */}
              <button
                onClick={() => handleRemoveFavorite(favorite.product_id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-medium hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="إزالة من المفضلة"
              >
                <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                favoriteProducts.forEach(favorite => handleRemoveFavorite(favorite.product_id));
              }}
              className="btn-ghost font-cairo"
            >
              إفراغ المفضلة
            </button>
            <a href="/products" className="btn-outline font-cairo">
              متابعة التسوق
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-text-primary mb-6 text-center font-cairo">
              نصائح للمفضلة
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-text-primary mb-2 font-cairo">حفظ المنتجات</h4>
                <p className="text-sm text-text-secondary font-cairo">
                  احفظ المنتجات التي تعجبك للعودة إليها لاحقاً
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-text-primary mb-2 font-cairo">إضافة للسلة</h4>
                <p className="text-sm text-text-secondary font-cairo">
                  أضف المنتجات المفضلة إلى سلة التسوق بسهولة
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-text-primary mb-2 font-cairo">متابعة الأسعار</h4>
                <p className="text-sm text-text-secondary font-cairo">
                  تابع التخفيضات والعروض على منتجاتك المفضلة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 