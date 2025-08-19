import api from './api';
import { getCurrentUser } from './auth';
import { User } from 'firebase/auth';

// Interface for the user profile response
export interface UserProfile {
  name: string;
  email?: string;
  phoneNumber: string;
  profileImageUrl?: string;
  business: {
    name: string;
    category: string;
    address: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
    description?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  } | null;
}

// Interface for updating user profile
export interface UpdateProfileData {
  name?: string;
  email?: string;
  profileImageUrl?: string;
  business?: {
    name?: string;
    category?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
    description?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
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
 * Updates the user profile via API
 * @param profileData The profile data to update
 * @returns Updated user profile
 */
export const updateUserProfile = async (profileData: UpdateProfileData): Promise<UserProfile> => {
  console.log('--- Initiating Profile Update ---');
  try {
    const firebaseUser = getCurrentUser();
    
    if (!firebaseUser) {
      throw new Error('Not authenticated');
    }
    
    console.log(`[Service] Preparing to update profile for Firebase UID: ${firebaseUser.uid}`);
    console.log('[Service] Payload to be sent:', JSON.stringify(profileData, null, 2));
    
    // API interceptor will automatically add the auth headers
    const response = await api.patch('/users/profile', profileData, {
      headers: {
        'firebase-uid': firebaseUser.uid
      }
    });

    console.log('[Service] API call successful. Response status:', response.status);
    console.log('[Service] Response data:', JSON.stringify(response.data, null, 2));
    
    // Update cached profile
    setCachedProfile(response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    if (error.response) {
      // The server responded with an error status
      console.error('Server error response:', error.response.status, error.response.data);
      throw new Error(error.response.data.message || 'Failed to update profile');
    } else if (error.request) {
      // The request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
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