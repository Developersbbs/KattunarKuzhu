import api from './api';
import { getCurrentUser } from './auth';
import { User } from 'firebase/auth';

// Interface for the user profile response
interface UserProfile {
  name: string;
  email?: string;
  phoneNumber: string;
  business: {
    name: string;
    category: string;
    address: string;
  } | null;
}

/**
 * Fetches the current user's profile from the API
 * @returns UserProfile object with user details and business info
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const firebaseUser = getCurrentUser();
    
    if (!firebaseUser) {
      throw new Error('Not authenticated');
    }
    
    console.log('Fetching user profile with Firebase UID:', firebaseUser.uid);
    console.log('Firebase user details:', {
      uid: firebaseUser.uid,
      phoneNumber: firebaseUser.phoneNumber,
      providerId: firebaseUser.providerId,
      metadata: firebaseUser.metadata
    });
    
    // API interceptor will automatically add the auth headers
    // Add explicit header for debugging
    const response = await api.get('/users/profile', {
      headers: {
        'firebase-uid': firebaseUser.uid
      }
    });
    
    // Cache the profile for offline use
    setCachedProfile(response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    
    if (error.response) {
      // The server responded with an error status
      console.error('Server error response:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response received
      console.error('No response received:', error.request);
    }
    
    // Return cached profile if available
    const cached = getCachedProfile();
    if (cached) {
      console.log('Returning cached user profile data');
      return cached;
    }
    
    throw error;
  }
};

/**
 * Updates cached user profile data when available
 * @param profile The user profile to cache
 */
let cachedProfile: UserProfile | null = null;

export const setCachedProfile = (profile: UserProfile | null) => {
  cachedProfile = profile;
};

export const getCachedProfile = (): UserProfile | null => {
  return cachedProfile;
};
