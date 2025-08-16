'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslations();
  const { user, signOut } = useUser();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cart.length;
  const favoritesCount = favorites.length;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-medium border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
              <span className="text-white font-bold text-lg lg:text-xl font-cairo">ك</span>
            </div>
            <span className={`font-bold text-xl lg:text-2xl font-cairo ${
              isScrolled ? 'text-text-primary' : 'text-white'
            } group-hover:text-primary transition-colors duration-300`}>
              كشخة شوب
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/products" 
              className={`font-medium font-cairo transition-colors duration-200 hover:text-primary ${
                isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              {t('navigation.products')}
            </Link>
            <Link 
              href="/categories" 
              className={`font-medium font-cairo transition-colors duration-200 hover:text-primary ${
                isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              {t('navigation.categories')}
            </Link>
            <Link 
              href="/about" 
              className={`font-medium font-cairo transition-colors duration-200 hover:text-primary ${
                isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              {t('navigation.about')}
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Search */}
            <button className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50 ${
              isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Favorites */}
            <Link 
              href="/favorites" 
              className={`relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50 ${
                isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              href="/cart" 
              className={`relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50 ${
                isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50 ${
                  isScrolled ? 'text-text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
                }`}>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm font-cairo">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block font-medium font-cairo">{t('navigation.profile')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-lg font-medium font-cairo transition-all duration-200 ${
                    isScrolled 
                      ? 'text-primary hover:bg-primary/10' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t('navigation.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium font-cairo hover:bg-primary-dark transition-colors duration-200 shadow-button hover:shadow-button-hover"
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200/50">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="font-medium font-cairo text-text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.products')}
              </Link>
              <Link 
                href="/categories" 
                className="font-medium font-cairo text-text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.categories')}
              </Link>
              <Link 
                href="/about" 
                className="font-medium font-cairo text-text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.about')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 