import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function VisaBaliEditor() {
  const { visaBali, updateVisaBali, addVisaBali, deleteVisaBali } = useCMS();
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    description: '',
    requirements: []
  });

  const handleEdit = (visa) => {
    setSelectedVisa(visa);
    setFormData({
      type: visa.type,
      duration: visa.duration,
      description: visa.description,
      requirements: [...visa.requirements]
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      type: '',
      duration: '',
      description: '',
      requirements: []
    });
    setSelectedVisa(null);
    setIsEditing(false);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedVisa(null);
    setFormData({ type: '', duration: '', description: '', requirements: [] });
  };

  const handleSave = async () => {
    if (!formData.type.trim()) {
      toast.error('Visa type is required');
      return;
    }

    setLoading(true);
    try {
      if (isAdding) {
        await addVisaBali(formData);
        toast.success('Visa type added successfully');
      } else {
        await updateVisaBali(selectedVisa.id, formData);
        toast.success('Visa type updated successfully');
      }
      handleCancel();
    } catch (error) {
      toast.error('Failed to save visa type');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (visa) => {
    if (window.confirm(`Are you sure you want to delete ${visa.type}?`)) {
      setLoading(true);
      try {
        await deleteVisaBali(visa.id);
        toast.success('Visa type deleted successfully');
        if (selectedVisa?.id === visa.id) {
          handleCancel();
        }
      } catch (error) {
        toast.error('Failed to delete visa type');
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
          <h2 className="text-2xl font-bold text-gray-900">Visa Assistance in Bali</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage visa information for different visa types in Bali.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Visa Type
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visa Types List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Visa Types</h3>
            <div className="space-y-3">
              {visaBali?.map((visa) => (
                <div key={visa.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{visa.type}</div>
                    <div className="text-sm text-gray-500">{visa.duration}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(visa)}
                      className="text-sm font-medium text-orange-600 hover:text-orange-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(visa)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {(!visaBali || visaBali.length === 0) && (
                <p className="py-8 text-center text-gray-500">No visa types added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        {(isEditing || isAdding) && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {isAdding ? 'Add New Visa Type' : `Edit ${selectedVisa?.type}`}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Visa Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter visa type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter visa duration"
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

export default VisaBaliEditor;