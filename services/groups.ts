import api from './api';

export interface Group {
  _id: string;
  name: string;
  description?: string;
  groupHead?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  groupHead?: string;
}

export const fetchGroups = async (): Promise<Group[]> => {
  try {
    console.log('Fetching groups from API');
    const response = await api.get('/groups');
    return response.data;
  } catch (error: any) {
    // Detailed error handling
    if (error.code === 'ECONNABORTED') {
      console.error('Connection timed out when fetching groups');
    } else if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('Server error when fetching groups:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error when fetching groups - no response received');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request to fetch groups:', error.message);
    }
    
    throw error;
  }
};

export const createGroup = async (groupData: CreateGroupDto): Promise<Group> => {
  try {
    const response = await api.post('/groups', groupData);
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const fetchGroupById = async (groupId: string): Promise<Group> => {
  try {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching group with id ${groupId}:`, error);
    throw error;
  }
};
