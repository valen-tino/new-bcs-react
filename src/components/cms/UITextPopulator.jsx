import React, { useState } from 'react';
import { populateUITextContent } from '../../scripts/populateUIText';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function UITextPopulator() {
  const [isPopulating, setIsPopulating] = useState(false);
  const { uiText, loadContent } = useCMS();
  
  // Check if content has been populated by looking for key sections
  const isPopulated = uiText && uiText.hero && uiText.hero.English && Object.keys(uiText.hero.English).length > 0;

  const handlePopulate = async () => {
    if (!window.confirm('This will populate the UI Text Editor with existing content from the site. Continue?')) {
      return;
    }

    setIsPopulating(true);
    try {
      await populateUITextContent();
      // Reload content to refresh the UI
      await loadContent();
      toast.success('UI Text Editor has been populated with existing content! You can now edit all text content through the UI Text Editor.');
    } catch (error) {
      console.error('Error populating UI Text:', error);
      toast.error('Failed to populate UI Text Editor. Please check the console for details.');
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-900">
              🚀 Populate UI Text Editor
            </h3>
            {isPopulated && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Content Loaded
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">
            This will populate the UI Text Editor with all existing content from the site, including:
            <br />• Hero section text
            <br />• Navigation labels
            <br />• Services descriptions
            <br />• About section content
            <br />• Footer information
            <br />• Page-specific text (Gallery, Testimonials)
            <br />• Contact form labels
            <br />• Notification content
          </p>
        </div>
        <button
          onClick={handlePopulate}
          disabled={isPopulating}
          className="ml-4 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPopulating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Populating...
            </>
          ) : isPopulated ? (
            'Repopulate Content'
          ) : (
            'Populate Content'
          )}
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              What this does:
            </h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Extracts all text content from existing static files</li>
                <li>Converts line breaks to HTML &lt;br&gt; tags for proper formatting</li>
                <li>Populates both English and Indonesian versions</li>
                <li>Makes all content editable through the UI Text Editor</li>
                <li>Allows dynamic language switching across the entire site</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UITextPopulator;