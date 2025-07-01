import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function ServicesEditor() {
  const { services, updateService, addService, deleteService } = useCMS();
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon || ''
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      icon: ''
    });
    setSelectedService(null);
    setIsEditing(false);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedService(null);
    setFormData({ name: '', description: '', icon: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    setLoading(true);
    try {
      if (isAdding) {
        await addService(formData);
        toast.success('Service added successfully');
      } else {
        await updateService(selectedService.id, formData);
        toast.success('Service updated successfully');
      }
      handleCancel();
    } catch (error) {
      toast.error('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
      setLoading(true);
      try {
        await deleteService(service.id);
        toast.success('Service deleted successfully');
        if (selectedService?.id === service.id) {
          handleCancel();
        }
      } catch (error) {
        toast.error('Failed to delete service');
      } finally {
        setLoading(false);
      }
    }
  };

  const serviceIcons = [
    { name: 'Wedding', icon: '💒' },
    { name: 'Translation', icon: '📄' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Document', icon: '📋' },
    { name: 'Service', icon: '🔧' },
    { name: 'Support', icon: '🤝' },
    { name: 'Legal', icon: '⚖️' },
    { name: 'Business', icon: '💼' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your service offerings including Wedding Ceremony, Translation, Travel Documents, and Other Services.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Services List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Services</h3>
            <div className="space-y-3">
              {services?.map((service) => (
                <div key={service.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon || '🔧'}</span>
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {service.description?.replace(/<[^>]*>/g, '').substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-sm font-medium text-orange-600 hover:text-orange-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {(!services || services.length === 0) && (
                <p className="py-8 text-center text-gray-500">No services added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        {(isEditing || isAdding) && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {isAdding ? 'Add New Service' : `Edit ${selectedService?.name}`}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon</label>
                  <div className="mt-1">
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {serviceIcons.map((iconOption) => (
                        <button
                          key={iconOption.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconOption.icon })}
                          className={`p-2 text-center border rounded-md hover:bg-gray-50 ${
                            formData.icon === iconOption.icon ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                          }`}
                        >
                          <div className="text-xl">{iconOption.icon}</div>
                          <div className="text-xs text-gray-500">{iconOption.name}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Or enter custom emoji/icon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Editor
                    apiKey="qi0nenw5umgv10sw07bvpjtaftf20chbphdm63kytqo8xzvx"
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={formData.description}
                    onEditorChange={(content) => setFormData({ ...formData, description: content })}
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

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesEditor;