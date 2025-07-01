import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Allowed admin emails
  const primaryAdmins = ['vinsen.jehaut0870@gmail.com', 'valentinojehaut@gmail.com'];

  const checkAdminStatus = async (user) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      // Check if user is in primary admins
      if (primaryAdmins.includes(user.email)) {
        setIsAdmin(true);
        return true;
      }

      // Check if user is in additional admins collection
      const adminDoc = await getDoc(doc(db, 'admins', user.email));
      if (adminDoc.exists()) {
        setIsAdmin(true);
        return true;
      }

      setIsAdmin(false);
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const adminStatus = await checkAdminStatus(user);
      
      if (!adminStatus) {
        await signOut(auth);
        toast.error('Access denied. You are not authorized to access this CMS.');
        return false;
      }

      // Store user info in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date(),
          isPrimaryAdmin: primaryAdmins.includes(user.email)
        }, { merge: true });
      } catch (firestoreError) {
        console.error('Firestore error during sign-in:', firestoreError);
        // Continue with sign-in even if Firestore update fails
      }

      toast.success('Successfully signed in!');
      return true;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/configuration-not-found') {
        toast.error('Authentication configuration error. Please contact support.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
      
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out.');
    }
  };

  const addAdmin = async (email) => {
    try {
      if (primaryAdmins.includes(email)) {
        toast.error('This email is already a primary admin.');
        return false;
      }

      await setDoc(doc(db, 'admins', email), {
        email: email,
        addedBy: currentUser.email,
        addedAt: new Date(),
        isActive: true
      });

      toast.success('Admin added successfully!');
      return true;
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Failed to add admin.');
      return false;
    }
  };

  const removeAdmin = async (email) => {
    try {
      if (primaryAdmins.includes(email)) {
        toast.error('Cannot remove primary admin.');
        return false;
      }

      await setDoc(doc(db, 'admins', email), {
        isActive: false,
        removedBy: currentUser.email,
        removedAt: new Date()
      }, { merge: true });

      toast.success('Admin removed successfully!');
      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin.');
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkAdminStatus(user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    signInWithGoogle,
    logout,
    addAdmin,
    removeAdmin,
    primaryAdmins
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}