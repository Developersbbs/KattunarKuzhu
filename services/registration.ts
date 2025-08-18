import api from './api';
import { RegisterFormData } from '@/types/register';

interface RegistrationData {
  firebaseUid: string; // Add Firebase UID
  name: string;
  phoneNumber: string;
  email?: string;
  group: string;
  businessName: string;
  businessCategory: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLocation: string;
}

export const registerUser = async (data: RegistrationData) => {
  try {
    // Log the incoming data for debugging
    console.log('Registering user with Firebase UID:', data.firebaseUid);
    
    // Transform the data to match the server's expected format
    const serverData = {
      firebaseUid: data.firebaseUid, // Add Firebase UID
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      group: data.group,
      business: {
        name: data.businessName,
        category: data.businessCategory,
        phoneNumber: data.businessPhone,
        email: data.businessEmail,
        location: data.businessLocation, // Keep as location as backend expects
      }
    };
    
    console.log('Sending registration data to server:', JSON.stringify(serverData, null, 2));
    
    const response = await api.post('/registration', serverData);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};
