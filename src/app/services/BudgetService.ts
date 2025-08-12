import toast from 'react-hot-toast';
import api from '../utils/axiosInstance';

// Function to Create Category
export const createBudgetCategoryApi = async (data: any, token: string) => {
  try {
    const response = await api.post('budgets/category', data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    toast.success(response.data.message);
    // console.log(response);
    return response.data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

export const GetAllBudgetsApi = async (token: string) => {
  try {
    const limit = 12;
    const page = 1;

    // Process each response
    // responses.forEach(response => {
    //     const { docs } = response.data.data; // Adjust if the response structure is different
    //     if (docs) {
    //         allBudgets = [...allBudgets, ...docs];
    //     }
    // });

    const budgets = await api.get(`budgets/?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('All budgets fetched:', budgets);
    return budgets.data.data.docs as any[];
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.error(error);
    return [];
  }
};

// Function to get a single budget by ID
export const getSingleBudgetApi = async (token: string, budgetId: string) => {
  try {
    const response = await api.get(`budgets/${budgetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // toast.success(response.data.message);
    return response.data.data; // Return the budget data
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

// ----------------------------------------------------------------
// Function to get active budget categories by budget ID
export const getActiveBudgetCategoriesApi = async (token: string, budgetId: string) => {
  try {
    const response = await api.get(`budgets/${budgetId}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // toast.success(response.data.message);
    return response.data.data; // Return the active categories
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

// Function to get budget distribution by budget ID
export const getBudgetDistributionApi = async (token: string, budgetId: string) => {
  try {
    const response = await api.get(`budgets/${budgetId}/distribution`, {
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

// Function to get budget distribution by budget ID
export const getActualExpenseApi = async (token: string, budgetId: string) => {
  try {
    const response = await api.get(`budgets/${budgetId}/expense/distribution`, {
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

// ----------------------------------------------------------------
// COLLABORATION

// delete budget
export const deleteBudgetApi = async (token: string, id: string) => {
  try {
    const response = await api.delete(`budgets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    return response.data; // Return response data upon success
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};

// re-authorize account
export const reauthorizeAccountApi = async (token: string, id: string) => {
  try {
    const response = await api.post(`accounts/${id}/reauthorize`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    return response.data; // Return response data upon success
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'An error occurred');
    console.log(error);
  }
};
