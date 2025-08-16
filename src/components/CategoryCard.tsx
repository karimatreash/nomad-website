'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface CategoryCardProps {
  category?: any;
  loading?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function CategoryCard({ category, loading = false, onClick, isSelected }: CategoryCardProps) {
  const { locale } = useTranslations();
  const [imageLoading, setImageLoading] = useState(true);

  if (loading) {
    return (
      <Link href="#" className="block group">
        <div className="card p-6 flex flex-col gap-4 animate-pulse">
          <div className="w-full aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`block group ${onClick ? 'cursor-pointer' : ''}`}
    >
      {!onClick ? (
        <Link href={`/${locale}/categories/${category?.id || '#'}`} className="block">
          <div className={`card card-hover p-6 flex flex-col gap-4 relative overflow-hidden ${
            isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}>
            {/* Category Image */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
              )}
              <Image 
                src={category?.image || '/next.svg'} 
                alt={category?.name || 'Category'} 
                width={400} 
                height={400}
                className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-110 ${
                  imageLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-sm font-medium">Explore</span>
                  </div>
                </div>
              </div>

              {/* Product Count Badge */}
              {category?.productCount && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {category.productCount} items
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {category?.name || 'Category Name'}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {category?.description || 'Discover amazing products in this category'}
                </p>
              </div>
              
              {/* Category Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Starting from ${category?.minPrice || '19.99'}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <div className="w-full py-3 px-4 bg-gray-100 group-hover:bg-blue-600 text-gray-700 group-hover:text-white rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
                <span>Shop Now</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500 delay-100"></div>
          </div>
        </Link>
      ) : (
        <div className={`card card-hover p-6 flex flex-col gap-4 relative overflow-hidden ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}>
          {/* Category Image */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
            )}
            <Image 
              src={category?.image || '/next.svg'} 
              alt={category?.name || 'Category'} 
              width={400} 
              height={400}
              className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-110 ${
                imageLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-sm font-medium">Explore</span>
                </div>
              </div>
            </div>

            {/* Product Count Badge */}
            {category?.productCount && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                {category.productCount} items
              </div>
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {category?.name || 'Category Name'}
              </h3>
              <p className="text-gray-600 line-clamp-2">
                {category?.description || 'Discover amazing products in this category'}
              </p>
            </div>
            
            {/* Category Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Starting from ${category?.minPrice || '19.99'}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <div className="w-full py-3 px-4 bg-gray-100 group-hover:bg-blue-600 text-gray-700 group-hover:text-white rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
              <span>Shop Now</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500 delay-100"></div>
        </div>
      )}
    </div>
  );
} 