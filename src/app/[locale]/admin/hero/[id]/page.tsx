'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditHeroPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [heroSection, setHeroSection] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHeroSection();
  }, [params.id]);

  const fetchHeroSection = async () => {
    const { data, error } = await supabase.from('hero_sections').select('*').eq('id', params.id).single();
    if (data) {
      setHeroSection(data);
      setForm({
        title: data.title,
        subtitle: data.subtitle,
        image: data.image || '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('hero_sections').update({
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
    }).eq('id', params.id);

    if (!error) {
      router.push('/admin/hero');
    } else {
      alert('Error updating hero section: ' + error.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!heroSection) return <div className="text-center py-12">Hero section not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">Edit Hero Section</h1>
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
            disabled={saving}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
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