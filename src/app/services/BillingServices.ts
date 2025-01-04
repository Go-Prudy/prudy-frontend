import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";

// Function to  get billing cycle
export const getBillingCycleApi = async (token: string) => {

    try {
        const response = await api.get('billing/cycle', {
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

export const getBillingHistoryApi = async (token: string, offset: number, limit: number) => {
    try {
        const response = await api.get(`billing/history?offset=${offset}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        return response.data.data; // Assuming the response structure matches the provided object
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.error(error);
        return {
            totalRecords: 0,
            pageTotal: 0,
            next: {},
            prev: {},
            offset: 0,
            limit,
            docs: [],
        };
    }
};
