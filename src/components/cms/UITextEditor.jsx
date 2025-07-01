import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';
import MultilingualEditor from './MultilingualEditor';

function UITextEditor() {
  const [activeSection, setActiveSection] = useState('header');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uiTextContent, setUITextContent] = useState({
    header: { English: {}, Indonesia: {} },
    nav: { English: {}, Indonesia: {} },
    footer: { English: {}, Indonesia: {} },
    services: { English: {}, Indonesia: {} },
    about: { English: {}, Indonesia: {} },
    gallery: { English: {}, Indonesia: {} },
  });

  // Fetch UI text content from Firestore
  useEffect(() => {
    const fetchUITextContent = async () => {
      setLoading(true);
      try {
        // This would be replaced with actual Firestore fetching
        // For now, we'll use a placeholder
        const sections = ['header', 'nav', 'footer', 'services', 'about', 'gallery'];
        const content = {};
        
        for (const section of sections) {
          // Fetch each section's content from Firestore
          const sectionContent = await fetchSectionContent(section);
          content[section] = sectionContent || { English: {}, Indonesia: {} };
        }
        
        setUITextContent(content);
      } catch (error) {
        console.error('Error fetching UI text content:', error);
        toast.error('Failed to load UI text content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUITextContent();
  }, []);

  // Placeholder function to fetch section content
  const fetchSectionContent = async (section) => {
    // This would be replaced with actual Firestore fetching
    // For now, we'll return placeholder data
    return { English: {}, Indonesia: {} };
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleContentChange = (field, content) => {
    setUITextContent(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: content
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save the content to Firestore
      // This would be implemented with actual Firestore saving
      await saveUITextContent(activeSection, uiTextContent[activeSection]);
      toast.success(`${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content saved successfully`);
    } catch (error) {
      console.error('Error saving UI text content:', error);
      toast.error('Failed to save UI text content');
    } finally {
      setSaving(false);
    }
  };

  // Placeholder function to save section content
  const saveUITextContent = async (section, content) => {
    // This would be replaced with actual Firestore saving
    console.log(`Saving ${section} content:`, content);
    return true;
  };

  const renderFields = () => {
    const sectionContent = uiTextContent[activeSection];
    if (!sectionContent) return null;

    // This would be customized based on the fields for each section
    // For now, we'll use a generic approach
    const fields = {
      header: ['title', 'subtitle', 'cta'],
      nav: ['home', 'services', 'about', 'gallery', 'testimonials', 'contact'],
      footer: ['title', 'address', 'phone', 'email', 'copyright'],
      services: ['title', 'subtitle', 'wedding', 'translation', 'travel', 'others'],
      about: ['title', 'subtitle'],
      gallery: ['title', 'subtitle']
    };

    return (
      <div className="space-y-6">
        {fields[activeSection].map(field => (
          <div key={field} className="mb-4">
            <MultilingualEditor
              fieldName={field.charAt(0).toUpperCase() + field.slice(1)}
              content={{
                English: sectionContent.English[field] || '',
                Indonesia: sectionContent.Indonesia[field] || ''
              }}
              onChange={(content) => handleContentChange(field, content)}
              isSimple={true}
              rows={3}
            />
          </div>
        ))}
      </div>
    );
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">UI Text Editor</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage multilingual text content for different sections of the website.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Section Navigation */}
        <div className="bg-white rounded-lg shadow lg:col-span-1">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Sections</h3>
            <nav className="space-y-1">
              {Object.keys(uiTextContent).map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${activeSection === section
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow lg:col-span-3">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Content
            </h3>
            
            {renderFields()}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UITextEditor;