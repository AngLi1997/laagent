import React, { memo } from 'react';

interface ImageGalleryProps {
  srcs: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = memo(({ srcs }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {srcs.map((src, index) => (
        <img
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          src={src}
          alt={`Image ${index + 1}`}
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
        />
      ))}
    </div>
  );
});

export default ImageGallery;
