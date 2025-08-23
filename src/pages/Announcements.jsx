import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';
import Navbar from '../sections/nav/nav';
import Footer from '../sections/footer/contactus';
import ContactUsModalForm from '../components/contactus_modal_form';
import SEOComponent from '../components/SEOComponent';
import AnnouncementBar from '../components/AnnouncementBar';

function AnnouncementsPage() {
  const { announcements, loading } = useAnnouncements();
  const { language, changeLanguage } = useLanguage();
  const { uiText } = useCMS();
  const navigate = useNavigate();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, scheduled

  const openContactForm = () => setIsContactFormOpen(true);
  const closeContactForm = () => setIsContactFormOpen(false);

  // Helper function to safely get text content
  const getTextContent = (textValue) => {
    if (!textValue) return '';
    if (typeof textValue === 'string') return textValue;
    if (typeof textValue === 'object') {
      if (textValue.English) return textValue.English;
      if (textValue.Indonesia) return textValue.Indonesia;
      console.warn('Unexpected object format in announcements:', textValue);
      return '';
    }
    return String(textValue);
  };

  // Get UI text with fallbacks
  const getText = (key, fallback) => {
    const announcementsText = uiText?.announcements;
    if (announcementsText) {
      const langText = language === 'Indonesia' ? announcementsText.Indonesia : announcementsText.English;
      return langText?.[key] || fallback;
    }
    return fallback;
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

  const getStatusBadge = (announcement) => {
    const now = new Date();
    const scheduledDate = announcement.scheduledDate ? 
      new Date(announcement.scheduledDate.seconds * 1000) : null;
    
    if (announcement.status === 'active') {
      if (scheduledDate && scheduledDate > now) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Scheduled
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    if (filter === 'active') return announcement.status === 'active';
    if (filter === 'scheduled') {
      const now = new Date();
      const scheduledDate = announcement.scheduledDate ? 
        new Date(announcement.scheduledDate.seconds * 1000) : null;
      return announcement.status === 'active' && scheduledDate && scheduledDate > now;
    }
    return true;
  });

  // SEO data
  const seoData = {
    title: "Announcements - BCS",
    description: "Stay updated with the latest announcements and news from BCS. Get important updates about our services and company news.",
    keywords: "BCS announcements, news, updates, company news",
    url: `${window.location.origin}/announcements`,
    image: `${window.location.origin}/images/bcs-announcements.jpg`
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{getText('loading', 'Loading announcements...')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOComponent {...seoData} />
      <AnnouncementBar />
      <Navbar 
        language={language} 
        handleSetLanguage={changeLanguage} 
        contactForm={openContactForm}
      />
      
      <div className="min-h-screen bg-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <i className="fas fa-bullhorn text-orange-500 mr-3"></i>
              {getText('pageTitle', 'Announcements')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getText('pageDescription', 'Stay updated with the latest news and important announcements from BCS')}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
                }`}
              >
                {getText('allAnnouncements', 'All Announcements')}
              </button>
              {/* <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === 'active'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === 'scheduled'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-300'
                }`}
              >
                Scheduled
              </button> */}
            </div>
          </div>

          {/* Announcements Grid */}
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-inbox text-6xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">{getText('noAnnouncements', 'No announcements found')}</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? getText('noAnnouncements', 'There are no announcements at the moment.')
                  : `No ${filter} announcements found.`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Banner Image */}
                  {announcement.bannerImage && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={announcement.bannerImage}
                        alt={getTextContent(announcement.title) || 'Announcement'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Status and Date */}
                    <div className="flex items-center justify-between mb-3">
                      {getStatusBadge(announcement)}
                      <span className="text-sm text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {getTextContent(announcement.title) || 'Untitled'}
                    </h3>
                    
                    {/* Short Description */}
                    {getTextContent(announcement.shortDescription) && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {getTextContent(announcement.shortDescription)}
                      </p>
                    )}
                    
                    {/* Scheduled Date */}
                    {announcement.scheduledDate && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        {getText('scheduledFor', 'Scheduled for')} {formatDate(announcement.scheduledDate)}
                      </div>
                    )}
                    
                    {/* Read More Button */}
                    <Link
                      to={`/announcements/${announcement.id}`}
                      className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
                    >
                      {getText('readMore', 'Read Full Announcement')}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {getText('backToHome', 'Back to Home')}
            </button>
          </div>
        </div>
      </div>

      <Footer language={language} contactForm={openContactForm} />
      {isContactFormOpen && <ContactUsModalForm hide={closeContactForm} />}
    </>
  );
}

export default AnnouncementsPage;