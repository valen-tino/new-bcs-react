// Lazy Firebase Loader
// Defers Firebase initialization to improve initial page load performance

let firebaseInitialized = false;
let firebaseInitPromise = null;

// Lazy load Firebase modules only when needed
export const lazyInitFirebase = async () => {
  if (firebaseInitialized) {
    return;
  }

  if (firebaseInitPromise) {
    return firebaseInitPromise;
  }

  firebaseInitPromise = (async () => {
    try {
      // Only initialize Firebase when actually needed
      const { db, auth, storage } = await import('../config/firebase.js');
      
      // Set a flag to prevent re-initialization
      firebaseInitialized = true;
      
      console.log('🔥 Firebase lazy initialization completed');
      return { db, auth, storage };
    } catch (error) {
      console.error('❌ Firebase lazy initialization failed:', error);
      firebaseInitPromise = null; // Reset to allow retry
      throw error;
    }
  })();

  return firebaseInitPromise;
};

// Check if Firebase is already initialized
export const isFirebaseReady = () => firebaseInitialized;

// Defer Firebase operations with automatic initialization
export const withFirebase = async (callback) => {
  try {
    await lazyInitFirebase();
    return await callback();
  } catch (error) {
    console.error('Firebase operation failed:', error);
    throw error;
  }
};

// Intersection Observer for lazy loading Firebase on scroll
let intersectionObserverRegistered = false;

export const initFirebaseOnInteraction = () => {
  if (intersectionObserverRegistered || firebaseInitialized) return;
  
  intersectionObserverRegistered = true;

  // Initialize Firebase on user interaction or scroll
  const initOnUserActivity = () => {
    lazyInitFirebase().catch(console.error);
    
    // Remove listeners after first interaction
    window.removeEventListener('scroll', initOnUserActivity);
    window.removeEventListener('touchstart', initOnUserActivity);
    window.removeEventListener('mousemove', initOnUserActivity);
  };

  // Use passive listeners for better performance
  window.addEventListener('scroll', initOnUserActivity, { passive: true, once: true });
  window.addEventListener('touchstart', initOnUserActivity, { passive: true, once: true });
  window.addEventListener('mousemove', initOnUserActivity, { passive: true, once: true });

  // Fallback: initialize after 3 seconds if no user interaction
  setTimeout(() => {
    if (!firebaseInitialized) {
      lazyInitFirebase().catch(console.error);
    }
  }, 3000);
};