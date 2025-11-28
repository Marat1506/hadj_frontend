'use client';

import {useEffect, useState} from 'react';

import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {api} from '@/services';
import { NewsSkeleton } from './ui/loading-skeletons';

interface NewsItem {
    additionalInformation: string;
    cover: string;
    coverUrl: string;
    createdAt: string;
    description: string;
    id: number;
    title: string;
    updatedAt: string;
}

interface News {
    data: NewsItem[];
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

const NewsSection = () => {
    const router = useRouter();
    const [newsItems, setNewsItems] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchNewsItems = async () => {
            try {
                const data = await api.getAllNewsItems();
                setNewsItems(data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsItems();
    }, []);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}.${month}.${year}`;
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-1">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl flex items-center">Новости</h2>
                </div>
                <NewsSkeleton />
            </section>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Ошибка загрузки новостей: {error.message}
            </div>
        );
    }

    if (newsItems?.data.length === 0) {
        return <div className="text-center py-8">Нет доступных новостей.</div>;
    }

    return (
        <section className="container mx-auto px-4 py-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl flex items-center">Новости</h2>
                <Link
                    href="/news"
                    className="text-sm hover:underline"
                >
                    Все
                </Link>
            </div>

            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex space-x-4">
                    {newsItems?.data.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="min-w-[280px] w-80 h-96 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col"
                            onClick={() => router.push(`/news/${item.id || index + 1}`)}
                        >
                            <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="flex flex-col flex-1 p-4">
                                <h3 className=" mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 flex-1">
                                    {item.description}
                                </p>
                                <span className="text-xs text-gray-500 mt-auto">
                  {formatDate(item.createdAt)}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
