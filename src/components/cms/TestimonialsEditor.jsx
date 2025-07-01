import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function TestimonialsEditor() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    rating: 5
  });

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      email: testimonial.email,
      description: testimonial.description,
      rating: testimonial.rating || 5
    });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      description: '',
      rating: 5
    });
    setSelectedTestimonial(null);
    setIsEditing(false);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedTestimonial(null);
    setFormData({ name: '', email: '', description: '', rating: 5 });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Testimonial description is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      if (isAdding) {
        await addTestimonial(formData);
        toast.success('Testimonial added successfully');
      } else {
        await updateTestimonial(selectedTestimonial.id, formData);
        toast.success('Testimonial updated successfully');
      }
      handleCancel();
    } catch (error) {
      toast.error('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testimonial) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from ${testimonial.name}?`)) {
      setLoading(true);
      try {
        await deleteTestimonial(testimonial.id);
        toast.success('Testimonial deleted successfully');
        if (selectedTestimonial?.id === testimonial.id) {
          handleCancel();
        }
      } catch (error) {
        toast.error('Failed to delete testimonial');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
            disabled={!interactive}
          >
            <svg
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer testimonials and reviews.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Testimonials List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonials</h3>
            <div className="space-y-4">
              {testimonials?.map((testimonial) => (
                <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                        {renderStars(testimonial.rating || 5)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{testimonial.email}</p>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        "{testimonial.description}"
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(!testimonials || testimonials.length === 0) && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first testimonial.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        {(isEditing || isAdding) && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isAdding ? 'Add New Testimonial' : `Edit Testimonial from ${selectedTestimonial?.name}`}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter customer email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <div className="mt-1">
                    {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                    <p className="text-sm text-gray-500 mt-1">Click on stars to set rating</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Testimonial</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter the customer's testimonial..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Preview */}
                {formData.name && formData.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{formData.name}</h4>
                        {renderStars(formData.rating)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{formData.email}</p>
                      <p className="text-sm text-gray-700 italic">
                        "{formData.description}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Testimonial'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for managing testimonials</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Always get permission before adding customer testimonials</li>
                <li>Include the customer's full name and email for authenticity</li>
                <li>Keep testimonials concise and focused on specific benefits</li>
                <li>Use star ratings to provide quick visual feedback</li>
                <li>Regularly update testimonials to keep content fresh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsEditor;