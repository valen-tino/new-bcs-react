import React, { useState, useRef, useEffect } from 'react';

/**
 * CORS-Safe Image Component
 * Handles external images that might be blocked by CORS policies
 * Provides fallbacks and error handling for problematic image sources
 */
function CORSSafeImage({ 
  src, 
  alt = '', 
  className = '', 
  fallbackSrc = null,
  useProxy = false,
  ariaHidden = false,
  onError = null,
  onLoad = null,
  ...props 
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  // List of proxy services for CORS-blocked images
  const proxyServices = [
    // Images.weserv.nl proxy service (most reliable)
    (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`,
    // Cloudinary proxy (if you want to use your own Cloudinary for proxying)
    (url) => `https://res.cloudinary.com/dzdiaslf9/image/fetch/${encodeURIComponent(url)}`,
    // Alternative proxy
    (url) => `https://imageproxy.pimg.tw/resize?url=${encodeURIComponent(url)}`
  ];

  // Generate fallback URLs based on the original source
  const generateFallbackUrls = (originalSrc) => {
    const fallbacks = [];
    
    // If it's a worldometers flag, try alternative sources
    if (originalSrc.includes('worldometers.info') && originalSrc.includes('flag')) {
      const countryCode = extractCountryCode(originalSrc);
      if (countryCode) {
        // Alternative flag sources (multiple sizes and formats)
        fallbacks.push(
          `https://flagcdn.com/w40/${countryCode}.png`,
          `https://flagcdn.com/w20/${countryCode}.png`,
          `https://flagcdn.com/${countryCode}.svg`,
          `https://flagpedia.net/data/flags/w580/${countryCode}.png`,
          `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${countryCode.toUpperCase()}.svg`
        );
      }
    }
    
    // Add proxy services if enabled
    if (useProxy) {
      proxyServices.forEach(proxyFn => {
        try {
          fallbacks.push(proxyFn(originalSrc));
        } catch (e) {
          console.warn('Failed to generate proxy URL:', e);
        }
      });
    }
    
    // Add custom fallback if provided
    if (fallbackSrc) {
      fallbacks.push(fallbackSrc);
    }
    
    return fallbacks;
  };

  // Extract country code from worldometers flag URLs
  const extractCountryCode = (url) => {
    const match = url.match(/\/tn_(\w+)-flag\.gif/);
    if (match) {
      const code = match[1];
      // Map some common codes
      const codeMap = {
        'us': 'us',
        'uk': 'gb',
        'ja': 'jp',
        'kr': 'kr',
        'ae': 'ae',
        'ch': 'ch',
        'nl': 'nl',
        'ca': 'ca',
        'nz': 'nz',
        'as': 'as',
        'gm': 'gm',
        'ks': 'xk' // Kosovo
      };
      return codeMap[code] || code;
    }
    return null;
  };

  const handleImageError = (e) => {
    // Only log on first attempt for each image to reduce console noise
    if (retryCount === 0) {
      console.warn(`🏳️ Flag image CORS blocked, trying fallbacks:`, currentSrc);
    }
    
    const fallbackUrls = generateFallbackUrls(src);
    
    // Try next fallback URL
    if (retryCount < fallbackUrls.length) {
      const nextUrl = fallbackUrls[retryCount];
      if (retryCount === 0) {
        console.log(`🔄 Trying fallback ${retryCount + 1}/${fallbackUrls.length}:`, nextUrl);
      }
      setCurrentSrc(nextUrl);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      return;
    }
    
    // All fallbacks failed
    console.warn(`❌ All fallbacks failed for:`, src);
    setHasError(true);
    setIsLoading(false);
    
    // Call custom error handler if provided
    if (onError) {
      onError(e);
    }
  };

  const handleImageLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    
    if (onLoad) {
      onLoad(e);
    }
  };

  // Show placeholder if image failed to load
  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ minWidth: '20px', minHeight: '15px' }}
        aria-hidden={ariaHidden}
      >
        {/* Simple flag placeholder */}
        <svg 
          className="w-3 h-2 text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      aria-hidden={ariaHidden}
      loading="lazy"
      {...props}
    />
  );
}

export default CORSSafeImage;