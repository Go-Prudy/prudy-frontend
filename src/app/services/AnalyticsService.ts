// analytics/budgets/:budgetUid

import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";


// Function to Get Overall Budget Analytics

export const GetOverallBudgetAnalyticsApi = async (token: string, id: string) => {

    try {
        const response = await api.get(`analytics/budgets/${id}`, {
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



// Function to Get Budget Categories Analytics
export const GetBudgetCategoriesAnalyticsApi = async (token: string, id: string) => {

    try {
        const response = await api.get(`analytics/budgets/${id}/categories`, {
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
