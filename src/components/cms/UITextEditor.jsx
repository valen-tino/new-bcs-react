import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';
import MultilingualEditor from './MultilingualEditor';
import UITextPopulator from './UITextPopulator';
import ServiceDescriptionMigrator from './ServiceDescriptionMigrator';
import AboutDescriptionMigrator from './AboutDescriptionMigrator';
import UITextCleanup from './UITextCleanup';
import AnnouncementsUITextPopulator from './AnnouncementsUITextPopulator';

function UITextEditor() {
  const { content, updateUIText, loadContent } = useCMS();
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uiTextContent, setUITextContent] = useState({
    hero: { English: {}, Indonesia: {} },
    nav: { English: {}, Indonesia: {} },
    services: { English: {}, Indonesia: {} },
    about: { English: {}, Indonesia: {} },
    team: { English: {}, Indonesia: {} },
    gallery: { English: {}, Indonesia: {} },
    testimonial: { English: {}, Indonesia: {} },
    footer: { English: {}, Indonesia: {} },
    galleryPage: { English: {}, Indonesia: {} },
    testimonialsPage: { English: {}, Indonesia: {} },
    notif: { English: {}, Indonesia: {} },
    contactForm: { English: {}, Indonesia: {} },
    announcements: { English: {}, Indonesia: {} },
  });

  // Fetch UI text content from Firestore
  useEffect(() => {
    const fetchUITextContent = async () => {
      setLoading(true);
      try {
        const sections = ['hero', 'nav', 'services', 'about', 'team', 'gallery', 'testimonial', 'footer', 'galleryPage', 'testimonialsPage', 'notif', 'contactForm', 'announcements'];
        const newContent = {};
        
        for (const section of sections) {
          // Get content from CMS context uiText
          const sectionContent = content.uiText?.[section] || { English: {}, Indonesia: {} };
          newContent[section] = sectionContent;
        }
        
        setUITextContent(newContent);
      } catch (error) {
        console.error('Error fetching UI text content:', error);
        toast.error('Failed to load UI text content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUITextContent();
  }, [content.uiText]);



  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleContentChange = (field, fieldContent) => {
    setUITextContent(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        English: {
          ...prev[activeSection]?.English,
          [field]: fieldContent.English
        },
        Indonesia: {
          ...prev[activeSection]?.Indonesia,
          [field]: fieldContent.Indonesia
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use the updateUIText function from CMS context
      await updateUIText(activeSection, uiTextContent[activeSection]);
      // Reload content to ensure UI is updated
      await loadContent();
      toast.success(`${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content saved successfully`);
    } catch (error) {
      console.error('Error saving UI text content:', error);
      toast.error('Failed to save UI text content');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await loadContent();
      toast.success('Content refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing content:', error);
      toast.error('Failed to refresh content');
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    const sectionContent = uiTextContent[activeSection];
    if (!sectionContent) {
      return (
        <div className="p-4 bg-yellow-50 rounded-md">
          <p className="text-yellow-800">No content found for {activeSection} section.</p>
          <p className="text-sm text-yellow-600 mt-2">Try populating the UI Text Editor first.</p>
        </div>
      );
    }

    // Field definitions based on actual component usage
    // Note: Service descriptions and About description have been migrated to their respective CMS sections
    const fields = {
      hero: ['heading', 'subheading', 'wa', 'lm'],
      nav: ['home', 'services', 'about', 'team', 'gallery', 'testi', 'contactus', 'announcements', 'email'],
      services: ['vaa', 'vaadesc', 'vaasub', 'vab', 'vabdesc', 'wedding', 'weddingsub', 'weddingbtn', 'translate', 'travel', 'others', 'email', 'wa'], // Removed: weddingdesc, translatedesc, traveldesc, otherssub
      about: ['heading'], // Removed: desc (now in About CMS)
      team: ['heading'],
      gallery: ['heading'],
      testimonial: ['heading', 'seeall'],
      footer: ['desc', 'email', 'wa', 'desc2', 'legal', 'legaldetails', 'sub', 'firstlink', 'secondlink', 'thirdlink', 'fourthlink', 'fifthlink', 'akte', 'copy'],
      galleryPage: ['heading', 'noImages', 'backToHome'],
      testimonialsPage: ['heading', 'description', 'backToHome', 'noTestimonials'],
      notif: ['update', 'ck', 'title', 'sub', 'desc'],
      contactForm: ['title', 'name', 'phone', 'email', 'province', 'services', 'help'],
      announcements: ['pageTitle', 'pageDescription', 'allAnnouncements', 'active', 'scheduled', 'noAnnouncements', 'readMore', 'backToHome', 'backToAnnouncements', 'published', 'scheduledFor', 'lastUpdated', 'featured', 'loading']
    };

    const sectionFields = fields[activeSection] || [];
    
    if (sectionFields.length === 0) {
      return (
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-red-800">No fields defined for {activeSection} section.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Debug info */}
        <div className="p-3 bg-gray-50 rounded-md text-xs">
          <p className="font-medium text-gray-700">Section: {activeSection}</p>
          <p className="text-gray-600">Fields: {sectionFields.length} | English: {Object.keys(sectionContent.English || {}).length} | Indonesian: {Object.keys(sectionContent.Indonesia || {}).length}</p>
        </div>
        
        {sectionFields.map(field => (
          <div key={field} className="mb-4">
            <MultilingualEditor
              fieldName={field.charAt(0).toUpperCase() + field.slice(1)}
              content={{
                English: sectionContent.English?.[field] || '',
                Indonesia: sectionContent.Indonesia?.[field] || ''
              }}
              onChange={(content) => handleContentChange(field, content)}
              isSimple={true}
              rows={3}
            />
          </div>
        ))}
        
        {/* Information about migrated content */}
        {activeSection === 'services' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">
                  📝 Service Descriptions Moved
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Service descriptions (Wedding, Translation, Travel, Others) have been moved to the <strong>Services CMS section</strong> for better bilingual management.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'about' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">
                  📄 About Description Moved
                </h4>
                <div className="mt-2 text-sm text-green-700">
                  <p>About Us description has been moved to the <strong>About Us CMS section</strong> for better bilingual management. Only the heading remains here for navigation purposes.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'announcements' && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-orange-800">
                  📢 Announcements UI Text
                </h4>
                <div className="mt-2 text-sm text-orange-700">
                  <p>These texts control the display of announcements pages, including page titles, navigation buttons, status labels, and loading messages. Actual announcement content is managed separately in the <strong>Announcements CMS section</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-b-2 border-orange-500 animate-spin"></div>
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
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Migration and setup tools - hidden since setup is complete */}
      {/* <UITextPopulator /> */}
      {/* <ServiceDescriptionMigrator /> */}
      {/* <AboutDescriptionMigrator /> */}
      {/* <UITextCleanup /> */}
      <AnnouncementsUITextPopulator onPopulated={handleRefresh} />

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