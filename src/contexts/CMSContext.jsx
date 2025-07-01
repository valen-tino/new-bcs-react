import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNotification } from './NotificationContext';

const CMSContext = createContext();

export function useCMS() {
  return useContext(CMSContext);
}

export function CMSProvider({ children }) {
  const [content, setContent] = useState({
    visaAbroad: [],
    visaBali: [],
    services: {
      wedding: { description: '' },
      translation: { description: '' },
      travel: { description: '' },
      others: { description: '' }
    },
    about: {
      mainPhoto: '',
      description: '',
      team: []
    },
    gallery: [],
    testimonials: [],
    contactRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [unreadRequests, setUnreadRequests] = useState(0);
  const notificationContext = useNotification();

  // Load all content from Firestore
  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Load visa abroad data
      let visaAbroad = [];
      try {
        const visaAbroadDoc = await getDoc(doc(db, 'content', 'visaAbroad'));
        visaAbroad = visaAbroadDoc.exists() ? visaAbroadDoc.data().items || [] : [];
      } catch (error) {
        console.error('Error loading visa abroad data:', error);
      }
      
      // Load visa bali data
      let visaBali = [];
      try {
        const visaBaliDoc = await getDoc(doc(db, 'content', 'visaBali'));
        visaBali = visaBaliDoc.exists() ? visaBaliDoc.data().items || [] : [];
      } catch (error) {
        console.error('Error loading visa bali data:', error);
      }
      
      // Load services data
      let services = {
        wedding: { description: '' },
        translation: { description: '' },
        travel: { description: '' },
        others: { description: '' }
      };
      try {
        const servicesDoc = await getDoc(doc(db, 'content', 'services'));
        if (servicesDoc.exists()) {
          services = servicesDoc.data();
        }
      } catch (error) {
        console.error('Error loading services data:', error);
      }
      
      // Load about data
      let about = {
        mainPhoto: '',
        description: '',
        team: []
      };
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if (aboutDoc.exists()) {
          about = aboutDoc.data();
        }
      } catch (error) {
        console.error('Error loading about data:', error);
      }
      
      // Load gallery data
      let gallery = [];
      try {
        const galleryDoc = await getDoc(doc(db, 'content', 'gallery'));
        gallery = galleryDoc.exists() ? galleryDoc.data().items || [] : [];
      } catch (error) {
        console.error('Error loading gallery data:', error);
      }
      
      // Load testimonials
      let testimonials = [];
      try {
        const testimonialsSnapshot = await getDocs(query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')));
        testimonials = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error loading testimonials data:', error);
      }
      
      setContent({
        visaAbroad,
        visaBali,
        services,
        about,
        gallery,
        testimonials,
        contactRequests: []
      });
      
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content.');
    } finally {
      setLoading(false);
    }
  };

  // Listen to contact requests in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContent(prev => ({ ...prev, contactRequests: requests }));
        
        // Count unread requests
        const unread = requests.filter(req => !req.isRead).length;
        setUnreadRequests(unread);
      },
      (error) => {
        console.error('Error listening to contact requests:', error);
      }
    );

    return unsubscribe;
  }, []);

  // Update visa abroad content
  const updateVisaAbroad = async (items) => {
    try {
      await setDoc(doc(db, 'content', 'visaAbroad'), { items });
      setContent(prev => ({ ...prev, visaAbroad: items }));
      toast.success('Visa Abroad content updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating visa abroad:', error);
      toast.error('Failed to update visa abroad content.');
      return false;
    }
  };

  // Update visa bali content
  const updateVisaBali = async (items) => {
    try {
      await setDoc(doc(db, 'content', 'visaBali'), { items });
      setContent(prev => ({ ...prev, visaBali: items }));
      toast.success('Visa Bali content updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating visa bali:', error);
      toast.error('Failed to update visa bali content.');
      return false;
    }
  };

  // Update services content
  const updateServices = async (serviceType, description) => {
    try {
      const updatedServices = {
        ...content.services,
        [serviceType]: { description }
      };
      await setDoc(doc(db, 'content', 'services'), updatedServices);
      setContent(prev => ({ ...prev, services: updatedServices }));
      toast.success(`${serviceType} service updated successfully!`);
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service.');
      return false;
    }
  };

  // Update about content
  const updateAbout = async (aboutData) => {
    try {
      await setDoc(doc(db, 'content', 'about'), aboutData);
      setContent(prev => ({ ...prev, about: aboutData }));
      toast.success('About section updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating about:', error);
      toast.error('Failed to update about section.');
      return false;
    }
  };

  // Update gallery
  const updateGallery = async (items) => {
    try {
      await setDoc(doc(db, 'content', 'gallery'), { items });
      setContent(prev => ({ ...prev, gallery: items }));
      toast.success('Gallery updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating gallery:', error);
      toast.error('Failed to update gallery.');
      return false;
    }
  };

  // Add testimonial
  const addTestimonial = async (testimonial) => {
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonial,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const newTestimonial = { id: docRef.id, ...testimonial, createdAt: new Date(), updatedAt: new Date() };
      setContent(prev => ({ 
        ...prev, 
        testimonials: [newTestimonial, ...prev.testimonials] 
      }));
      toast.success('Testimonial added successfully!');
      return true;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial.');
      return false;
    }
  };

  // Update testimonial
  const updateTestimonial = async (id, testimonial) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        ...testimonial,
        updatedAt: new Date()
      });
      setContent(prev => ({
        ...prev,
        testimonials: prev.testimonials.map(t => 
          t.id === id ? { ...t, ...testimonial, updatedAt: new Date() } : t
        )
      }));
      toast.success('Testimonial updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial.');
      return false;
    }
  };

  // Delete testimonial
  const deleteTestimonial = async (id) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setContent(prev => ({
        ...prev,
        testimonials: prev.testimonials.filter(t => t.id !== id)
      }));
      toast.success('Testimonial deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial.');
      return false;
    }
  };

  // Mark contact request as read
  const markRequestAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'contactRequests', id), {
        isRead: true,
        readAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error marking request as read:', error);
      return false;
    }
  };

  // Submit contact request (for the public form)
  const submitContactRequest = async (requestData) => {
    try {
      await addDoc(collection(db, 'contactRequests'), {
        ...requestData,
        createdAt: new Date(),
        isRead: false
      });
      return true;
    } catch (error) {
      console.error('Error submitting contact request:', error);
      return false;
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Notification methods from NotificationContext
  const { 
    getNotification, 
    updateNotification, 
    createNotification, 
    deleteNotification,
    activeNotification,
    notifications
  } = notificationContext;

  const value = {
    content,
    loading,
    unreadRequests,
    updateVisaAbroad,
    updateVisaBali,
    updateServices,
    updateAbout,
    updateGallery,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    markRequestAsRead,
    submitContactRequest,
    loadContent,
    // Notification methods
    getNotification,
    updateNotification,
    createNotification,
    deleteNotification,
    activeNotification,
    notifications
  };

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
}