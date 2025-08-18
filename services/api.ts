import axios from 'axios';
import Constants from 'expo-constants';
import { getCurrentUser } from './auth';

// Use the network IP address of the development machine
// React Native apps can't use 'localhost' as it refers to the device itself
const API_URL = 'http://192.168.1.41:3000';

const api = axios.create({
  baseURL: API_URL, // Override with hardcoded value
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to quickly identify connection issues
  timeout: 10000,
});

// Add an interceptor to automatically add auth headers
api.interceptors.request.use(async (config) => {
  try {
    const firebaseUser = getCurrentUser();
    
    if (firebaseUser) {
      // Add Firebase UID to request headers
      config.headers['firebase-uid'] = firebaseUser.uid;
      
      // Get the Firebase token (this will be used in future JWT implementation)
      const token = await firebaseUser.getIdToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  } catch (error) {
    console.error('Error in API request interceptor:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

export default api;
