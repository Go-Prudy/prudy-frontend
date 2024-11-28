import toast from 'react-hot-toast';
import api from "../../utils/axiosInstance";
import { ICreateBudgetCategory, IExpense, IForgotPassword, ILoginForm, IOtpResponse, ISignupForm, ManualData } from "../Types";


// Function to get all budgets categories
export const getAllBudgetCategoriesApi = async (token: string) => {

    try {
        const response = await api.get('budgets/category', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        console.log(response.data.data);
        return response.data.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);

    }
};


// Function to Create Category
export const createBudgetCategoryApi = async (data: any, token: string) => {

    try {
        const response = await api.post('budgets/category', data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        toast.success(response.data.message);
        console.log(response);
        return response.data.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);

    }
};


// Function to fetch category expenses
export const getCategoryExpenses = async (budgetId: string, categoryId: string, token: string) => {
    try {
        const response = await api.get(`budgets/${budgetId}/categories/${categoryId}/expenses`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);

        return response.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }

};

// Function to record expense 
export const RecordExpenseApi = async (budgetId: string, budgetCategoryId: string, data: any, token: string) => {

    try {
        const response = await api.post(`budgets/${budgetId}/categories/${budgetCategoryId}/expenses`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        toast.success(response.data.message || "An error occurred");
        console.log(response);
        return response.data.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);

    }
};


export const GetAllBudgetsApi = async (token: string) => {
    try {
        let allBudgets: any[] = [];
        let currentPage = 1;
        const limit = 10; // Default limit, can be adjusted based on the API

        while (true) {
            console.log(`Fetching page ${currentPage}`);

            const response = await api.get(`budgets/?page=${currentPage}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Log the response to see the actual structure
            console.log(response.data);

            const { docs, next } = response.data.data; // Adjust if the response structure is different
            if (!docs) {
                console.error('No docs found on this page.');
                break;
            }

            // Merge the current page's docs with the previous ones
            allBudgets = [...allBudgets, ...docs];

            if (!next || !next.page) {
                console.log('No more pages to fetch.');
                break; // Exit if there's no next page
            }

            currentPage = next.page;
        }

        console.log('All budgets fetched:', allBudgets);

        return allBudgets;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
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
        console.log(budgetId);
        console.log(response.data);

        // toast.success(response.data.message);
        return response.data.data; // Return the budget data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
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
        toast.error(error?.response?.data?.message || "An error occurred");
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
        console.log(response.data);
        toast.success(response.data.message);
        return response.data.data; // Return the budget distribution data
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }
};















// Function to Create Budget
export const createBudgetApi = async (data: any, token: string) => {

    try {
        const response = await api.post('budgets', data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        toast.success(response.data.message);
        console.log(response);
        return response.data.data
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);

    }
};











// ----------------------------------------------------------------
// COLLABORATION

// Function to invite a collaborator to a budget
export const inviteCollaboratorApi = async (token: string, budgetId: string, collaboratorEmail: string) => {
    try {
        const response = await api.post(`budgets/${budgetId}/invite`, {
            email: collaboratorEmail,
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        toast.success(response.data.message);
        return response.data; // Return response data upon success
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }
};



// Create Sub Category
export const CreateSubCategoryApi = async (token: string, id: string, name: string) => {
    try {
        const response = await api.post(`budgets/category/${id}/sub`, {
            name: name,
        }, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        toast.success(response.data.message);
        return response.data; // Return response data upon success
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }
};
