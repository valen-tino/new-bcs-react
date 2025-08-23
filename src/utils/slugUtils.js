/**
 * Utility functions for generating and handling URL-friendly slugs
 */

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 50 characters
    .substring(0, 50)
    // Remove trailing hyphen if it was cut off
    .replace(/-+$/, '');
}

/**
 * Generate a unique slug by appending numbers if necessary
 * @param {string} baseSlug - The base slug
 * @param {Array} existingSlugs - Array of existing slugs to check against
 * @returns {string} - Unique slug
 */
export function generateUniqueSlug(baseSlug, existingSlugs = []) {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Extract text content from multilingual object
 * @param {string|object} content - Content that might be multilingual
 * @returns {string} - Extracted text for slug generation
 */
export function extractTextForSlug(content) {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  if (typeof content === 'object') {
    // Prefer English for SEO, fallback to Indonesian
    return content.English || content.Indonesia || '';
  }
  
  return String(content);
}

/**
 * Generate slug from announcement data
 * @param {object} announcement - Announcement object
 * @returns {string} - Generated slug
 */
export function generateAnnouncementSlug(announcement) {
  if (!announcement) return '';
  
  const titleText = extractTextForSlug(announcement.title);
  return generateSlug(titleText);
}

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} - Whether slug is valid
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  
  // Check if slug contains only lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && 
         slug.length > 0 && 
         slug.length <= 50 && 
         !slug.startsWith('-') && 
         !slug.endsWith('-');
}