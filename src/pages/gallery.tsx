import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import axios from 'axios';

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
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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

  return (
    <>
      <Head>
        <title>Галерея - NHK</title>
        <meta name="description" content="Галерея фотографий и видео" />
      </Head>
      <main style={{ minHeight: '70vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', color: '#333' }}>
            Галерея
          </h1>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Загрузка...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#d32f2f' }}>{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Галерея пуста</p>
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
