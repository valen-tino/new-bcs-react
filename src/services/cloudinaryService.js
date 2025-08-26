// Cloudinary CDN Service
// Handles image uploads, deletions, and URL generation with optimization
class CloudinaryService {
  constructor() {
    // Load configuration from environment variables for security
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    this.apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'bcs_visa_images';
    
    // Validate required configuration
    this.validateConfiguration();
  }

  validateConfiguration() {
    const requiredVars = {
      cloudName: this.cloudName,
      apiKey: this.apiKey,
      uploadPreset: this.uploadPreset
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error('Missing Cloudinary configuration:', missingVars);
      throw new Error(`Missing Cloudinary configuration: ${missingVars.join(', ')}`);
    }
  }

  /**
   * Upload an image to Cloudinary with automatic optimization
   * @param {File} file - The image file to upload
   * @param {string} folder - The folder to organize images
   * @param {Object} options - Additional upload options
   * @returns {Promise<Object>} Upload result with URLs and metadata
   */
  async uploadImage(file, folder = 'gallery', options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);
    
    // Automatic optimization settings
    formData.append('quality', 'auto');
    formData.append('fetch_format', 'auto');
    formData.append('crop', 'limit');
    formData.append('width', '1920'); // Max width for optimization
    formData.append('height', '1080'); // Max height for optimization
    
