import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../contexts/CMSContext';
import { useLanguage } from '../contexts/LanguageContext';

const SEOComponent = ({ 
  title, 
  description, 
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  articleData,
  structuredData,
  noIndex = false
}) => {
  const location = useLocation();
  const { about, services, testimonials } = useCMS();
  const { language } = useLanguage();
  
  // Default SEO data based on current route and language
  const getDefaultSEOData = () => {
    const isIndonesian = language === 'Indonesia';
    const baseUrl = 'https://bcsvisa.com';
    
    const seoData = {
      '/': {
        title: isIndonesian 
          ? 'BCS Visa - Layanan Visa Terpercaya di Bali | Visa Schengen, Australia, Jepang'
          : 'BCS Visa - Trusted Visa Services in Bali | Schengen, Australia, Japan Visa',
        description: isIndonesian
          ? 'Layanan visa terpercaya di Bali dengan pengalaman 20+ tahun. Visa Schengen, Australia, Jepang, Korea, USA. Jaminan 99% approval rate. Konsultasi gratis!'
          : 'Trusted visa services in Bali with 20+ years experience. Schengen, Australia, Japan, Korea, USA visa assistance. 99% approval guarantee. Free consultation!',
        keywords: 'visa bali, visa schengen, visa australia, visa jepang, visa korea, bcs visa, bali connection service, visa services bali, visa application indonesia'
      },
      '/gallery': {
        title: isIndonesian ? 'Galeri BCS Visa - Momen Pernikahan & Layanan Kami' : 'BCS Visa Gallery - Wedding Moments & Our Services',
        description: isIndonesian 
          ? 'Lihat galeri foto pernikahan dan layanan BCS Visa. Dokumentasi upacara pernikahan di Bali dan berbagai layanan visa kami.'
          : 'View our gallery of wedding ceremonies and visa services. Documentation of Bali wedding ceremonies and our various visa services.',
        keywords: 'bcs gallery, bali wedding photos, visa services gallery, wedding ceremony bali'
      },
      '/testimonials': {
        title: isIndonesian ? 'Testimoni Klien BCS Visa - Pengalaman Nyata Pelanggan' : 'BCS Visa Client Testimonials - Real Customer Experiences',
        description: isIndonesian
          ? 'Baca testimoni nyata dari klien BCS Visa yang telah menggunakan layanan visa kami. Rating tinggi dan kepuasan pelanggan terjamin.'
          : 'Read real testimonials from BCS Visa clients who have used our visa services. High ratings and guaranteed customer satisfaction.',
        keywords: 'bcs testimonials, visa service reviews, customer feedback, bali visa service ratings'
      },
      '/announcements': {
        title: isIndonesian ? 'Pengumuman BCS Visa - Berita dan Update Terbaru' : 'BCS Visa Announcements - Latest News and Updates',
        description: isIndonesian
          ? 'Tetap update dengan pengumuman dan berita terbaru dari BCS Visa. Dapatkan informasi penting tentang layanan dan pengembangan perusahaan kami.'
          : 'Stay updated with the latest announcements and news from BCS Visa. Get important updates about our services and company developments.',
        keywords: 'bcs announcements, visa news, bcs updates, visa service news, bali visa announcements'
      }
    };
    
    return seoData[location.pathname] || seoData['/'];
  };

  const defaultSEO = getDefaultSEOData();
  const finalTitle = title || defaultSEO.title;
  const finalDescription = description || defaultSEO.description;
  const finalKeywords = keywords || defaultSEO.keywords;
  const finalCanonical = canonical || `https://bcsvisa.com${location.pathname}`;
  
  // Auto-detect CMS/admin routes and set noindex
  const isCMSRoute = location.pathname.startsWith('/cms') || 
                     location.pathname.startsWith('/login') || 
                     location.pathname.startsWith('/testimonial/');
  const shouldNoIndex = noIndex || isCMSRoute;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', 'BCS Visa - Bali Connection Service');
    updateMetaTag('robots', shouldNoIndex ? 'noindex,nofollow' : 'index,follow');
    
    // Language and locale
    const locale = language === 'Indonesia' ? 'id_ID' : 'en_US';
    const langCode = language === 'Indonesia' ? 'id' : 'en';
    document.documentElement.lang = langCode;
    updateMetaTag('language', langCode);
    
    // Open Graph tags
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:url', finalCanonical);
    updateMetaProperty('og:type', ogType);
    updateMetaProperty('og:locale', locale);
    updateMetaProperty('og:site_name', 'BCS Visa - Bali Connection Service');
    
    if (ogImage) {
      updateMetaProperty('og:image', ogImage);
      updateMetaProperty('og:image:alt', finalTitle);
    }
    
    // Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    if (ogImage) {
      updateMetaName('twitter:image', ogImage);
    }
    
    // Canonical URL
    updateCanonical(finalCanonical);
    
    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData);
    } else {
      // Default structured data
      const defaultStructuredData = generateDefaultStructuredData();
      updateStructuredData(defaultStructuredData);
    }
    
    // Article structured data for testimonials
    if (articleData && location.pathname === '/testimonials') {
      const articleStructuredData = generateArticleStructuredData(articleData);
      updateStructuredData(articleStructuredData, 'article-schema');
    }
    
  }, [finalTitle, finalDescription, finalKeywords, finalCanonical, ogImage, ogType, structuredData, shouldNoIndex, location.pathname, language]);

  const updateMetaTag = (name, content) => {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.name = name;
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateMetaProperty = (property, content) => {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateMetaName = (name, content) => {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.name = name;
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateCanonical = (href) => {
    let element = document.querySelector('link[rel="canonical"]');
    if (!element) {
      element = document.createElement('link');
      element.rel = 'canonical';
      document.head.appendChild(element);
    }
    element.href = href;
  };

  const updateStructuredData = (data, id = 'structured-data') => {
    // Remove existing structured data
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  const generateDefaultStructuredData = () => {
    const isIndonesian = language === 'Indonesia';
    
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BCS Visa - Bali Connection Service',
      alternateName: 'BCS Visa',
      url: 'https://bcsvisa.com',
      logo: 'https://bcsvisa.com/assets/logo.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+62-812-3666187',
        contactType: 'customer service',
        availableLanguage: ['English', 'Indonesian']
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bali',
        addressCountry: 'Indonesia'
      },
      sameAs: [
        'https://www.facebook.com/vinsen.jehaut.3',
        'https://www.instagram.com/vinsensiusjehaut'
      ],
      services: [
        'Visa Application Services',
        'Document Translation',
        'Wedding Ceremony Organization',
        'Travel Insurance'
      ]
    };

    if (location.pathname === '/') {
      return [
        organizationData,
        {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'BCS Visa Services',
          description: isIndonesian 
            ? 'Layanan visa profesional dengan pengalaman 20+ tahun di Bali'
            : 'Professional visa services with 20+ years experience in Bali',
          provider: organizationData,
          serviceType: 'Visa Application Services',
          areaServed: {
            '@type': 'Country',
            name: 'Indonesia'
          }
        }
      ];
    }

    return organizationData;
  };

  const generateArticleStructuredData = (data) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      author: {
        '@type': 'Organization',
        name: 'BCS Visa'
      },
      publisher: {
        '@type': 'Organization',
        name: 'BCS Visa',
        logo: {
          '@type': 'ImageObject',
          url: 'https://bcsvisa.com/assets/logo.svg'
        }
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished
    };
  };

  const generateAnnouncementStructuredData = (announcement) => {
    const extractText = (content) => {
      if (!content) return '';
      if (typeof content === 'string') return content;
      if (typeof content === 'object') {
        return content.English || content.Indonesia || '';
      }
      return String(content);
    };

    const formatDate = (dateValue) => {
      if (!dateValue) return new Date().toISOString();
      
      let date;
      if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      } else {
        date = new Date(dateValue);
      }
      
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    };

    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: extractText(announcement.title) || 'BCS Announcement',
      description: extractText(announcement.shortDescription) || 'Latest announcement from BCS Visa',
      url: `https://bcsvisa.com/announcements/${announcement.slug || announcement.id}`,
      datePublished: formatDate(announcement.createdAt),
      dateModified: formatDate(announcement.updatedAt || announcement.createdAt),
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
        '@id': `https://bcsvisa.com/announcements/${announcement.slug || announcement.id}`
      },
      articleSection: 'Announcements',
      keywords: 'BCS announcement, visa news, bali visa service'
    };
  };

  return null; // This component doesn't render anything
};

export default SEOComponent;