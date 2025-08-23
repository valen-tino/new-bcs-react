import React, { useState, useEffect } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { toast } from 'react-toastify';

function ContactRequestsManager() {
  const { contactRequests, markRequestAsRead, deleteContactRequest, unreadRequests } = useCMS();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [loading, setLoading] = useState(false);

  const filteredRequests = contactRequests?.filter(request => {
    if (filter === 'unread') return !request.read;
    if (filter === 'read') return request.read;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  }) || [];

  const handleMarkAsRead = async (request) => {
    if (request.read) return;
    
    setLoading(true);
    try {
      await markRequestAsRead(request.id);
      toast.success('Request marked as read');
    } catch (error) {
      toast.error('Failed to mark request as read');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (request) => {
    if (window.confirm('Are you sure you want to delete this contact request?')) {
      setLoading(true);
      try {
        await deleteContactRequest(request.id);
        toast.success('Contact request deleted successfully');
        if (selectedRequest?.id === request.id) {
          setSelectedRequest(null);
        }
      } catch (error) {
        toast.error('Failed to delete contact request');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectRequest = async (request) => {
    setSelectedRequest(request);
    if (!request.read) {
      await handleMarkAsRead(request);
    }
  };

  const formatDate = (dateValue) => {
    let date;
    
    // Handle Firebase Timestamp objects
    if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      // Firebase Timestamp object has .seconds and .nanoseconds properties
      date = new Date(dateValue.seconds * 1000);
    } else if (dateValue && typeof dateValue.toDate === 'function') {
      // Firebase Timestamp object with toDate method
      date = dateValue.toDate();
    } else {
      // Handle regular Date objects, ISO strings, or timestamps
      date = new Date(dateValue);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (request) => {
    return request.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (request) => {
    return request.read ? 'Read' : 'New';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Requests</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage and respond to customer contact requests.
            {unreadRequests > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadRequests} unread
              </span>
            )}
          </p>
        </div>
        
        {/* Filters and Sort */}
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          >
            <option value="all">All Requests</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Requests ({filteredRequests.length})
            </h3>
            
            {filteredRequests.length === 0 ? (
              <div className="py-8 text-center">
                <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'unread' ? 'No unread requests.' : 
                   filter === 'read' ? 'No read requests.' : 'No contact requests yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-3 max-h-96">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => handleSelectRequest(request)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRequest?.id === request.id
                        ? 'border-orange-500 bg-orange-50'
                        : !request.read
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{request.name}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            getStatusColor(request)
                          }`}>
                            {getStatusText(request)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Service: {request.service}
                        </p>
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                          {request.message}
                        </p>
                      </div>
                      <div className="ml-4 text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            {selectedRequest ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Request Details</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(selectedRequest)
                    }`}>
                      {getStatusText(selectedRequest)}
                    </span>
                    <button
                      onClick={() => handleDelete(selectedRequest)}
                      className="text-sm font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a href={`mailto:${selectedRequest.email}`} className="text-orange-600 hover:text-orange-900">
                        {selectedRequest.email}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.phone ? (
                        <a href={`tel:${selectedRequest.phone}`} className="text-orange-600 hover:text-orange-900">
                          {selectedRequest.phone}
                        </a>
                      ) : (
                        <span className="text-gray-500">Not provided</span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Interested In</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.service}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Province</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.province || <span className="text-gray-500">Not provided</span>}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <div className="p-3 mt-1 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedRequest.message}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Quick Actions</h4>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${selectedRequest.email}?subject=Re: Your inquiry about ${selectedRequest.service}&body=Dear ${selectedRequest.name},%0D%0A%0D%0AThank you for your inquiry about ${selectedRequest.service}.%0D%0A%0D%0ABest regards,%0D%0ABCS Team`}
                        className="inline-flex justify-center items-center px-3 py-2 w-full text-sm font-medium leading-4 text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Reply via Email
                      </a>
                      
                      {selectedRequest.phone && (
                        <a
                          href={`tel:${selectedRequest.phone}`}
                          className="inline-flex justify-center items-center px-3 py-2 w-full text-sm font-medium leading-4 text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call Customer
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No request selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a request from the list to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactRequestsManager;