'use client';

import Header from '@/components/header';
import React, { useEffect } from 'react';
import axios from 'axios';
import { BsCheck } from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { OtpResponse, verifyOtpResponse } from '@/app/Types';
import { sendOtp, verifyOtp } from '@/app/services/AuthenticationService';
import { useAuthentication } from '@/app/store/AuthStore';
import { CircularProgress } from '@nextui-org/react';

const VerifyOtpPage = () => {
  const inputLength = 6;
  const [otpValues, setOtpValues] = React.useState<string[]>(Array(inputLength).fill(''));
  const [focusedInput, setFocusedInput] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null | any>(null);
  const navigate = useRouter();
  const { signup, form, timeLeft, tick, startTimer, canResend } = useAuthentication();


  // React Query mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (otpFormData: any) => verifyOtp(otpFormData),
    onSuccess: (data: verifyOtpResponse) => {
      if (data?.success) {
        console.log(data);
        setSuccess(true)
        setTimeout(() => {
          navigate.push('/signup/set-passcode');
        }, 1000);


      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  // React Query mutation for sending OTP
  const otpMutation = useMutation<OtpResponse, Error, { email: string; phoneNumber: string }>({
    mutationFn: (otpFormData) => sendOtp(otpFormData),
    onSuccess: (data: OtpResponse) => {
      if (data?.success) {

        const newFormData = { ...form, otpReference: data?.data.reference }
        // Store form data using Zustand store
        signup(newFormData);
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  //submission of otp request
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const otp = otpValues.join('');
    try {
      const { lastName, firstName, registeredWith, pin, confirmPin, ...rest } = form
      const verifyOtpData = {
        reference: rest.otpReference,
        email: rest.email,
        code: otp.toString(),
      }
      verifyOtpMutation.mutateAsync(verifyOtpData)
      // Handle success (e.g., redirect or show a success message)
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResendCode = async () => {
    try {

      const resendData = {
        channel: 'email',
        email: form.email,
        phoneNumber: form.phoneNumber,
        type: 'signup'
      }

      if (canResend) {
        console.log('Code resent successfully!');
        startTimer(); // Start the 5-minute countdown
        const otpResponse = await otpMutation.mutateAsync(resendData);
        console.log(otpResponse);
      }



    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    // Auto-submit when all OTP fields are filled
    if (otpValues.every(value => value.length > 0)) {
      handleSubmit(); // Trigger form submission
    }
  }, [otpValues]);



  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, tick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} className="w-full">
      <Header link={'/signup/'} title="Create account" />
      <form id="otp-form" className="pt-10 px-6" onSubmit={e => e.preventDefault()}>
        <p className="font-medium text-[#2D2D2D] text-xl mb-6">
          Verify your email address/phone number
        </p>
        <div className="flex items-center gap-2 mb-6 justify-between">
          {Array.from({ length: inputLength }).map((_, index) => (
            <OtpInput
              key={index}
              index={index}
              otpValues={otpValues}
              setOtpValues={setOtpValues}
              inputLength={inputLength}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />
          ))}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {
          verifyOtpMutation.isPending && <CircularProgress className=' text-[#343434] flex mx-auto justify-center size-[30px] ' color='primary' size='md' />
        }
        {success && <div className=' flex items-start  gap-x-[8px] '>
          <BsCheck className=' size-[16px]  text-[#219653] ' />

          <p className="text-[#219653] block text-[12px] mb-4">success</p>
        </div>
        }

        <button
          onClick={() => canResend && handleResendCode()}  // Only trigger handleResendCode when canResend is true
          className={`font-medium flex justify-center w-full mx-auto text-lemonGreen-700 ${success ? 'mt-[38px]' : 'flex'
            }`}
          disabled={!canResend}  // Disable the button when canResend is false
        >
          {canResend ? (
            <>
              Resend code
            </>
          ) : (
            <>
              Resend code in {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

type OtpInputProps = {
  index: number;
  otpValues: string[];
  setOtpValues: React.Dispatch<React.SetStateAction<string[]>>;
  inputLength: number;
  focusedInput: number | null;
  setFocusedInput: React.Dispatch<React.SetStateAction<number | null>>;
};

const OtpInput = ({
  index,
  otpValues,
  setOtpValues,
  inputLength,
  focusedInput,
  setFocusedInput,
}: OtpInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const validKeys = /^[0-9]{1}$|Backspace|Delete|Tab|Meta/;
    if (!validKeys.test(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (index > 0) {
        setOtpValues((prev) => [
          ...prev.slice(0, index),
          '',
          ...prev.slice(index + 1),
        ]);
        setFocusedInput((prev) => (prev && prev > 0 ? prev - 1 : prev));
      }
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setOtpValues((prev) => [
      ...prev.slice(0, index),
      value,
      ...prev.slice(index + 1),
    ]);

    if (value && index < inputLength - 1) {
      setFocusedInput(index + 1);
    }
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    e.target.select();
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(text)) {
      const digits = text.split('');
      setOtpValues((prev) => [
        ...prev.slice(0, index),
        digits[index],
        ...prev.slice(index + 1),
      ]);
    }
  };

  React.useEffect(() => {
    if (focusedInput === index && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusedInput, index]);

  React.useEffect(() => {
    if (otpValues[index] && inputRef.current) {
      inputRef.current.value = otpValues[index];
    }
  }, [otpValues, index]);

  const isFilled = !!otpValues[index];

  return (
    <input
      type="text"
      autoComplete="new-password"
      className={`w-12 h-[56px] text-center font-extrabold text-slate-900 border border-[#EFEFF0] rounded-2xl p-2 outline-none 
        ${isFilled ? 'bg-[#E6F8EF] text-slate-900' : 'bg-[#F7F7F9]'} 
        ${isFilled ? 'text-black' : 'text-slate-900'} 
        focus:border-lemonGreen-700 focus:ring-2 focus:ring-indigo-100`}
      pattern="\d*"
      maxLength={1}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onPaste={handlePaste}
      ref={inputRef}
      value={otpValues[index]}
    />
  );
};

export default VerifyOtpPage;
