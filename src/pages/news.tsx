'use client';

import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';

import {api} from '@/services';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
}

interface News {
    data: NewsItem[]
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

const News = () => {
    const [newsItems, setNewsItems] = useState<News>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchNewsItems = async () => {
            try {
                const data = await api.getAllNewsItems();
                setNewsItems(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load news');
            } finally {
                setLoading(false);
            }
        };

        fetchNewsItems();
    }, []);

    const handleNewsItemClick = (id: string) => {
        router.push(`/news/${id}`);
    };

    if (loading) {
        return <div className="text-center py-8">Загрузка новостей...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Ошибка загрузки новостей: {error}
            </div>
        );
    }

    if (newsItems?.data.length === 0) {
        return <div className="text-center py-8">Нет доступных новостей.</div>;
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-3xl  mb-8">Все новости</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {newsItems?.data.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col w-full max-h-96"
                        onClick={() => handleNewsItemClick(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleNewsItemClick(item.id);
                            }
                        }}
                    >
                        <img
                            src={item.coverUrl}
                            alt={item.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="flex flex-col p-4">
                            <h3 className="mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                {item.description.length > 100
                                    ? `${item.description.substring(0, 100)}...`
                                    : item.description}
                            </p>
                            <span className="text-xs brand-col mt-auto">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
