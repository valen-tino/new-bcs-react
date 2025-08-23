import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';
import Navbar from '../sections/nav/nav';
import Footer from '../sections/footer/contactus';
import ContactUsModalForm from '../components/contactus_modal_form';
import SEOComponent from '../components/SEOComponent';
import AnnouncementBar from '../components/AnnouncementBar';

function AnnouncementDetail() {
  const { id } = useParams(); // This will be either slug or ID
  const navigate = useNavigate();
  const { getAnnouncementById, getAnnouncementBySlug } = useAnnouncements();
  const { language, changeLanguage } = useLanguage();
  const { uiText } = useCMS();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Helper function to safely get text content
  const getTextContent = (textValue) => {
    if (!textValue) return '';
    if (typeof textValue === 'string') return textValue;
    if (typeof textValue === 'object') {
      if (textValue.English) return textValue.English;
      if (textValue.Indonesia) return textValue.Indonesia;
      console.warn('Unexpected object format in announcement detail:', textValue);
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

  const openContactForm = () => setIsContactFormOpen(true);
  const closeContactForm = () => setIsContactFormOpen(false);

  useEffect(() => {
    const loadAnnouncement = async () => {
      setLoading(true);
      
      // First try to get by slug (SEO-friendly URLs)
      let announcementData = await getAnnouncementBySlug(id);
      
      // If not found by slug, try by ID (backward compatibility)
      if (!announcementData) {
        announcementData = await getAnnouncementById(id);
      }
      
      if (announcementData) {
        setAnnouncement(announcementData);
        
        // If we found by ID but it has a slug, redirect to slug URL for SEO
        if (announcementData.slug && id !== announcementData.slug) {
          navigate(`/announcements/${announcementData.slug}`, { replace: true });
          return;
        }
      } else {
        // Announcement not found, redirect to announcements page
        navigate('/announcements');
      }
      
      setLoading(false);
    };

    if (id) {
      loadAnnouncement();
    }
  }, [id, getAnnouncementById, getAnnouncementBySlug, navigate]);

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (!announcement) return null;
    
    const now = new Date();
    const scheduledDate = announcement.scheduledDate ? 
      new Date(announcement.scheduledDate.seconds * 1000) : null;
    
    if (announcement.status === 'active') {
      if (scheduledDate && scheduledDate > now) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <i className="fas fa-clock mr-2"></i>
            Scheduled
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <i className="fas fa-check-circle mr-2"></i>
          Active
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <i className="fas fa-pause-circle mr-2"></i>
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-Sora">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{getText('loading', 'Loading announcement...')}</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return null; // Will redirect in useEffect
  }

  // SEO data
  const seoData = {
    title: `${getTextContent(announcement.title) || 'Announcement'} - BCS Announcements`,
    description: getTextContent(announcement.shortDescription) || 
                'Read the latest announcement from BCS.',
    keywords: "BCS announcement, news, update, visa services, bali",
    url: `${window.location.origin}/announcements/${announcement.slug || id}`,
    image: announcement.bannerImage || `${window.location.origin}/images/bcs-announcement.jpg`,
    ogType: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: getTextContent(announcement.title) || 'BCS Announcement',
      description: getTextContent(announcement.shortDescription) || 'Latest announcement from BCS Visa',
      url: `https://bcsvisa.com/announcements/${announcement.slug || id}`,
      datePublished: announcement.createdAt ? new Date(announcement.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
      dateModified: announcement.updatedAt ? new Date(announcement.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'BCS Visa - Bali Connection Service',
        url: 'https://bcsvisa.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'BCS Visa - Bali Connection Service',
        logo: {
          '@type': 'ImageObject',
          url: 'https://bcsvisa.com/assets/logo.svg',
          width: '400',
          height: '400'
        },
        url: 'https://bcsvisa.com'
      },
      ...(announcement.bannerImage && {
        image: {
          '@type': 'ImageObject',
          url: announcement.bannerImage,
          width: '1200',
          height: '630'
        }
      }),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://bcsvisa.com/announcements/${announcement.slug || id}`
      },
      articleSection: 'Announcements',
      keywords: 'BCS announcement, visa news, bali visa service'
    }
  };

  return (
    <>
      <SEOComponent {...seoData} />
      <AnnouncementBar />
      <Navbar 
        language={language} 
        handleSetLanguage={changeLanguage} 
        contactForm={openContactForm}
      />
      
      <div className="min-h-screen bg-orange-100 py-12 font-Sora">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-orange-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-orange-600 transition-colors duration-200">
                  {getText('backToAnnouncements', 'Announcements')}
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">
                {getTextContent(announcement.title) || 'Untitled'}
              </li>
            </ol>
          </nav>

          {/* Article */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Banner Image */}
            {announcement.bannerImage && (
              <div className="h-64 md:h-96 bg-gray-200 overflow-hidden">
                <img
                  src={announcement.bannerImage}
                  alt={getTextContent(announcement.title) || 'Announcement'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  {getStatusBadge()}
                  <time className="text-sm text-gray-500">
                    {getText('published', 'Published')} {formatDate(announcement.createdAt)}
                  </time>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {getTextContent(announcement.title) || 'Untitled'}
                </h1>
                
                {getTextContent(announcement.shortDescription) && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {getTextContent(announcement.shortDescription)}
                  </p>
                )}
                
                {announcement.scheduledDate && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center text-blue-800">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      <span className="font-medium">
                        {getText('scheduledFor', 'Scheduled for')}: {formatDate(announcement.scheduledDate)}
                      </span>
                    </div>
                  </div>
                )}
              </header>
              
              {/* Content Body */}
              <div className="prose prose-lg max-w-none">
                {getTextContent(announcement.content) && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: getTextContent(announcement.content).replace(/\n/g, '<br>')
                    }}
                  />
                )}
                
                {!getTextContent(announcement.content) && getTextContent(announcement.shortDescription) && (
                  <p className="text-gray-700 leading-relaxed">
                    {getTextContent(announcement.shortDescription)}
                  </p>
                )}
              </div>
              
              {/* Meta Information */}
              <footer className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                  <div>
                    {getText('lastUpdated', 'Last updated')}: {formatDate(announcement.updatedAt)}
                  </div>
                  <div className="flex items-center space-x-4">
                    {announcement.showOnMain && (
                      <span className="inline-flex items-center text-orange-600">
                        <i className="fas fa-star mr-1"></i>
                        {getText('featured', 'Featured')}
                      </span>
                    )}
                  </div>
                </div>
              </footer>
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link
              to="/announcements"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {getText('backToAnnouncements', 'Back to Announcements')}
            </Link>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {getText('backToHome', 'Home')}
            </button>
          </div>
        </div>
      </div>

      <Footer language={language} contactForm={openContactForm} />
      {isContactFormOpen && <ContactUsModalForm hide={closeContactForm} />}
    </>
  );
}

export default AnnouncementDetail;