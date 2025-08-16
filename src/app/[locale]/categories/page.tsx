'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import CategoryCard from '@/components/CategoryCard';
import { supabase } from '@/lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image_url: string;
  product_count: number;
  min_price: number;
}

export default function CategoriesPage() {
  const { t, locale } = useTranslations();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = locale === 'ar';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('name_ar', { ascending: true });

        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description_ar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-cairo">
        <div className="container-responsive section-padding">
          <div className="text-center mb-12">
            <div className="skeleton-title mx-auto mb-4"></div>
            <div className="skeleton-text mx-auto max-w-2xl"></div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
              فئات المنتجات
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              تصفح مجموعاتنا المتنوعة من الفئات المميزة
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive section-padding">
        {/* Search */}
        <div className="mb-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في الفئات..."
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
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-text-secondary font-cairo">
            {searchQuery ? `تم العثور على ${filteredCategories.length} فئة` : `إجمالي الفئات: ${categories.length}`}
          </p>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
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
              لم يتم العثور على فئات
            </h3>
            <p className="text-text-secondary mb-6 font-cairo">
              جرب تغيير كلمة البحث
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary font-cairo"
            >
              إعادة تعيين البحث
            </button>
          </div>
        )}

        {/* Featured Categories */}
        {!searchQuery && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4 font-cairo">
                فئات مميزة
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto font-cairo">
                اكتشف أكثر الفئات شعبية وطلباتاً
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((category) => (
                <div key={category.id} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-primary font-cairo">
                      {category.name_ar.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 font-cairo">
                    {category.name_ar}
                  </h3>
                  <p className="text-sm text-text-secondary font-cairo">
                    {category.product_count} منتج
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4 font-cairo">
              لا تجد ما تبحث عنه؟
            </h3>
            <p className="text-text-secondary mb-6 font-cairo">
              تواصل معنا وسنقوم بإضافة الفئات التي تحتاجها
            </p>
            <button className="btn-primary font-cairo">
              اقتراح فئة جديدة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 