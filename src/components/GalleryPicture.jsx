import React from 'react';
import cloudinaryService from '../services/cloudinaryService';

export default function GalleryPicture({ path, alt, title, className = "" }) {
  const rawPath = path || '';
  
  // Generate optimized image URL if it's a Cloudinary URL
  const getOptimizedImageUrl = (url) => {
    if (cloudinaryService.isCloudinaryUrl(url)) {
      const publicId = cloudinaryService.extractPublicId(url);
      if (publicId) {
        return cloudinaryService.generateImageUrl(publicId, {
          width: 400,
          height: 300,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
          gravity: 'auto'
        });
      }
    }
    // For non-Cloudinary URLs, use as-is
    return (rawPath.startsWith('http') || rawPath.includes('/')) ? rawPath : `gallery/${rawPath}`;
  };
  
  const imagePath = getOptimizedImageUrl(rawPath);
  
  // If we have visible caption text (alt or title), make the image decorative
  const hasCaption = alt || title;
  const imageAlt = hasCaption ? '' : 'Gallery image';
  
  if (hasCaption) {
    return (
      <figure className={`relative group font-Sora ${className}`}>
        <img 
          src={imagePath} 
          alt="" 
          role="presentation"
          className="w-full h-64 md:h-80 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          width="400"
          height="300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
          <div className="absolute bottom-4 left-4 right-4">
            <figcaption className="text-white text-lg font-semibold">
              {alt || title}
            </figcaption>
          </div>
        </div>
      </figure>
    );
  }
  
  return (
    <div className={`relative group font-Sora ${className}`}>
      <img 
        src={imagePath} 
        alt={imageAlt}
        className="w-full h-64 md:h-80 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        width="400"
        height="300"
        loading="lazy"
      />
    </div>
  );
}