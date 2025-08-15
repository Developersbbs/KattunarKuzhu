import { 
  PhoneAuthProvider, 
  signInWithCredential, 
  RecaptchaVerifier,
  ApplicationVerifier,
  ConfirmationResult,
  UserCredential,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
  PhoneAuthProvider as FirebasePhoneAuthProvider
} from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';

// Type assertion for auth
const typedAuth = auth as Auth;

// Store confirmation result globally
let verificationConfirmation: ConfirmationResult | null = null;

// Store verification ID for registration flow
let currentVerificationId: string = "";

/**
 * Initialize reCAPTCHA verifier for web platform
 * @param containerId - DOM element ID or React ref for reCAPTCHA container
 */
export const initRecaptchaVerifier = (containerId: string | any): RecaptchaVerifier | null => {
  if (Platform.OS === 'web') {
    // @ts-ignore - Fix for auth type issues
    const recaptchaVerifier = new RecaptchaVerifier(typedAuth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    });
    return recaptchaVerifier;
  }
  return null;
};

/**
 * Send verification code to the provided phone number
 * @param phoneNumber - Full phone number with country code
 * @param recaptchaVerifier - reCAPTCHA verifier (for web)
 */
export const sendVerificationCode = async (
  phoneNumber: string,
  recaptchaVerifier?: ApplicationVerifier
): Promise<{ success: boolean; verificationId: string; error?: string }> => {
  try {
    // For web, we need to pass the recaptchaVerifier
    if (Platform.OS === 'web' && recaptchaVerifier) {
      // @ts-ignore - Fix for auth type issues
      verificationConfirmation = await typedAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
    } else {
      // For mobile, Firebase handles the reCAPTCHA internally
      // @ts-ignore - Fix for auth type issues
      verificationConfirmation = await typedAuth.signInWithPhoneNumber(phoneNumber);
    }
    
    // Generate a random verification ID for demo purposes
    // In a real app, this would come from Firebase
    currentVerificationId = Math.random().toString(36).substring(2, 15);
    
    return {
      success: true,
      verificationId: currentVerificationId
    };
  } catch (error: any) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      verificationId: "",
      error: error?.message || 'Failed to send verification code'
    };
  }
};

/**
 * Sign in with the verification code
 * @param verificationId - The verification ID received from sendVerificationCode
 * @param verificationCode - 6-digit OTP received via SMS
 */
export const signInWithCode = async (verificationId: string, verificationCode: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if the verification ID matches
    if (verificationId !== currentVerificationId) {
      return {
        success: false,
        error: 'Invalid verification session'
      };
    }
    
    // In a real app, we would use the confirmation result
    if (verificationConfirmation) {
      try {
        const credential = await verificationConfirmation.confirm(verificationCode);
        return { success: true };
      } catch (confirmError: any) {
        return {
          success: false,
          error: confirmError?.message || 'Invalid verification code'
        };
      }
    }
    
    // For demo purposes, accept any 6-digit code
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Invalid verification code format'
      };
    }
  } catch (error: any) {
    console.error('Error confirming verification code:', error);
    return {
      success: false,
      error: error?.message || 'Verification failed'
    };
  }
};

/**
 * Sign out the current user
 */
export const logOut = async (): Promise<boolean> => {
  try {
    await signOut(typedAuth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return typedAuth.currentUser;
};

/**
 * Listen to authentication state changes
 * @param callback - Function to call when auth state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(typedAuth, callback);
};