import api from './api';
import { ConnectionStatus } from '@/types/connections';

export const getConnectionStatus = async (
  recipientId: string
): Promise<{ status: ConnectionStatus | null }> => {
  try {
    const response = await api.get(`/connections/status/${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching connection status:', error);
    // Return null status on error (e.g., 404 Not Found means no connection)
    return { status: null };
  }
};

export const sendConnectionRequest = async (
  recipientId: string
): Promise<any> => {
  try {
    const response = await api.post('/connections', { recipientId });
    return response.data;
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error; // Re-throw to be handled by the component
  }
};
