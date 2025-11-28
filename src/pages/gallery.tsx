import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import axios from 'axios';
import PageHeader from '@/components/PageHeader';
import { GridSkeleton } from '@/components/ui/loading-skeletons';

interface GalleryItem {
  id: number;
  mediaType: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
  order: number;
  createdAt: string;
}

const GalleryPage: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/gallery`);
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Не удалось загрузить галерею. Попробуйте обновить страницу.');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Галерея - NHK</title>
        <meta name="description" content="Галерея фотографий и видео" />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <div>
          <PageHeader title="Галерея" onBack={handleBackClick} />
          
          {loading && <GridSkeleton count={6} />}

          {error && (
            <div className="text-center py-8">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Галерея пуста</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <GalleryGrid items={items} />
          )}
        </div>
      </main>
    </>
  );
};

export default GalleryPage;
