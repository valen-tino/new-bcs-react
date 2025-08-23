/**
 * SEO Validation Utilities
 * Tools to validate and check SEO implementation across the site
 */

/**
 * Validate page SEO elements
 * @param {string} url - URL to validate
 * @returns {object} Validation results
 */
export function validatePageSEO(url = window.location.href) {
  const results = {
    url,
    passed: [],
    warnings: [],
    errors: [],
    score: 0
  };
  
  // Check title tag
  const title = document.title;
  if (!title) {
    results.errors.push('Missing title tag');
  } else if (title.length < 10) {
    results.warnings.push('Title too short (should be 10-60 characters)');
  } else if (title.length > 60) {
    results.warnings.push('Title too long (should be 10-60 characters)');
  } else {
    results.passed.push('Title tag present and appropriate length');
  }
  
  // Check meta description
  const description = document.querySelector('meta[name="description"]')?.content;
  if (!description) {
    results.errors.push('Missing meta description');
  } else if (description.length < 50) {
    results.warnings.push('Meta description too short (should be 50-160 characters)');
  } else if (description.length > 160) {
    results.warnings.push('Meta description too long (should be 50-160 characters)');
  } else {
    results.passed.push('Meta description present and appropriate length');
  }
  
  // Check canonical URL
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (!canonical) {
    results.warnings.push('Missing canonical URL');
  } else {
    results.passed.push('Canonical URL present');
  }
  
  // Check Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
  const ogDescription = document.querySelector('meta[property="og:description"]')?.content;
  const ogImage = document.querySelector('meta[property="og:image"]')?.content;
  
  if (!ogTitle) {
    results.warnings.push('Missing Open Graph title');
  } else {
    results.passed.push('Open Graph title present');
  }
  
  if (!ogDescription) {
    results.warnings.push('Missing Open Graph description');
  } else {
    results.passed.push('Open Graph description present');
  }
  
  if (!ogImage) {
    results.warnings.push('Missing Open Graph image');
  } else {
    results.passed.push('Open Graph image present');
  }
  
  // Check structured data
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (!structuredData) {
    results.warnings.push('No structured data found');
  } else {
    try {
      JSON.parse(structuredData.textContent);
      results.passed.push('Valid structured data present');
    } catch (error) {
      results.errors.push('Invalid structured data JSON');
    }
  }
  
  // Check robots meta
  const robots = document.querySelector('meta[name="robots"]')?.content;
  if (!robots) {
    results.warnings.push('Missing robots meta tag');
  } else {
    results.passed.push(`Robots directive: ${robots}`);
  }
  
  // Check language
  const lang = document.documentElement.lang;
  if (!lang) {
    results.warnings.push('Missing language attribute on html element');
  } else {
    results.passed.push(`Language set to: ${lang}`);
  }
  
  // Calculate score
  const total = results.passed.length + results.warnings.length + results.errors.length;
  results.score = Math.round((results.passed.length / total) * 100);
  
  return results;
}

/**
 * Check if current page should be indexed
 * @returns {boolean} True if page should be indexed
 */
export function shouldPageBeIndexed() {
  const path = window.location.pathname;
  const robots = document.querySelector('meta[name="robots"]')?.content || '';
  
  // Check robots meta tag
  if (robots.includes('noindex')) {
    return false;
  }
  
  // Check if it's a CMS or admin route
  const cmsRoutes = ['/cms', '/login', '/testimonial/'];
  return !cmsRoutes.some(route => path.startsWith(route));
}

/**
 * Generate SEO report for the current page
 * @returns {object} Comprehensive SEO report
 */
export function generateSEOReport() {
  const validation = validatePageSEO();
  const indexed = shouldPageBeIndexed();
  
  const report = {
    ...validation,
    indexable: indexed,
    recommendations: []
  };
  
  // Add specific recommendations
  if (validation.errors.length > 0) {
    report.recommendations.push('Fix critical SEO errors first');
  }
  
  if (validation.warnings.length > 0) {
    report.recommendations.push('Address SEO warnings to improve ranking potential');
  }
  
  if (!indexed && !window.location.pathname.startsWith('/cms') && !window.location.pathname.startsWith('/login')) {
    report.recommendations.push('Page is not indexable - check if this is intentional');
  }
  
  if (validation.score < 80) {
    report.recommendations.push('SEO score is below 80% - consider improvements');
  }
  
  return report;
}

/**
 * Console log SEO report
 */
export function logSEOReport() {
  const report = generateSEOReport();
  
  console.group('🔍 SEO Report for ' + window.location.href);
  console.log('📊 Score:', report.score + '%');
  console.log('🤖 Indexable:', report.indexable ? 'Yes' : 'No');
  
  if (report.passed.length > 0) {
    console.group('✅ Passed Checks');
    report.passed.forEach(item => console.log('  ✓', item));
    console.groupEnd();
  }
  
  if (report.warnings.length > 0) {
    console.group('⚠️ Warnings');
    report.warnings.forEach(item => console.log('  ⚠️', item));
    console.groupEnd();
  }
  
  if (report.errors.length > 0) {
    console.group('❌ Errors');
    report.errors.forEach(item => console.log('  ❌', item));
    console.groupEnd();
  }
  
  if (report.recommendations.length > 0) {
    console.group('💡 Recommendations');
    report.recommendations.forEach(item => console.log('  💡', item));
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return report;
}

/**
 * Validate announcement URL structure
 * @param {string} slug - Announcement slug
 * @returns {object} URL validation result
 */
export function validateAnnouncementURL(slug) {
  const validation = {
    valid: true,
    issues: []
  };
  
  if (!slug) {
    validation.valid = false;
    validation.issues.push('Missing slug');
    return validation;
  }
  
  // Check slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    validation.valid = false;
    validation.issues.push('Slug should only contain lowercase letters, numbers, and hyphens');
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    validation.valid = false;
    validation.issues.push('Slug should not start or end with hyphens');
  }
  
  if (slug.length > 50) {
    validation.valid = false;
    validation.issues.push('Slug is too long (should be 50 characters or less)');
  }
  
  if (slug.length < 3) {
    validation.valid = false;
    validation.issues.push('Slug is too short (should be at least 3 characters)');
  }
  
  return validation;
}