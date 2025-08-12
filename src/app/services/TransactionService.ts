import api from '@/app/utils/axiosInstance';
import toast from 'react-hot-toast';

export const scanReceiptApi = async (token: string, url: any): Promise<any> => {
  try {
    // console.log(url);

    const response = await api.post(`transactions/scan`, url, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    toast.success(response.data.message || 'Scanned uploaded successfully!');
    // console.log(response.data);
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred during file upload');
    console.log('Error uploading file', error);
    throw error;
  }
};

export const AssignCategoryToTransactionApi = async (
  accountId: string,
  transactionId: string,
  budgetId: string,
  categoryId: string,
  token: string,
) => {
  try {
    const response = await api.post(
      `accounts/${accountId}/transactions/${transactionId}/assign`,
      {
        budgetId,
        categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      },
    );
    // toast.success(response.data.message || 'Category assigned successfully!');
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.error(error);
    throw error;
  }
};

export const AssignSplitCategoryToTransactionApi = async (
  accountId: string,
  transactionId: string,
  budgetId: string,
  categories: { allocationId: string; amount: number | string }[],
  token: string,
) => {
  try {
    const response = await api.post(
      `accounts/${accountId}/transactions/${transactionId}/split`,
      {
        budgetId,
        breakdown: categories,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      },
    );
    // toast.success(response.data.message || 'Category assigned successfully!');
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.error(error);
    throw error;
  }
};
