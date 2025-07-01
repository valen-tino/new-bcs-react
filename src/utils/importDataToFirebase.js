import { db } from '../config/firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Import data files
import dataVisaAbroad from '../data/dataVisaAbroad';
import dataVisaBali from '../data/dataVisaBali';
import dataGallery from '../data/dataGallery';
import dataTeam from '../data/dataTeam';
import dataTestimonial from '../data/dataTestimonial';
import dataServices from '../data/dataServices';

// Import content from section files
import { content as notifContent } from '../sections/notif/content';
import { content as headerContent } from '../sections/header/content';
import { content as navContent } from '../sections/nav/content';
import { content as footerContent } from '../sections/footer/content';
import { content as galleryContent } from '../sections/gallery/content';
import { content as servicesContent } from '../sections/services/content';
import { content as aboutContent } from '../sections/about/content';

/**
 * Import all data from local files to Firebase
 * @returns {Promise<boolean>} - True if import was successful
 */
export const importAllData = async () => {
  try {
    // Show loading toast
    const loadingToast = toast.loading('Importing data to Firebase...');
    
    // Import all data in parallel
    await Promise.all([
      importVisaAbroadToFirebase(),
      importVisaBaliToFirebase(),
      importServicesToFirebase(),
      importTeamToFirebase(),
      importGalleryToFirebase(),
      importTestimonialsToFirebase(),
      importNotificationToFirebase(),
      importUITextToFirebase()
    ]);
    
    // Update toast to success
    toast.update(loadingToast, { 
      render: 'All data imported successfully!', 
      type: 'success', 
      isLoading: false,
      autoClose: 3000
    });
    
    return true;
  } catch (error) {
    console.error('Error importing all data:', error);
    toast.error('Failed to import all data');
    return false;
  }
};

/**
 * Import Visa Abroad data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importVisaAbroadToFirebase = async () => {
  try {
    const items = dataVisaAbroad.VisaAbroad.map(item => ({
      id: item.id,
      title: item.title,
      desc: item.desc
    }));
    
    await setDoc(doc(db, 'content', 'visaAbroad'), { items });
    toast.success('Visa Abroad data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Visa Abroad data:', error);
    toast.error('Failed to import Visa Abroad data.');
    return false;
  }
};

/**
 * Import Visa Bali data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importVisaBaliToFirebase = async () => {
  try {
    const items = dataVisaBali.VisaBali.map(item => ({
      id: item.id,
      title: item.title,
      desc: item.desc
    }));
    
    await setDoc(doc(db, 'content', 'visaBali'), { items });
    toast.success('Visa Bali data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Visa Bali data:', error);
    toast.error('Failed to import Visa Bali data.');
    return false;
  }
};

/**
 * Import Services data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importServicesToFirebase = async () => {
  try {
    // Create a services object with data from dataServices and content from servicesContent
    const services = {
      content: servicesContent,
      wedding: { 
        description: servicesContent.English.weddingdesc,
        title: servicesContent.English.wedding,
        subtitle: servicesContent.English.weddingsub
      },
      translation: { 
        description: servicesContent.English.translatedesc,
        title: servicesContent.English.translate
      },
      travel: { 
        description: servicesContent.English.traveldesc,
        title: servicesContent.English.travel,
        subtitle: servicesContent.English.travelsub
      },
      others: { 
        description: servicesContent.English.otherssub,
        title: servicesContent.English.others
      },
      updatedAt: serverTimestamp()
    };

    // Import services to Firestore
    await setDoc(doc(db, 'content', 'services'), services);
    
    // Create service items for the CMS
    const serviceItems = {
      items: dataServices.map(service => ({
        id: service.id.toString(),
        name: service.services,
        description: "",
        icon: "🔧"
      })),
      updatedAt: serverTimestamp()
    };
    
    // Import service items to Firestore
    await setDoc(doc(db, 'content', 'serviceItems'), serviceItems);
    
    toast.success('Services data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Services data:', error);
    toast.error('Failed to import Services data.');
    return false;
  }
};

/**
 * Import Gallery data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importGalleryToFirebase = async () => {
  try {
    const items = dataGallery.Images.map(item => ({
      id: item.id,
      path: item.path,
      alt: item.alt
    }));
    
    await setDoc(doc(db, 'content', 'gallery'), { items });
    toast.success('Gallery data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Gallery data:', error);
    toast.error('Failed to import Gallery data.');
    return false;
  }
};

/**
 * Import Team data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importTeamToFirebase = async () => {
  try {
    const team = dataTeam.OurTeam.map(member => ({
      id: member.id,
      name: member.name,
      title: member.title,
      desc: member.desc,
      path: member.path
    }));
    
    const about = {
      team,
      content: aboutContent,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'content', 'about'), about);
    toast.success('Team data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Team data:', error);
    toast.error('Failed to import Team data.');
    return false;
  }
};

/**
 * Import Testimonials data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importTestimonialsToFirebase = async () => {
  try {
    // Clear existing testimonials first
    // Note: In a production environment, you might want to check for existing data first
    
    // Add each testimonial as a separate document
    const promises = dataTestimonial.Testi.map(async (testimonial) => {
      await addDoc(collection(db, 'testimonials'), {
        clientName: testimonial.clientName,
        email: testimonial.email,
        desc: testimonial.desc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    
    await Promise.all(promises);
    toast.success('Testimonials data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Testimonials data:', error);
    toast.error('Failed to import Testimonials data.');
    return false;
  }
};

/**
 * Import Notification data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importNotificationToFirebase = async () => {
  try {
    const notificationData = {
      English: notifContent.English,
      Indonesia: notifContent.Indonesia,
      imageType: 'default',
      isActive: true,
      scheduledDate: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'notifications', 'default'), notificationData);
    toast.success('Notification data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing Notification data:', error);
    toast.error('Failed to import Notification data.');
    return false;
  }
};

/**
 * Import UI Text Content data to Firebase
 * @returns {Promise<boolean>} Success status
 */
export const importUITextToFirebase = async () => {
  try {
    const uiTextData = {
      header: headerContent,
      nav: navContent,
      footer: footerContent,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'content', 'uiText'), uiTextData);
    toast.success('UI Text data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing UI Text data:', error);
    toast.error('Failed to import UI Text data.');
    return false;
  }
};