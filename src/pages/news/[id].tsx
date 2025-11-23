'use client';

import React, {useEffect, useState} from 'react';

import moment from 'moment';
import {useParams, useRouter} from 'next/navigation';

import {api} from '@/services';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
    additionalInformation?: string;
}

const Id = () => {
    const params = useParams();
    const id = params?.id;
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const fetchNewsItem = async () => {
            try {
                const data = await api.getSingleNewsItem(id);
                setNewsItem(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load news item');
            } finally {
                setLoading(false);
            }
        };

        fetchNewsItem();
    }, [id]);

    if (loading) {
        return <div className="text-center py-8">Загрузка новости...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (!newsItem) {
        return <div className="text-center py-8">Новость не найдена</div>;
    }

    return (
        <div className="container mx-auto max-w-4xl px-2 md:px-0 py-5">
            <button
                onClick={() => router.push('/news')} 
                className="flex items-center gap-2 hover:bg-blue-100 px-4 rounded-lg font-semibold mb-4 transition-colors"
            >
                <span className="text-2xl leading-none">←</span>
                <span>Назад к новостям</span>
            </button>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <img
                    src={newsItem.coverUrl}
                    alt={newsItem.title}
                    className="w-full h-64 object-cover"
                    style={{filter: 'none'}}
                />
                <div className="p-6">
                    <h1 className="text-3xl  mb-2 text-gray-900">{newsItem.title}</h1>
                    <div className="flex items-center text-sm text-gray-400 mb-4 gap-4">
                        <span>{moment(newsItem.createdAt).subtract(10, 'days').calendar()}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full inline-block"></span>
                    </div>
                    <div className="prose max-w-none text-gray-800 mb-8">
                        <p>{newsItem.description}</p>
                    </div>
                    {newsItem.additionalInformation && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800">Дополнительная информация</h2>
                            <div className="text-gray-500 text-sm">{newsItem.additionalInformation}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Id;
