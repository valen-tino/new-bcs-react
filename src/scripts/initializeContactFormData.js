import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

/**
 * Initialize Service Options for Contact Form
 * This script ensures that service options are available for the contact form
 */
export const initializeServiceOptions = async () => {
  try {
    console.log('🔧 Initializing service options for contact form...');

    // Check if service options already exist
    const serviceOptionsDoc = await getDoc(doc(db, 'content', 'serviceOptions'));
    
    if (serviceOptionsDoc.exists() && serviceOptionsDoc.data().items?.length > 0) {
      console.log('✅ Service options already exist');
      return true;
    }

    // Create default service options
    const defaultServiceOptions = {
      items: [
        { id: '1', services: 'Visa Assistance Abroad' },
        { id: '2', services: 'Visa Assistance in Bali' },
        { id: '3', services: 'Wedding Ceremony Organizer' },
        { id: '4', services: 'Translation Documents' },
        { id: '5', services: 'Travel Insurance' },
        { id: '6', services: 'Other Services' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to Firestore
    await setDoc(doc(db, 'content', 'serviceOptions'), defaultServiceOptions);

    console.log('✅ Service options initialized successfully!');
    console.log('📋 Created service options:', defaultServiceOptions.items);

    return true;
  } catch (error) {
    console.error('❌ Error initializing service options:', error);
    return false;
  }
};

/**
 * Initialize Provinces for Contact Form
 * This script ensures that provinces are available for the contact form
 */
export const initializeProvinces = async () => {
  try {
    console.log('🌍 Initializing provinces for contact form...');

    // Check if provinces already exist
    const provincesDoc = await getDoc(doc(db, 'content', 'provinces'));
    
    if (provincesDoc.exists() && provincesDoc.data().items?.length > 0) {
      console.log('✅ Provinces already exist');
      return true;
    }

    // Create default Indonesian provinces (major ones)
    const defaultProvinces = {
      items: [
        { id: '1', name: 'DKI Jakarta' },
        { id: '2', name: 'Jawa Barat' },
        { id: '3', name: 'Jawa Tengah' },
        { id: '4', name: 'Jawa Timur' },
        { id: '5', name: 'Bali' },
        { id: '6', name: 'Sumatera Utara' },
        { id: '7', name: 'Sumatera Barat' },
        { id: '8', name: 'Sumatera Selatan' },
        { id: '9', name: 'Kalimantan Barat' },
        { id: '10', name: 'Kalimantan Timur' },
        { id: '11', name: 'Sulawesi Selatan' },
        { id: '12', name: 'Sulawesi Utara' },
        { id: '13', name: 'Papua' },
        { id: '14', name: 'Nusa Tenggara Barat' },
        { id: '15', name: 'Nusa Tenggara Timur' },
        { id: '16', name: 'Maluku' },
        { id: '17', name: 'Aceh' },
        { id: '18', name: 'Lampung' },
        { id: '19', name: 'Riau' },
        { id: '20', name: 'Yogyakarta' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to Firestore
    await setDoc(doc(db, 'content', 'provinces'), defaultProvinces);

    console.log('✅ Provinces initialized successfully!');
    console.log('📍 Created provinces count:', defaultProvinces.items.length);

    return true;
  } catch (error) {
    console.error('❌ Error initializing provinces:', error);
    return false;
  }
};

/**
 * Initialize all contact form data
 */
export const initializeContactFormData = async () => {
  try {
    console.log('🚀 Initializing all contact form data...');
    
    const serviceOptionsResult = await initializeServiceOptions();
    const provincesResult = await initializeProvinces();
    
    if (serviceOptionsResult && provincesResult) {
      console.log('✅ All contact form data initialized successfully!');
      toast.success('Contact form data initialized successfully!');
      return true;
    } else {
      console.log('⚠️ Some initialization failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    toast.error('Failed to initialize contact form data');
    return false;
  }
};