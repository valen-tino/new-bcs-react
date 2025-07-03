import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function VisaAbroadEditor() {
  const { visaAbroad, updateVisaAbroad, addVisaAbroad, deleteVisaAbroad } = useCMS();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  
  const [formData, setFormData] = useState({
    country: '',
    flag: '',
    description: '',
    requirements: []
  });

  const handleEdit = (country) => {
    setSelectedCountry(country);
    setFormData({
      country: country.country,
      flag: country.flag,
      description: country.description,
      requirements: [...country.requirements]
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      country: '',
      flag: '',
      description: '',
      requirements: []
    });
    setSelectedCountry(null);
    setIsEditing(false);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedCountry(null);
    setFormData({ country: '', flag: '', description: '', requirements: [] });
  };

  const handleSave = async () => {
    if (!formData.country.trim()) {
      toast.error('Country name is required');
      return;
    }

    setLoading(true);
    try {
      if (isAdding) {
        await addVisaAbroad(formData);
        toast.success('Country added successfully');
      } else {
        // Get the current countries array
        const updatedCountries = visaAbroad.map(country => {
          if (country.id === selectedCountry.id) {
            // Update the selected country with new data
            return {
              ...country,
              country: formData.country,
              flag: formData.flag,
              description: formData.description,
              requirements: formData.requirements || []
            };
          }
          return country;
        });
        
        // Update the entire array
        await updateVisaAbroad(updatedCountries);
        toast.success('Country updated successfully');
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving country:', error);
      toast.error('Failed to save country');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (country) => {
    if (window.confirm(`Are you sure you want to delete ${country.country}?`)) {
      setLoading(true);
      try {
        // Filter out the country to delete from the current array
        const updatedCountries = visaAbroad.filter(c => c.id !== country.id);
        
        // Update the entire array
        await updateVisaAbroad(updatedCountries);
        
        toast.success('Country deleted successfully');
        if (selectedCountry?.id === country.id) {
          handleCancel();
        }
      } catch (error) {
        console.error('Error deleting country:', error);
        toast.error('Failed to delete country');
      } finally {
        setLoading(false);
      }
    }
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visa Assistance Abroad</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage visa information for different countries.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Country
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Countries List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Countries</h3>
            <div className="space-y-3">
              {visaAbroad?.map((country) => (
                <div key={country.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img src={country.flag} alt={country.country} className="object-cover w-8 h-6 rounded" />
                    <span className="font-medium text-gray-900">{country.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(country)}
                      className="text-sm font-medium text-orange-600 hover:text-orange-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(country)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {(!visaAbroad || visaAbroad.length === 0) && (
                <p className="py-8 text-center text-gray-500">No countries added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        {(isEditing || isAdding) && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {isAdding ? 'Add New Country' : `Edit ${selectedCountry?.country}`}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country Name</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter country name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Flag URL</label>
                  <input
                    type="url"
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter flag image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Editor
                    apiKey="qi0nenw5umgv10sw07bvpjtaftf20chbphdm63kytqo8xzvx"
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={formData.description}
                    onEditorChange={(content) => setFormData({ ...formData, description: content })}
                    init={{
                      height: 300,
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Requirements</label>
                    <button
                      onClick={addRequirement}
                      className="text-sm font-medium text-orange-600 hover:text-orange-900"
                    >
                      + Add Requirement
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => updateRequirement(index, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="Enter requirement"
                        />
                        <button
                          onClick={() => removeRequirement(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
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

export default VisaAbroadEditor;