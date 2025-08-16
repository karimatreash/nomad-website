'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';

interface HeroSlide {
	id: number;
	topLabel: string;
	titleAr: string;
	titleEn: string;
	subtitleAr: string;
	subtitleEn: string;
	link: string;
	imageUrl: string;
	overlayColor: string;
	isActive: boolean;
	order: number;
}

// Default slides data - will be replaced by API call
const defaultSlides: HeroSlide[] = [
	{
		id: 1,
		topLabel: 'Nomad',
		titleAr: 'يا هلا بالحلوين',
		titleEn: 'Welcome to Elegance',
		subtitleAr: 'nomad.com',
		subtitleEn: 'nomad.com',
		link: 'products',
		imageUrl: '/icon.jpg',
		overlayColor: 'rgba(6, 42, 38, 0.7)',
		isActive: true,
		order: 1,
  },
  {
		id: 2,
		topLabel: 'عروض مميزة',
		titleAr: 'تسوق بأناقة',
		titleEn: 'Shop with Style',
		subtitleAr: 'nomad.com',
		subtitleEn: 'nomad.com',
		link: 'categories',
		imageUrl: '/icon.jpg',
		overlayColor: 'rgba(5, 48, 42, 0.7)',
		isActive: true,
		order: 2,
  },
  {
		id: 3,
		topLabel: 'إطلالتك أجمل',
		titleAr: 'مجموعة مختارة بعناية',
		titleEn: 'Carefully Selected Collection',
		subtitleAr: 'nomad.com',
		subtitleEn: 'nomad.com',
		link: 'about',
		imageUrl: '/icon.jpg',
		overlayColor: 'rgba(6, 42, 38, 0.7)',
		isActive: true,
		order: 3,
  },
];

export default function HeroSlider() {
	const { locale } = useTranslations();
	const isRTL = locale === 'ar';
	
	const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
	const [loading, setLoading] = useState(true);

	// TODO: Replace with actual API call to fetch admin-managed slides
	useEffect(() => {
		const fetchSlides = async () => {
			try {
				// const response = await fetch('/api/hero-slides');
				// const data = await response.json();
				// setSlides(data.filter((slide: HeroSlide) => slide.isActive).sort((a: HeroSlide, b: HeroSlide) => a.order - b.order));
				
				// For now, use default slides
				setSlides(defaultSlides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order));
			} catch (error) {
				console.error('Failed to fetch hero slides:', error);
				// Fallback to default slides
				setSlides(defaultSlides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order));
			} finally {
				setLoading(false);
			}
		};

		fetchSlides();
	}, []);

	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	const nextSlide = useCallback(() => {
		if (slides.length > 0) {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}
	}, [slides.length]);

	const prevSlide = useCallback(() => {
		if (slides.length > 0) {
			setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
		}
	}, [slides.length]);

	const goToSlide = useCallback((index: number) => {
		setCurrentSlide(index);
	}, []);

	useEffect(() => {
		if (!isAutoPlaying || slides.length === 0) return;
		const interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	}, [isAutoPlaying, nextSlide, slides.length]);

	// Don't render if no slides or still loading
	if (loading || slides.length === 0) {
		return (
			<section className="relative w-full h-screen overflow-hidden bg-darkGreen-900 flex items-center justify-center">
				<div className="text-white text-xl font-cairo">جاري تحميل المحتوى...</div>
			</section>
		);
	}

	const slide = slides[currentSlide];

  return (
		<section className="relative w-full h-screen overflow-hidden select-none">
			{/* Background Image */}
			<div className="absolute inset-0">
				<div 
					className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
					style={{
						backgroundImage: `url(${slide.imageUrl})`,
					}}
				/>
				{/* Dark overlay for better text readability */}
				<div 
					className="absolute inset-0"
					style={{ backgroundColor: slide.overlayColor }}
				/>
			</div>

			{/* Soft bokeh dots overlay */}
			<div className="pointer-events-none absolute inset-0">
				{Array.from({ length: 24 }).map((_, i) => (
					<span
						key={i}
						className="absolute rounded-full"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							width: `${8 + Math.random() * 18}px`,
							height: `${8 + Math.random() * 18}px`,
							background:
								'radial-gradient(circle, rgba(245,231,179,0.9) 0%, rgba(245,231,179,0.25) 60%, rgba(245,231,179,0) 70%)',
							opacity: 0.25 + Math.random() * 0.5,
							filter: 'blur(1px)',
						}}
					/>
				))}
			</div>

			{/* Content */}
			<div className="relative h-full flex items-center justify-center">
				<div className="mx-auto max-w-screen-2xl px-6 lg:px-10 text-center">
					{/* Top small label */}
					<div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/35 text-gold/90 tracking-wide font-cairo">
						<span className="w-2 h-2 rounded-full bg-gold" />
						<span className="font-semibold text-base">{slide.topLabel}</span>
					</div>

					{/* Main Arabic heading */}
					<h1
						className={`mt-8 font-extrabold leading-[1.05] text-gold font-cairo ${
							isRTL ? 'text-hero-arabic' : 'text-hero'
						}`}
						style={{
							textShadow: '0 4px 24px rgba(245,231,160,0.25)',
							direction: isRTL ? 'rtl' as const : 'ltr' as const,
						}}
					>
						                        {isRTL ? slide.titleAr : slide.titleEn}
          </h1>

					{/* Subheading / domain */}
					                      <p
                        className="mt-6 font-semibold text-gold/95 font-cairo text-xl lg:text-2xl xl:text-3xl"
                      >
                        {isRTL ? slide.subtitleAr : slide.subtitleEn}
                      </p>

					{/* CTA (subtle) */}
					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							href={`/${locale}/${slide.link}`}
							className="px-7 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 font-cairo"
							style={{
								backgroundColor: 'rgba(245,231,160,0.12)',
								border: '1px solid rgba(245,231,160,0.32)',
								color: '#F5E7A0',
							}}
						>
							{isRTL ? 'تسوق الآن' : 'Shop Now'}
						</Link>
        </div>
          </div>
        </div>

			{/* Dots - only show if more than one slide */}
			{slides.length > 1 && (
				<div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-3">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							onMouseEnter={() => setIsAutoPlaying(false)}
							onMouseLeave={() => setIsAutoPlaying(true)}
							className={`h-2.5 rounded-full transition-all duration-300 ${
								index === currentSlide ? 'w-8' : 'w-2.5'
							}`}
							style={{ backgroundColor: index === currentSlide ? '#F5E7A0' : 'rgba(245,231,160,0.5)' }}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
      </div>
			)}

			{/* Arrows - only show if more than one slide */}
			{slides.length > 1 && (
				<>
					<button
						onClick={prevSlide}
						onMouseEnter={() => setIsAutoPlaying(false)}
						onMouseLeave={() => setIsAutoPlaying(true)}
						className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 glass"
						style={{ color: '#F5E7A0' }}
						aria-label="Previous slide"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					<button
						onClick={nextSlide}
						onMouseEnter={() => setIsAutoPlaying(false)}
						onMouseLeave={() => setIsAutoPlaying(true)}
						className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 glass"
						style={{ color: '#F5E7A0' }}
						aria-label="Next slide"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</>
			)}
    </section>
  );
} 