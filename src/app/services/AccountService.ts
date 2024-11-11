import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { AccountParams, AssignTransactionData } from "../Types";


export const initLinkAccountApi = async (
    token: string
): Promise<any> => {
    try {
        const response = await api.post(
            `accounts/link`,
            {}, // Assuming no body data is needed for this request
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            }
        );

        toast.success(response.data.message);
        console.log(response.data);

        // Automatically redirect if URL is present
        if (response.data.data.url) {
            window.location.href = response.data.data.url;
        }

        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
        throw error; // Re-throw the error for further handling if needed
    }
};




export const getAllAccountsApi = async (token: string, params: AccountParams): Promise<any> => {
    try {
        const response = await api.get(`accounts/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                sortBy: params.sortBy ?? 'Samuel Olamide', // Default sortBy to 'accountName' if not provided
                sortDir: params.sortDir ?? 'ASC', // Default sortDir to 'ASC' if not provided
                limit: params.limit ?? 2, // Default limit to 2 if not provided
                page: params.page ?? 1, // Default page to 1 if not provided
            },
        });
        console.log(response.data);

        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred while fetching accounts");
        console.log(error);
        throw error;
    }
};




export const fetchAccountInfoApi = async (
    token: string,
    id: string
): Promise<any> => {
    try {
        const response = await api.get(`accounts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        return response.data.data; // Assuming account information is in `data`
    } catch (error: any) {
        toast.error(error.response.data?.message || "An error occurred while fetching");
        console.error("Error fetching account information:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};





export const fetchAccountTransactionsApi = async (
    token: string,
    id: string,
    limit: number = 12,
    page: number = 1
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
        return response.data.data; // Assuming transaction data is in `data`
    } catch (error: any) {
        console.error("Error fetching account transactions:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};




export const syncAccountTransactionsApi = async (
    token: string,
    accountId: string
): Promise<any> => {
    try {
        const response = await api.get(`accounts/${accountId}/transactions/sync`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        return response.data.data; // Assuming the synced transaction data is in `data`
    } catch (error: any) {
        console.error("Error syncing account transactions:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};









export const assignAccountTransactionApi = async (
    token: string,
    accountId: string,
    transactionId: string,
    data: AssignTransactionData
): Promise<any> => {
    try {
        const response = await api.post(
            `accounts/${accountId}/transactions/${transactionId}/assign`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            }
        );
        return response.data.data; // Assuming the response data is in `data`
    } catch (error: any) {
        console.error("Error assigning account transaction:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};

// const assignTransactionMutation = useMutation({
//     mutationFn: (data: AssignTransactionData) =>
//         assignAccountTransactionApi(
//             authenticatedUser?.token ?? '',
//             '26f90072-be73-4f75-8a2b-3cdb3ff1ff23', // Replace with actual account ID
//             'de75672d-2e33-4bd3-9acc-396b16f218af', // Replace with actual transaction ID
//             data
//         ),
//     onSuccess: () => {
//         console.log("Transaction assigned successfully!");
//         // Add any additional success handling here
//     },
//     onError: (error: unknown) => {
//         console.error("Error assigning transaction:", error);
//     },
// });

// const handleAssignTransaction = () => {
//     const data: AssignTransactionData = {
//         budgetId: "14066cce-a0fb-4502-853b-cb2361dd2ae6",
//         categoryId: "5ea16909-2ebe-4987-a85e-574a5b399126",
//     };

//     assignTransactionMutation.mutate(data);
// };