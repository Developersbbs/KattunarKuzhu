import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence, 
  Auth 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUUCHIs9fyiPXyjNmuoN4AoIxxQb91Ibg",
  authDomain: "kattunar-kuzhu-3373e.firebaseapp.com",
  projectId: "kattunar-kuzhu-3373e",
  storageBucket: "kattunar-kuzhu-3373e.firebasestorage.app",
  messagingSenderId: "608033768330",
  appId: "1:608033768330:web:5c2d1d1074fb721e3bbe73"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  // Initialize auth with persistence for native platforms
  if (Platform.OS !== 'web') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } else {
    auth = getAuth(app);
  }
  
  // Set language code for authentication
  auth.languageCode = 'en';
  
  // Use reCAPTCHA v2 explicitly
  // This is only needed for development/testing
  if (__DEV__) {
    // @ts-ignore - This property exists but might not be in the types
    auth.settings.appVerificationDisabledForTesting = false;
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

export { app, auth };