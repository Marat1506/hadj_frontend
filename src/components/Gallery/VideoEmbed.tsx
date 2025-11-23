import React from 'react';

interface VideoEmbedProps {
  videoId: string;
  title?: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId, title }) => {
  return (
    <div style={{
      position: 'relative',
      paddingTop: '56.25%', // 16:9 aspect ratio
      width: '100%',
      backgroundColor: '#000'
    }}>
      <iframe
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0
        }}
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoEmbed;
