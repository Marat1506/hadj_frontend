'use client';

import React, {useEffect, useState} from 'react';

import moment from 'moment';
import {useParams, useRouter} from 'next/navigation';
import {FaChevronLeft} from 'react-icons/fa';

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
        <div className="min-h-screen bg-white flex flex-col pb-16">
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center pb-4 mb-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <button className="mr-3 text-blue-800 hover:text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center w-10 h-10" onClick={() => router.push('/news')}>
                            <FaChevronLeft/>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Назад</h1>
                    </div>
                </header>

                <div className="flex-1">
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
                    <div className="prose max-w-none text-gray-800">
                        <p>{newsItem.description}</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Id;
