import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, onSnapshot, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all notifications
  useEffect(() => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
        const notificationsList = [];
        snapshot.forEach((doc) => {
          notificationsList.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(notificationsList);
        
        // Find active notification
        const now = new Date();
        const active = notificationsList.find(notif => {
          // Check if notification is active
          if (!notif.isActive) return false;
          
          // Check if it's scheduled for the future
          if (notif.scheduledDate) {
            const scheduleDate = notif.scheduledDate instanceof Timestamp 
              ? notif.scheduledDate.toDate() 
              : new Date(notif.scheduledDate);
            return scheduleDate <= now;
          }
          
          // No schedule, but active
          return true;
        });
        
        setActiveNotification(active || null);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching notifications:', err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up notifications listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Get a specific notification
  const getNotification = async (id = 'default') => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      const notificationSnap = await getDoc(notificationRef);
      
      if (notificationSnap.exists()) {
        return { id: notificationSnap.id, ...notificationSnap.data() };
      } else {
        // Return default structure if notification doesn't exist
        return {
          English: {
            update: 'Important Update',
            ck: 'Check it out',
            title: 'Notification Title',
            sub: 'Notification Subtitle',
            desc: 'Notification description goes here.'
          },
          Indonesia: {
            update: 'Pembaruan Penting',
            ck: 'Lihat selengkapnya',
            title: 'Judul Notifikasi',
            sub: 'Subjudul Notifikasi',
            desc: 'Deskripsi notifikasi di sini.'
          },
          imageType: 'default',
          scheduledDate: null,
          isActive: false,
          createdAt: serverTimestamp()
        };
      }
    } catch (error) {
      console.error('Error getting notification:', error);
      throw error;
    }
  };

  // Create or update a notification
  const updateNotification = async (notificationData, id = 'default') => {
    try {
      const notificationRef = doc(db, 'notifications', id);
      
      // Add timestamps
      const dataToSave = {
        ...notificationData,
        updatedAt: serverTimestamp(),
        createdAt: notificationData.createdAt || serverTimestamp()
      };
      
      await setDoc(notificationRef, dataToSave, { merge: true });
      return { id, ...dataToSave };
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  };

  // Create a new notification
  const createNotification = async (notificationData) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const newNotificationRef = doc(notificationsRef);
      
      // Add timestamps
      const dataToSave = {
        ...notificationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(newNotificationRef, dataToSave);
      return { id: newNotificationRef.id, ...dataToSave };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      // Don't allow deleting the default notification
      if (id === 'default') {
        throw new Error('Cannot delete the default notification');
      }
      
      const notificationRef = doc(db, 'notifications', id);
      await setDoc(notificationRef, { isActive: false, deletedAt: serverTimestamp() }, { merge: true });
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const value = {
    notifications,
    activeNotification,
    loading,
    error,
    getNotification,
    updateNotification,
    createNotification,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};