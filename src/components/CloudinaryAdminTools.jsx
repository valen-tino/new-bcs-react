import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import cloudinaryService from '../services/cloudinaryService';

function CloudinaryAdminTools() {
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    loadDeletedImages();
    loadDebugInfo();
  }, []);

  const loadDeletedImages = () => {
    const images = cloudinaryService.getImagesMarkedForDeletion();
    setDeletedImages(images);
  };

  const loadDebugInfo = () => {
    try {
      cloudinaryService.validateConfiguration();
      setDebugInfo({
        cloudName: cloudinaryService.cloudName,
        configured: true,
        error: null
      });
    } catch (error) {
      setDebugInfo({
        cloudName: null,
        configured: false,
        error: error.message
      });
    }
  };

  const testImageUrl = async (url) => {
    try {
      const isValid = await cloudinaryService.validateCloudinaryUrl(url);
      const publicId = cloudinaryService.extractPublicId(url);
      const fallbackUrl = cloudinaryService.getFallbackUrl(url);
      
      toast.info(
        `URL Test: ${isValid ? '✅ Valid' : '❌ Failed'}\n` +
        `Public ID: ${publicId || 'Not extracted'}\n` +
        `Fallback: ${fallbackUrl ? '✅ Available' : '❌ None'}`,
        { autoClose: 5000 }
      );
      
      return { isValid, publicId, fallbackUrl };
    } catch (error) {
      toast.error(`URL test failed: ${error.message}`);
      return { isValid: false, error: error.message };
    }
  };

  const clearDeletedImagesList = () => {
    if (window.confirm('Are you sure you want to clear the deleted images list? This should only be done after manually cleaning up the images in Cloudinary dashboard.')) {
      cloudinaryService.clearDeletedImagesList();
      setDeletedImages([]);
      toast.success('Deleted images list cleared');
    }
  };

  const exportDeletedImagesList = () => {
    const dataStr = JSON.stringify(deletedImages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudinary-deleted-images-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Deleted images list exported');
  };

  const generateCloudinaryDashboardUrl = () => {
    return `https://console.cloudinary.com/console/${cloudinaryService.cloudName}/media_library/folders/gallery`;
  };

  const copyPublicIdsToClipboard = () => {
    const publicIds = deletedImages.map(img => img.publicId).join('\n');
    navigator.clipboard.writeText(publicIds).then(() => {
      toast.success('Public IDs copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          📁 Cloudinary Admin Tools
        </h2>
        <span className="text-sm text-gray-500">
          {deletedImages.length} images marked for deletion
        </span>
      </div>

      {/* Debug Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">
          🔧 Debug Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Cloud Name:</span>
            <span className="ml-2 text-gray-800">{debugInfo?.cloudName || 'Not configured'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Status:</span>
            <span className={`ml-2 ${debugInfo?.configured ? 'text-green-600' : 'text-red-600'}`}>
              {debugInfo?.configured ? '✅ Configured' : '❌ Not configured'}
            </span>
          </div>
          {debugInfo?.error && (
            <div className="col-span-2">
              <span className="font-medium text-red-600">Error:</span>
              <span className="ml-2 text-red-800">{debugInfo.error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-yellow-800 mb-2">
          ⚠️ Manual Cleanup Required
        </h3>
        <p className="text-sm text-yellow-700 mb-3">
          Due to security limitations, images cannot be automatically deleted from Cloudinary on the client-side. 
          Images marked for deletion need to be manually removed from your Cloudinary dashboard.
        </p>
        <div className="space-y-2">
          <a
            href={generateCloudinaryDashboardUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          >
            🔗 Open Cloudinary Dashboard
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={loadDeletedImages}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh List
        </button>
        
        <button
          onClick={copyPublicIdsToClipboard}
          disabled={deletedImages.length === 0}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📋 Copy Public IDs
        </button>
        
        <button
          onClick={exportDeletedImagesList}
          disabled={deletedImages.length === 0}
          className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Export List
        </button>

        <button
          onClick={() => {
            const url = prompt('Enter Cloudinary URL to test:');
            if (url) testImageUrl(url);
          }}
          className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          🧪 Test URL
        </button>
      </div>

      {/* Deleted Images List */}
      {deletedImages.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 mb-3">
            Images Marked for Deletion:
          </h3>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Public ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deleted At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deletedImages.map((image, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                      {image.publicId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(image.deletedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {image.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Clear List */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={clearDeletedImagesList}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              🗑️ Clear Deleted Images List
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Only clear this list after manually deleting the images from Cloudinary dashboard
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No images marked for deletion</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">How to manually clean up images:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Copy the Public IDs using the button above</li>
          <li>Open your Cloudinary dashboard</li>
          <li>Go to Media Library</li>
          <li>Search for each Public ID and delete the images</li>
          <li>Come back here and clear the deleted images list</li>
        </ol>
      </div>
    </div>
  );
}

export default CloudinaryAdminTools;