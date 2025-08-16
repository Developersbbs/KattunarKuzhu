import api from './api';
import { RegisterFormData } from '@/types/register';

export const registerUser = async (data: Omit<RegisterFormData, 'otp' | 'profilePic' | 'countryCode' | 'phoneNumber'>) => {
  try {
    const response = await api.post('/registration', data);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};
