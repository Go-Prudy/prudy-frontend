'use client';
import Header from '@/components/header';
import GoogleLogo from '@/icons/google-logo';
import Link from 'next/link';
import Input from '@/components/input';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { getGoogleUrl, loginUser, loginWithGoogle } from '@/app/services/AuthenticationService';
import { Button, CircularProgress } from '@nextui-org/react';
import { useAuthentication } from '@/app/store/AuthStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { access } from 'fs';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setIsLoading] = useState(false);
  const { login, authenticatedUser } = useAuthentication();
  const navigate = useRouter();

  const hasFreeTrialCookie = Cookies.get('hasFreeTrial');

  const hasFreeTrial = hasFreeTrialCookie ? JSON.parse(hasFreeTrialCookie) : null;

  // React Query mutation for sending OTP
  const loginMutation = useMutation({
    mutationFn: (data: any) => loginUser(data),
    onSuccess: (data: any) => {
      if (data?.success) {
        setIsLoading(false);
        console.log(data);
        const { success, message, ...rest } = data;
        console.log(rest.data);
        login(rest.data);
        Cookies.set('token', rest.data.token, { expires: 7 });

        if (hasFreeTrialCookie) {
          Cookies.set('hasFreeTrial', 'false', { expires: 365 * 100, secure: true });
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
      setIsLoading(false); // Ensure loading state is reset on error
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const loginData = {
        pin: passcode,
        loginWith: 'form',
        email,
      };
      await loginMutation.mutateAsync(loginData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[500px] h-[100vh] "
    >
      <Header link="" title="Sign in" />
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-[24px]">
          <div className="w-full mb-6">
            <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">
              Sign in to your account
            </p>
            <button
              type="button"
              className=" w-full py-[16px] gap-[8px] rounded-[20px] text-[#575757] justify-center inline-flex flex-col items-center bg-[#F7F7F9] border border-[#EFEFF0]"
              onClick={(e) => handleGoogleLogin(e)}
            >
              <GoogleLogo scale={24} />
              <p className=" text-[12px] leading-[14.4px]">Google</p>
            </button>
          </div>

          <Input
            label="Email address"
            inputName="email"
            inputType="email"
            placeholder="example@email.com"
            onChange={(value) => setEmail(value)}
          />
          <Input
            label="Passcode"
            maxLength={6}
            inputName="passcode"
            inputType="password"
            placeholder="Enter your passcode"
            onChange={(value) => setPasscode(value)}
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="flex font-medium justify-end gap-2">
            <Link href="/forgot-password" className="text-[#575757]">
              Forgot passcode?
            </Link>
          </p>
        </div>

        <div className=" m-0 mb-[24px] flex w-full items-center bg-white px-6  rounded-t-3xl ">
          <Button
            type="submit"
            className="h-12 font-[500] text-white flex justify-center items-center bg-black rounded-3xl w-full"
          >
            {loading ? <CircularProgress color="default" size="sm" /> : 'Sign in'}
          </Button>
        </div>
      </form>

      <p className="flex font-medium justify-center gap-2">
        <span className="text-[#575757]">Don’t have an account? </span>{' '}
        <Link href="/signup" className="text-lemonGreen-700">
          Signup
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;
