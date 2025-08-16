import api from './api';
import { RegisterFormData } from '@/types/register';

interface RegistrationData {
  name: string;
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
    // Transform the data to match the server's expected format
    const serverData = {
      name: data.name,
      email: data.email,
      group: data.group,
      business: {
        name: data.businessName,
        category: data.businessCategory,
        phoneNumber: data.businessPhone,
        email: data.businessEmail,
        location: data.businessLocation,
      }
    };
    
    const response = await api.post('/registration', serverData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};
