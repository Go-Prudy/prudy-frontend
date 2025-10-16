import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getGoogleUrl,
  loginUser,
  loginWithGoogle,
} from '@/app/services/AuthenticationService';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function useLogin() {
  const [error, setError] = useState<string>('');
  const [loading, setIsLoading] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string[]>(Array(6).fill(''));
  const [focusedPasswordInput, setFocusedPasswordInput] = useState<number | null>(null);
  const [showSignupDrawer, setShowSignupDrawer] = useState<boolean>(false);

  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : null;

  const loginMutation = useMutation({
    mutationFn: (data: any) => loginUser(data),
    onSuccess: (data: any) => {
      if (data?.success) {
        console.log(redirectTo);

        login(data.data);

        Cookies.set('hasFreeTrial', data.data.profile.hasFreeTrial, {
          expires: 365 * 100,
          secure: true,
        });

        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          router.push('/home');
        }
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
      const googleUrl = getGoogleUrl();
      if (redirectTo) {
        const url = new URL(googleUrl);
        url.searchParams.set('state', redirectTo);
        window.location.href = url.toString();
      } else {
        window.location.href = googleUrl;
      }
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
    passCodeLength: 6,
    passcode,
    setPasscode,
    error,
    loading,
    loginMutation,
    showSignupDrawer,
    setShowSignupDrawer,
  };
}
