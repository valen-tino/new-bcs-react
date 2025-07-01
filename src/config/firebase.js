// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Load environment variables with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2G_bsUmqdiyWudYlSE3sYhkCUK_Qjuqs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bcs-cms-5ab14.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bcs-cms-5ab14",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bcs-cms-5ab14.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "937702124741",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:937702124741:web:b5a1a2c3bd8b8c81bed4ac",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C06GE7EH13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment to prevent SSR issues
let analytics = null;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Analytics initialization error:', error);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore with error handling
let db;
try {
  db = getFirestore(app);
  // Set up automatic retry for Firestore operations
  db.settings({
    cacheSizeBytes: 1048576 * 100, // 100 MB cache size
    ignoreUndefinedProperties: true,
    experimentalForceLongPolling: true, // Use long polling for more stable connections
    experimentalAutoDetectLongPolling: true
  });
  console.log('Firestore initialized with enhanced settings');
} catch (error) {
  console.error('Firestore initialization error:', error);
  // Fallback to a basic Firestore instance
  try {
    db = getFirestore(app);
    console.log('Firestore initialized with default settings');
  } catch (fallbackError) {
    console.error('Critical Firestore initialization failure:', fallbackError);
    // Create a mock db object to prevent app crashes
    db = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: () => false, data: () => ({}) }),
          set: async () => {}
        }),
        add: async () => ({}),
        where: () => ({
          get: async () => ({ docs: [] })
        })
      })
    };
  }
}

export { db };

// Initialize Cloud Storage with error handling
let storage;
try {
  storage = getStorage(app);
  console.log('Storage initialized successfully');
} catch (error) {
  console.error('Storage initialization error:', error);
  // Create a mock storage object to prevent app crashes
  storage = {
    ref: () => ({
      put: async () => ({
        ref: { getDownloadURL: async () => '' },
        getDownloadURL: async () => ''
      }),
      getDownloadURL: async () => ''
    })
  };
}

export { storage };

export default app;