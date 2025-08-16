'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import Link from 'next/link';

interface HeroSlide {
  id: number;
  topLabel: string;
  titleAr: string;
  subtitleAr: string;
  link: string;
  imageUrl: string;
  overlayColor: string;
  isActive: boolean;
  order: number;
}

export default function AdminHeroPage() {
  const { t } = useTranslations();
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: 1,
      topLabel: 'كشخة',
      titleAr: 'يا هلا بالحلوين',
      subtitleAr: 'kashkhashop.com',
      link: 'products',
      imageUrl: '/hero-1.jpg',
      overlayColor: 'rgba(6, 42, 38, 0.7)',
      isActive: true,
      order: 1,
    },
    {
      id: 2,
      topLabel: 'عروض مميزة',
      titleAr: 'تسوق بأناقة',
      subtitleAr: 'kashkhashop.com',
      link: 'categories',
      imageUrl: '/hero-2.jpg',
      overlayColor: 'rgba(5, 48, 42, 0.7)',
      isActive: true,
      order: 2,
    },
    {
      id: 3,
      topLabel: 'إطلالتك أجمل',
      titleAr: 'مجموعة مختارة بعناية',
      subtitleAr: 'kashkhashop.com',
      link: 'about',
      imageUrl: '/hero-3.jpg',
      overlayColor: 'rgba(6, 42, 38, 0.7)',
      isActive: true,
      order: 3,
    },
  ]);

  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File, slideId: number) => {
    setIsUploading(true);
    try {
      // TODO: Implement actual image upload to Supabase storage
      // const { data, error } = await supabase.storage
      //   .from('hero-images')
      //   .upload(`${slideId}-${Date.now()}.jpg`, file);
      
      // For now, simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newImageUrl = `/hero-${slideId}-${Date.now()}.jpg`;
      setSlides(prev => prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, imageUrl: newImageUrl }
          : slide
      ));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSlide = (slide: HeroSlide) => {
    setSlides(prev => prev.map(s => s.id === slide.id ? slide : s));
    setEditingSlide(null);
  };

  const handleDeleteSlide = (slideId: number) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      setSlides(prev => prev.filter(s => s.id !== slideId));
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);
    
    // Update order numbers
    newSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });
    
    setSlides(newSlides);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hero Slider Management</h1>
              <p className="text-gray-600 mt-2">Manage your hero section slides, images, and content</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Add New Slide Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              const newSlide: HeroSlide = {
                id: Date.now(),
                topLabel: 'New Slide',
                titleAr: 'عنوان جديد',
                subtitleAr: 'kashkhashop.com',
                link: 'products',
                imageUrl: '/placeholder-hero.jpg',
                overlayColor: 'rgba(6, 42, 38, 0.7)',
                isActive: true,
                order: slides.length + 1,
              };
              setSlides(prev => [...prev, newSlide]);
              setEditingSlide(newSlide);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Slide
          </button>
        </div>

        {/* Slides List */}
        <div className="grid gap-6">
          {slides.map((slide, index) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
                      <img
                        src={slide.imageUrl}
                        alt={`Slide ${slide.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-hero.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs">Preview</span>
                      </div>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, slide.id);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="text-xs text-blue-600 mt-1">Uploading...</div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Top Label
                        </label>
                        <input
                          type="text"
                          value={slide.topLabel}
                          onChange={(e) => {
                            setSlides(prev => prev.map(s => 
                              s.id === slide.id ? { ...s, topLabel: e.target.value } : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Arabic Title
                        </label>
                        <input
                          type="text"
                          value={slide.titleAr}
                          onChange={(e) => {
                            setSlides(prev => prev.map(s => 
                              s.id === slide.id ? { ...s, titleAr: e.target.value } : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={slide.subtitleAr}
                          onChange={(e) => {
                            setSlides(prev => prev.map(s => 
                              s.id === slide.id ? { ...s, subtitleAr: e.target.value } : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Link
                        </label>
                        <input
                          type="text"
                          value={slide.link}
                          onChange={(e) => {
                            setSlides(prev => prev.map(s => 
                              s.id === slide.id ? { ...s, link: e.target.value } : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., products, categories"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Overlay Color
                        </label>
                        <input
                          type="text"
                          value={slide.overlayColor}
                          onChange={(e) => {
                            setSlides(prev => prev.map(s => 
                              s.id === slide.id ? { ...s, overlayColor: e.target.value } : s
                            ));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="rgba(6, 42, 38, 0.7)"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={slide.isActive}
                            onChange={(e) => {
                              setSlides(prev => prev.map(s => 
                                s.id === slide.id ? { ...s, isActive: e.target.checked } : s
                              ));
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorder(index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <span className="text-sm text-gray-500 w-8 text-center">{slide.order}</span>
                          <button
                            onClick={() => handleReorder(index, Math.min(slides.length - 1, index + 1))}
                            disabled={index === slides.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => handleSaveSlide(slide)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save All Changes */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              // TODO: Implement API call to save all changes
              alert('All changes saved! (API integration needed)');
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
} 