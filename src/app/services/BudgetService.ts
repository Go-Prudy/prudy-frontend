import toast from 'react-hot-toast';
import api from "../../utils/axiosInstance";
import { ICreateBudgetCategory, IExpense, IForgotPassword, ILoginForm, IOtpResponse, ISignupForm, ManualData } from "../Types";


// Function to get all budgets categories
export const getAllBudgetCategories = async (token: string) => {

    try {
        const response = await api.get('budgets/category', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        console.log(response.data.data);
        return response.data.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message);
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
        toast.error(error?.response?.data?.message);
        console.log(error);

    }
};


// Function to record expense 
export const RecordExpenseApi = async (budgetCategoryId: string, data: ManualData, token: string) => {

    try {
        const response = await api.post(`budgets/${budgetCategoryId}/expense`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        toast.success(response.data.message);
        console.log(response);
        return response.data.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message);
        console.log(error);

    }
};


// Function to get all budget  
export const GetAllBudgetsApi = async (token: string) => {

    try {
        const response = await api.get(`budgets/`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        // toast.success(response.data.message);
        console.log(response);
        return response.data.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message);
        console.log(error);

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
        toast.error(error?.response?.data?.message);
        console.log(error);
    }
};

// // Example query using React Query
// const { data: singleBudgetData, status: singleBudgetStatus } = useQuery({
//     queryKey: ['singleBudget', budgetId],
//     queryFn: () => getSingleBudgetApi(authenticatedUser?.token ?? '', budgetId),
//     enabled: !!authenticatedUser?.token && !!budgetId,
// });





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
        toast.error(error?.response?.data?.message);
        console.log(error);
    }
};

// // Example query using React Query
// const { data: activeCategoriesData, status: categoriesStatus } = useQuery({
//     queryKey: ['activeBudgetCategories', budgetId],
//     queryFn: () => getActiveBudgetCategoriesApi(authenticatedUser?.token ?? '', budgetId),
//     enabled: !!authenticatedUser?.token && !!budgetId,
// });


// ----------------------------------------------------------------




// Function to get budget distribution by budget ID
export const getBudgetDistributionApi = async (token: string, budgetId: string) => {
    try {
        const response = await api.get(`budgets/${budgetId}/distribution`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success(response.data.message);
        return response.data.data; // Return the budget distribution data
    } catch (error: any) {
        toast.error(error?.response?.data?.message);
        console.log(error);
    }
};

// // Example query using React Query
// const { data: budgetDistributionData, status: distributionStatus } = useQuery({
//     queryKey: ['budgetDistribution', budgetId],
//     queryFn: () => getBudgetDistributionApi(authenticatedUser?.token ?? '', budgetId),
//     enabled: !!authenticatedUser?.token && !!budgetId,
// });


// ----------------------------------------------------------------















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
        toast.error(error?.response?.data?.message);
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
        toast.error(error?.response?.data?.message);
        console.log(error);
    }
};