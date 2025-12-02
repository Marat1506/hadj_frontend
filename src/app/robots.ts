import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dubliz.store';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/balance',
          '/checklist',
          '/medical-card',
          '/companions',
          '/data-verification',
          '/api/',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/profile',
          '/balance',
          '/checklist',
          '/medical-card',
          '/companions',
          '/data-verification',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/profile',
          '/balance',
          '/checklist',
          '/medical-card',
          '/companions',
          '/data-verification',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
