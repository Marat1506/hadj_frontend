import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { api } from '@/services';

const Attractions: React.FC = () => {
    const router = useRouter();
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

    if (attractions.length === 0) {
        return (
            <section className="container mx-auto px-4 py-6">
                <p>Достопримечательности не найдены.</p>
            </section>
        );
    }
    return (
        <div className="container mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-3xl  mb-8">Все достопримечательности</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {attractions.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => router.push(`/attractions/${item.id}`)}
                        className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition flex flex-col w-full h-80 group"
                    >
                        <div className="relative h-44 w-full overflow-hidden">
                            <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div
                                className="text-white absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <h3 className="text-lg  drop-shadow-lg">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                        <div className="px-5 p-3">

                        <h3 className="text-lg  drop-shadow-lg line-clamp-4">
                                {item.description}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Attractions;
