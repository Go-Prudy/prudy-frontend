import api from '@/app/utils/axiosInstance';
import toast from 'react-hot-toast';
import { AccountParams, AssignTransactionData } from '../Types';

export const initLinkAccountApi = async (token: string): Promise<any> => {
  try {
    const response = await api.post(
      `accounts/link`,
      {}, // Assuming no body data is needed for this request
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      },
    );

    toast.success(response.data.message);
    console.log(response.data);

    // Automatically redirect if URL is present
    if (response.data.data.url) {
      window.location.href = response.data.data.url;
    }

    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

export const getAllAccountsApi = async (
  token: string,
  params?: AccountParams,
): Promise<any> => {
  try {
    const response = await api.get(`accounts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    return response.data.data;
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || 'An error occurred while fetching accounts',
    );
    console.log(error);
  }
};

export const fetchAccountInfoApi = async (token: string, id: string): Promise<any> => {
  try {
    const response = await api.get(`accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    return response.data.data; // Assuming account information is in `data`
  } catch (error: any) {
    toast.error(error.response.data?.message || 'An error occurred while fetching');
    console.error('Error fetching account information:', error);
  }
};

export const removeAccountApi = async (token: string, id: string): Promise<any> => {
  try {
    const response = await api.delete(`accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    return response.data; // Assuming account information is in `data`
  } catch (error: any) {
    toast.error(error.response.data?.message || 'An error occurred while fetching');
    console.error('Error deleting account information:', error);
  }
};

export const fetchAccountTransactionsApi = async (
  token: string,
  id: string,
  limit: number = 12,
  page: number = 1,
): Promise<any> => {
  try {
    const response = await api.get(`accounts/${id}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      params: {
        limit,
        page,
      },
    });
    console.log(response.data);

    return response.data.data; // Assuming transaction data is in `data`
  } catch (error: any) {
    console.error('Error fetching account transactions:', error);
  }
};

export const syncAccountTransactionsApi = async (
  token: string,
  accountId: string,
): Promise<any> => {
  try {
    const response = await api.get(`accounts/${accountId}/transactions/sync`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    console.log(response.data);

    // toast.success(response.data?.message)
    return response.data.data; // Assuming the synced transaction data is in `data`
  } catch (error: any) {
    toast.error('Failed to sync transactions');
    console.error('Error syncing account transactions:', error);
  }
};

export const assignAccountTransactionApi = async (
  token: string,
  accountId: string,
  transactionId: string,
  data: AssignTransactionData,
): Promise<any> => {
  try {
    const response = await api.post(
      `accounts/${accountId}/transactions/${transactionId}/assign`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      },
    );
    return response.data.data; // Assuming the response data is in `data`
  } catch (error: any) {
    console.error('Error assigning account transaction:', error);
  }
};
