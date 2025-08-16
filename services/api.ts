import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We will add an interceptor here in Phase 2 to automatically add the JWT token.

export default api;
