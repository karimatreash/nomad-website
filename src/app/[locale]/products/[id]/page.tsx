'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { supabase } from '@/lib/supabaseClient';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  const isFavorite = favorites.some(fav => fav.product_id === product?.id);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    addToCart(product.id, selectedSize, quantity);
  };

  const handleFavorite = () => {
    if (!product) return;
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-10">
      <div className="flex-1 flex items-center justify-center">
        <Image src={product.image || '/next.svg'} alt={product.name} width={320} height={320} className="rounded-xl bg-gradient-to-br from-pink-200 via-blue-200 to-yellow-200 p-8" />
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-pink-600">{product.name}</h1>
        <p className="text-lg text-gray-700">{product.description}</p>
        <div className="text-2xl font-bold text-blue-600">${product.price}</div>
        <div className="flex gap-4 items-center mt-2">
          <span className="font-semibold">Size:</span>
          <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="border rounded px-3 py-1">
            <option value="">Select Size</option>
            {product.sizes?.map((size: string) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 items-center mt-2">
          <span className="font-semibold">Quantity:</span>
          <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="border rounded px-3 py-1 w-20" />
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={handleAddToCart} disabled={!selectedSize} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50">Add to Cart</button>
          <button onClick={handleFavorite} className={`border rounded-full px-6 py-2 font-semibold transition ${isFavorite ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-300 text-pink-500 hover:bg-pink-50'}`}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
} 