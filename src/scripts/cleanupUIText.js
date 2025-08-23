import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Cleanup UI Text Editor - Remove migrated fields
 * This script removes fields that have been migrated to their respective CMS sections
 */
export const cleanupUITextMigratedFields = async () => {
  try {
    console.log('🧹 Starting UI Text cleanup - removing migrated fields...');

    // Get current UI Text data
    const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
    if (!uiTextDoc.exists()) {
      console.log('❌ No UI Text data found');
      return false;
    }

    const uiTextData = uiTextDoc.data();
    console.log('📋 Current UI Text data loaded');

    // Define fields to remove (migrated fields)
    const fieldsToRemove = {
      services: {
        English: ['weddingdesc', 'translatedesc', 'traveldesc', 'otherssub'],
        Indonesia: ['weddingdesc', 'translatedesc', 'traveldesc', 'otherssub']
      },
      about: {
        English: ['desc'],
        Indonesia: ['desc']
      }
    };

    let cleanedData = { ...uiTextData };
    let totalFieldsRemoved = 0;

    // Clean up each section
    Object.entries(fieldsToRemove).forEach(([section, languages]) => {
      console.log(`\n🔍 Cleaning section: ${section}`);
      
      if (cleanedData[section]) {
        Object.entries(languages).forEach(([language, fields]) => {
          if (cleanedData[section][language]) {
            fields.forEach(field => {
              if (cleanedData[section][language][field]) {
                console.log(`   ❌ Removing ${section}.${language}.${field}`);
                delete cleanedData[section][language][field];
                totalFieldsRemoved++;
              }
            });
          }
        });
      }
    });

    if (totalFieldsRemoved === 0) {
      console.log('ℹ️ No migrated fields found to remove - UI Text already clean');
      return true;
    }

    // Save cleaned data
    await setDoc(doc(db, 'content', 'uiText'), {
      ...cleanedData,
      cleanedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('\n✅ UI Text cleanup completed successfully!');
    console.log(`🗑️ Removed ${totalFieldsRemoved} migrated fields:`);
    console.log('   - Services: weddingdesc, translatedesc, traveldesc, otherssub');
    console.log('   - About: desc');
    console.log('📝 These fields are now managed in their respective CMS sections:');
    console.log('   - Service descriptions → Services CMS');
    console.log('   - About description → About CMS');

    return true;
  } catch (error) {
    console.error('❌ Error during UI Text cleanup:', error);
    throw error;
  }
};