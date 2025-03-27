import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import {
  getGoogleUrl,
  loginUser,
  loginWithGoogle,
} from '@/app/services/AuthenticationService';
import { useAuthentication } from '@/app/store/AuthStore';

export default function useLogin() {
  const passCodeLength = 6;

  const [passcode, setPasscode] = useState<string[]>(Array(passCodeLength).fill(''));
  const [focusedPasswordInput, setFocusedPasswordInput] = useState<number | null>(null);

  const [error, setError] = useState<string>('');
  const [loading, setIsLoading] = useState(false);
  const { login, authenticatedUser } = useAuthentication();
  const navigate = useRouter();

  const hasFreeTrialCookie = Cookies.get('hasFreeTrial');

  const hasFreeTrial = hasFreeTrialCookie ? JSON.parse(hasFreeTrialCookie) : null;

  const loginMutation = useMutation({
    mutationFn: (data: any) => loginUser(data),
    onSuccess: (data: any) => {
      if (data?.success) {
        console.log(data);
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

        console.log(authenticatedUser);

        navigate.push('/budgets');
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  const handleGoogleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      event.preventDefault();
      window.location.href = getGoogleUrl();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    if (passcode.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const loginData = {
      pin: passcode.join('').toString(),
      loginWith: 'form',
      email: data.email,
    };
    loginMutation.mutateAsync(loginData);
  };

  return {
    onSubmit,
    focusedPasswordInput,
    setFocusedPasswordInput,
    passCodeLength,
    passcode,
    setPasscode,
    error,
    loading,
    loginMutation,
  };
}
