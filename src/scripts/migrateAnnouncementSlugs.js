/**
 * Migration script to add slugs to existing announcements
 * Run this script once to add slugs to announcements that don't have them
 */

import { db } from '../config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { generateAnnouncementSlug, generateUniqueSlug } from '../utils/slugUtils';

/**
 * Add slugs to announcements that don't have them
 */
export async function addSlugsToExistingAnnouncements() {
  try {
    console.log('🔄 Starting slug migration for announcements...');
    
    // Get all announcements
    const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
    const announcements = announcementsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📋 Found ${announcements.length} announcement(s) to check`);
    
    // Filter announcements without slugs
    const announcementsWithoutSlugs = announcements.filter(announcement => !announcement.slug);
    
    if (announcementsWithoutSlugs.length === 0) {
      console.log('✅ All announcements already have slugs!');
      return { success: true, updated: 0 };
    }
    
    console.log(`🔧 ${announcementsWithoutSlugs.length} announcement(s) need slugs`);
    
    // Get existing slugs for uniqueness check
    const existingSlugs = announcements
      .filter(a => a.slug)
      .map(a => a.slug);
    
    let updateCount = 0;
    
    // Add slugs to announcements that don't have them
    for (const announcement of announcementsWithoutSlugs) {
      try {
        const baseSlug = generateAnnouncementSlug(announcement);
        const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
        
        // Update the announcement with the new slug
        await updateDoc(doc(db, 'announcements', announcement.id), {
          slug: uniqueSlug,
          updatedAt: new Date()
        });
        
        // Add to existing slugs to maintain uniqueness
        existingSlugs.push(uniqueSlug);
        updateCount++;
        
        console.log(`✅ Updated: "${announcement.title?.English || announcement.title || 'Untitled'}" -> "${uniqueSlug}"`);
      } catch (error) {
        console.error(`❌ Failed to update announcement ${announcement.id}:`, error);
      }
    }
    
    console.log(`🎉 Migration completed! Updated ${updateCount} announcement(s) with slugs.`);
    return { success: true, updated: updateCount };
    
  } catch (error) {
    console.error('❌ Error in slug migration:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate all announcement slugs
 */
export async function validateAnnouncementSlugs() {
  try {
    console.log('🔍 Validating announcement slugs...');
    
    const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
    const announcements = announcementsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const issues = [];
    
    // Check for missing slugs
    const withoutSlugs = announcements.filter(a => !a.slug);
    if (withoutSlugs.length > 0) {
      issues.push(`${withoutSlugs.length} announcement(s) missing slugs`);
    }
    
    // Check for duplicate slugs
    const slugs = announcements.map(a => a.slug).filter(Boolean);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateSlugs.length > 0) {
      issues.push(`Duplicate slugs found: ${[...new Set(duplicateSlugs)].join(', ')}`);
    }
    
    if (issues.length === 0) {
      console.log('✅ All announcement slugs are valid!');
      return { valid: true, issues: [] };
    } else {
      console.log('⚠️ Slug validation issues:');
      issues.forEach(issue => console.log(`  - ${issue}`));
      return { valid: false, issues };
    }
    
  } catch (error) {
    console.error('❌ Error validating slugs:', error);
    return { valid: false, error: error.message };
  }
}

/**
 * Run the migration (call this function to execute)
 */
export async function runSlugMigration() {
  console.log('🚀 Starting announcement slug migration process...');
  
  // First validate current state
  const validation = await validateAnnouncementSlugs();
  
  if (!validation.valid && validation.issues) {
    console.log('📝 Issues found, running migration...');
    const migration = await addSlugsToExistingAnnouncements();
    
    if (migration.success) {
      console.log('🔄 Re-validating after migration...');
      await validateAnnouncementSlugs();
    }
  }
  
  console.log('✨ Migration process completed!');
}