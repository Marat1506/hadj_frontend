'use client';

import React, {useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';
import {FaChevronLeft} from 'react-icons/fa';

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
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center mb-6">
                    <div className="flex items-center">
                        <button className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10" onClick={() => router.push('/')}>
                            <FaChevronLeft/>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Новости</h1>
                    </div>
                </header>

                <div className="flex-1">
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
            </div>
        </div>
    );
};

export default News;
