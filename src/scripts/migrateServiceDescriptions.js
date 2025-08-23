import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Migrate service descriptions from UI Text to Services CMS
 * This moves service descriptions to the proper Services section for better organization
 */
export const migrateServiceDescriptions = async () => {
  try {
    console.log('🚀 Starting service descriptions migration...');

    // Get current UI Text content
    const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
    if (!uiTextDoc.exists()) {
      console.log('❌ No UI Text content found');
      return false;
    }

    const uiTextData = uiTextDoc.data();
    const servicesUIText = uiTextData.services;

    if (!servicesUIText) {
      console.log('❌ No services section found in UI Text');
      return false;
    }

    // Get current Services CMS content
    const servicesDoc = await getDoc(doc(db, 'content', 'services'));
    let servicesData = {
      wedding: { description: { English: '', Indonesian: '' } },
      translation: { description: { English: '', Indonesian: '' } },
      travel: { description: { English: '', Indonesian: '' } },
      others: { description: { English: '', Indonesian: '' } },
      items: []
    };

    if (servicesDoc.exists()) {
      servicesData = { ...servicesData, ...servicesDoc.data() };
    }

    // Extract service descriptions from UI Text
    const serviceMapping = {
      wedding: 'weddingdesc',
      translation: 'translatedesc', 
      travel: 'traveldesc',
      others: 'otherssub'
    };

    let migratedCount = 0;

    // Migrate each service description
    Object.entries(serviceMapping).forEach(([serviceKey, uiTextKey]) => {
      const englishDesc = servicesUIText.English?.[uiTextKey];
      const indonesianDesc = servicesUIText.Indonesia?.[uiTextKey];

      if (englishDesc || indonesianDesc) {
        // Update service description to bilingual structure
        servicesData[serviceKey] = {
          ...servicesData[serviceKey],
          description: {
            English: englishDesc || '',
            Indonesian: indonesianDesc || ''
          }
        };
        migratedCount++;
        console.log(`✅ Migrated ${serviceKey}: EN(${englishDesc ? 'Yes' : 'No'}) ID(${indonesianDesc ? 'Yes' : 'No'})`);
      }
    });

    // Save updated services data
    await setDoc(doc(db, 'content', 'services'), {
      ...servicesData,
      migratedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Clean up service descriptions from UI Text
    const cleanedUITextServices = {
      English: { ...servicesUIText.English },
      Indonesia: { ...servicesUIText.Indonesia }
    };

    // Remove migrated fields
    Object.values(serviceMapping).forEach(field => {
      delete cleanedUITextServices.English[field];
      delete cleanedUITextServices.Indonesia[field];
    });

    // Update UI Text with cleaned services section
    const updatedUIText = {
      ...uiTextData,
      services: cleanedUITextServices,
      servicesMigratedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'content', 'uiText'), updatedUIText);

    console.log(`🎉 Migration completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   • Services migrated: ${migratedCount}`);
    console.log(`   • UI Text fields removed: ${Object.values(serviceMapping).length * 2} (EN + ID)`);
    console.log(`   • Services now managed in: Services CMS section`);
    console.log(`   • UI Text now contains: Other service fields only`);

    return true;
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
};