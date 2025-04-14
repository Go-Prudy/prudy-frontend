import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { IOtpResponse, IVerifyOtpResponse } from '@/app/Types';
import { sendOtp, verifyOtp } from '@/app/services/AuthenticationService';
import { useSignupStore } from '@/app/store/useSignupStore';
import { useOtpTimer } from '@/app/_hooks/useOtpTimer';

export default function useVerify() {
  const [otpValues, setOtpValues] = React.useState<string[]>(Array(6).fill(''));
  const [focusedInput, setFocusedInput] = React.useState<number | null>(null);
  const navigate = useRouter();
  const { form, updateForm } = useSignupStore();
  const { timeLeft, canResend, startTimer } = useOtpTimer();

  const verifyOtpMutation = useMutation({
    mutationFn: (otpFormData: any) => verifyOtp(otpFormData),
    onSuccess: (data: IVerifyOtpResponse) => {
      if (data?.success) {
        console.log(data);
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
  const otpMutation = useMutation({
    mutationFn: (otpFormData: { channel: string; email: string; type: string }) =>
      sendOtp(otpFormData),
    onSuccess: (data: IOtpResponse) => {
      if (data?.success) {
        updateForm({ otpReference: data?.data.reference });
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  //submission of otp request
  const handleSubmit = async () => {
    const otp = otpValues.join('');
    verifyOtpMutation.mutateAsync({
      reference: form.otpReference,
      email: form.email,
      code: otp.toString(),
    });
  };

  const handleResendCode = async () => {
    startTimer();
    await otpMutation.mutateAsync({
      channel: 'email',
      email: form.email,
      type: 'signup',
    });
  };

  useEffect(() => {
    // Auto-submit when all OTP fields are filled
    if (otpValues.every((value) => value.length > 0)) {
      handleSubmit(); // Trigger form submission
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValues]);

  return {
    otpValues,
    setOtpValues,
    focusedInput,
    setFocusedInput,
    verifyOtpMutation,
    timeLeft,
    canResend,
    handleResendCode,
  };
}
