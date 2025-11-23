'use client';

import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';

import {useAuth} from '@/hooks/useAuth';
import http from '@/services/http';

import TestimonialForm from './TestimonialForm';

interface Testimonial {
    id: string;
    message: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    user: {
        firstName: string;
        lastName: string;
        avatarUrl?: string | null;
    };
}

const TestimonialsSection = () => {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleReviewButtonClick = () => {
        if (isAuthenticated) {
            setShowReviewForm(true);
        } else {
            router.push('/login');
        }
    };

    const fetchTestimonials = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await http.get<Testimonial[]>('/testimonials');
            setTestimonials(response.data);
        } catch (err) {
            setError('Не удалось загрузить отзывы.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={i} className="w-4 h-4 mr-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.825 1.983c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.54 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/>
                </svg>
            );
        }
        if (hasHalfStar) {
            stars.push(
                <svg key={'half'} className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                        d="M10 2.5l1.464 4.51a.5.5 0 00.475.34h4.74l-3.83 2.783a.5.5 0 00-.182.559L14.18 16 10 13.62V2.5z"/>
                    <path
                        d="M10 2.5v11.12L6.82 16l.294-3.918a.5.5 0 00-.182-.559L2.105 9.74h4.74a.5.5 0 00.475-.34L10 2.5z"
                        className="opacity-30"/>
                </svg>
            );
        }
        return <div className="flex items-center text-amber-400">{stars}</div>;
    };

    return (
        <section className="container mx-auto px-4 pb-4">
            <h2 className="text-xl mb-2">Отзывы паломников</h2>

            {loading && <p className="text-center">Загрузка отзывов...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && testimonials.length === 0 && (
                <p className="text-center">Отзывов пока нет. Будьте первым!</p>
            )}

            <div className="flex overflow-x-auto no-scrollbar gap-6 pb-6">
                {testimonials.map((t) => (
                    <div
                        key={t.id}
                        className="min-w-[360px] max-w-[360px] bg-white border border-gray-100 rounded-2xl p-6 flex-shrink-0 shadow-sm"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div
                                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
                                {t.user.avatarUrl ? (
                                    <img src={t.user.avatarUrl} alt={`${t.user.firstName} ${t.user.lastName}`}
                                         className="w-full h-full object-cover"/>
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-700">
                                        {`${t.user.firstName?.charAt(0) || ''}${t.user.lastName?.charAt(0) || ''}`}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {t.user.firstName} {t.user.lastName}
                                    </h4>
                                </div>
                                <div className="mt-2">{renderStars(t.rating)}</div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{t.message}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleReviewButtonClick}
                    className="bg-[#12326a] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-[#0f2754] transition-colors"
                >
                    Оставить отзыв
                </button>
            </div>

            {showReviewForm && (
                <TestimonialForm
                    onClose={() => setShowReviewForm(false)}
                    onSuccess={() => {
                        setShowReviewForm(false);
                        fetchTestimonials();
                    }}
                />
            )}
        </section>
    );
};

export default TestimonialsSection;
