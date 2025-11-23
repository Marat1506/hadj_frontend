import React, { useEffect } from 'react';

interface LightboxImage {
  url: string;
  title?: string;
  description?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onPrevious, onNext }) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onPrevious, onNext]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          fontSize: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          zIndex: 10001
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
      >
        ×
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          style={{
            position: 'absolute',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 10001
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          style={{
            position: 'absolute',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 10001
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ›
        </button>
      )}

      {/* Image container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img
          src={currentImage.url}
          alt={currentImage.title || 'Gallery image'}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(90vh - 100px)',
            objectFit: 'contain',
            borderRadius: '4px'
          }}
        />
        
        {(currentImage.title || currentImage.description) && (
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            color: 'white',
            maxWidth: '600px'
          }}>
            {currentImage.title && (
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>
                {currentImage.title}
              </h3>
            )}
            {currentImage.description && (
              <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
                {currentImage.description}
              </p>
            )}
          </div>
        )}

        {images.length > 1 && (
          <div style={{
            marginTop: '16px',
            color: 'white',
            fontSize: '0.9rem',
            opacity: 0.7
          }}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
