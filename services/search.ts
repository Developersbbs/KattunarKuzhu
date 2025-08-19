import api from './api';

export interface SearchParams {
  q?: string;
  category?: string;
  location?: string;
}

// Define a basic structure for the search results
// This should be expanded based on the actual data returned by the API
export interface BusinessSearchResult {
  _id: string;
  name: string;
  category: string;
  address: string;
  logoUrl?: string;
  owner?: {
    _id: string;
    name: string;
    profileImageUrl?: string;
  };
  // Add other relevant business properties
}

export const searchBusinesses = async (
  params: SearchParams
): Promise<BusinessSearchResult[]> => {
  try {
    const response = await api.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching businesses:', error);
    // Depending on error handling strategy, you might want to throw the error
    // or return an empty array.
    return [];
  }
};
