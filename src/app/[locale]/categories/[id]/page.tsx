'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabaseClient';

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [categoryRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('id', params.id).single(),
        supabase.from('products').select('*').eq('category_id', params.id)
      ]);
      if (categoryRes.data) setCategory(categoryRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!category) return <div className="text-center py-12">Category not found.</div>;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-12">
      <div className="flex items-center gap-6 mb-10">
        <Image src={category.image || '/globe.svg'} alt={category.name} width={64} height={64} className="rounded-full bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-200 p-2" />
        <h1 className="text-3xl font-bold text-blue-600">{category.name}</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 