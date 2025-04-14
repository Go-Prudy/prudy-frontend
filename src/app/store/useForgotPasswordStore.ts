import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IForgotPasswordForm } from '../Types';

interface ForgotPasswordState {
  form: IForgotPasswordForm;
  updateForm: (data: Partial<IForgotPasswordForm>) => void;
  resetForm: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>()(
  persist(
    (set, get) => ({
      form: {
        email: '',
        otpReference: '',
        pin: '',
        confirmPin: '',
      },
      updateForm: (data) =>
        set((state) => ({
          form: { ...state.form, ...data },
        })),
      resetForm: () =>
        set(() => ({
          form: {
            otpReference: '',
            email: '',
            pin: '',
            confirmPin: '',
          },
        })),
    }),
    {
      name: 'forgot-password-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
