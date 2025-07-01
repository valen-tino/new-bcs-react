import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Import content from section files
import { content as headerContent } from '../sections/header/content';
import { content as navContent } from '../sections/nav/content';
import { content as footerContent } from '../sections/footer/content';
import { content as servicesContent } from '../sections/services/content';
import { content as aboutContent } from '../sections/about/content';
import { content as galleryContent } from '../sections/gallery/content';

/**
 * Import UI text content from local files to Firebase
 * @returns {Promise<boolean>} - True if import was successful
 */
export const importUITextToFirebase = async () => {
  try {
    // Create a batch of promises to import all UI text content
    const importPromises = [
      // Import header content
      setDoc(doc(db, 'uiText', 'header'), {
        ...headerContent,
        updatedAt: serverTimestamp(),
        importedAt: serverTimestamp()
      }),
      
      // Import nav content
      setDoc(doc(db, 'uiText', 'nav'), {
        ...navContent,
        updatedAt: serverTimestamp(),
        importedAt: serverTimestamp()
      }),
      
      // Import footer content
      setDoc(doc(db, 'uiText', 'footer'), {
        ...footerContent,
        updatedAt: serverTimestamp(),
        importedAt: serverTimestamp()
      }),
      
      // Import services content
      setDoc(doc(db, 'uiText', 'services'), {
        ...servicesContent,
        updatedAt: serverTimestamp(),
        importedAt: serverTimestamp()
      }),
      
      // Import about content
      setDoc(doc(db, 'uiText', 'about'), {
        ...aboutContent,
        updatedAt: serverTimestamp(),
        importedAt: serverTimestamp()
      }),
      
      // Import gallery content
      setDoc(doc(db, 'uiText', 'gallery'), {
        ...galleryContent,
        updatedAt: serverTimestamp(),
        importedAt: serverTimestamp()
      })
    ];
    
    // Execute all import promises
    await Promise.all(importPromises);
    
    toast.success('UI text content imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing UI text content:', error);
    toast.error('Failed to import UI text content');
    return false;
  }
};

/**
 * Import a specific UI text section from local files to Firebase
 * @param {string} section - The section to import (header, nav, footer, services, about, gallery)
 * @returns {Promise<boolean>} - True if import was successful
 */
export const importUITextSectionToFirebase = async (section) => {
  try {
    let contentToImport;
    
    // Get the content for the specified section
    switch (section) {
      case 'header':
        contentToImport = headerContent;
        break;
      case 'nav':
        contentToImport = navContent;
        break;
      case 'footer':
        contentToImport = footerContent;
        break;
      case 'services':
        contentToImport = servicesContent;
        break;
      case 'about':
        contentToImport = aboutContent;
        break;
      case 'gallery':
        contentToImport = galleryContent;
        break;
      default:
        throw new Error(`Unknown section: ${section}`);
    }
    
    // Import the content
    await setDoc(doc(db, 'uiText', section), {
      ...contentToImport,
      updatedAt: serverTimestamp(),
      importedAt: serverTimestamp()
    });
    
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} text imported successfully`);
    return true;
  } catch (error) {
    console.error(`Error importing ${section} UI text:`, error);
    toast.error(`Failed to import ${section} text`);
    return false;
  }
};