    // Additional options
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    
    if (options.context) {
      formData.append('context', Object.entries(options.context)
        .map(([key, value]) => `${key}=${value}`)
        .join('|'));
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${errorData}`);
      }

      const data = await response.json();
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        size: data.bytes,
        version: data.version,
        createdAt: data.created_at,
        etag: data.etag,
        folder: data.folder,
        originalFilename: data.original_filename
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Generate optimized image URL with transformations
   * @param {string} publicId - The Cloudinary public ID
   * @param {Object} transformations - Image transformation options
   * @returns {string} Optimized image URL
   */
  generateImageUrl(publicId, transformations = {}) {
    if (!publicId || !this.cloudName) {
      throw new Error('Public ID and cloud name are required');
    }

    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      gravity = 'auto',
      effect,
      angle,
      radius,
      background,
      opacity,
      overlay,
      fetchFormat = 'auto'
    } = transformations;

    let transformArray = [];
    
    // Quality and format optimization (these should come first)
    if (quality) transformArray.push(`q_${quality}`);
    if (format !== 'auto') {
      transformArray.push(`f_${format}`);
    } else {
      transformArray.push('f_auto');
    }
    
    // Dimensions and cropping
    if (width || height) {
      transformArray.push(`c_${crop}`);
      if (width) transformArray.push(`w_${width}`);
      if (height) transformArray.push(`h_${height}`);
      if (gravity && (width || height)) transformArray.push(`g_${gravity}`);
    }
    
    // Additional effects
    if (effect) transformArray.push(`e_${effect}`);
    if (angle) transformArray.push(`a_${angle}`);
    if (radius) transformArray.push(`r_${radius}`);
    if (background) transformArray.push(`b_${background}`);
    if (opacity) transformArray.push(`o_${opacity}`);
    if (overlay) transformArray.push(`l_${overlay}`);

    const transformString = transformArray.join(',');
    
    // Only add transformation string if we have transformations
    if (transformString) {
      return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformString}/${publicId}`;
    } else {
      return `https://res.cloudinary.com/${this.cloudName}/image/upload/${publicId}`;
    }
  }

  /**
   * Generate responsive image URLs for different screen sizes
   * @param {string} publicId - The Cloudinary public ID
   * @param {Object} baseTransformations - Base transformations to apply
   * @returns {Object} Object with URLs for different breakpoints
   */
  generateResponsiveUrls(publicId, baseTransformations = {}) {
    const breakpoints = {
      mobile: { width: 480, height: 320 },
      tablet: { width: 768, height: 512 },
      desktop: { width: 1200, height: 800 },
      large: { width: 1920, height: 1080 }
    };

    const responsiveUrls = {};

    Object.entries(breakpoints).forEach(([breakpoint, dimensions]) => {
      responsiveUrls[breakpoint] = this.generateImageUrl(publicId, {
        ...baseTransformations,
        ...dimensions,
        crop: 'fill',
        gravity: 'auto'
      });
    });

    return responsiveUrls;
  }

  /**
   * Delete an image from Cloudinary
   * Uses tracking-based deletion due to client-side security limitations
   * @param {string} publicId - The Cloudinary public ID to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    if (!publicId) {
      throw new Error('Public ID is required for deletion');
    }

    try {
      console.log('Processing deletion request for:', publicId);
      
      // Store the public ID in localStorage for manual cleanup reference
      const deletedImages = JSON.parse(localStorage.getItem('bcs_deleted_images') || '[]');
      
      // Check if already marked for deletion
      const existingEntry = deletedImages.find(img => img.publicId === publicId);
      if (existingEntry) {
        return {
          success: true,
          result: 'already_marked',
          publicId: publicId,
          message: 'Image already marked for deletion'
        };
      }
      
      // Add to deletion tracking
      deletedImages.push({
        publicId: publicId,
        deletedAt: new Date().toISOString(),
        status: 'marked_for_deletion',
        url: `https://res.cloudinary.com/${this.cloudName}/image/upload/${publicId}`
      });
      
      localStorage.setItem('bcs_deleted_images', JSON.stringify(deletedImages));
      
      // Provide clear feedback to user
      console.log(`Image ${publicId} marked for deletion. Total pending: ${deletedImages.length}`);
      
      return {
        success: true,
        result: 'marked_for_deletion',
        publicId: publicId,
        pendingCount: deletedImages.length,
        message: `Image marked for deletion. Please clean up manually in Cloudinary dashboard.`,
        dashboardUrl: `https://console.cloudinary.com/console/${this.cloudName}/media_library/search?q=${publicId}`
      };
      
    } catch (error) {
      console.error('Failed to process image deletion:', error);
      return {
        success: false,
        error: error.message,
        publicId: publicId
      };
    }
  }

  /**
   * Get list of images marked for deletion
   * @returns {Array} List of images marked for deletion
   */
  getImagesMarkedForDeletion() {
    return JSON.parse(localStorage.getItem('bcs_deleted_images') || '[]');
  }

  /**
   * Clear the list of deleted images (after manual cleanup)
   */
  clearDeletedImagesList() {
    localStorage.removeItem('bcs_deleted_images');
  }

  /**
   * Get image information and metadata
   * @param {string} publicId - The Cloudinary public ID
   * @returns {Promise<Object>} Image information
   */
  async getImageInfo(publicId) {
    try {
      const response = await fetch(
        `https://res.cloudinary.com/${this.cloudName}/image/upload/${publicId}.json`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image info');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get image info:', error);
      throw error;
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param {string} url - Cloudinary URL
   * @returns {string|null} Public ID or null if not a Cloudinary URL
   */
  extractPublicId(url) {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    try {
      // Handle different Cloudinary URL formats
      // Format: https://res.cloudinary.com/cloudname/image/upload/[transformations]/publicId
      // Format: https://res.cloudinary.com/cloudname/image/upload/publicId
      
      // Remove query parameters first
      const cleanUrl = url.split('?')[0];
      
      // Split by '/upload/' to get the part after upload
      const uploadIndex = cleanUrl.indexOf('/upload/');
      if (uploadIndex === -1) {
        return null;
      }
      
      const afterUpload = cleanUrl.substring(uploadIndex + 8); // 8 = length of '/upload/'
      
      // Split by '/' to handle transformations
      const parts = afterUpload.split('/');
      
      // If there's only one part, it's the publicId
      if (parts.length === 1) {
        // Remove file extension if present
        return parts[0].split('.')[0];
      }
      
      // If there are multiple parts, the last part is usually the publicId
      // unless it starts with 'v' followed by numbers (version)
      let publicId = parts[parts.length - 1];
      
      // Handle versioned URLs - if last part is version, take the second to last
      if (parts.length > 1 && /^v\d+$/.test(publicId)) {
        publicId = parts[parts.length - 2];
      }
      
      // Remove file extension if present
      return publicId.split('.')[0];
      
    } catch (error) {
      console.error('Error extracting public ID from URL:', url, error);
      return null;
    }
  }

  /**
   * Check if URL is a Cloudinary URL
   * @param {string} url - URL to check
   * @returns {boolean} True if Cloudinary URL
   */
  isCloudinaryUrl(url) {
    return url && url.includes('cloudinary.com');
  }

  /**
   * Validate a Cloudinary URL by checking if the image exists
   * @param {string} url - Cloudinary URL to validate
   * @returns {Promise<boolean>} True if image exists and is accessible
   */
  async validateCloudinaryUrl(url) {
    if (!this.isCloudinaryUrl(url)) {
      return false;
    }

    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Failed to validate Cloudinary URL:', url, error);
      return false;
    }
  }

  /**
   * Get a fallback URL for a failed Cloudinary image
   * @param {string} url - Original failed URL
   * @returns {string|null} Simplified URL or null if cannot create fallback
   */
  getFallbackUrl(url) {
    if (!this.isCloudinaryUrl(url)) {
      return null;
    }

    const publicId = this.extractPublicId(url);
    if (!publicId) {
      return null;
    }

    // Return simple URL without transformations
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${publicId}`;
  }
}

export default new CloudinaryService();