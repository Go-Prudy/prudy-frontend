import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useAuthentication } from '@/app/store/AuthStore';
import { signupUser } from '@/app/services/AuthenticationService';
import { ISignupForm } from '@/app/Types';

export default function useSetPasscode() {
  const passCodeLength = 6;

  const [password, setPassword] = useState<string[]>(Array(passCodeLength).fill(''));
  const [focusedPasswordInput, setFocusedPasswordInput] = useState<number | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string[]>(
    Array(passCodeLength).fill(''),
  );
  const [focusedConfirmPasswordInput, setFocusedConfirmPasswordInput] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string>('');
  const { signup, form, login, authenticatedUser } = useAuthentication();
  const navigate = useRouter();

  const hasFreeTrialCookie = Cookies.get('hasFreeTrial');

  const setPasscodeMutation = useMutation({
    mutationFn: (data: ISignupForm) => {
      signup(data);
      return signupUser(data);
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        const { success, message, ...rest } = data;
        console.log(rest.data);
        login(rest.data);
        Cookies.set('token', rest.data.token, { expires: 7 });

        if (hasFreeTrialCookie) {
          Cookies.set('hasFreeTrial', 'false', {
            expires: 365 * 100,
            secure: true,
          });
        } else {
          Cookies.set('hasFreeTrial', rest.data.profile.hasFreeTrial, {
            expires: 365 * 100,
            secure: true,
          });
        }
        navigate.push('/budgets');
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
    passCodeLength,
    error,
  };
}
