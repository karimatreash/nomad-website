'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export default function Footer() {
  const { locale } = useTranslations();
  const [email, setEmail] = useState('');
  const isRTL = locale === 'ar';

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[#2C3E50] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5C6BC0] to-[#FF4081] rounded-3xl flex items-center justify-center shadow-glow">
                                        <span className="text-white font-bold text-2xl">N</span>
              </div>
                                        <span className="text-3xl font-bold bg-gradient-to-r from-[#5C6BC0] to-[#FF4081] bg-clip-text text-transparent">Nomad</span>
            </div>
            <p className="text-[#B0BEC5] mb-8 leading-relaxed text-lg">
              {isRTL 
                ? 'اكتشف أسلوبك المثالي مع مجموعتنا المختارة من الملابس التي تجمع بين الراحة والجودة والتصميم المعاصر.'
                : 'Discover your perfect style with our curated collection of clothing that combines comfort, quality, and contemporary design.'
              }
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-[#34495E] hover:bg-[#5C6BC0] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 group shadow-soft">
                <svg className="w-6 h-6 text-[#B0BEC5] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#34495E] hover:bg-[#5C6BC0] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 group shadow-soft">
                <svg className="w-6 h-6 text-[#B0BEC5] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#34495E] hover:bg-[#5C6BC0] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 group shadow-soft">
                <svg className="w-6 h-6 text-[#B0BEC5] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#34495E] hover:bg-[#5C6BC0] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 group shadow-soft">
                <svg className="w-6 h-6 text-[#B0BEC5] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-white">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href={`/${locale}/products`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'جميع المنتجات' : 'All Products'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'الفئات' : 'Categories'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/new`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'وصل حديثاً' : 'New Arrivals'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/sale`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'العروض' : 'Sale Items'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/trending`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'الأكثر رواجاً' : 'Trending Now'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-white">
              {isRTL ? 'خدمة العملاء' : 'Customer Service'}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href={`/${locale}/contact`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'معلومات الشحن' : 'Shipping Info'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/returns`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'الاسترجاع والتبديل' : 'Returns & Exchanges'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/size-guide`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'دليل المقاسات' : 'Size Guide'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-[#B0BEC5] hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block text-lg">
                  {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-white">
              {isRTL ? 'ابق على اطلاع' : 'Stay Updated'}
            </h3>
            <p className="text-[#B0BEC5] mb-6 text-lg">
              {isRTL 
                ? 'اشترك في نشرتنا الإخبارية للحصول على آخر التحديثات والعروض الحصرية ونصائح الأزياء.'
                : 'Subscribe to our newsletter for the latest updates, exclusive offers, and style tips.'
              }
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-[#34495E] border border-[#546E7A] rounded-2xl text-white placeholder-[#B0BEC5] focus:outline-none focus:ring-2 focus:ring-[#5C6BC0] focus:border-transparent transition-all duration-200 shadow-soft"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#5C6BC0] to-[#FF4081] hover:from-[#3F51B5] hover:to-[#F50057] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[#5C6BC0] focus:ring-offset-2 focus:ring-offset-[#2C3E50] text-lg"
              >
                {isRTL ? 'اشتراك' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-10 border-t border-[#34495E]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[#B0BEC5] text-base">
              © 2024 NomadWear. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </div>
            
            <div className="flex items-center gap-8">
              <Link href={`/${locale}/privacy`} className="text-[#B0BEC5] hover:text-white text-base transition-colors">
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link href={`/${locale}/terms`} className="text-[#B0BEC5] hover:text-white text-base transition-colors">
                {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-[#B0BEC5] text-base">
                {isRTL ? 'نحن نقبل:' : 'We accept:'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-8 bg-[#34495E] rounded-xl flex items-center justify-center">
                  <span className="text-xs text-[#B0BEC5]">VISA</span>
                </div>
                <div className="w-10 h-8 bg-[#34495E] rounded-xl flex items-center justify-center">
                  <span className="text-xs text-[#B0BEC5]">MC</span>
                </div>
                <div className="w-10 h-8 bg-[#34495E] rounded-xl flex items-center justify-center">
                  <span className="text-xs text-[#B0BEC5]">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 