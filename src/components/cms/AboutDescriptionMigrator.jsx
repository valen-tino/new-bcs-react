import React, { useState } from 'react';
import { migrateAboutDescriptions } from '../../scripts/migrateAboutDescriptions';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function AboutDescriptionMigrator() {
  const [isMigrating, setIsMigrating] = useState(false);
  const { loadContent } = useCMS();

  const handleMigrate = async () => {
    if (!window.confirm('This will move About Us descriptions from UI Text Editor to the About CMS section. This action cannot be undone. Continue?')) {
      return;
    }

    setIsMigrating(true);
    try {
      await migrateAboutDescriptions();
      // Reload content to reflect changes
      await loadContent();
      toast.success('About descriptions migrated successfully! You can now manage them in the About Us section.');
    } catch (error) {
      console.error('Error migrating About descriptions:', error);
      toast.error('Failed to migrate About descriptions. Please check the console for details.');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">
            📄 About Us Content Migration
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>
              Move About Us descriptions from the UI Text Editor to the About CMS section for better organization. 
              This will allow you to manage English and Indonesian content directly in the About Us section.
            </p>
            <div className="mt-3">
              <h4 className="font-medium">What this migration does:</h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Moves About Us descriptions from UI Text to About CMS</li>
                <li>Creates bilingual structure (English + Indonesian) in About CMS</li>
                <li>Keeps About Us headings in UI Text for navigation</li>
                <li>Enables proper bilingual content management</li>
                <li>Maintains all existing content</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleMigrate}
              disabled={isMigrating}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md border border-transparent hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMigrating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Migrating...
                </>
              ) : (
                'Migrate About Content'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutDescriptionMigrator;