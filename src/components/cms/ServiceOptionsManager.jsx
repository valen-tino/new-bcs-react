import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';
import { initializeServiceOptions } from '../../scripts/initializeContactFormData';

function ServiceOptionsManager() {
  const { serviceOptions, updateServiceOptions, services } = useCMS();
  const [items, setItems] = useState([]);
  const [newService, setNewService] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // Initialize with existing service options or create from default services
    if (Array.isArray(serviceOptions) && serviceOptions.length > 0) {
      setItems(serviceOptions);
    } else {
      // Create initial service options from the services in ServicesEditor
      const defaultServices = [
        { id: '1', services: 'Visa Assistance Abroad' },
        { id: '2', services: 'Visa Assistance in Bali' },
        { id: '3', services: 'Wedding Ceremony Organizer' },
        { id: '4', services: 'Translation Documents' },
        { id: '5', services: 'Travel Insurance' },
        { id: '6', services: 'Other Services' }
      ];
      setItems(defaultServices);
    }
  }, [serviceOptions]);

  const handleAddService = async () => {
    if (!newService.trim()) {
      toast.error('Please enter a service name');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      services: newService.trim()
    };

    const updatedItems = [...items, newItem];
    
    setLoading(true);
    try {
      await updateServiceOptions(updatedItems);
      setItems(updatedItems);
      setNewService('');
      toast.success('Service option added successfully!');
    } catch (error) {
      toast.error('Failed to add service option');
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (id, currentValue) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      toast.error('Service name cannot be empty');
      return;
    }

    const updatedItems = items.map(item => 
      item.id === editingId 
        ? { ...item, services: editValue.trim() }
        : item
    );

    setLoading(true);
    try {
      await updateServiceOptions(updatedItems);
      setItems(updatedItems);
      setEditingId(null);
      setEditValue('');
      toast.success('Service option updated successfully!');
    } catch (error) {
      toast.error('Failed to update service option');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service option?')) {
      return;
    }

    const updatedItems = items.filter(item => item.id !== id);
    
    setLoading(true);
    try {
      await updateServiceOptions(updatedItems);
      setItems(updatedItems);
      toast.success('Service option deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete service option');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeData = async () => {
    if (!window.confirm('This will initialize default service options if none exist. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await initializeServiceOptions();
      if (success) {
        // Reload the content to reflect changes
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to initialize service options');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncWithServices = async () => {
    // Sync with the main services from ServicesEditor
    const servicesFromEditor = [
      { id: 'visa-abroad', services: 'Visa Assistance Abroad' },
      { id: 'visa-bali', services: 'Visa Assistance in Bali' },
      { id: 'wedding', services: 'Wedding Ceremony Organizer' },
      { id: 'translation', services: 'Translation Documents' },
      { id: 'travel', services: 'Travel Insurance' },
      { id: 'others', services: 'Other Services' }
    ];

    // Add any custom services that don't exist
    const existingServices = items.map(item => item.services.toLowerCase());
    const newServices = servicesFromEditor.filter(service => 
      !existingServices.includes(service.services.toLowerCase())
    );

    if (newServices.length === 0) {
      toast.info('Service options are already up to date');
      return;
    }

    const updatedItems = [...items, ...newServices];
    
    setLoading(true);
    try {
      await updateServiceOptions(updatedItems);
      setItems(updatedItems);
      toast.success(`Added ${newServices.length} missing service options`);
    } catch (error) {
      toast.error('Failed to sync service options');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Service Options</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage the service options that appear in the contact form dropdown. These are the services customers can select when submitting a request.
        </p>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              📋 Contact Form Service Options
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                These service options will appear in the contact form dropdown menu. 
                Customers will select one of these services when submitting their request.
                You can add, edit, or remove service options as needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Service */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Service Option</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Enter service name (e.g., Document Certification)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
              />
            </div>
            <button
              onClick={handleAddService}
              disabled={loading || !newService.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </div>
      </div>

      {/* Service Options List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Current Service Options ({items.length})
            </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSyncWithServices}
              disabled={loading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              🔄 Sync with Main Services
            </button>
            <button
              onClick={handleInitializeData}
              disabled={loading}
              className="px-3 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              🚀 Initialize Data
            </button>
          </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No service options</h3>
              <p className="mt-1 text-sm text-gray-500">Add your first service option above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-900">{item.services}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={loading}
                          className="text-sm text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditService(item.id, item.services)}
                          disabled={loading}
                          className="text-sm text-orange-600 hover:text-orange-900 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(item.id)}
                          disabled={loading}
                          className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Form Preview</h4>
        <div className="bg-white rounded border p-3">
          <label className="block text-xs text-gray-600 mb-1">Select Service</label>
          <select className="w-full text-sm border border-gray-300 rounded px-2 py-1" disabled>
            <option>--Please Choose an Option--</option>
            {items.map((item) => (
              <option key={item.id} value={item.services}>
                {item.services}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ServiceOptionsManager;