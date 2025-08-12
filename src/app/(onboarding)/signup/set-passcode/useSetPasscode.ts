import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { signupUser } from '@/app/services/AuthenticationService';
import { ISignupForm } from '@/app/Types';
import { useSignupStore } from '@/app/store/useSignupStore';

export default function useSetPasscode() {
  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState<string[]>(Array(6).fill(''));
  const [focusedPasswordInput, setFocusedPasswordInput] = useState<number | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string[]>(Array(6).fill(''));
  const [focusedConfirmPasswordInput, setFocusedConfirmPasswordInput] = useState<
    number | null
  >(null);

  const { form, updateForm, signup } = useSignupStore();

  const setPasscodeMutation = useMutation({
    mutationFn: (data: ISignupForm) => {
      updateForm(data);
      return signupUser(data);
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        // const { success, message, ...rest } = data;
        signup(data.data);

        Cookies.set('hasFreeTrial', data.data.profile.hasFreeTrial, {
          expires: 365 * 100,
          secure: true,
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response.data.message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validate password length
    if (password.length < 6 || confirmPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    // Validate if passwords match
    if (password.join('').toString() !== confirmPassword.join('').toString()) {
      setError('Passwords do not match');
      return;
    }

    setPasscodeMutation.mutateAsync({
      ...form,
      pin: password.join('').toString(),
      confirmPin: confirmPassword.join('').toString(),
    });

    setError('');
  };
  return {
    password,
    setPassword,
    focusedPasswordInput,
    setFocusedPasswordInput,
    confirmPassword,
    setConfirmPassword,
    focusedConfirmPasswordInput,
    setFocusedConfirmPasswordInput,
    setPasscodeMutation,
    handleSubmit,
    passCodeLength: 6,
    error,
  };
}
