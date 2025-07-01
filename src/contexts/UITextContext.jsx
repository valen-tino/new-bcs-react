import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const UITextContext = createContext();

export const useUIText = () => useContext(UITextContext);

export const UITextProvider = ({ children }) => {
  const [uiTextContent, setUITextContent] = useState({
    header: { English: {}, Indonesia: {} },
    nav: { English: {}, Indonesia: {} },
    footer: { English: {}, Indonesia: {} },
    services: { English: {}, Indonesia: {} },
    about: { English: {}, Indonesia: {} },
    gallery: { English: {}, Indonesia: {} },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all UI text content
  useEffect(() => {
    try {
      setLoading(true);
      const uiTextRef = collection(db, 'uiText');
      
      // Set up listeners for each section
      const sections = ['header', 'nav', 'footer', 'services', 'about', 'gallery'];
      const unsubscribes = sections.map(section => {
        return onSnapshot(doc(uiTextRef, section), (snapshot) => {
          if (snapshot.exists()) {
            setUITextContent(prev => ({
              ...prev,
              [section]: snapshot.data()
            }));
          }
        }, (err) => {
          console.error(`Error fetching ${section} UI text:`, err);
          setError(err.message);
        });
      });
      
      setLoading(false);
      
      // Clean up listeners
      return () => {
        unsubscribes.forEach(unsubscribe => unsubscribe());
      };
    } catch (err) {
      console.error('Error setting up UI text listeners:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Get UI text for a specific section
  const getUIText = async (section) => {
    try {
      const uiTextRef = doc(db, 'uiText', section);
      const uiTextSnap = await getDoc(uiTextRef);
      
      if (uiTextSnap.exists()) {
        return uiTextSnap.data();
      } else {
        // Return default structure if UI text doesn't exist
        return {
          English: {},
          Indonesia: {}
        };
      }
    } catch (error) {
      console.error(`Error getting ${section} UI text:`, error);
      throw error;
    }
  };

  // Update UI text for a specific section
  const updateUIText = async (section, content) => {
    try {
      const uiTextRef = doc(db, 'uiText', section);
      
      // Add timestamps
      const dataToSave = {
        ...content,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(uiTextRef, dataToSave, { merge: true });
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} text updated successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating ${section} UI text:`, error);
      toast.error(`Failed to update ${section} text`);
      throw error;
    }
  };

  // Import UI text from local files
  const importUIText = async (content) => {
    try {
      const sections = Object.keys(content);
      
      for (const section of sections) {
        const uiTextRef = doc(db, 'uiText', section);
        
        // Add timestamps
        const dataToSave = {
          ...content[section],
          updatedAt: serverTimestamp(),
          importedAt: serverTimestamp()
        };
        
        await setDoc(uiTextRef, dataToSave);
      }
      
      toast.success('UI text imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing UI text:', error);
      toast.error('Failed to import UI text');
      throw error;
    }
  };

  const value = {
    uiTextContent,
    loading,
    error,
    getUIText,
    updateUIText,
    importUIText
  };

  return (
    <UITextContext.Provider value={value}>
      {children}
    </UITextContext.Provider>
  );
};