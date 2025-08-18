import api from './api';
import {
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";
import { auth } from "./firebase";

const typedAuth = auth as Auth;

export const checkUserStatus = async (phoneNumber: string): Promise<{ isApproved: boolean; message: string }> => {
  // Log the URL for debugging purposes
  const url = `${api.defaults.baseURL}/users/check-status`;
  console.log(`Attempting to connect to server at: ${url}`);

  try {
    const response = await api.post('/users/check-status', { phoneNumber });
    // Check for a successful response (status 200)
    if (response.status === 200 && response.data.status === 'approved') {
      return { isApproved: true, message: 'User is approved.' };
    }
    // Handle unexpected successful responses
    return { isApproved: false, message: 'Received an unexpected server response.' };
  } catch (error: any) {
    if (error.response) {
      // The server responded with an error (e.g., 404 Not Found, 401 Unauthorized)
      console.error('Server responded with an error:', error.response.data);
      return { isApproved: false, message: error.response.data.message || 'Login not authorized.' };
    } else if (error.request) {
      // The request was made but no response was received (network error)
      console.error('Network error: No response received from the server.');
      return { isApproved: false, message: 'Could not connect to the server. Please check the IP address and firewall settings.' };
    } else {
      // Something else went wrong
      console.error('An unexpected error occurred:', error.message);
      return { isApproved: false, message: 'An unexpected error occurred.' };
    }
  }
};


export const verifyPhoneNumber = async (
  phoneNumber: string,
  recaptchaVerifier: React.RefObject<any>
): Promise<{ success: boolean; verificationId?: string; error?: string }> => {
  try {
    const phoneProvider = new PhoneAuthProvider(typedAuth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier.current
    );
    return { success: true, verificationId };
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    return {
      success: false,
      error: error?.message || "Failed to send verification code",
    };
  }
};

export const confirmVerificationCode = async (
  verificationId: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    
    // Always sign in, which creates the account if it doesn't exist
    await signInWithCredential(typedAuth, credential);
    return { success: true };
  } catch (error: any)
  {
    console.error("Error confirming verification code:", error);
    return {
      success: false,
      error: error?.message || "Invalid verification code",
    };
  }
};

export const logOut = async (): Promise<boolean> => {
  try {
    await signOut(typedAuth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

export const getCurrentUser = (): User | null => {
  return typedAuth.currentUser;
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(typedAuth, callback);
};