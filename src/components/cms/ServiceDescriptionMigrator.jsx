import React, { useState } from 'react';
import { migrateServiceDescriptions } from '../../scripts/migrateServiceDescriptions';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function ServiceDescriptionMigrator() {
  const [isMigrating, setIsMigrating] = useState(false);
  const { loadContent } = useCMS();

  const handleMigrate = async () => {
    if (!window.confirm('This will move service descriptions from UI Text Editor to the Services CMS section. This action cannot be undone. Continue?')) {
      return;
    }

    setIsMigrating(true);
    try {
      await migrateServiceDescriptions();
      // Reload content to reflect changes
      await loadContent();
      toast.success('Service descriptions migrated successfully! You can now manage them in the Services section.');
    } catch (error) {
      console.error('Error migrating service descriptions:', error);
      toast.error('Failed to migrate service descriptions. Please check the console for details.');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            📋 Service Descriptions Migration
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              Move service descriptions from the UI Text Editor to the Services CMS section for better organization. 
              This will allow you to manage English and Indonesian descriptions directly in the Services section.
            </p>
            <div className="mt-3">
              <h4 className="font-medium">What this migration does:</h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Moves Wedding, Translation, Travel, and Other service descriptions</li>
                <li>Creates bilingual structure (English + Indonesian) in Services CMS</li>
                <li>Removes description fields from UI Text Editor</li>
                <li>Maintains all existing content</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleMigrate}
              disabled={isMigrating}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Start Migration'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDescriptionMigrator;