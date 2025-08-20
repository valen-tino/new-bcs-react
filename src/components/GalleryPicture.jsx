import React from 'react';

export default function GalleryPicture({ path, alt, title, className = "" }) {
  const rawPath = path || '';
  const imagePath = (rawPath.startsWith('http') || rawPath.includes('/')) ? rawPath : `gallery/${rawPath}`;
  
  return (
    <div className={`relative group ${className}`}>
      <img 
        src={imagePath} 
        alt={alt || title || 'Gallery image'} 
        className="w-full h-64 md:h-80 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
      />
      {(alt || title) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-semibold">
              {alt || title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}