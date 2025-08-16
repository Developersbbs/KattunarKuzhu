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
  try {
    await api.post('/users/check-status', { phoneNumber });
    return { isApproved: true, message: 'User is approved.' };
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return { isApproved: false, message: error.response.data.message };
    } else if (error.request) {
      // The request was made but no response was received
      return { isApproved: false, message: 'Could not connect to the server.' };
    } else {
      // Something happened in setting up the request that triggered an Error
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
  verificationCode: string,
  skipSignIn: boolean = false
): Promise<{ success: boolean; error?: string }> => {
  try {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    
    if (skipSignIn) {
      // For registration, we just verify the code but don't sign in
      return { success: true };
    } else {
      // For login, we sign in with the credential
      await signInWithCredential(typedAuth, credential);
      return { success: true };
    }
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