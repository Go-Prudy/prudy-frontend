'use client';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation } from '@tanstack/react-query';
import { signupUser } from '@/app/services/AuthenticationService';
import { toast } from 'react-hot-toast';
import { ISignupForm } from '@/app/Types';
import { CircularProgress } from '@nextui-org/react';
import Cookies from 'js-cookie';
import OtpInput from '@/components/OtpInput';

const Page = () => {
  const passCodeLength = 6;

  const [password, setPassword] = useState<string[]>(Array(passCodeLength).fill(''));
  const [focusedPasswordInput, setFocusedPasswordInput] = React.useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string[]>(
    Array(passCodeLength).fill(''),
  );
  const [focusedConfirmPasswordInput, setFocusedConfirmPasswordInput] = React.useState<
    number | null
  >(null);
  const [error, setError] = useState<string>('');
  const { signup, form, login, authenticatedUser } = useAuthentication();
  const navigate = useRouter();

  const hasFreeTrialCookie = Cookies.get('hasFreeTrial');

  const setPasscodeMutation = useMutation({
    mutationFn: async (data: ISignupForm) => {
      setIsLoading(true);
      const result = await signupUser(data);
      setIsLoading(false);

      const newData: any = { ...form, pin: password, confirmPin: confirmPassword };
      signup(newData);

      // Navigate to the next step or page

      navigate.push('/login');
      return result;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        // console.log(data);
        setIsLoading(false);
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
    onError: (error: any) => {
      setIsLoading(false);
      console.error(error?.response.data.message);
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
    const newData: any = {
      ...form,
      pin: password.join('').toString(),
      confirmPin: confirmPassword.join('').toString(),
    };
    setPasscodeMutation.mutateAsync(newData);

    // Validate if passwords match
    if (password.join('').toString() !== confirmPassword.join('').toString()) {
      setError('Passwords do not match');
      return;
    }

    setError(''); // Clear the error message
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[500px] h-[100vh] "
    >
      <Header link={'/signup/verify'} title="Create account" />
      <div className="px-6 py-10">
        <div className="w-full">
          <p className="mb-6 font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">
            Set your passcode
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <p className='mb-4 text-sm text-[#828282]'>Enter Passcode</p>
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: passCodeLength }).map((_, index) => (
              <OtpInput
                key={index}
                index={index}
                otpValues={password}
                setOtpValues={setPassword}
                inputLength={passCodeLength}
                focusedInput={focusedPasswordInput}
                setFocusedInput={setFocusedPasswordInput}
              />
            ))}
          </div>
          <p className='mb-4 text-sm text-[#828282]'>Confirm Passcode</p>
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: passCodeLength }).map((_, index) => (
              <OtpInput
                key={index}
                index={index}
                otpValues={confirmPassword}
                setOtpValues={setConfirmPassword}
                inputLength={passCodeLength}
                focusedInput={focusedConfirmPasswordInput}
                setFocusedInput={setFocusedConfirmPasswordInput}
              />
            ))}
          </div>

          {/* <Input
            label="Confirm passcode"
            inputName="Confirm your passcode"
            inputType="password"
            maxLength={6}
            placeholder="Confirm your passcode"
            onChange={(value) => setConfirmPassword(value)}
          /> */}
          <div className="flex items-center gap-2 mb-6 justify-between"></div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="m-0 mt-[38px] flex w-full items-center bg-white rounded-t-3xl">
            <button
              type="submit"
              className={`h-12 text-white font-[500] bg-black rounded-3xl w-full `}
            >
              {isLoading ? (
                <CircularProgress
                  color="default"
                  className=" text-[#ae3d3d] flex mx-auto justify-center "
                  size="sm"
                />
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Page;
