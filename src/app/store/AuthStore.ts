import { create } from 'zustand';
import Cookies from 'js-cookie';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  IAuthenticatedUser,
  IForgotPassword,
  ISignupForm,
  IUserProfile,
  IVerifyOtpForm,
} from '../Types';

interface AuthState {
  form: ISignupForm;
  authenticatedUser: IAuthenticatedUser | null;
  isAuthenticated: () => boolean;
  LogOut: () => void;
  login: (data: IAuthenticatedUser) => void;
  verifyOtpForm: IVerifyOtpForm;
  signup: (form: ISignupForm) => void;
  verifyOtp: (form: IVerifyOtpForm) => void;
  updateAuthenticatedUser: (data: IAuthenticatedUser) => void;
  ForgotPassword: (form: IForgotPassword) => void;
  ForgotPasswordForm: IForgotPassword;
  canResend: boolean;
  timeLeft: number;
  startTimer: () => void;
  tick: () => void;
}

export const useAuthentication = create<AuthState>()(
  persist(
    (set, get) => ({
      canResend: true, 
      timeLeft: 0,
      startTimer: () => {
        set({ canResend: false, timeLeft: 300 }); // Start a 5-minute timer (300 seconds)
      },

      tick: () =>
        set((state) => ({
          timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
          canResend: state.timeLeft <= 1, // Enable the button when time reaches 0
        })),

      form: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        otpReference: '',
        pin: '',
        confirmPin: '',
        registeredWith: 'form',
      },

      ForgotPasswordForm: {
        otpRef: '',
        email: '',
        pin: '',
        confirmPin: '',
      },

      verifyOtpForm: {
        reference: '',
        code: '',
        email: '',
        phoneNumber: '',
      },

      signup: (formData: ISignupForm) =>
        set((state) => ({
          form: { ...state.form, ...formData }, // Update form with the provided form data
        })),

      verifyOtp: (formData: IVerifyOtpForm) =>
        set((state) => ({
          verifyOtpForm: { ...state.form, ...formData }, // Update form with the provided form data
        })),

      updateAuthenticatedUser: (data: IAuthenticatedUser) =>
        set((state) => ({
          authenticatedUser: {
            ...(state.authenticatedUser as IAuthenticatedUser),
            ...data,
          },
        })),
      ForgotPassword: (formData: IForgotPassword) =>
        set((state) => ({
          ForgotPasswordForm: { ...state.ForgotPasswordForm, ...formData },
        })),

      authenticatedUser: {
        token: '',
        profile: {
          createdAt: '',
          updatedAt: '',
          uid: '',
          firstName: '',
          lastName: '',
          email: '',
          hasFreeTrial: false,
          phoneNumber: '',
          registeredWith: '',
          isVerified: false,
          hasOnboarded: false,
          accountProviderId: '',
          profilePhotoUrl: '',
        },
      },
      // Check if user is authenticated
      isAuthenticated: () => {
        const user = get().authenticatedUser;
        return user !== null && user.token !== '';
      },

      // Login: Store authenticated user data
      login: (userData: IAuthenticatedUser) => {
        set({ authenticatedUser: userData });
      },

      // Logout: Clear authenticated user data
      LogOut: () => {
        Cookies.remove('token');
        localStorage.clear();
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // Using createJSONStorage to wrap localStorage
    },
  ),
);
