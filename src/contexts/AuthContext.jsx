import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
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
  const [admins, setAdmins] = useState([]);

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

  const signInWithGoogle = async (useRedirect = false) => {
    try {
      let result;
      
      if (useRedirect) {
        // Use redirect method for better compatibility
        await signInWithRedirect(auth, googleProvider);
        return 'redirect'; // Will be handled by getRedirectResult
      } else {
        // Try popup method first
        result = await signInWithPopup(auth, googleProvider);
      }
      
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
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Error signing in with Google:', error);
      }

      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
          try {
            await signInWithRedirect(auth, googleProvider);
            return 'redirect';
          } catch (redirectError) {
            console.error('Redirect sign-in failed:', redirectError);
          }
        }
        return 'popup-closed';
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked by your browser. Please allow popups and try again, or use the redirect option.');
        return 'popup-blocked';
      } else if (error.code === 'auth/configuration-not-found') {
        toast.error('Authentication configuration error. Please contact support.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized for authentication. Please contact support.');
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

      // Add to individual admin document
      await setDoc(doc(db, 'admins', email), {
        email: email,
        addedBy: currentUser.email,
        addedAt: new Date(),
        isActive: true
      });

      // Update the admins list document
      const adminListRef = doc(db, 'admins', 'list');
      const adminListDoc = await getDoc(adminListRef);
      
      let emailsList = [];
      if (adminListDoc.exists() && adminListDoc.data().emails) {
        emailsList = adminListDoc.data().emails;
      }
      
      if (!emailsList.includes(email)) {
        emailsList.push(email);
        await setDoc(adminListRef, { emails: emailsList }, { merge: true });
      }

      // Update local state
      setAdmins(prevAdmins => {
        if (!prevAdmins.includes(email)) {
          return [...prevAdmins, email];
        }
        return prevAdmins;
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

      // Update individual admin document
      await setDoc(doc(db, 'admins', email), {
        isActive: false,
        removedBy: currentUser.email,
        removedAt: new Date()
      }, { merge: true });

      // Update the admins list document
      const adminListRef = doc(db, 'admins', 'list');
      const adminListDoc = await getDoc(adminListRef);
      
      if (adminListDoc.exists() && adminListDoc.data().emails) {
        const emailsList = adminListDoc.data().emails.filter(e => e !== email);
        await setDoc(adminListRef, { emails: emailsList }, { merge: true });
      }

      // Update local state
      setAdmins(prevAdmins => prevAdmins.filter(e => e !== email));

      toast.success('Admin removed successfully!');
      return true;
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin.');
      return false;
    }
  };

  // Fetch all admins from Firestore
  const fetchAdmins = async () => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', 'list'));
      if (adminDoc.exists() && adminDoc.data().emails) {
        setAdmins([...primaryAdmins, ...adminDoc.data().emails]);
      } else {
        setAdmins([...primaryAdmins]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setAdmins([...primaryAdmins]);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const handleAuth = async () => {
      try {
        // Check for redirect result first
        const result = await getRedirectResult(auth);
        if (result && mounted) {
          const user = result.user;
          
          // Set current user immediately
          setCurrentUser(user);
          
          // Check admin status
          const isUserAdmin = await checkAdminStatus(user);
          
          if (!isUserAdmin) {
            await signOut(auth);
            toast.error('Access denied. You are not authorized to access this CMS.');
            if (mounted) {
              setCurrentUser(null);
              setIsAdmin(false);
              setLoading(false);
            }
            return;
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
          }

          if (mounted) {
            toast.success('Successfully signed in!');
          }
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
        if (mounted) {
          if (error.code === 'auth/unauthorized-domain') {
            toast.error('This domain is not authorized for authentication. Please update Firebase Auth settings.');
          } else if (error.code !== 'auth/popup-closed-by-user') {
            toast.error('Failed to complete sign-in. Please try again.');
          }
        }
      }
    };
    
    // Handle redirect result
    handleAuth();
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (mounted) {
        setCurrentUser(user);
        if (user) {
          await checkAdminStatus(user);
          await fetchAdmins();
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    isAdmin,
    signInWithGoogle,
    logout,
    addAdmin,
    removeAdmin,
    primaryAdmins,
    admins
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}