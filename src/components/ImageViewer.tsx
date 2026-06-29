import React from 'react';

interface ImageViewerProps {
  src: string | null;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ src }) => {
  if (!src) return null;

  return (
    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
      <img 
        src={`${import.meta.env.BASE_URL}${src}`} 
        alt="Question visualization" 
        style={{
          maxWidth: '100%',
          maxHeight: '400px',
          objectFit: 'contain',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
        }}
      />
    </div>
  );
};
