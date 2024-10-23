import toast from 'react-hot-toast';
import api from "../../utils/axiosInstance";
import { IForgotPassword, ILoginForm, IOtpResponse, ISignupForm } from "../Types";


// Function to send OTP with SIGNUP
export const sendOtp = async (otpFormData: any) => {

    try {
        const response = await api.post('/auth/otp', otpFormData);
        // console.log(response.data);
        toast.success(response.data.message);
        return response.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message);
        console.log(error);

    }
};

// Function to Verify OTP with SIGNUP
export const verifyOtp = async (otpFormData: any) => {
    try {
        const response = await api.post('auth/otp/verify', otpFormData);
        toast.success(response.data.message);
        // console.log(response.data);

        return response.data

    } catch (error: any) {
        console.log(error.response.data.message);

        toast.error(error?.response?.data?.message);

    }

};

// Function to signup with OTP reference

export const signupUser = async (formData: ISignupForm) => {
    try {
        const response = await api.post('/auth/signup', formData);
        toast.success(response.data.message);
        // console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
};



export const loginUser = async (formData: ILoginForm) => {
    try {
        const response = await api.post('/auth/login', formData);
        toast.success(response.data.message);
        // console.log(response.data);

        return response.data;
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
};


export const signUpWithGoogle = async () => {
    try {
        const response = await api.get('/auth/google');
        toast.success(response.data.message);
        // console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
};




export const forgotPassword = async (data: IForgotPassword) => {
    try {
        console.log(data);

        const response = await api.post('auth/forgot-pin', data);
        toast.success(response.data.message);
        // console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
};







