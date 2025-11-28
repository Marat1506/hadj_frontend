'use client';

import {useEffect, useState} from 'react';

import Image from 'next/image';
import {useRouter} from 'next/navigation';

import {api} from '@/services';
import { BannerSkeleton } from './ui/loading-skeletons';

interface Slide {
    imageUrl: string;
    alt: string;
    title: string;
    link: string;
}

const BannerCarousel = () => {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCarouselItems = async () => {
            try {
                const data = await api.getAllCarouselItems();
                setSlides(data);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselItems();
    }, []);

    useEffect(() => {
        if (slides.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [slides.length]);

    if (loading) {
        return (
            <section className="relative overflow-hidden h-[396px] md:h-[500px]">
                <BannerSkeleton />
            </section>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Ошибка загрузки карусели: {error}
            </div>
        );
    }

    if (slides.length === 0) {
        return <div className="text-center py-8">Нет доступных слайдов карусели.</div>;
    }

    return (
        <section className="relative overflow-hidden h-[396px] md:h-[500px]">
            <div className="relative w-full h-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Image
                            src={slide.imageUrl}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div className="text-center px-4">
                                <h2 className="text-white text-xl md:text-4xl  mb-3 max-w-4xl">
                                    {slide.title}
                                </h2>
                                <button
                                    onClick={() => router.push(slide.link || '/hajj')}
                                    className="brand-bg text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BannerCarousel;
