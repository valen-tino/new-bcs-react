import React, { useState, useEffect } from 'react';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { toast } from 'react-toastify';
import EnhancedImageUpload from '../EnhancedImageUpload';

function AnnouncementsManager() {
  const {
    announcements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementStatus,
    setAsMainAnnouncement,
    loading
  } = useAnnouncements();

  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: { English: '', Indonesia: '' },
    shortDescription: { English: '', Indonesia: '' },
    content: { English: '', Indonesia: '' },
    bannerImage: '',
    bannerImageMetadata: null,
    status: 'active',
    showOnMain: false,
    scheduledDate: '',
    dismissible: false
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      title: { English: '', Indonesia: '' },
      shortDescription: { English: '', Indonesia: '' },
      content: { English: '', Indonesia: '' },
      bannerImage: '',
      bannerImageMetadata: null,
      status: 'active',
      showOnMain: false,
      scheduledDate: '',
      dismissible: false
    });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.English.trim()) {
      toast.error('English title is required');
      return;
    }
    
    const announcementData = {
      ...formData,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null
    };
    
    let success;
    if (editingAnnouncement) {
      success = await updateAnnouncement(editingAnnouncement.id, announcementData);
    } else {
      success = await createAnnouncement(announcementData);
    }
    
    if (success) {
      resetForm();
    }
  };

  // Handle edit
  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title || { English: '', Indonesia: '' },
      shortDescription: announcement.shortDescription || { English: '', Indonesia: '' },
      content: announcement.content || { English: '', Indonesia: '' },
      bannerImage: announcement.bannerImage || '',
      bannerImageMetadata: announcement.bannerImageMetadata || null,
      status: announcement.status || 'active',
      showOnMain: announcement.showOnMain || false,
      scheduledDate: announcement.scheduledDate ? 
        new Date(announcement.scheduledDate.seconds * 1000).toISOString().slice(0, 16) : '',
      dismissible: announcement.dismissible || false
    });
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  // Handle banner image upload
  const handleBannerImageUploaded = (url, metadata) => {
    setFormData(prev => ({
      ...prev,
      bannerImage: url,
      bannerImageMetadata: metadata
    }));
  };

  // Handle delete with confirmation
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteAnnouncement(id);
    }
  };

  // Format date for display
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Not set';
    
    let date;
    if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000);
    } else {
      date = new Date(dateValue);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (announcement) => {
    const now = new Date();
    const scheduledDate = announcement.scheduledDate ? 
      new Date(announcement.scheduledDate.seconds * 1000) : null;
    
    if (announcement.status === 'active') {
      if (scheduledDate && scheduledDate > now) {
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Scheduled</span>;
      }
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Announcements Manager</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          New Announcement
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
          <div className="text-sm text-gray-600">Total Announcements</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {announcements.filter(a => a.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {announcements.filter(a => a.scheduledDate && new Date(a.scheduledDate.seconds * 1000) > new Date()).length}
          </div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {announcements.filter(a => a.showOnMain).length}
          </div>
          <div className="text-sm text-gray-600">Featured</div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title.English}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, English: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Indonesia)
                  </label>
                  <input
                    type="text"
                    value={formData.title.Indonesia}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: { ...prev.title, Indonesia: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description (English)
                  </label>
                  <textarea
                    rows="3"
                    value={formData.shortDescription.English}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, English: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description (Indonesia)
                  </label>
                  <textarea
                    rows="3"
                    value={formData.shortDescription.Indonesia}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shortDescription: { ...prev.shortDescription, Indonesia: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (English)
                  </label>
                  <textarea
                    rows="6"
                    value={formData.content.English}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, English: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (Indonesia)
                  </label>
                  <textarea
                    rows="6"
                    value={formData.content.Indonesia}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, Indonesia: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <EnhancedImageUpload
                  onImageUploaded={handleBannerImageUploaded}
                  currentImageUrl={formData.bannerImage}
                  folder="announcements"
                  maxSizeMB={5}
                  provider="auto"
                  transformations={{
                    width: 1200,
                    height: 630,
                    crop: 'fill',
                    quality: 'auto',
                    format: 'auto'
                  }}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  className=""
                />
                
                {/* Alternative URL Input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter image URL directly:
                  </label>
                  <input
                    type="url"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      bannerImage: e.target.value,
                      bannerImageMetadata: null 
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="https://example.com/banner-image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended: 1200x630 pixels for optimal display across platforms
                  </p>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showOnMain}
                    onChange={(e) => setFormData(prev => ({ ...prev, showOnMain: e.target.checked }))}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show on main site</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dismissible}
                    onChange={(e) => setFormData(prev => ({ ...prev, dismissible: e.target.checked }))}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dismissible</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  {editingAnnouncement ? 'Update' : 'Create'} Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {announcements.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              No announcements found. Create your first announcement!
            </li>
          ) : (
            announcements.map((announcement) => (
              <li key={announcement.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(announcement)}
                      {announcement.showOnMain && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-gray-900 truncate mt-2">
                      {announcement.title?.English || announcement.title || 'Untitled'}
                    </p>
                    {announcement.shortDescription?.English && (
                      <p className="text-sm text-gray-500 truncate">
                        {announcement.shortDescription.English}
                      </p>
                    )}
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <span>Created: {formatDate(announcement.createdAt)}</span>
                      {announcement.scheduledDate && (
                        <span>Scheduled: {formatDate(announcement.scheduledDate)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAnnouncementStatus(announcement.id, announcement.status)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        announcement.status === 'active'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {announcement.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    {!announcement.showOnMain && announcement.status === 'active' && (
                      <button
                        onClick={() => setAsMainAnnouncement(announcement.id)}
                        className="px-3 py-1 bg-orange-100 text-orange-800 hover:bg-orange-200 rounded text-sm font-medium"
                      >
                        Set as Main
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id, announcement.title?.English || announcement.title || 'Untitled')}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default AnnouncementsManager;