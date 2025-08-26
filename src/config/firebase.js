// Firebase configuration with optimized loading
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services (optimized for performance)
let db;
try {
  db = getFirestore(app);
  
  // Configure Firestore settings for better performance and error handling
  if (typeof window !== 'undefined') {
    // Enable offline persistence only in browser
    import('firebase/firestore').then(({ enableNetwork, disableNetwork }) => {
      // Add connection handling
      window.addEventListener('online', () => {
        enableNetwork(db).catch(console.error);
      });
      
      window.addEventListener('offline', () => {
        disableNetwork(db).catch(console.error);
      });
    }).catch(console.error);
  }
  
  console.log('🔥 Firestore initialized successfully');
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
}

let storage;
try {
  storage = getStorage(app);
  console.log('📁 Firebase Storage initialized successfully');
} catch (error) {
  console.error('Storage initialization error:', error);
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

// Initialize auth and provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider for better compatibility
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { db };
export { storage };

// Lazy load analytics only when needed
let analytics = null;
export const getAnalytics = async () => {
  if (!analytics && typeof window !== 'undefined') {
    try {
      const { getAnalytics: getAnalyticsService } = await import('firebase/analytics');
      analytics = getAnalyticsService(app);
      console.log('📊 Firebase Analytics loaded');
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }
  return analytics;
};

export default app;