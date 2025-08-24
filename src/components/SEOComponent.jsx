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
          ? 'Layanan visa terpercaya di Bali dengan pengalaman 20+ tahun. Visa Schengen, Australia, Jepang, Korea, USA. Jaminan 99% approval rate. Konsultasi gratis! ✓ Berpengalaman ✓ Terpercaya ✓ Hasil Terjamin'
          : 'Trusted visa services in Bali with 20+ years experience. Schengen, Australia, Japan, Korea, USA visa assistance. 99% approval guarantee. Free consultation! ✓ Experienced ✓ Trusted ✓ Results Guaranteed',
        keywords: 'visa bali, visa schengen, visa australia, visa jepang, visa korea, bcs visa, bali connection service, visa services bali, visa application indonesia, layanan visa bali'
      },
      '/gallery': {
        title: isIndonesian ? 'Galeri BCS Visa - Momen Pernikahan & Layanan Kami | Dokumentasi Profesional' : 'BCS Visa Gallery - Wedding Moments & Our Services | Professional Documentation',
        description: isIndonesian 
          ? 'Lihat galeri foto pernikahan dan layanan BCS Visa. Dokumentasi upacara pernikahan di Bali dan berbagai layanan visa kami. Profesional, berkualitas, dan berpengalaman dalam mengabadikan momen spesial Anda.'
          : 'View our gallery of wedding ceremonies and visa services. Documentation of Bali wedding ceremonies and our various visa services. Professional, high-quality, and experienced in capturing your special moments.',
        keywords: 'bcs gallery, bali wedding photos, visa services gallery, wedding ceremony bali, dokumentasi pernikahan bali, wedding photography bali'
      },
      '/testimonials': {
        title: isIndonesian ? 'Testimoni Klien BCS Visa - Pengalaman Nyata Pelanggan | Rating 4.8/5' : 'BCS Visa Client Testimonials - Real Customer Experiences | 4.8/5 Rating',
        description: isIndonesian
          ? 'Baca testimoni nyata dari klien BCS Visa yang telah menggunakan layanan visa kami. Rating tinggi dan kepuasan pelanggan terjamin. Lebih dari 1000 klien puas dengan layanan kami. ⭐⭐⭐⭐⭐ 4.8/5 rating'
          : 'Read real testimonials from BCS Visa clients who have used our visa services. High ratings and guaranteed customer satisfaction. Over 1000 satisfied clients with our services. ⭐⭐⭐⭐⭐ 4.8/5 rating',
        keywords: 'bcs testimonials, visa service reviews, customer feedback, bali visa service ratings, testimoni visa bali, review layanan visa'
      },
      '/announcements': {
        title: isIndonesian ? 'Pengumuman BCS Visa - Berita dan Update Terbaru | Info Penting' : 'BCS Visa Announcements - Latest News and Updates | Important Information',
        description: isIndonesian
          ? 'Tetap update dengan pengumuman dan berita terbaru dari BCS Visa. Dapatkan informasi penting tentang layanan dan pengembangan perusahaan kami. Berita visa terkini, promo spesial, dan update kebijakan.'
          : 'Stay updated with the latest announcements and news from BCS Visa. Get important updates about our services and company developments. Latest visa news, special promotions, and policy updates.',
        keywords: 'bcs announcements, visa news, bcs updates, visa service news, bali visa announcements, berita visa, pengumuman visa bali'
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
    
    // Enhanced meta tags with better multilingual support
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', 'BCS Visa - Bali Connection Service');
    updateMetaTag('robots', shouldNoIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    updateMetaTag('generator', 'React');
    updateMetaTag('theme-color', '#2563EB');
    updateMetaTag('color-scheme', 'light');
    
    // Enhanced viewport and mobile optimization
    updateMetaTag('viewport', 'width=device-width,initial-scale=1,viewport-fit=cover');
    updateMetaTag('format-detection', 'telephone=no');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    
    // Language and locale with improved hreflang support
    const locale = language === 'Indonesia' ? 'id_ID' : 'en_US';
    const langCode = language === 'Indonesia' ? 'id' : 'en';
    document.documentElement.lang = langCode;
    updateMetaTag('language', langCode);
    updateMetaTag('content-language', langCode);
    
    // Enhanced Open Graph tags with better formatting
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:url', finalCanonical);
    updateMetaProperty('og:type', ogType);
    updateMetaProperty('og:locale', locale);
    updateMetaProperty('og:site_name', 'BCS Visa - Bali Connection Service');
    updateMetaProperty('og:updated_time', new Date().toISOString());
    
    // Add alternate locale for multilingual support
    const altLocale = language === 'Indonesia' ? 'en_US' : 'id_ID';
    updateMetaProperty('og:locale:alternate', altLocale);
    
    if (ogImage) {
      updateMetaProperty('og:image', ogImage);
      updateMetaProperty('og:image:alt', finalTitle);
      updateMetaProperty('og:image:width', '1200');
      updateMetaProperty('og:image:height', '630');
      updateMetaProperty('og:image:type', 'image/jpeg');
    } else {
      // Default OG image
      updateMetaProperty('og:image', 'https://bcsvisa.com/assets/logo.svg');
      updateMetaProperty('og:image:alt', 'BCS Visa Logo');
      updateMetaProperty('og:image:width', '400');
      updateMetaProperty('og:image:height', '400');
    }
    
    // Enhanced Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    updateMetaName('twitter:site', '@bcsvisa');
    updateMetaName('twitter:creator', '@bcsvisa');
    if (ogImage) {
      updateMetaName('twitter:image', ogImage);
      updateMetaName('twitter:image:alt', finalTitle);
    }
    
    // Enhanced canonical URL with proper multilingual support
    updateCanonical(finalCanonical);
    
    // Add hreflang tags for multilingual SEO
    updateHreflangTags();
    
    // Add alternate mobile URLs if applicable
    updateAlternateLinks();
    
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

  const updateHreflangTags = () => {
    // Remove existing hreflang tags
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(tag => tag.remove());
    
    const currentPath = location.pathname;
    const baseUrl = 'https://bcsvisa.com';
    
    // Add hreflang for English
    const enLink = document.createElement('link');
    enLink.rel = 'alternate';
    enLink.hreflang = 'en';
    enLink.href = `${baseUrl}${currentPath}`;
    document.head.appendChild(enLink);
    
    // Add hreflang for Indonesian
    const idLink = document.createElement('link');
    idLink.rel = 'alternate';
    idLink.hreflang = 'id';
    idLink.href = `${baseUrl}${currentPath}`; // Same URL, language switching via context
    document.head.appendChild(idLink);
    
    // Add x-default hreflang
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}${currentPath}`;
    document.head.appendChild(defaultLink);
  };
  
  const updateAlternateLinks = () => {
    // Remove existing alternate links for mobile/amp
    const existingAlt = document.querySelectorAll('link[rel="alternate"][media], link[rel="amphtml"]');
    existingAlt.forEach(tag => tag.remove());
    
    // Add mobile alternate (if different mobile version exists)
    // Currently using responsive design, so not needed
    
    // Add RSS feed if announcements page
    if (location.pathname === '/announcements') {
      const rssLink = document.createElement('link');
      rssLink.rel = 'alternate';
      rssLink.type = 'application/rss+xml';
      rssLink.title = 'BCS Visa Announcements RSS';
      rssLink.href = 'https://bcsvisa.com/feed.xml';
      document.head.appendChild(rssLink);
    }
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
      '@id': 'https://bcsvisa.com/#organization',
      name: 'BCS Visa - Bali Connection Service',
      alternateName: ['BCS Visa', 'Bali Connection Service'],
      url: 'https://bcsvisa.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bcsvisa.com/assets/logo.svg',
        width: '400',
        height: '400'
      },
      image: 'https://bcsvisa.com/assets/logo.svg',
      description: isIndonesian 
        ? 'BCS Visa adalah penyedia layanan visa terpercaya di Bali dengan pengalaman lebih dari 20 tahun, melayani visa Schengen, Australia, Jepang, Korea, dan berbagai negara lainnya.'
        : 'BCS Visa is a trusted visa service provider in Bali with over 20 years of experience, serving Schengen, Australia, Japan, Korea, and various other country visas.',
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+62-812-3666187',
        contactType: 'customer service',
        availableLanguage: ['English', 'Indonesian'],
        areaServed: 'Indonesia'
      }],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bali',
        addressRegion: 'Bali',
        addressCountry: 'ID'
      },
      sameAs: [
        'https://www.facebook.com/vinsen.jehaut.3',
        'https://www.instagram.com/vinsensiusjehaut'
      ],
      foundingDate: '2003',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '10-20'
      },
      serviceArea: {
        '@type': 'Country',
        name: 'Indonesia'
      }
    };

    if (location.pathname === '/') {
      return [
        organizationData,
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://bcsvisa.com/#localbusiness',
          name: 'BCS Visa - Bali Connection Service',
          description: isIndonesian 
            ? 'Layanan visa profesional dengan pengalaman 20+ tahun di Bali. Melayani visa Schengen, Australia, Jepang, Korea dengan approval rate 99%.'
            : 'Professional visa services with 20+ years experience in Bali. Serving Schengen, Australia, Japan, Korea visas with 99% approval rate.',
          url: 'https://bcsvisa.com',
          telephone: '+62-812-3666187',
          address: organizationData.address,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '-8.6500',
            longitude: '115.2167'
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00'
          },
          priceRange: '$$',
          currenciesAccepted: 'IDR',
          paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
          serviceArea: organizationData.serviceArea,
          sameAs: organizationData.sameAs,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '150'
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

    const headline = extractText(announcement.title) || 'BCS Announcement';
    const description = extractText(announcement.shortDescription) || 'Latest announcement from BCS Visa';
    const articleUrl = `https://bcsvisa.com/announcements/${announcement.slug || announcement.id}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      '@id': `${articleUrl}#article`,
      headline: headline.length > 110 ? headline.substring(0, 110) + '...' : headline,
      alternativeHeadline: headline,
      description: description,
      url: articleUrl,
      datePublished: formatDate(announcement.createdAt),
      dateModified: formatDate(announcement.updatedAt || announcement.createdAt),
      author: {
        '@type': 'Organization',
        '@id': 'https://bcsvisa.com/#organization',
        name: 'BCS Visa - Bali Connection Service',
        url: 'https://bcsvisa.com'
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://bcsvisa.com/#organization',
        name: 'BCS Visa - Bali Connection Service',
        logo: {
          '@type': 'ImageObject',
          url: 'https://bcsvisa.com/assets/logo.svg',
          width: 400,
          height: 400
        },
        url: 'https://bcsvisa.com'
      },
      image: announcement.bannerImage ? {
        '@type': 'ImageObject',
        url: announcement.bannerImage,
        width: 1200,
        height: 630,
        caption: headline
      } : {
        '@type': 'ImageObject',
        url: 'https://bcsvisa.com/assets/logo.svg',
        width: 400,
        height: 400,
        caption: 'BCS Visa Logo'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl
      },
      articleSection: 'Announcements',
      keywords: ['BCS announcement', 'visa news', 'bali visa service', 'visa updates'],
      inLanguage: language === 'Indonesia' ? 'id-ID' : 'en-US',
      isAccessibleForFree: true,
      about: {
        '@type': 'Thing',
        name: 'Visa Services'
      }
    };
  };

  // Export function for external use (e.g., in announcement pages)
  window.generateAnnouncementStructuredData = generateAnnouncementStructuredData;

  return null; // This component doesn't render anything
};

export default SEOComponent;