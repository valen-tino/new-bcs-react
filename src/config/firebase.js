// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Load environment variables - all required for security
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required environment variables are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingVars);
  throw new Error(`Missing Firebase configuration. Please set the following environment variables: ${missingVars.join(', ')}`);
}

const firebaseConfig = requiredEnvVars;

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
  // In Firebase v9, settings are passed directly to getFirestore
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firestore initialization error:', error);
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
  console.error('Using mock Firestore instance due to initialization failure');
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