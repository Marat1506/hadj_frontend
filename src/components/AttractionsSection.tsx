'use client';

import {useEffect, useState} from 'react';

import Link from 'next/link';

import {api} from '@/services';

const AttractionsSection = () => {
    const [attractions, setAttractions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                setLoading(true);
                const data = await api.getAllAttractions();
                setAttractions(data);
            } catch (err) {
                setError('Не удалось загрузить достопримечательности.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttractions();
    }, []);

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-6">
                <p>Загрузка достопримечательностей...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container mx-auto px-4 py-6">
                <p className="text-red-500">Ошибка: {error}</p>
            </section>
        );
    }

    if (attractions?.length === 0) {
        return (
            <section className="container mx-auto px-4 py-6">
                <p>Достопримечательности не найдены.</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl flex items-center">
                    Достопримечательности
                </h2>
                <Link href="/attractions" className="text-sm  hover:underline">
                    Все
                </Link>
            </div>

            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex space-x-4">
                    {attractions.map((attraction) => (
                        <Link
                            key={attraction.id}
                            href={`/attractions/${attraction.id}`}
                            className="min-w-[220px] w-[220px] relative rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
                        >
                            <img
                                src={attraction.coverUrl}
                                alt={attraction.alt || attraction.title}
                                className="w-full h-40 object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-4">
                                <h3 className="text-white  text-[14px]">
                                    {attraction.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AttractionsSection;