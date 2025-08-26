import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import cloudinaryService from '../services/cloudinaryService';
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

function EnhancedImageUpload({ 
  onImageUploaded, 
  currentImageUrl = '', 
  folder = 'gallery',
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  provider = 'cloudinary', // 'cloudinary' | 'firebase' | 'auto'
  transformations = {},
  showProviderInfo = true,
  className = ''
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [imageData, setImageData] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize preview URL when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== previewUrl) {
      setPreviewUrl(currentImageUrl);
      
      // If it's a Cloudinary URL, extract metadata
      if (cloudinaryService.isCloudinaryUrl(currentImageUrl)) {
        const publicId = cloudinaryService.extractPublicId(currentImageUrl);
        if (publicId) {
          setImageData({
            url: currentImageUrl,
            publicId: publicId,
            provider: 'cloudinary'
          });
        }
      } else if (currentImageUrl) {
        // For non-Cloudinary URLs (Firebase or external)
        setImageData({
          url: currentImageUrl,
          provider: 'external'
        });
      }
    } else if (!currentImageUrl && previewUrl) {
      // Clear preview if currentImageUrl is empty
      setPreviewUrl('');
      setImageData(null);
    }
  }, [currentImageUrl, previewUrl]);

  const detectBestProvider = () => {
    // Auto-detect best provider based on configuration and file size
    if (provider === 'auto') {
      try {
        // Check if Cloudinary is configured
        cloudinaryService.validateConfiguration();
        return 'cloudinary'; // Prefer Cloudinary for better optimization
      } catch (error) {
        console.warn('Cloudinary not configured, falling back to Firebase:', error.message);
        return 'firebase';
      }
    }
    return provider;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    const selectedProvider = detectBestProvider();
    
    try {
      if (selectedProvider === 'cloudinary') {
        await uploadToCloudinary(file);
      } else {
        await uploadToFirebase(file);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate progress for Cloudinary (they don't provide real-time progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const uploadOptions = {
        tags: [folder, 'bcs-visa'],
        context: {
          uploadedBy: 'bcs-cms',
          originalName: file.name
        }
      };

      const result = await cloudinaryService.uploadImage(file, folder, uploadOptions);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Generate optimized URL with transformations
      const optimizedUrl = cloudinaryService.generateImageUrl(result.publicId, {
        width: 1200,
        quality: 'auto',
        format: 'auto',
        crop: 'limit',
        ...transformations
      });

      const imageMetadata = {
        url: optimizedUrl,
        publicId: result.publicId,
        provider: 'cloudinary',
        originalUrl: result.url,
        width: result.width,
        height: result.height,
        size: result.size,
        format: result.format,
        folder: result.folder,
        createdAt: result.createdAt
      };

      setPreviewUrl(optimizedUrl);
      setImageData(imageMetadata);

      // Call the callback with both URL and metadata
      onImageUploaded(optimizedUrl, imageMetadata);

      toast.success('Image uploaded and optimized successfully via Cloudinary');
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadToFirebase = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Firebase upload failed:', error);
            reject(new Error(`Firebase upload failed: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              const imageMetadata = {
                url: downloadURL,
                provider: 'firebase',
                path: `${folder}/${filename}`,
                size: file.size,
                type: file.type,
                name: file.name
              };

              setPreviewUrl(downloadURL);
              setImageData(imageMetadata);

              onImageUploaded(downloadURL, imageMetadata);

              toast.success('Image uploaded successfully via Firebase');
              resolve(imageMetadata);
            } catch (error) {
              console.error('Failed to get download URL:', error);
              reject(new Error('Failed to get image URL'));
            } finally {
              setUploading(false);
              setUploadProgress(0);
            }
          }
        );
      });
    } catch (error) {
      console.error('Firebase upload error:', error);
      throw error;
    }
  };

  const handleRemoveImage = async () => {
    if (!previewUrl) return;

    const confirmDelete = window.confirm('Are you sure you want to remove this image?');
    if (!confirmDelete) return;

    try {
      let deletionResult = { success: false };
      
      if (imageData?.provider === 'cloudinary' && imageData.publicId) {
        console.log('Attempting to delete Cloudinary image:', imageData.publicId);
        deletionResult = await cloudinaryService.deleteImage(imageData.publicId);
        
        if (deletionResult.success) {
          if (deletionResult.result === 'already_marked') {
            toast.info('Image was already marked for deletion');
          } else {
            toast.success(
              `Image marked for deletion (${deletionResult.pendingCount} pending cleanup)`,
              {
                autoClose: 5000,
                hideProgressBar: false
              }
            );
            
            // Show additional info about manual cleanup
            setTimeout(() => {
              toast.info(
                '💡 Tip: Use Admin Tools to manage pending deletions in Cloudinary dashboard',
                { autoClose: 7000 }
              );
            }, 2000);
          }
        } else {
          console.warn('Cloudinary deletion failed:', deletionResult.error);
          toast.warning('Image removed from form. Manual cleanup may be needed in Cloudinary.');
        }
      } else if (imageData?.provider === 'firebase' && imageData.path) {
        const imageRef = ref(storage, imageData.path);
        await deleteObject(imageRef);
        deletionResult.success = true;
        toast.success('Image removed from Firebase successfully');
      } else {
        // External URL or no provider info
        deletionResult.success = true;
        toast.success('Image removed from form');
      }
      
      // Always clear the UI state regardless of deletion success
      setPreviewUrl('');
      setImageData(null);
      onImageUploaded('', null);
      
    } catch (error) {
      console.error('Failed to remove image:', error);
      
      // Still clear the UI state even if deletion fails
      setPreviewUrl('');
      setImageData(null);
      onImageUploaded('', null);
      
      toast.warning('Image removed from form, but deletion from storage may have failed. You may need to manually clean up the image.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-200 hover:border-orange-400">
        {previewUrl ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-48 object-cover rounded-lg mx-auto shadow-md"
                onError={(e) => {
                  const failedUrl = e.target.src;
                  console.error('Failed to load preview image:', failedUrl);
                  
                  // If it's a Cloudinary URL, try to extract public ID and create a simpler URL
                  if (cloudinaryService.isCloudinaryUrl(failedUrl)) {
                    const publicId = cloudinaryService.extractPublicId(failedUrl);
                    if (publicId) {
                      console.log('Extracted public ID:', publicId, 'trying simpler URL...');
                      // Try a simpler URL without transformations
                      const simpleUrl = `https://res.cloudinary.com/${cloudinaryService.cloudName}/image/upload/${publicId}`;
                      if (failedUrl !== simpleUrl) {
                        console.log('Retrying with simple URL:', simpleUrl);
                        e.target.src = simpleUrl;
                        return;
                      }
                    }
                  }
                  
                  // If retry failed or not a Cloudinary URL, show placeholder
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzEyNy42MTQgMTUwIDE1MCAxMjcuNjE0IDE1MCAxMDBTMTI3LjYxNCA1MCAxMDAgNTBTNTAgNzIuMzg2IDUwIDEwMFM3Mi4zODYgMTUwIDEwMCAxNTBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNODUgOTBIMTE1TTg1IDExMEgxMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjc5IiBmb250LXNpemU9IjEyIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPgo=';
                  e.target.alt = 'Image preview failed to load';
                  
                  // Show an error message
                  if (!document.querySelector('.image-error-message')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'image-error-message mt-2 text-sm text-red-600 text-center';
                    errorDiv.textContent = `Failed to load image: ${publicId || 'Invalid URL'}`;
                    e.target.parentNode.appendChild(errorDiv);
                  }
                }}
                onLoad={(e) => {
                  // Remove error message if image loads successfully
                  const errorMsg = e.target.parentNode.querySelector('.image-error-message');
                  if (errorMsg) {
                    errorMsg.remove();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                title="Remove image"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Image Metadata */}
            {showProviderInfo && imageData && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Provider:</span>
                  <span className="capitalize text-orange-600">{imageData.provider}</span>
                </div>
                {imageData.width && imageData.height && (
                  <div className="flex justify-between">
                    <span className="font-medium">Dimensions:</span>
                    <span>{imageData.width} × {imageData.height}px</span>
                  </div>
                )}
                {imageData.size && (
                  <div className="flex justify-between">
                    <span className="font-medium">Size:</span>
                    <span>{formatFileSize(imageData.size)}</span>
                  </div>
                )}
                {imageData.format && (
                  <div className="flex justify-between">
                    <span className="font-medium">Format:</span>
                    <span className="uppercase">{imageData.format}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Replace Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className="px-4 py-2 border border-orange-300 rounded-md text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Replace Image
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Upload Icon */}
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Upload Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
            
            {/* File Info */}
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG, WebP up to {maxSizeMB}MB
              {showProviderInfo && (
                <span className="block mt-1">
                  Optimized via <span className="font-medium text-orange-600">{detectBestProvider()}</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Uploading and optimizing...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select image file"
      />
    </div>
  );
}

export default EnhancedImageUpload;