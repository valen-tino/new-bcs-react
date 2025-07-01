import { db } from '../config/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Import data from local files
import { dataVisaAbroad } from '../data/dataVisaAbroad';
import { dataVisaBali } from '../data/dataVisaBali';
import { dataServices } from '../data/dataServices';
import { dataGallery } from '../data/dataGallery';
import { dataTeam } from '../data/dataTeam';
import { dataTestimonial } from '../data/dataTestimonial';
import { content as notifContent } from '../sections/notif/content';

// Import content from section files
import { content as aboutContent } from '../sections/about/content';
import { content as footerContent } from '../sections/footer/content';
import { content as galleryContent } from '../sections/gallery/content';
import { content as headerContent } from '../sections/header/content';
import { content as navContent } from '../sections/nav/content';
import { content as servicesContent } from '../sections/services/content';

/**
 * Import Visa Abroad data to Firestore
 */
export const importVisaAbroadData = async () => {
  try {
    const visaAbroadRef = doc(db, 'content', 'visaAbroad');
    await setDoc(visaAbroadRef, {
      countries: dataVisaAbroad,
      updatedAt: serverTimestamp()
    });
    toast.success('Visa Abroad data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing Visa Abroad data:', error);
    toast.error('Failed to import Visa Abroad data');
    return false;
  }
};

/**
 * Import Visa Bali data to Firestore
 */
export const importVisaBaliData = async () => {
  try {
    const visaBaliRef = doc(db, 'content', 'visaBali');
    await setDoc(visaBaliRef, {
      visas: dataVisaBali,
      updatedAt: serverTimestamp()
    });
    toast.success('Visa Bali data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing Visa Bali data:', error);
    toast.error('Failed to import Visa Bali data');
    return false;
  }
};

/**
 * Import Services data to Firestore
 */
export const importServicesData = async () => {
  try {
    const servicesRef = doc(db, 'content', 'services');
    await setDoc(servicesRef, {
      services: dataServices,
      content: servicesContent,
      updatedAt: serverTimestamp()
    });
    toast.success('Services data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing Services data:', error);
    toast.error('Failed to import Services data');
    return false;
  }
};

/**
 * Import About data to Firestore
 */
export const importAboutData = async () => {
  try {
    const aboutRef = doc(db, 'content', 'about');
    await setDoc(aboutRef, {
      team: dataTeam,
      content: aboutContent,
      updatedAt: serverTimestamp()
    });
    toast.success('About data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing About data:', error);
    toast.error('Failed to import About data');
    return false;
  }
};

/**
 * Import Gallery data to Firestore
 */
export const importGalleryData = async () => {
  try {
    const galleryRef = doc(db, 'content', 'gallery');
    await setDoc(galleryRef, {
      images: dataGallery,
      content: galleryContent,
      updatedAt: serverTimestamp()
    });
    toast.success('Gallery data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing Gallery data:', error);
    toast.error('Failed to import Gallery data');
    return false;
  }
};

/**
 * Import Testimonials data to Firestore
 */
export const importTestimonialsData = async () => {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    
    // Add each testimonial as a separate document
    for (const testimonial of dataTestimonial) {
      const testimonialRef = doc(testimonialsRef);
      await setDoc(testimonialRef, {
        ...testimonial,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    toast.success('Testimonials data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing Testimonials data:', error);
    toast.error('Failed to import Testimonials data');
    return false;
  }
};

/**
 * Import Notification data to Firestore
 */
export const importNotificationData = async () => {
  try {
    const notificationRef = doc(db, 'notifications', 'default');
    await setDoc(notificationRef, {
      English: notifContent.English,
      Indonesia: notifContent.Indonesia,
      imageType: 'default',
      isActive: true,
      scheduledDate: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    toast.success('Notification data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing Notification data:', error);
    toast.error('Failed to import Notification data');
    return false;
  }
};

/**
 * Import UI Text Content data to Firestore
 */
export const importUITextData = async () => {
  try {
    const uiTextRef = doc(db, 'content', 'uiText');
    await setDoc(uiTextRef, {
      header: headerContent,
      nav: navContent,
      footer: footerContent,
      updatedAt: serverTimestamp()
    });
    toast.success('UI Text data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing UI Text data:', error);
    toast.error('Failed to import UI Text data');
    return false;
  }
};

/**
 * Import all data to Firestore
 */
export const importAllData = async () => {
  try {
    toast.info('Starting data import...');
    
    await importVisaAbroadData();
    await importVisaBaliData();
    await importServicesData();
    await importAboutData();
    await importGalleryData();
    await importTestimonialsData();
    await importNotificationData();
    await importUITextData();
    
    toast.success('All data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing all data:', error);
    toast.error('Failed to import all data');
    return false;
  }
};