import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';
import EnhancedImageUpload from '../EnhancedImageUpload';

function GalleryEditor() {
  const { gallery, addGalleryImage, deleteGalleryImage } = useCMS();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' or 'url'
  const [newImage, setNewImage] = useState({
    src: '',
    alt: '',
    metadata: null
  });

  const handleAdd = () => {
    setNewImage({ src: '', alt: '', metadata: null });
    setUploadMethod('upload'); // Default to upload method
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewImage({ src: '', alt: '', metadata: null });
    setUploadMethod('upload');
  };

  const handleSave = async () => {
    if (!newImage.src.trim()) {
      toast.error('Image is required');
      return;
    }

    if (!newImage.alt.trim()) {
      toast.error('Alt text is required');
      return;
    }

    setLoading(true);
    try {
      const imageData = {
        src: newImage.src,
        alt: newImage.alt,
        ...(newImage.metadata && { metadata: newImage.metadata })
      };
      
      await addGalleryImage(imageData);
      toast.success('Image added to gallery successfully');
      handleCancel();
    } catch (error) {
      toast.error('Failed to add image to gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (image) => {
    if (window.confirm('Are you sure you want to delete this image from the gallery?')) {
      setLoading(true);
      try {
        await deleteGalleryImage(image.id);
        toast.success('Image deleted from gallery successfully');
      } catch (error) {
        toast.error('Failed to delete image from gallery');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageUploaded = (url, metadata) => {
    setNewImage(prev => ({ 
      ...prev, 
      src: url, 
      metadata: metadata 
    }));
  };

  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    setNewImage(prev => ({ ...prev, src: '', metadata: null }));
  };

  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('unsplash.com') || url.includes('pexels.com');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your photo gallery. Add or remove images to showcase your work.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Image
        </button>
      </div>

      {/* Add Image Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Add New Image</h3>
            
            {/* Upload Method Selection */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleUploadMethodChange('upload')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    uploadMethod === 'upload'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📤 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => handleUploadMethodChange('url')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    uploadMethod === 'url'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* File Upload Method */}
              {uploadMethod === 'upload' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <EnhancedImageUpload
                    onImageUploaded={handleImageUploaded}
                    currentImageUrl={newImage.src}
                    folder="gallery"
                    maxSizeMB={10}
                    provider="auto"
                    transformations={{
                      width: 1200,
                      quality: 'auto',
                      format: 'auto'
                    }}
                    className=""
                  />
                </div>
              )}

              {/* URL Input Method */}
              {uploadMethod === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={newImage.src}
                    onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter image URL (jpg, png, gif, webp)"
                  />
                  {newImage.src && !isValidImageUrl(newImage.src) && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid image URL</p>
                  )}
                  
                  {/* URL Image Preview */}
                  {newImage.src && isValidImageUrl(newImage.src) && (
                    <div className="mt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">Preview</label>
                      <div className="p-4 rounded-lg border border-gray-300">
                        <img 
                          src={newImage.src} 
                          alt={newImage.alt || 'Preview'} 
                          className="object-cover mx-auto max-w-full h-48 rounded-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="mt-2 text-sm text-center text-gray-500" style={{display: 'none'}}>
                          Failed to load image preview
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Alt Text Input (always visible) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  type="text"
                  value={newImage.alt}
                  onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter descriptive alt text for the image"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Describe what's in the image for accessibility and SEO
                </p>
              </div>

              {/* Image Metadata Display */}
              {newImage.metadata && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image Information</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="capitalize text-orange-600">{newImage.metadata.provider}</span>
                    </div>
                    {newImage.metadata.width && newImage.metadata.height && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{newImage.metadata.width} × {newImage.metadata.height}px</span>
                      </div>
                    )}
                    {newImage.metadata.size && (
                      <div className="flex justify-between">
                        <span>File Size:</span>
                        <span>{(newImage.metadata.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    loading || 
                    !newImage.src || 
                    !newImage.alt || 
                    (uploadMethod === 'url' && !isValidImageUrl(newImage.src))
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Gallery Images ({gallery?.length || 0})
          </h3>
          
          {(!gallery || gallery.length === 0) ? (
            <div className="py-12 text-center">
              <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first image to the gallery.</p>
              <div className="mt-6">
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Image
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="overflow-hidden w-full bg-gray-200 rounded-lg aspect-w-1 aspect-h-1">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-48 transition-opacity group-hover:opacity-75"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-0 rounded-lg transition-all duration-200 group-hover:bg-opacity-50">
                    <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => handleDelete(image)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-red-600 rounded-md border border-transparent hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="mr-1 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Image info */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate" title={image.alt}>
                      {image.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for adding images</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="pl-5 space-y-1 list-disc">
                <li><strong>File Upload:</strong> Automatically optimized via Cloudinary CDN for fast loading</li>
                <li><strong>URL Method:</strong> Use external URLs from image hosting services</li>
                <li>Supported formats: JPG, PNG, GIF, WebP, SVG</li>
                <li>Maximum file size: 10MB (automatically compressed)</li>
                <li>Add descriptive alt text for accessibility and SEO</li>
                <li>Images are automatically resized and optimized for web delivery</li>
                <li>Free CDN storage with global fast delivery network</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryEditor;