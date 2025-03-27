import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { sendOtp, verifyOtp } from '@/app/services/AuthenticationService';
import { IVerifyOtpResponse } from '@/app/Types';
import { useAuthentication } from '@/app/store/AuthStore';

export default function useForgotPassword() {
  const inputLength = 6;
  const [otpValues, setOtpValues] = useState<string[]>(Array(inputLength).fill(''));
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const navigate = useRouter();

  const { timeLeft, tick, startTimer, canResend, ForgotPassword, ForgotPasswordForm } =
    useAuthentication();

  // React Query mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: (data: {
      channel: string;
      email: string;
      type: string;
      isResendOtp: boolean;
    }) => sendOtp({ channel: data.channel, email: data.email, type: data.type }),
    onMutate: (values) => {
      return { ...values };
    },
    onSuccess: (data: any, _values, context) => {
      if (data?.success) {
        const { success, message, ...rest } = data;
        ForgotPassword({
          ...ForgotPasswordForm,
          email: context?.email,
          otpRef: rest.data.reference,
        });
        if (context?.isResendOtp) {
          startTimer();
        } else {
          setStep(2);
        }
      }
    },
    onError: (error: Error) => {},
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (otpFormData: any) => verifyOtp(otpFormData),
    onSuccess: (data: IVerifyOtpResponse) => {
      if (data?.success) {
        setTimeout(() => {
          navigate.push('/change-passcode');
        }, 1000);
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  const onSubmitOtp = async () => {
    const otp = otpValues.join('');

    const verifyOtpData = {
      reference: ForgotPasswordForm.otpRef,
      email: ForgotPasswordForm.email,
      code: otp.toString(),
    };
    await verifyOtpMutation.mutateAsync(verifyOtpData);
  };

  const handleResendOtp = async (e: React.FormEvent, email: string) => {
    e.preventDefault();
    await sendOtpMutation.mutateAsync({
      channel: 'email',
      email: email,
      type: 'forgotPassword',
      isResendOtp: true,
    });
  };

  useEffect(() => {
    if (otpValues.every((value) => value.length > 0)) {
      onSubmitOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValues]);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        tick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, tick]);

  return {
    otpValues,
    setOtpValues,
    focusedInput,
    setFocusedInput,
    step,
    timeLeft,
    canResend,
    sendOtpMutation,
    verifyOtpMutation,
    handleResendOtp,
  };
}
