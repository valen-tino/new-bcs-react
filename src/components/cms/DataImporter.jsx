import React, { useState } from 'react';
import { 
  importAllData,
  importVisaAbroadToFirebase as importVisaAbroadData,
  importVisaBaliToFirebase as importVisaBaliData,
  importServicesToFirebase as importServicesData,
  importTeamToFirebase as importAboutData,
  importGalleryToFirebase as importGalleryData,
  importTestimonialsToFirebase as importTestimonialsData,
  importNotificationToFirebase as importNotificationData
} from '../../utils/importDataToFirebase';
import { importUITextToFirebase } from '../../scripts/importUITextToFirebase';
import { toast } from 'react-toastify';

function DataImporter() {
  const [importing, setImporting] = useState(false);
  const [selectedImport, setSelectedImport] = useState('all');

  const handleImport = async () => {
    if (importing) return;
    
    try {
      setImporting(true);
      let success = false;
      
      switch (selectedImport) {
        case 'all':
          success = await importAllData();
          break;
        case 'visaAbroad':
          success = await importVisaAbroadData();
          break;
        case 'visaBali':
          success = await importVisaBaliData();
          break;
        case 'services':
          success = await importServicesData();
          break;
        case 'team':
          success = await importAboutData();
          break;
        case 'gallery':
          success = await importGalleryData();
          break;
        case 'testimonials':
          success = await importTestimonialsData();
          break;
        case 'notification':
          success = await importNotificationData();
          break;
        case 'uiText':
          success = await importUITextToFirebase();
          break;
        default:
          toast.error('Invalid import selection');
          break;
      }
      
      if (success) {
        toast.success(`${selectedImport === 'all' ? 'All data' : selectedImport} imported successfully!`);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data. Check console for details.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Import Tool</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          This tool imports data from local files to Firebase. Use this to populate the CMS with initial data.
        </p>
        <p className="text-sm text-orange-600 mb-4">
          <strong>Warning:</strong> This will overwrite existing data in Firebase. Make sure you have a backup if needed.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select data to import:</label>
          <select
            className="form-select rounded-md shadow-sm mt-1 block w-full"
            value={selectedImport}
            onChange={(e) => setSelectedImport(e.target.value)}
            disabled={importing}
          >
            <option value="all">All Data</option>
            <option value="visaAbroad">Visa Abroad</option>
            <option value="visaBali">Visa Bali</option>
            <option value="services">Services</option>
            <option value="team">Team & About</option>
            <option value="gallery">Gallery</option>
            <option value="testimonials">Testimonials</option>
            <option value="notification">Notification</option>
            <option value="uiText">UI Text (Header, Nav, Footer)</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handleImport}
          disabled={importing}
          className={`px-4 py-2 rounded-md text-white font-medium ${importing ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'}`}
        >
          {importing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importing...
            </>
          ) : `Import ${selectedImport === 'all' ? 'All Data' : selectedImport} to Firebase`}
        </button>
      </div>
    </div>
  );
}

export default DataImporter;