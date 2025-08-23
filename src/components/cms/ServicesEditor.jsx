import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function ServicesEditor() {
  const { services, updateServices } = useCMS();
  const [activeTab, setActiveTab] = useState('wedding');
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  
  const [serviceData, setServiceData] = useState({
    wedding: {
      English: services?.wedding?.description?.English || services?.wedding?.description || '',
      Indonesian: services?.wedding?.description?.Indonesian || ''
    },
    translation: {
      English: services?.translation?.description?.English || services?.translation?.description || '',
      Indonesian: services?.translation?.description?.Indonesian || ''
    },
    travel: {
      English: services?.travel?.description?.English || services?.travel?.description || '',
      Indonesian: services?.travel?.description?.Indonesian || ''
    },
    others: {
      English: services?.others?.description?.English || services?.others?.description || '',
      Indonesian: services?.others?.description?.Indonesian || ''
    }
  });

  const handleSave = async (serviceType) => {
    setLoading(true);
    try {
      // Save bilingual description object
      await updateServices(serviceType, {
        English: serviceData[serviceType].English,
        Indonesian: serviceData[serviceType].Indonesian
      });
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
      [serviceType]: {
        ...prev[serviceType],
        [activeLanguage]: content
      }
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
          Manage your service offerings including Wedding Ceremony, Translation, Travel Documents, and Other Services. Each service can have both English and Indonesian descriptions.
        </p>
      </div>
      
      {/* Info about bilingual descriptions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              🌐 Bilingual Service Descriptions
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                You can now manage both English and Indonesian descriptions for each service. 
                Use the language toggle to switch between languages and preview the other language content.
              </p>
            </div>
          </div>
        </div>
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
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Language:</span>
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setActiveLanguage('English')}
                    className={`px-3 py-1 text-sm font-medium border ${
                      activeLanguage === 'English'
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } rounded-l-md`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setActiveLanguage('Indonesian')}
                    className={`px-3 py-1 text-sm font-medium border-t border-r border-b ${
                      activeLanguage === 'Indonesian'
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } rounded-r-md`}
                  >
                    Indonesian
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => handleSave(activeTab)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description ({activeLanguage})
            </label>
            <div className="mb-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                🌍 Currently editing: <strong>{activeLanguage}</strong> description for {getServiceTitle(activeTab)}
              </p>
            </div>
            <Editor
              apiKey="qi0nenw5umgv10sw07bvpjtaftf20chbphdm63kytqo8xzvx"
              onInit={(evt, editor) => editorRef.current = editor}
              value={serviceData[activeTab][activeLanguage]}
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
            
            {/* Preview of other language */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Preview: {activeLanguage === 'English' ? 'Indonesian' : 'English'} Description
              </h4>
              <div 
                className="text-sm text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: serviceData[activeTab][activeLanguage === 'English' ? 'Indonesian' : 'English'] || '<em>No content yet</em>' 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesEditor;