import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import { NotifContent, NotifPNG, NyepiContent, NyepiPNG } from '../../sections/all/allpics';

function NotificationManager() {
  const { content: cmsContent, updateNotification, getNotification } = useCMS();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notificationData, setNotificationData] = useState({
    English: {
      update: '',
      ck: '',
      title: '',
      sub: '',
      desc: ''
    },
    Indonesia: {
      update: '',
      ck: '',
      title: '',
      sub: '',
      desc: ''
    },
    imageType: 'default', // 'default' or 'nyepi'
    scheduledDate: null,
    isActive: true
  });

  // Load notification data
  useEffect(() => {
    const loadNotification = async () => {
      setLoading(true);
      try {
        const notifData = await getNotification();
        if (notifData) {
          setNotificationData(notifData);
        }
      } catch (error) {
        console.error('Error loading notification data:', error);
        toast.error('Failed to load notification data');
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, [getNotification]);

  const handleInputChange = (lang, field, value) => {
    setNotificationData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleImageTypeChange = (type) => {
    setNotificationData(prev => ({
      ...prev,
      imageType: type
    }));
  };

  const handleScheduleChange = (date) => {
    setNotificationData(prev => ({
      ...prev,
      scheduledDate: date ? new Date(date).toISOString() : null
    }));
  };

  const handleActiveChange = (isActive) => {
    setNotificationData(prev => ({
      ...prev,
      isActive
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotification(notificationData);
      toast.success('Notification updated successfully!');
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Manager</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Notification Status</h3>
        <div className="flex items-center mb-4">
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              className="form-radio text-orange-600"
              name="notification-status"
              checked={notificationData.isActive}
              onChange={() => handleActiveChange(true)}
            />
            <span className="ml-2">Active</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-orange-600"
              name="notification-status"
              checked={!notificationData.isActive}
              onChange={() => handleActiveChange(false)}
            />
            <span className="ml-2">Inactive</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Notification Image</h3>
        <div className="flex items-center mb-4">
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              className="form-radio text-orange-600"
              name="image-type"
              checked={notificationData.imageType === 'default'}
              onChange={() => handleImageTypeChange('default')}
            />
            <span className="ml-2">Default Image</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-orange-600"
              name="image-type"
              checked={notificationData.imageType === 'nyepi'}
              onChange={() => handleImageTypeChange('nyepi')}
            />
            <span className="ml-2">Nyepi Image</span>
          </label>
        </div>
        
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Preview:</h4>
          <div className="max-w-md">
            <picture className="rounded-lg overflow-hidden block">
              <source 
                srcSet={notificationData.imageType === 'default' ? NotifContent : NyepiContent} 
                type="image/webp"
              />
              <img 
                src={notificationData.imageType === 'default' ? NotifPNG : NyepiPNG} 
                alt="Notification Preview" 
                className="w-full h-auto"
              />
            </picture>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Schedule Notification</h3>
        <div className="flex items-center">
          <input
            type="datetime-local"
            className="form-input rounded-md shadow-sm mt-1 block w-full md:w-64"
            value={notificationData.scheduledDate ? new Date(notificationData.scheduledDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleScheduleChange(e.target.value)}
          />
          {notificationData.scheduledDate && (
            <button
              className="ml-2 text-red-600 hover:text-red-800"
              onClick={() => handleScheduleChange(null)}
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {notificationData.scheduledDate 
            ? `Notification will be displayed on ${new Date(notificationData.scheduledDate).toLocaleString()}` 
            : 'No schedule set. Notification will be displayed immediately if active.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Content */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">English Content</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.English.update}
              onChange={(e) => handleInputChange('English', 'update', e.target.value)}
              placeholder="Banner text"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.English.ck}
              onChange={(e) => handleInputChange('English', 'ck', e.target.value)}
              placeholder="Button text"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Title</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.English.title}
              onChange={(e) => handleInputChange('English', 'title', e.target.value)}
              placeholder="Modal title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Subtitle</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.English.sub}
              onChange={(e) => handleInputChange('English', 'sub', e.target.value)}
              placeholder="Modal subtitle"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Description</label>
            <textarea
              rows="6"
              className="form-textarea rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.English.desc}
              onChange={(e) => handleInputChange('English', 'desc', e.target.value)}
              placeholder="Modal description"
            ></textarea>
          </div>
        </div>
        
        {/* Indonesian Content */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Indonesian Content</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.Indonesia.update}
              onChange={(e) => handleInputChange('Indonesia', 'update', e.target.value)}
              placeholder="Banner text"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.Indonesia.ck}
              onChange={(e) => handleInputChange('Indonesia', 'ck', e.target.value)}
              placeholder="Button text"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Title</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.Indonesia.title}
              onChange={(e) => handleInputChange('Indonesia', 'title', e.target.value)}
              placeholder="Modal title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Subtitle</label>
            <input
              type="text"
              className="form-input rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.Indonesia.sub}
              onChange={(e) => handleInputChange('Indonesia', 'sub', e.target.value)}
              placeholder="Modal subtitle"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Description</label>
            <textarea
              rows="6"
              className="form-textarea rounded-md shadow-sm mt-1 block w-full"
              value={notificationData.Indonesia.desc}
              onChange={(e) => handleInputChange('Indonesia', 'desc', e.target.value)}
              placeholder="Modal description"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded-md text-white font-medium ${saving ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'}`}
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default NotificationManager;