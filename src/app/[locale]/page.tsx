'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslations } from '@/hooks/useTranslations';
import { useOptimizedData } from '@/hooks/useOptimizedData';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  product_count: number;
  min_price: number;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSlider />
      <div className="container-responsive section-padding">
        <div className="space-y-16">
          <div className="text-center">
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
    </div>
  );
}

// Products section component
function ProductsSection() {
  const { data: products, loading, error } = useOptimizedData<Product[]>({
    fetchFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    cacheKey: 'home-products',
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  if (loading) {
    return (
      <div className="card-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error mb-4">Failed to load products</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Categories section component
function CategoriesSection() {
  const { data: categories, loading, error } = useOptimizedData<Category[]>({
    fetchFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
    cacheKey: 'home-categories',
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  if (loading) {
    return (
      <div className="card-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error mb-4">Failed to load categories</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {categories?.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Hero Section */}
      <Suspense fallback={<div className="h-screen bg-gray-200 animate-pulse" />}>
        <HeroSlider />
      </Suspense>

      {/* Featured Products Section */}
      <section className="container-responsive section-padding">
        <div className="text-center mb-12">
          <h2 className="section-title">
            {t('home.featuredProducts')}
          </h2>
          <p className="section-subtitle">
            {t('home.featuredProductsSubtitle')}
          </p>
        </div>

        <Suspense fallback={
          <div className="card-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCard key={i} loading={true} />
            ))}
          </div>
        }>
          <ProductsSection />
        </Suspense>

        <div className="text-center mt-12">
          <a href={`/${locale}/products`} className="btn-secondary">
            {t('home.viewAllProducts')}
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-responsive section-padding bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="section-title">
            {t('home.shopByCategory')}
          </h2>
          <p className="section-subtitle">
            {t('home.shopByCategorySubtitle')}
          </p>
        </div>

        <Suspense fallback={
          <div className="card-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCard key={i} loading={true} />
            ))}
          </div>
        }>
          <CategoriesSection />
        </Suspense>

        <div className="text-center mt-12">
          <a href={`/${locale}/categories`} className="btn-secondary">
            {t('home.viewAllCategories')}
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 font-cairo">
              {t('home.freeShipping')}
            </h3>
            <p className="text-text-secondary font-cairo">
              {t('home.freeShippingDesc')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 font-cairo">
              {t('home.qualityGuarantee')}
            </h3>
            <p className="text-text-secondary font-cairo">
              {t('home.qualityGuaranteeDesc')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 font-cairo">
              {t('home.fastDelivery')}
            </h3>
            <p className="text-text-secondary font-cairo">
              {t('home.fastDeliveryDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container-responsive section-padding bg-white">
        <div className="text-center mb-16">
          <h2 className="section-title">
            {t('testimonials.title')}
          </h2>
          <p className="section-subtitle">
            {t('testimonials.subtitle')}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-text-secondary mb-4 font-cairo">
              {t('testimonials.testimonial1.text')}
            </p>
            <h4 className="font-bold text-text-primary font-cairo">{t('testimonials.testimonial1.author')}</h4>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-text-secondary mb-4 font-cairo">
              {t('testimonials.testimonial2.text')}
            </p>
            <h4 className="font-bold text-text-primary font-cairo">{t('testimonials.testimonial2.author')}</h4>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-text-secondary mb-4 font-cairo">
              {t('testimonials.testimonial3.text')}
            </p>
            <h4 className="font-bold text-text-primary font-cairo">{t('testimonials.testimonial3.author')}</h4>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container-responsive section-padding">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="section-title text-right">
              {t('home.aboutUs')}
            </h2>
            <p className="text-lg text-text-secondary mb-6 font-cairo">
              مرحباً بك في Nomad! نحن شغوفون بتقديم أحدث صيحات الملابس مع التركيز على الجودة والراحة والأناقة.
            </p>
            <p className="text-lg text-text-secondary mb-6 font-cairo">
              اكتشف مجموعاتنا الملونة واستمتع بتجربة تسوق سلسة. نؤمن بأن الأزياء يجب أن تكون تعبيراً عن شخصيتك الفريدة.
            </p>
            <a
              href={`/${locale}/about`}
              className="btn-outline text-lg px-8 py-4 font-cairo"
            >
              {t('home.learnMore')}
            </a>
          </div>
          
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-soft mx-auto mb-6">
                  <img 
                    src="/icon.jpg" 
                    alt="Nomad Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to original design if image fails
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.about-logo-fallback') as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="about-logo-fallback w-full h-full bg-primary flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-white text-4xl font-bold font-cairo">ن</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-text-primary font-cairo mb-2">Nomad</h3>
                <p className="text-text-secondary font-cairo text-lg">أسلوبك، هويتك</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
