import React from 'react';
import GuideClient from './GuideClient';

interface Category {
  id: number;
  title: string;
  iconUrl?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/guide/categories`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    return [];
  }
}

const GuidePage: React.FC = async () => {
  const categories = await fetchCategories();
  return <GuideClient initialCategories={categories} />;
};

export default GuidePage;