import api from '@/app/utils/axiosInstance';
import toast from 'react-hot-toast';

// Function to get budget distribution by budget ID
export const getPendingInvitesApi = async (token: string) => {
  try {
    const response = await api.get(`invites/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // toast.success(response.data.message);
    return response.data.data; // Return the budget distribution data
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};
