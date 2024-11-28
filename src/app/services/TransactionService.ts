import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";


export const scanReceiptApi = async (token: string, url: any): Promise<any> => {
    try {
        console.log(url);

        const response = await api.post(`transactions/scan`, url, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        toast.success(response.data.message || "Scanned uploaded successfully!");
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred during file upload");
        console.log("Error uploading file", error);
        throw error;
    }
};


