'use client';
import { useState, memo } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTranslations } from '@/hooks/useTranslations';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product?: any;
  loading?: boolean;
}

const ProductCard = memo(function ProductCard({ product, loading = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { locale } = useTranslations();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isFavorite = favorites.some(fav => fav.product_id === product?.id);

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product.id, selectedSize, quantity);
    setIsAddingToCart(false);
    
    // Reset form
    setSelectedSize('');
    setQuantity(1);
  };

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  if (loading) {
    return (
      <div className="card p-6 flex flex-col gap-4 animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-full"></div>
          <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-20"></div>
        </div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-full"></div>
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="group card card-hover p-6 flex flex-col gap-4 relative overflow-hidden">
      {/* Favorite Button - Absolute positioned */}
      <button 
        onClick={handleFavorite} 
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isFavorite 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
        }`}
        aria-label={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <svg width="18" height="18" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z"/>
        </svg>
      </button>

      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden group-hover:shadow-xl transition-all duration-300">
        <OptimizedImage 
          src={product?.image || '/next.svg'} 
          alt={product?.name || 'Product'} 
          width={400} 
          height={400}
          className="object-cover w-full h-full transition-all duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 btn-primary text-sm px-6 py-2">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product?.name || 'Premium T-Shirt'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product?.description || 'Comfortable and stylish design perfect for everyday wear'}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">
              ${product?.price || 29.99}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {product?.discount && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Size and Quantity Selection */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <select 
            value={selectedSize} 
            onChange={e => setSelectedSize(e.target.value)} 
            className="flex-1 input-modern text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Size</option>
            {product?.sizes?.map((size: string) => (
              <option key={size} value={size}>{size}</option>
            )) || ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          
          <div className="relative">
            <input 
              type="number" 
              min={1} 
              max={99}
              value={quantity} 
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} 
              className="w-20 input-modern text-sm text-center focus:ring-2 focus:ring-blue-500" 
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Qty
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart} 
          disabled={!selectedSize || isAddingToCart} 
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            !selectedSize 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : isAddingToCart
                ? 'bg-blue-500 text-white cursor-wait'
                : 'btn-primary'
          }`}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>

      {/* Additional Features */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Free Shipping
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Easy Returns
        </div>
      </div>
    </div>
  );
});

export default ProductCard; 