// Migration Helper for Cloudinary CDN
// This script helps migrate existing external images to Cloudinary for better performance

import cloudinaryService from '../services/cloudinaryService.js';

/**
 * Migrate an image URL to Cloudinary by uploading it
 * @param {string} imageUrl - External image URL to migrate
 * @param {string} folder - Cloudinary folder to store the image
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<Object>} Migration result
 */
export async function migrateImageToCloudinary(imageUrl, folder = 'migrated', publicId = null) {
  try {
    // Fetch the image from the external URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert to blob
    const blob = await response.blob();
    
    // Create a File object from the blob
    const filename = publicId || imageUrl.split('/').pop().split('?')[0] || 'migrated_image';
    const file = new File([blob], filename, { type: blob.type });

    // Upload to Cloudinary
    const uploadOptions = {
      tags: ['migrated', 'external'],
      context: {
        originalUrl: imageUrl,
        migratedAt: new Date().toISOString()
      }
    };

    const result = await cloudinaryService.uploadImage(file, folder, uploadOptions);
    
    return {
      success: true,
      originalUrl: imageUrl,
      newUrl: result.url,
      publicId: result.publicId,
      size: result.size,
      format: result.format,
      optimizedSize: Math.round((result.size / blob.size) * 100) + '%'
    };
  } catch (error) {
    console.error('Migration failed for:', imageUrl, error);
    return {
      success: false,
      originalUrl: imageUrl,
      error: error.message
    };
  }
}

/**
 * Batch migrate multiple images
 * @param {Array<string>} imageUrls - Array of image URLs to migrate
 * @param {string} folder - Cloudinary folder
 * @param {Function} progressCallback - Optional progress callback
 * @returns {Promise<Array>} Migration results
 */
export async function batchMigrateImages(imageUrls, folder = 'migrated', progressCallback = null) {
  const results = [];
  const total = imageUrls.length;

  for (let i = 0; i < total; i++) {
    const url = imageUrls[i];
    console.log(`Migrating ${i + 1}/${total}: ${url}`);
    
    if (progressCallback) {
      progressCallback({
        current: i + 1,
        total,
        url,
        progress: Math.round(((i + 1) / total) * 100)
      });
    }

    const result = await migrateImageToCloudinary(url, folder);
    results.push(result);

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Migrate gallery images from Firebase/External to Cloudinary
 * @param {Array} galleryItems - Gallery items with src URLs
 * @returns {Promise<Array>} Updated gallery items with new URLs
 */
export async function migrateGalleryImages(galleryItems) {
  const updatedItems = [];
  
  for (const item of galleryItems) {
    if (item.src && !cloudinaryService.isCloudinaryUrl(item.src)) {
      console.log(`Migrating gallery image: ${item.alt || 'Untitled'}`);
      
      const migrationResult = await migrateImageToCloudinary(
        item.src, 
        'gallery',
        `gallery_${item.id}`
      );

      if (migrationResult.success) {
        updatedItems.push({
          ...item,
          src: migrationResult.newUrl,
          metadata: {
            provider: 'cloudinary',
            publicId: migrationResult.publicId,
            originalUrl: migrationResult.originalUrl,
            migratedAt: new Date().toISOString()
          }
        });
      } else {
        // Keep original if migration failed
        updatedItems.push(item);
        console.warn(`Failed to migrate: ${item.src}`);
      }
    } else {
      // Already Cloudinary or invalid URL
      updatedItems.push(item);
    }
  }

  return updatedItems;
}

/**
 * Generate migration report
 * @param {Array} migrationResults - Results from migration operations
 * @returns {Object} Migration statistics
 */
export function generateMigrationReport(migrationResults) {
  const successful = migrationResults.filter(r => r.success);
  const failed = migrationResults.filter(r => !r.success);
  
  const totalOriginalSize = migrationResults.reduce((sum, r) => {
    return sum + (r.originalSize || 0);
  }, 0);
  
  const totalOptimizedSize = successful.reduce((sum, r) => {
    return sum + (r.size || 0);
  }, 0);

  return {
    total: migrationResults.length,
    successful: successful.length,
    failed: failed.length,
    successRate: Math.round((successful.length / migrationResults.length) * 100),
    spaceSaved: totalOriginalSize - totalOptimizedSize,
    spaceSavedPercentage: totalOriginalSize > 0 ? 
      Math.round(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100) : 0,
    failedUrls: failed.map(f => ({ url: f.originalUrl, error: f.error }))
  };
}

// Example usage:
export async function exampleMigration() {
  // Example: Migrate a single image
  const singleResult = await migrateImageToCloudinary(
    'https://example.com/image.jpg',
    'gallery'
  );
  console.log('Single migration result:', singleResult);

  // Example: Migrate multiple images with progress tracking
  const imageUrls = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ];

  const batchResults = await batchMigrateImages(
    imageUrls,
    'migrated',
    (progress) => {
      console.log(`Progress: ${progress.progress}% (${progress.current}/${progress.total})`);
    }
  );

  const report = generateMigrationReport(batchResults);
  console.log('Migration Report:', report);
}

export default {
  migrateImageToCloudinary,
  batchMigrateImages,
  migrateGalleryImages,
  generateMigrationReport,
  exampleMigration
};