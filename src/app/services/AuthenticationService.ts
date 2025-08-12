import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import api from '../utils/axiosInstance';
import { IForgotPasswordForm, ILoginForm, ISignupForm } from '../Types';

// Function to send OTP with SIGNUP
export const sendOtp = async (otpFormData: any) => {
  try {
    const response = await api.post('/auth/otp', otpFormData);

    toast.success(response.data.message);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

// Validate Email on Signup
export const validateUserEmailOnSignup = async (email: string) => {
  try {
    const response = await api.post('/auth/validate-credential', { email });

    // toast.success(response.data.message);
    return response.data;
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

    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
  }
};

// Function to signup with OTP reference

export const signupUser = async (formData: ISignupForm) => {
  try {
    const response = await api.post('/auth/signup', formData);
    toast.success(response.data.message);

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

    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

export const loginWithGoogle = async () => {
  try {
    const response = await api.get('/auth/google/callback');
    toast.success(response.data.message);

    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

export const forgotPassword = async (data: IForgotPasswordForm) => {
  try {
    const response = await api.post('auth/forgot-pin', data);
    toast.success(response.data.message);

    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

export const fetchUserProfile = async () => {
  try {
    const token = Cookies.get('token');
    const response = await api.get('/settings/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // toast.success(response.data.message);

    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

export const getGoogleUrl = () => {
  const rootUrl = 'https://beta-api.goprudy.com/api/v1/auth/google';

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL!,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: 'email profile',
  };

  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs}`;
};
