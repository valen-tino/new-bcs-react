import React from 'react';
import { Link } from 'react-router-dom';
import { useAnnouncements } from '../contexts/AnnouncementContext';

function AnnouncementBar() {
  const { activeAnnouncement } = useAnnouncements();

  // Don't render if no active announcement or invalid structure
  if (!activeAnnouncement || typeof activeAnnouncement !== 'object' || !activeAnnouncement.id) {
    return null;
  }

  // Debug logging to identify the issue
  console.log('AnnouncementBar - activeAnnouncement:', activeAnnouncement);
  console.log('AnnouncementBar - title type:', typeof activeAnnouncement.title);
  console.log('AnnouncementBar - shortDescription type:', typeof activeAnnouncement.shortDescription);

  // Helper function to safely get text content
  const getTextContent = (textValue) => {
    if (!textValue) return '';
    if (typeof textValue === 'string') return textValue;
    if (typeof textValue === 'object') {
      if (textValue.English) return textValue.English;
      if (textValue.Indonesia) return textValue.Indonesia;
      // If it's an object but not the expected format, return empty string
      console.warn('Unexpected object format:', textValue);
      return '';
    }
    // Convert any other type to string
    return String(textValue);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    
    let date;
    if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000);
    } else {
      date = new Date(dateValue);
    }
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 shadow-md font-Sora">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          {/* Announcement Icon */}
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-orange-100" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
              />
            </svg>
          </div>
          
          {/* Announcement Content */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Announcement
                </span>
                {activeAnnouncement.scheduledDate && (
                  <span className="text-orange-100 text-sm">
                    {formatDate(activeAnnouncement.scheduledDate)}
                  </span>
                )}
              </div>
              
              <div className="mt-1 sm:mt-0">
                <h3 className="text-sm sm:text-base font-semibold leading-tight">
                  {getTextContent(activeAnnouncement.title) || 'Untitled'}
                </h3>
                {getTextContent(activeAnnouncement.shortDescription) && (
                  <p className="text-sm text-orange-100 leading-tight mt-1 hidden sm:block">
                    {getTextContent(activeAnnouncement.shortDescription)}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link
              to={`/announcements/${activeAnnouncement.id}`}
              className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-md text-sm font-medium text-orange-100 bg-orange-600 hover:bg-orange-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <span className="hidden sm:inline">Read More</span>
              <span className="sm:hidden">Read</span>
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Close Button (Optional - for dismissible announcements) */}
        {activeAnnouncement.dismissible && (
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={() => {
                // Store dismissed announcement in localStorage
                localStorage.setItem(`dismissed_announcement_${activeAnnouncement.id}`, 'true');
                // Force re-render by reloading announcements
                window.location.reload();
              }}
              className="text-orange-200 hover:text-white transition-colors duration-200"
              aria-label="Dismiss announcement"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnouncementBar;