'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewHeroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('hero_sections').insert({
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
    });

    if (!error) {
      router.push('/admin/hero');
    } else {
      alert('Error creating hero section: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">Add New Hero Section</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <textarea
            value={form.subtitle}
            onChange={e => setForm({ ...form, subtitle: e.target.value })}
            required
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Hero Section'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/hero')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 