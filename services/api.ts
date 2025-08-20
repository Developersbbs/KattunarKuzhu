import axios from 'axios';
import Constants from 'expo-constants';
import { getAuthToken } from './auth';

// Use the network IP address of the development machine
// React Native apps can't use 'localhost' as it refers to the device itself
const API_URL = Constants.expoConfig?.extra?.API_BASE_URL || 'http://192.168.1.41:3000';

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
    const token = await getAuthToken();
    
    if (token) {
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
