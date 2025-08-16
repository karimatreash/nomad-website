import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { UserProvider } from '@/contexts/UserContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
                return {
                title: locale === 'ar' ? 'Nomad - تسوق بأسلوب' : 'Nomad - Shop with Style',
                description: locale === 'ar'
                  ? 'اكتشف مجموعتنا المميزة من المنتجات العصرية والأنيقة. تسوق الآن واحصل على أفضل العروض!'
                  : 'Discover our exclusive collection of modern and elegant products. Shop now and get the best offers!',
              };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`bg-[#F5F5F7] min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </FavoritesProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
