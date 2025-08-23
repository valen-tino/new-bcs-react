import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot, 
  serverTimestamp,
  limit 
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { generateAnnouncementSlug, generateUniqueSlug, extractTextForSlug } from '../utils/slugUtils';

const AnnouncementContext = createContext();

export function useAnnouncements() {
  return useContext(AnnouncementContext);
}

export function AnnouncementProvider({ children }) {
  const [announcements, setAnnouncements] = useState([]);
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all announcements
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const announcementsQuery = query(
        collection(db, 'announcements'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(announcementsQuery);
      const announcementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAnnouncements(announcementsData);
      
      // Find the currently active announcement
      const activeAnnouncementData = announcementsData.find(announcement => 
        announcement.status === 'active' && 
        announcement.showOnMain === true &&
        (!announcement.scheduledDate || new Date(announcement.scheduledDate.seconds * 1000) <= new Date())
      );
      
      setActiveAnnouncement(activeAnnouncementData || null);
      
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  // Get active announcement for main site
  const getActiveAnnouncement = async () => {
    try {
      const now = new Date();
      const activeQuery = query(
        collection(db, 'announcements'),
        where('status', '==', 'active'),
        where('showOnMain', '==', true),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const snapshot = await getDocs(activeQuery);
      
      if (!snapshot.empty) {
        const announcement = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
        
        // Check if scheduled date has passed
        if (!announcement.scheduledDate || 
            new Date(announcement.scheduledDate.seconds * 1000) <= now) {
          return announcement;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting active announcement:', error);
      return null;
    }
  };

  // Create new announcement
  const createAnnouncement = async (announcementData) => {
    try {
      // Generate slug from title
      const baseSlug = generateAnnouncementSlug(announcementData);
      const existingSlugs = announcements.map(a => a.slug).filter(Boolean);
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
      
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...announcementData,
        slug: uniqueSlug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      await loadAnnouncements(); // Refresh the list
      toast.success('Announcement created successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
      return null;
    }
  };

  // Update announcement
  const updateAnnouncement = async (id, updates) => {
    try {
      const docRef = doc(db, 'announcements', id);
      
      // If title is being updated, regenerate slug
      if (updates.title) {
        const baseSlug = generateAnnouncementSlug(updates);
        const existingSlugs = announcements
          .filter(a => a.id !== id)
          .map(a => a.slug)
          .filter(Boolean);
        const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
        updates.slug = uniqueSlug;
      }
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      await loadAnnouncements(); // Refresh the list
      toast.success('Announcement updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
      return false;
    }
  };

  // Delete announcement
  const deleteAnnouncement = async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      await loadAnnouncements(); // Refresh the list
      toast.success('Announcement deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
      return false;
    }
  };

  // Toggle announcement status
  const toggleAnnouncementStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return await updateAnnouncement(id, { status: newStatus });
  };

  // Set announcement as active on main site
  const setAsMainAnnouncement = async (id) => {
    try {
      // First, set all other announcements to not show on main
      const batch = [];
      announcements.forEach(announcement => {
        if (announcement.id !== id && announcement.showOnMain) {
          batch.push(updateAnnouncement(announcement.id, { showOnMain: false }));
        }
      });
      
      // Wait for all updates to complete
      await Promise.all(batch);
      
      // Then set the selected announcement as main
      await updateAnnouncement(id, { 
        showOnMain: true, 
        status: 'active' 
      });
      
      return true;
    } catch (error) {
      console.error('Error setting main announcement:', error);
      toast.error('Failed to set main announcement');
      return false;
    }
  };

  // Get announcement by ID
  const getAnnouncementById = async (id) => {
    try {
      const docRef = doc(db, 'announcements', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting announcement:', error);
      return null;
    }
  };

  // Get announcement by slug
  const getAnnouncementBySlug = async (slug) => {
    try {
      const announcementsQuery = query(
        collection(db, 'announcements'),
        where('slug', '==', slug),
        limit(1)
      );
      
      const snapshot = await getDocs(announcementsQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting announcement by slug:', error);
      return null;
    }
  };

  // Setup real-time listener for announcements
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'announcements'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const announcementsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAnnouncements(announcementsData);
        
        // Update active announcement
        const activeAnnouncementData = announcementsData.find(announcement => 
          announcement.status === 'active' && 
          announcement.showOnMain === true &&
          (!announcement.scheduledDate || new Date(announcement.scheduledDate.seconds * 1000) <= new Date())
        );
        
        setActiveAnnouncement(activeAnnouncementData || null);
      },
      (error) => {
        console.error('Error in announcements listener:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Load announcements on mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const value = {
    announcements,
    activeAnnouncement,
    loading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementStatus,
    setAsMainAnnouncement,
    getAnnouncementById,
    getAnnouncementBySlug,
    getActiveAnnouncement,
    loadAnnouncements
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}