import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { IForgotPasswordForm } from '@/app/Types';
import { forgotPassword as handleForgotPassword } from '@/app/services/AuthenticationService';
import { useForgotPasswordStore } from '@/app/store/useForgotPasswordStore';

export default function useChangePasscode() {
  const inputLength = 6;

  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const [newPasscode, setNewPasscode] = useState<string[]>(Array(inputLength).fill(''));
  const [confirmPasscode, setConfirmPasscode] = useState<string[]>(
    Array(inputLength).fill(''),
  );
  const [focusedNewPasscode, setFocusedNewPasscode] = useState<number | null>(null);
  const [focusedConfirmPasscode, setFocusedConfirmPasscode] = useState<number | null>(
    null,
  );

  const { form, updateForm } = useForgotPasswordStore();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: IForgotPasswordForm) => {
      const result = await handleForgotPassword(data);
      return result;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        updateForm({
          pin: newPasscode.join('').toString(),
          confirmPin: confirmPasscode.join('').toString(),
        });
        setShowModal(true);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    },
  });

  const handleResetPassword = async () => {
    if (newPasscode.join('').toString() !== confirmPasscode.join('').toString()) {
      setError('Passcodes do not match.');
      return;
    }

    // Clear any previous errors
    setError('');
    forgotPasswordMutation.mutateAsync({
      ...form,
      pin: newPasscode.join('').toString(),
      confirmPin: confirmPasscode.join('').toString(),
    });
  };

  return {
    handleResetPassword,
    forgotPasswordMutation,
    focusedNewPasscode,
    setFocusedNewPasscode,
    focusedConfirmPasscode,
    setFocusedConfirmPasscode,
    newPasscode,
    setNewPasscode,
    confirmPasscode,
    setConfirmPasscode,
    error,
    showModal,
    setShowModal,
  };
}
