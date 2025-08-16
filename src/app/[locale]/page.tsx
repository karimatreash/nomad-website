'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
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
  description: string;
  description_ar: string;
  image_url: string;
  product_count: number;
  min_price: number;
}

export default function HomePage() {
  const { t, locale } = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = locale === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .limit(6);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeroSlider />
        <div className="container-responsive section-padding">
          {/* Loading skeletons */}
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

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Hero Section */}
      <HeroSlider />

      {/* New Arrivals Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-cairo">
              وصل حديثاً
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto font-cairo">
              اكتشف أحدث المنتجات في مجموعتنا المميزة من الأزياء والإكسسوارات العصرية
            </p>
          </div>
          
          <div className="card-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/products"
              className="btn-primary text-lg px-8 py-4 font-cairo"
            >
              عرض جميع المنتجات
            </a>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-cairo">
              تسوق حسب الفئة
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto font-cairo">
              تصفح مجموعاتنا المتنوعة من الفئات المميزة
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/categories"
              className="btn-secondary text-lg px-8 py-4 font-cairo"
            >
              استكشاف جميع الفئات
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-cairo">
              مميزاتنا
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto font-cairo">
              لماذا تختار كشخة شوب؟ اكتشف ما يميزنا عن الآخرين
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-cairo">جودة عالية</h3>
              <p className="text-text-secondary font-cairo">منتجات عالية الجودة مصنوعة من أفضل المواد</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-cairo">شحن سريع</h3>
              <p className="text-text-secondary font-cairo">شحن مجاني لجميع الطلبات فوق 200 ريال</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-cairo">دعم 24/7</h3>
              <p className="text-text-secondary font-cairo">فريق دعم متاح على مدار الساعة لمساعدتك</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-cairo">دفع آمن</h3>
              <p className="text-text-secondary font-cairo">معاملات آمنة ومشفرة لحماية بياناتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-cairo">
              آراء عملائنا
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto font-cairo">
              ماذا يقول عملاؤنا عن تجربتهم معنا
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
                "منتجات رائعة وجودة عالية! أنصح الجميع بالتسوق من كشخة شوب"
              </p>
              <h4 className="font-bold text-text-primary font-cairo">سارة أحمد</h4>
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
                "خدمة عملاء ممتازة وشحن سريع. سأعود بالتأكيد!"
              </p>
              <h4 className="font-bold text-text-primary font-cairo">محمد علي</h4>
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
                "أسعار معقولة ومنتجات أنيقة. تجربة تسوق رائعة!"
              </p>
              <h4 className="font-bold text-text-primary font-cairo">فاطمة محمد</h4>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 font-cairo">
                من نحن
              </h2>
              <p className="text-lg text-text-secondary mb-6 font-cairo">
                مرحباً بك في كشخة شوب! نحن شغوفون بتقديم أحدث صيحات الملابس مع التركيز على الجودة والراحة والأناقة.
              </p>
              <p className="text-lg text-text-secondary mb-6 font-cairo">
                اكتشف مجموعاتنا الملونة واستمتع بتجربة تسوق سلسة. نؤمن بأن الأزياء يجب أن تكون تعبيراً عن شخصيتك الفريدة.
              </p>
              <a
                href="/about"
                className="btn-outline text-lg px-8 py-4 font-cairo"
              >
                اعرف المزيد عنا
              </a>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl font-bold font-cairo">ك</span>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary font-cairo">كشخة شوب</h3>
                  <p className="text-text-secondary font-cairo">أسلوبك، هويتك</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
