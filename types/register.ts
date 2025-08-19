/**
 * Type definitions for the registration form
 */

/**
 * Location data structure with coordinates
 */
export interface LocationData {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Registration form data structure
 */
export interface RegisterFormData {
  // Step 1 - Personal Information
  profilePic?: string;
  name: string;
  countryCode: string;
  phoneNumber: string;
  email?: string;
  group: string;

  // Step 2 - Business Information
  businessName: string;
  businessCategory: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLocation: string;
  businessLocationData?: LocationData; // Extended location data with coordinates

  // Step 3 - OTP Verification
  otp: string[];
}

/**
 * Business category options
 */
export const businessCategories = [
  "Construction",
  "Real Estate",
  "Interior Design",
  "Electrical",
  "Plumbing",
  "Painting",
  "Architecture",
  "Landscaping",
  "Furniture",
  "Consulting",
  "Other"
];

/**
 * Group options
 */
export const groupOptions = [
  "Chennai North",
  "Chennai South",
  "Chennai Central",
  "Coimbatore",
  "Madurai",
  "Salem",
  "Trichy",
  "Tirunelveli",
  "Create New Group"
];