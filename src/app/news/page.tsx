import React from 'react';
import NewsClient from './NewsClient';

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

async function getNewsItems(): Promise<News> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${API_BASE_URL}/news`, {
        next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
        throw new Error('Failed to fetch news');
    }
    
    return res.json();
}

const News = async () => {
    const newsItems = await getNewsItems();

    return <NewsClient newsItems={newsItems} />;
};

export default News;
