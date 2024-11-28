import api from "@/utils/axiosInstance";
import toast from "react-hot-toast";


export const uploadReceiptApi = async (token: string, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append("file", file, "receipt.jpg");


        const response = await api.post(`media/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'multipart/form-data',
            },
        });

        toast.success(response.data.message || "File uploaded successfully!");
        console.log(response.data);
        return response.data.data;
    } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred during file upload");
        console.log("Error uploading file", error);
        throw error;
    }
};