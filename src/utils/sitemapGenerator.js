/**
 * Dynamic sitemap generator for announcements
 * This script generates announcement URLs for sitemap submission
 */

import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

/**
 * Generate sitemap entries for published announcements
 * @returns {Array} Array of announcement sitemap entries
 */
export async function generateAnnouncementSitemapEntries() {
  try {
    // Query only active announcements that are visible
    const announcementsQuery = query(
      collection(db, 'announcements'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(announcementsQuery);
    const entries = [];
    
    snapshot.docs.forEach(doc => {
      const announcement = { id: doc.id, ...doc.data() };
      
      // Only include announcements with slugs for SEO-friendly URLs
      if (announcement.slug) {
        const lastmod = announcement.updatedAt || announcement.createdAt;
        const lastmodDate = lastmod && lastmod.seconds 
          ? new Date(lastmod.seconds * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        
        entries.push({
          loc: `https://bcsvisa.com/announcements/${announcement.slug}`,
          lastmod: lastmodDate,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });
    
    return entries;
  } catch (error) {
    console.error('Error generating announcement sitemap entries:', error);
    return [];
  }
}

/**
 * Generate XML sitemap content for announcements
 * @returns {string} XML sitemap content
 */
export async function generateAnnouncementSitemapXML() {
  const entries = await generateAnnouncementSitemapEntries();
  
  if (entries.length === 0) {
    return '';
  }
  
  const xmlEntries = entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlEntries}
</urlset>`;
}

/**
 * Log announcement URLs for manual sitemap addition
 */
export async function logAnnouncementURLs() {
  const entries = await generateAnnouncementSitemapEntries();
  
  console.log('=== Announcement URLs for Sitemap ===');
  console.log(`Found ${entries.length} announcement(s):`);
  
  entries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.loc}`);
  });
  
  console.log('=====================================');
  
  return entries;
}