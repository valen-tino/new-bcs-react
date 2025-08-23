import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Migrate About Us descriptions from UI Text Editor to About CMS section
 * This will move English and Indonesian content to the About CMS for better organization
 */
export const migrateAboutDescriptions = async () => {
  try {
    console.log('🚀 Starting About descriptions migration...');

    // Get current UI Text data
    const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
    if (!uiTextDoc.exists()) {
      console.log('❌ No UI Text data found');
      return false;
    }

    const uiTextData = uiTextDoc.data();
    const aboutUIText = uiTextData.about || {};

    console.log('📋 Found About UI Text:', aboutUIText);

    // Get current About CMS data
    const aboutDoc = await getDoc(doc(db, 'content', 'about'));
    let aboutData = {
      image: '',
      description: { English: '', Indonesian: '' }
    };

    if (aboutDoc.exists()) {
      aboutData = { ...aboutData, ...aboutDoc.data() };
    }

    console.log('📋 Current About CMS data:', aboutData);

    // Extract About descriptions from UI Text
    const englishHeading = aboutUIText.English?.heading || '';
    const englishDesc = aboutUIText.English?.desc || '';
    const indonesianHeading = aboutUIText.Indonesia?.heading || '';
    const indonesianDesc = aboutUIText.Indonesia?.desc || '';

    let migratedContent = false;

    // Migrate About description to bilingual structure
    if (englishDesc || indonesianDesc) {
      aboutData.description = {
        English: englishDesc || '',
        Indonesian: indonesianDesc || ''
      };
      
      // Also migrate heading if needed
      aboutData.heading = {
        English: englishHeading || 'About Us',
        Indonesian: indonesianHeading || 'Tentang Kami'
      };

      migratedContent = true;
      console.log(`✅ Migrated About descriptions:`);
      console.log(`   - English: ${englishDesc ? 'Yes' : 'No'} (${englishDesc?.length || 0} chars)`);
      console.log(`   - Indonesian: ${indonesianDesc ? 'Yes' : 'No'} (${indonesianDesc?.length || 0} chars)`);
    }

    if (!migratedContent) {
      console.log('ℹ️ No About content found to migrate');
      return false;
    }

    // Save updated About data to CMS
    await setDoc(doc(db, 'content', 'about'), {
      ...aboutData,
      migratedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ About CMS updated with bilingual descriptions');

    // Clean up About descriptions from UI Text (keep only navigation-related fields)
    const cleanedUIText = { ...uiTextData };
    if (cleanedUIText.about) {
      // Remove description fields, keep only heading for navigation purposes
      if (cleanedUIText.about.English) {
        delete cleanedUIText.about.English.desc;
      }
      if (cleanedUIText.about.Indonesia) {
        delete cleanedUIText.about.Indonesia.desc;
      }
    }

    // Save cleaned UI Text
    await setDoc(doc(db, 'content', 'uiText'), {
      ...cleanedUIText,
      aboutDescMigratedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('🧹 Cleaned up UI Text - removed About descriptions');

    console.log('✅ About descriptions migration completed successfully!');
    console.log('📝 Summary:');
    console.log(`   - Migrated bilingual About descriptions to About CMS`);
    console.log(`   - Preserved About headings in UI Text for navigation`);
    console.log(`   - About section now supports proper bilingual content management`);

    return true;
  } catch (error) {
    console.error('❌ Error migrating About descriptions:', error);
    throw error;
  }
};