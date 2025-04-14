import api from '@/app/utils/axiosInstance';
import toast from 'react-hot-toast';

export const getAllPlans = async (token: string) => {
  try {
    const response = await api.get(`subscriptions/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    // toast.success(response.data.message);
    return response.data.data; // Return the budget data
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

export const getSinglePlan = async (token: string, id: string) => {
  try {
    const response = await api.get(`subscriptions/plans/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    // toast.success(response.data.message);
    return response.data; // Return the budget data
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

export const getUserSubscription = async (token: string) => {
  try {
    const response = await api.get(`subscriptions/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    // toast.success(response.data.message);
    return response.data.data; // Return the budget data
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};
