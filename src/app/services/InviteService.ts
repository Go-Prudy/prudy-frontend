import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";

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
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }
};



export const acceptBudgetInviteApi = async (
    inviteId: string,
    budgetId: string,
    token: string
): Promise<any> => {
    try {
        const response = await api.post(
            `invites/${inviteId}/budget/${budgetId}/accept`,
            {}, // Assuming no body data is needed for this request
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            }
        );
        // toast.success(response.data.message);
        console.log(response);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }
};



// Function to Reject Budget Invite
export const rejectBudgetInviteApi = async (
    inviteId: string,
    budgetId: string,
    token: string
): Promise<any> => {
    try {
        const response = await api.post(
            `invites/${inviteId}/budget/${budgetId}/reject`,
            {}, // Assuming no body data is needed for this request
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(response.data.message);
        console.log(response);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
        console.log(error);
    }
};
