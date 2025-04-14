import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IAuthenticatedUser, ISignupForm } from '../Types';
import { useAuthStore } from './useAuthStore';

interface SignupState {
  form: ISignupForm;
  updateForm: (data: Partial<ISignupForm>) => void;
  resetForm: () => void;
  signup: (data: IAuthenticatedUser) => void;
}

export const useSignupStore = create<SignupState>()(
  persist(
    (set, get) => ({
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

      updateForm: (data) =>
        set((state) => ({
          form: { ...state.form, ...data },
        })),

      resetForm: () =>
        set(() => ({
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
        })),

      signup: (data) => {
        useAuthStore.getState().login(data);
        get().resetForm();
      },
    }),
    {
      name: 'signup-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
