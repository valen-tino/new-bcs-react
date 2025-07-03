import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function ServicesEditor() {
  const { services, updateServices } = useCMS();
  const [activeTab, setActiveTab] = useState('wedding');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  
  const [serviceData, setServiceData] = useState({
    wedding: services?.wedding?.description || '',
    translation: services?.translation?.description || '',
    travel: services?.travel?.description || '',
    others: services?.others?.description || ''
  });

  const handleSave = async (serviceType) => {
    setLoading(true);
    try {
      await updateServices(serviceType, serviceData[serviceType]);
      toast.success(`${getServiceTitle(serviceType)} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${getServiceTitle(serviceType)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (serviceType, content) => {
    setServiceData(prev => ({
      ...prev,
      [serviceType]: content
    }));
  };

  const getServiceTitle = (serviceType) => {
    const titles = {
      wedding: 'Wedding Ceremony Organizer',
      translation: 'Translation Documents',
      travel: 'Travel Insurance',
      others: 'Other Services'
    };
    return titles[serviceType] || serviceType;
  };

  const tabs = [
    { id: 'wedding', name: 'Wedding Ceremony Organizer', icon: '💒' },
    { id: 'translation', name: 'Translation Documents', icon: '📄' },
    { id: 'travel', name: 'Travel Insurance', icon: '✈️' },
    { id: 'others', name: 'Other Services', icon: '🔧' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your service offerings including Wedding Ceremony, Translation, Travel Documents, and Other Services.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {getServiceTitle(activeTab)}
            </h3>
            <button
              onClick={() => handleSave(activeTab)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <Editor
              apiKey="your-tinymce-api-key"
              onInit={(evt, editor) => editorRef.current = editor}
              value={serviceData[activeTab]}
              onEditorChange={(content) => handleDescriptionChange(activeTab, content)}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesEditor;