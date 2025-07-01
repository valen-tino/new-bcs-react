import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationManager from '../../components/cms/NotificationManager';
import DataImporter from '../../components/cms/DataImporter';
import { toast } from 'react-toastify';

function NotificationEditor() {
  const { loading } = useNotification();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Set page loading based on notification context loading
    if (!loading) {
      setPageLoading(false);
    }
  }, [loading]);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notification Management</h1>
        <p className="text-gray-600 mt-1">
          Manage notification content, images, and scheduling for the website.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <NotificationManager />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Import Notification Data</h2>
        <p className="text-gray-600 mb-4">
          Use this tool to import notification data from local files to Firebase.
        </p>
        <DataImporter />
      </div>
    </div>
  );
}

export default NotificationEditor;