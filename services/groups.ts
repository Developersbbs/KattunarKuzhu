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
    const response = await api.get('/groups');
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
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
