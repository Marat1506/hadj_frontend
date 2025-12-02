import { MetadataRoute } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dubliz.store';

async function getNewsItems() {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
    return [];
  }
}

async function getAttractions() {
  try {
    const res = await fetch(`${API_BASE_URL}/attractions`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching attractions for sitemap:', error);
    return [];
  }
}

async function getCities() {
  try {
    const res = await fetch(`${API_BASE_URL}/cities`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching cities for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsItems = await getNewsItems();
  const attractions = await getAttractions();
  const cities = await getCities();

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/hajj`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/umrah`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/navigation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Динамические страницы новостей
  const newsPages: MetadataRoute.Sitemap = newsItems.map((item: any) => ({
    url: `${SITE_URL}/news/${item.id}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Динамические страницы достопримечательностей
  const attractionPages: MetadataRoute.Sitemap = attractions.map((item: any) => ({
    url: `${SITE_URL}/attractions/${item.id}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Динамические страницы городов
  const cityPages: MetadataRoute.Sitemap = cities.map((item: any) => ({
    url: `${SITE_URL}/cities/${item.id}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages, ...attractionPages, ...cityPages];
}
