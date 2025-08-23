import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import DataImporter from './DataImporter';

function Overview({ setActiveSection }) {
  const { 
    visaAbroad, 
    visaBali, 
    services, 
    gallery, 
    testimonials, 
    contactRequests, 
    unreadRequests 
  } = useCMS();

  const [showImporter, setShowImporter] = useState(false);

  // Handler functions for Quick Actions
  const handleAddService = () => {
    if (setActiveSection) {
      setActiveSection('services');
    }
  };

  const handleAddGalleryImage = () => {
    if (setActiveSection) {
      setActiveSection('gallery');
    }
  };

  const handleAddTestimonial = () => {
    if (setActiveSection) {
      setActiveSection('testimonials');
    }
  };

  const handleViewWebsite = () => {
    window.open('/', '_blank');
  };

  const stats = [
    {
      name: 'Visa Abroad Countries',
      value: visaAbroad?.length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      name: 'Visa Bali Options',
      value: visaBali?.length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      name: 'Services',
      value: 4,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      name: 'Gallery Images',
      value: gallery?.length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-yellow-500'
    },
    {
      name: 'Testimonials',
      value: testimonials?.length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'bg-indigo-500'
    },
    {
      name: 'Contact Requests',
      value: contactRequests?.length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-red-500',
      badge: unreadRequests > 0 ? unreadRequests : null
    }
  ];

  const recentRequests = contactRequests
    ?.sort((a, b) => {
      const getDate = (dateValue) => {
        if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
          return new Date(dateValue.seconds * 1000);
        } else if (dateValue && typeof dateValue.toDate === 'function') {
          return dateValue.toDate();
        } else {
          return new Date(dateValue);
        }
      };
      return getDate(b.createdAt) - getDate(a.createdAt);
    })
    ?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to the BCS Content Management System. Here's a quick overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden relative px-4 pt-5 pb-12 bg-white rounded-lg shadow sm:pt-6 sm:px-6">
            <dt>
              <div className={`absolute ${stat.color} rounded-md p-3`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </dt>
            <dd className="flex items-baseline pb-6 ml-16 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              {stat.badge && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stat.badge} new
                </span>
              )}
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Contact Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
            Recent Contact Requests
            {unreadRequests > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadRequests} unread
              </span>
            )}
          </h3>
          
          {recentRequests.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No contact requests yet.</p>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className={`border rounded-lg p-4 ${
                  !request.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{request.name}</h4>
                        {!request.isRead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
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
                      {(() => {
                        let date;
                        if (request.createdAt && typeof request.createdAt === 'object' && request.createdAt.seconds) {
                          date = new Date(request.createdAt.seconds * 1000);
                        } else if (request.createdAt && typeof request.createdAt.toDate === 'function') {
                          date = request.createdAt.toDate();
                        } else {
                          date = new Date(request.createdAt);
                        }
                        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                      })()
                      }
                    </div>
                  </div>
                </div>
              ))}
              
              {contactRequests.length > 5 && (
                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Showing 5 of {contactRequests.length} requests.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>          
        
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Existing buttons */}
          
            <button 
            onClick={() => setShowImporter(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md border border-transparent hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
            <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Data
            </button>
          
          
          {/* Add importer modal at bottom */}
          {showImporter && (
          <div className="flex fixed inset-0 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-2xl bg-white rounded-lg">
          <DataImporter onClose={() => setShowImporter(false)} />
          </div>
          </div>
          )}
          <button 
            onClick={handleAddService}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Service
          </button>
          
          <button 
            onClick={handleAddGalleryImage}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md border border-transparent hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Gallery Image
          </button>
          
          <button 
            onClick={handleAddTestimonial}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Add Testimonial
          </button>
          
          <button 
            onClick={handleViewWebsite}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M17 7v4" />
            </svg>
            View Website
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;