import React, { useState } from 'react';
import Lightbox from './Lightbox';
import VideoEmbed from './VideoEmbed';

interface GalleryItem {
  id: number;
  mediaType: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageItems = items.filter(item => item.mediaType === 'image');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const handleImageClick = (item: GalleryItem) => {
    const index = imageItems.findIndex(img => img.id === item.id);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageItems.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < imageItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        padding: '20px 0'
      }}>
        {items.map((item) => (
          <div key={item.id} style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: item.mediaType === 'image' ? 'pointer' : 'default'
          }}
          onMouseEnter={(e) => {
            if (item.mediaType === 'image') {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (item.mediaType === 'image') {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
          }}
          onClick={() => item.mediaType === 'image' && handleImageClick(item)}
          >
            {item.mediaType === 'image' ? (
              <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#f5f5f5' }}>
                <img
                  src={`${apiUrl}/gallery/image/${item.mediaUrl}`}
                  alt={item.title || 'Gallery image'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                />
              </div>
            ) : (
              <VideoEmbed videoId={item.mediaUrl} title={item.title} />
            )}
            
            {(item.title || item.description) && (
              <div style={{ padding: '16px', backgroundColor: '#fff' }}>
                {item.title && (
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#333' }}>
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && imageItems.length > 0 && (
        <Lightbox
          images={imageItems.map(item => ({
            url: `${apiUrl}/gallery/image/${item.mediaUrl}`,
            title: item.title,
            description: item.description
          }))}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </>
  );
};

export default GalleryGrid;
