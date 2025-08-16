'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  original_price: number;
  image_url: string;
  category_id: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

export default function ProductsPage() {
  const { t, locale } = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = locale === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*');

        if (productsData) setProducts(productsData);
        if (categoriesData) setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch = product.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description_ar.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-cairo">
        <div className="container-responsive section-padding">
          <div className="text-center mb-12">
            <div className="skeleton-title mx-auto mb-4"></div>
            <div className="skeleton-text mx-auto max-w-2xl"></div>
          </div>
          
          <div className="card-grid">
            {Array.from({ length: 8 }).map((_, i) => (
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

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              جميع المنتجات
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              اكتشف مجموعتنا الواسعة من المنتجات المميزة والأزياء العصرية
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive section-padding">
        {/* Filters and Search */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary w-full pl-12 font-cairo"
                dir="rtl"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-text-primary font-cairo">الفئة:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-primary max-w-xs font-cairo"
                dir="rtl"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-text-primary font-cairo">ترتيب حسب:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-primary max-w-xs font-cairo"
                dir="rtl"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="price-low">السعر: من الأقل إلى الأعلى</option>
                <option value="price-high">السعر: من الأعلى إلى الأقل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-text-secondary font-cairo">
            تم العثور على {sortedProducts.length} منتج
            {selectedCategory !== 'all' && (
              <>
                {' '}في فئة{' '}
                <span className="font-semibold text-text-primary">
                  {categories.find(c => c.id === selectedCategory)?.name_ar}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="card-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2 font-cairo">
              لم يتم العثور على منتجات
            </h3>
            <p className="text-text-secondary mb-6 font-cairo">
              جرب تغيير معايير البحث أو الفئة المحددة
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-primary font-cairo"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}

        {/* Load More */}
        {sortedProducts.length > 8 && (
          <div className="text-center mt-12">
            <button className="btn-outline text-lg px-8 py-4 font-cairo">
              عرض المزيد من المنتجات
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 