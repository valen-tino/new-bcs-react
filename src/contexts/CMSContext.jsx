import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
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
      others: { description: '' },
      items: []
    },
    about: {
      mainPhoto: '',
      description: '',
      team: []
    },
    gallery: [],
    testimonials: [],
    contactRequests: [],
    provinces: [],
    serviceOptions: []
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
        others: { description: '' },
        items: []
      };
      try {
        const servicesDoc = await getDoc(doc(db, 'content', 'services'));
        if (servicesDoc.exists()) {
          services = servicesDoc.data();
        }
        
        // Load service items
        const serviceItemsDoc = await getDoc(doc(db, 'content', 'serviceItems'));
        if (serviceItemsDoc.exists()) {
          services.items = serviceItemsDoc.data().items || [];
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

      // Load provinces
      let provinces = [];
      try {
        const provincesDoc = await getDoc(doc(db, 'content', 'provinces'));
        provinces = provincesDoc.exists() ? provincesDoc.data().items || [] : [];
      } catch (error) {
        console.error('Error loading provinces data:', error);
      }

      // Load service options
      let serviceOptions = [];
      try {
        const serviceOptionsDoc = await getDoc(doc(db, 'content', 'serviceOptions'));
        serviceOptions = serviceOptionsDoc.exists() ? serviceOptionsDoc.data().items || [] : [];
      } catch (error) {
        console.error('Error loading service options data:', error);
      }

      // Load UI text
      let uiText = {};
      try {
        const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
        if (uiTextDoc.exists()) {
          uiText = uiTextDoc.data();
        }
      } catch (error) {
        console.error('Error loading UI text data:', error);
      }

    // Load team members
    const loadTeam = async () => {
      try {
        const teamSnapshot = await getDocs(collection(db, 'team'));
        const teamData = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContent(prev => ({ ...prev, team: teamData }));
      } catch (error) {
        console.error('Error loading team:', error);
        toast.error('Failed to load team members');
      }
    };

    // Load UI text
    const loadUIText = async () => {
      try {
        const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
        let uiText = {};
        if (uiTextDoc.exists()) {
          uiText = uiTextDoc.data();
        }
        setContent(prev => ({ ...prev, uiText }));
      } catch (error) {
        console.error('Error loading UI text:', error);
        toast.error('Failed to load UI text');
      }
    };
      
      setContent({
        visaAbroad,
        visaBali,
        services,
        about,
        gallery,
        testimonials,
        contactRequests: [],
        provinces,
        serviceOptions,
        uiText
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
  
  // Add a new visa abroad country
  const addVisaAbroad = async (countryData) => {
    try {
      // Get the current visa abroad data
      const visaAbroadDoc = await getDoc(doc(db, 'content', 'visaAbroad'));
      let countries = [];
      
      if (visaAbroadDoc.exists()) {
        countries = visaAbroadDoc.data().items || [];
      }
      
      // Generate a new ID
      const newId = countries.length > 0 ? Math.max(...countries.map(c => parseInt(c.id || '0'))) + 1 : 1;
      
      // Create the new country
      const newCountry = {
        id: newId.toString(),
        country: countryData.country,
        flag: countryData.flag,
        description: countryData.description,
        requirements: countryData.requirements || []
      };
      
      // Add to the array
      const updatedCountries = [...countries, newCountry];
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'visaAbroad'), { items: updatedCountries });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        visaAbroad: updatedCountries
      }));
      
      return newCountry;
    } catch (error) {
      console.error('Error adding visa abroad country:', error);
      toast.error('Failed to add country.');
      throw error;
    }
  };
  
  // Delete a visa abroad country
  const deleteVisaAbroad = async (id) => {
    try {
      // Get the current visa abroad data
      const visaAbroadDoc = await getDoc(doc(db, 'content', 'visaAbroad'));
      
      if (!visaAbroadDoc.exists()) {
        throw new Error('Visa abroad collection not found');
      }
      
      const countries = visaAbroadDoc.data().items || [];
      
      // Filter out the country to delete
      const updatedCountries = countries.filter(country => country.id !== id);
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'visaAbroad'), { items: updatedCountries });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        visaAbroad: updatedCountries
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting visa abroad country:', error);
      toast.error('Failed to delete country.');
      throw error;
    }
  };

  // Update visa bali content
  const updateVisaBali = async (id, visaData) => {
    try {
      // Get the current visa bali data
      const visaBaliDoc = await getDoc(doc(db, 'content', 'visaBali'));
      
      if (!visaBaliDoc.exists()) {
        throw new Error('Visa bali collection not found');
      }
      
      const visaTypes = visaBaliDoc.data().items || [];
      
      // Find the visa type to update
      const updatedVisaTypes = visaTypes.map(visa => {
        if (visa.id === id) {
          return {
            ...visa,
            type: visaData.type,
            duration: visaData.duration,
            description: visaData.description,
            requirements: visaData.requirements || []
          };
        }
        return visa;
      });
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'visaBali'), { items: updatedVisaTypes });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        visaBali: updatedVisaTypes
      }));
      
      toast.success('Visa Bali type updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating visa bali:', error);
      toast.error('Failed to update visa bali type.');
      return false;
    }
  };
  
  // Add a new visa bali type
  const addVisaBali = async (visaData) => {
    try {
      // Get the current visa bali data
      const visaBaliDoc = await getDoc(doc(db, 'content', 'visaBali'));
      let visaTypes = [];
      
      if (visaBaliDoc.exists()) {
        visaTypes = visaBaliDoc.data().items || [];
      }
      
      // Generate a new ID
      const newId = visaTypes.length > 0 ? Math.max(...visaTypes.map(v => parseInt(v.id || '0'))) + 1 : 1;
      
      // Create the new visa type
      const newVisaType = {
        id: newId.toString(),
        type: visaData.type,
        duration: visaData.duration,
        description: visaData.description,
        requirements: visaData.requirements || []
      };
      
      // Add to the array
      const updatedVisaTypes = [...visaTypes, newVisaType];
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'visaBali'), { items: updatedVisaTypes });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        visaBali: updatedVisaTypes
      }));
      
      return newVisaType;
    } catch (error) {
      console.error('Error adding visa bali type:', error);
      toast.error('Failed to add visa type.');
      throw error;
    }
  };
  
  // Delete a visa bali type
  const deleteVisaBali = async (id) => {
    try {
      // Get the current visa bali data
      const visaBaliDoc = await getDoc(doc(db, 'content', 'visaBali'));
      
      if (!visaBaliDoc.exists()) {
        throw new Error('Visa bali collection not found');
      }
      
      const visaTypes = visaBaliDoc.data().items || [];
      
      // Filter out the visa type to delete
      const updatedVisaTypes = visaTypes.filter(visa => visa.id !== id);
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'visaBali'), { items: updatedVisaTypes });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        visaBali: updatedVisaTypes
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting visa bali type:', error);
      toast.error('Failed to delete visa type.');
      throw error;
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
  
  // Add a new service
  const addService = async (serviceData) => {
    try {
      // Get the current services collection
      const servicesDoc = await getDoc(doc(db, 'content', 'serviceItems'));
      let services = [];
      
      if (servicesDoc.exists()) {
        services = servicesDoc.data().items || [];
      }
      
      // Generate a new ID
      const newId = services.length > 0 ? Math.max(...services.map(s => parseInt(s.id))) + 1 : 1;
      
      // Create the new service
      const newService = {
        id: newId.toString(),
        name: serviceData.name,
        description: serviceData.description,
        icon: serviceData.icon || '🔧'
      };
      
      // Add to the array
      const updatedServices = [...services, newService];
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'serviceItems'), { items: updatedServices });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        services: {
          ...prev.services,
          items: updatedServices
        }
      }));
      
      return newService;
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service.');
      throw error;
    }
  };
  
  // Update an existing service
  const updateService = async (id, serviceData) => {
    try {
      // Get the current services collection
      const servicesDoc = await getDoc(doc(db, 'content', 'serviceItems'));
      
      if (!servicesDoc.exists()) {
        throw new Error('Services collection not found');
      }
      
      const services = servicesDoc.data().items || [];
      
      // Update the service
      const updatedServices = services.map(service => 
        service.id === id ? { ...service, ...serviceData } : service
      );
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'serviceItems'), { items: updatedServices });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        services: {
          ...prev.services,
          items: updatedServices
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service.');
      throw error;
    }
  };
  
  // Delete a service
  const deleteService = async (id) => {
    try {
      // Get the current services collection
      const servicesDoc = await getDoc(doc(db, 'content', 'serviceItems'));
      
      if (!servicesDoc.exists()) {
        throw new Error('Services collection not found');
      }
      
      const services = servicesDoc.data().items || [];
      
      // Filter out the service to delete
      const updatedServices = services.filter(service => service.id !== id);
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'serviceItems'), { items: updatedServices });
      
      // Update local state
      setContent(prev => ({
        ...prev,
        services: {
          ...prev.services,
          items: updatedServices
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service.');
      throw error;
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

  // Add gallery image
  const addGalleryImage = async (imageData) => {
    try {
      const galleryDoc = await getDoc(doc(db, 'content', 'gallery'));
      let currentGallery = [];
      
      if (galleryDoc.exists()) {
        currentGallery = galleryDoc.data().items || [];
      }
      
      const newId = currentGallery.length > 0 ? Math.max(...currentGallery.map(img => parseInt(img.id) || 0)) + 1 : 1;
      const newImage = {
        id: newId.toString(),
        src: imageData.src,
        alt: imageData.alt
      };
      
      const updatedGallery = [...currentGallery, newImage];
      await setDoc(doc(db, 'content', 'gallery'), { items: updatedGallery });
      setContent(prev => ({ ...prev, gallery: updatedGallery }));
      toast.success('Image added to gallery successfully!');
      return true;
    } catch (error) {
      console.error('Error adding gallery image:', error);
      toast.error('Failed to add image to gallery.');
      return false;
    }
  };

  // Delete gallery image
  const deleteGalleryImage = async (imageId) => {
    try {
      const galleryDoc = await getDoc(doc(db, 'content', 'gallery'));
      
      if (!galleryDoc.exists()) {
        throw new Error('Gallery collection not found');
      }
      
      const currentGallery = galleryDoc.data().items || [];
      const updatedGallery = currentGallery.filter(image => image.id !== imageId);
      
      await setDoc(doc(db, 'content', 'gallery'), { items: updatedGallery });
      setContent(prev => ({ ...prev, gallery: updatedGallery }));
      toast.success('Image deleted from gallery successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Failed to delete image from gallery.');
      return false;
    }
  };

  // Add testimonial
  const addTestimonial = async (testimonial) => {
    try {
      // Set default status to pending if not provided
      const testimonialWithStatus = {
        ...testimonial,
        status: testimonial.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'testimonials'), testimonialWithStatus);
      const newTestimonial = { id: docRef.id, ...testimonialWithStatus };
      
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
  
  // Publish testimonial - change status to 'published'
  const publishTestimonial = async (id) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date()
      });
      setContent(prev => ({
        ...prev,
        testimonials: prev.testimonials.map(t => 
          t.id === id ? { ...t, status: 'published', publishedAt: new Date(), updatedAt: new Date() } : t
        )
      }));
      toast.success('Testimonial published successfully!');
      return true;
    } catch (error) {
      console.error('Error publishing testimonial:', error);
      toast.error('Failed to publish testimonial.');
      return false;
    }
  };
  
  // Archive testimonial - change status to 'archived'
  const archiveTestimonial = async (id) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        status: 'archived',
        archivedAt: new Date(),
        updatedAt: new Date()
      });
      setContent(prev => ({
        ...prev,
        testimonials: prev.testimonials.map(t => 
          t.id === id ? { ...t, status: 'archived', archivedAt: new Date(), updatedAt: new Date() } : t
        )
      }));
      toast.success('Testimonial archived successfully!');
      return true;
    } catch (error) {
      console.error('Error archiving testimonial:', error);
      toast.error('Failed to archive testimonial.');
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
        createdAt: serverTimestamp(),
        isRead: false
      });
      return true;
    } catch (error) {
      console.error('Error submitting contact request:', error);
      return false;
    }
  };

  // Delete contact request
  const deleteContactRequest = async (id) => {
    try {
      await deleteDoc(doc(db, 'contactRequests', id));
      return true;
    } catch (error) {
      console.error('Error deleting contact request:', error);
      return false;
    }
  };

  // Provinces and service options updaters
  const updateProvinces = async (items) => {
    try {
      await setDoc(doc(db, 'content', 'provinces'), { items });
      setContent(prev => ({ ...prev, provinces: items }));
      toast.success('Provinces updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating provinces:', error);
      toast.error('Failed to update provinces.');
      return false;
    }
  };

  const updateServiceOptions = async (items) => {
    try {
      await setDoc(doc(db, 'content', 'serviceOptions'), { items });
      setContent(prev => ({ ...prev, serviceOptions: items }));
      toast.success('Service options updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating service options:', error);
      toast.error('Failed to update service options.');
      return false;
    }
  };

  // Update UI text content
  const updateUIText = async (section, content) => {
    try {
      const uiTextRef = doc(db, 'content', 'uiText');
      const uiTextDoc = await getDoc(uiTextRef);
      
      let currentContent = {};
      if (uiTextDoc.exists()) {
        currentContent = uiTextDoc.data();
      }
      
      // Merge the new content with existing content
      const updatedContent = {
        ...currentContent,
        [section]: content
      };
      
      await setDoc(uiTextRef, updatedContent);
      setContent(prev => ({ ...prev, uiText: updatedContent }));
      toast.success(`${section} content updated successfully!`);
      return true;
    } catch (error) {
      console.error('Error updating UI text:', error);
      toast.error('Failed to update UI text content.');
      return false;
    }
  };

  // Add a new team member
  const addTeamMember = async (memberData) => {
    try {
      // Get the current about data
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      let aboutData = {
        mainPhoto: '',
        description: '',
        team: []
      };
      
      if (aboutDoc.exists()) {
        aboutData = aboutDoc.data();
      }
      
      // Generate a new ID
      const teamMembers = aboutData.team || [];
      const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => parseInt(m.id || '0'))) + 1 : 1;
      
      // Create the new team member
      const newMember = {
        id: newId.toString(),
        name: memberData.name,
        position: memberData.position,
        image: memberData.image,
        description: memberData.description
      };
      
      // Add to the team array
      const updatedTeam = [...teamMembers, newMember];
      const updatedAbout = { ...aboutData, team: updatedTeam };
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'about'), updatedAbout);
      
      // Update local state
      setContent(prev => ({
        ...prev,
        about: updatedAbout
      }));
      
      return newMember;
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member.');
      throw error;
    }
  };
  
  // Update a team member
  const updateTeam = async (id, memberData) => {
    try {
      // Get the current about data
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      
      if (!aboutDoc.exists()) {
        throw new Error('About data not found');
      }
      
      const aboutData = aboutDoc.data();
      const teamMembers = aboutData.team || [];
      
      // Find the team member to update
      const updatedTeam = teamMembers.map(member => {
        if (member.id === id) {
          return {
            ...member,
            name: memberData.name,
            position: memberData.position,
            image: memberData.image,
            description: memberData.description
          };
        }
        return member;
      });
      
      const updatedAbout = { ...aboutData, team: updatedTeam };
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'about'), updatedAbout);
      
      // Update local state
      setContent(prev => ({
        ...prev,
        about: updatedAbout
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member.');
      throw error;
    }
  };
  
  // Delete a team member
  const deleteTeamMember = async (id) => {
    try {
      // Get the current about data
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      
      if (!aboutDoc.exists()) {
        throw new Error('About data not found');
      }
      
      const aboutData = aboutDoc.data();
      const teamMembers = aboutData.team || [];
      
      // Filter out the team member to delete
      const updatedTeam = teamMembers.filter(member => member.id !== id);
      const updatedAbout = { ...aboutData, team: updatedTeam };
      
      // Save to Firestore
      await setDoc(doc(db, 'content', 'about'), updatedAbout);
      
      // Update local state
      setContent(prev => ({
        ...prev,
        about: updatedAbout
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member.');
      throw error;
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
    // Individual content properties for easier access
    services: content.services,
    visaAbroad: content.visaAbroad,
    visaBali: content.visaBali,
    about: content.about,
    team: content.about?.team || [],
    gallery: content.gallery,
    testimonials: content.testimonials,
    contactRequests: content.contactRequests,
    provinces: content.provinces,
    serviceOptions: content.serviceOptions,
    uiText: content.uiText || {},
    loading,
    unreadRequests,
    updateVisaAbroad,
    addVisaAbroad,
    deleteVisaAbroad,
    updateVisaBali,
    addVisaBali,
    deleteVisaBali,
    updateServices,
    updateService,
    addService,
    deleteService,
    updateAbout,
    addTeamMember,
    updateTeam,
    deleteTeamMember,
    updateGallery,
    addGalleryImage,
    deleteGalleryImage,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    publishTestimonial,
    archiveTestimonial,
    markRequestAsRead,
    submitContactRequest,
    deleteContactRequest,
    updateProvinces,
    updateServiceOptions,
    updateUIText,
    loadContent,
    // Notification methods
    getNotification,
    updateNotification,
    createNotification,
    deleteNotification,
    activeNotification,
    notifications
  };

  // The value object is already defined above with all necessary properties

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
}