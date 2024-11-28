import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";

export const fetchUserProfileApi = async (token: string): Promise<any> => {
    try {
        const response = await api.get(`settings/profile`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        return response.data.data; // Assuming the profile data is under `data`
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
    }
}

export const GetSettingsApi = async (token: string): Promise<any> => {
    try {
        const response = await api.get(`settings`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        return response.data.data; // Assuming the profile data is under `data`
    } catch (error: any) {
        console.log("Error fetching  GetSettingsApi:", error);
    }
}






export const updateProfilePhotoApi = async (token: string, picture: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('picture', picture); // Add the image file to form data

        const response = await api.post(`settings/profile/picture`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'multipart/form-data', // Set content type for form data
            },
        });

        toast.success(response.data.message);
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred while updating the profile photo");
        console.error("Error updating profile photo:", error);
    }
};




export const changePasswordApi = async (token: string, data: any): Promise<any> => {
    try {

        const response = await api.post(`settings/change-passcode`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        toast.success(response.data.message);
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred while changing password");
        console.error("Error changing Password", error);
    }
}



export const SetCurrencyApi = async (token: string, data: any): Promise<any> => {
    try {

        const response = await api.post(`settings/currency`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        toast.success(response.data.message);
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred while changing password");
        console.log("Error SetCurrency", error);
    }
}


// Activate Reminder
export const ActivateReminderApi = async (token: string, data: any): Promise<any> => {
    try {

        const response = await api.post(`settings/reminders/activate`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        toast.success(response.data.message);
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred while changing password");
        console.error("Error changing Password", error);
    }
}


// Deactivate Reminder
export const DeactivateReminderApi = async (token: string): Promise<any> => {
    try {
        const response = await api.post(`settings/reminders/deactivate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        toast.success(response.data.message);
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred while deactivating the reminder");
        console.error("Error deactivating reminder", error);
    }
};