import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { sendOtp, verifyOtp } from '@/app/services/AuthenticationService';
import { IVerifyOtpResponse } from '@/app/Types';
import { useForgotPasswordStore } from '@/app/store/useForgotPasswordStore';
import { useOtpTimer } from '@/app/_hooks/useOtpTimer';

export default function useForgotPassword() {
  const inputLength = 6;
  const [otpValues, setOtpValues] = useState<string[]>(Array(inputLength).fill(''));
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const navigate = useRouter();

  const { form, updateForm } = useForgotPasswordStore();
  const { timeLeft, canResend, startTimer } = useOtpTimer();

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
        updateForm({
          email: context?.email,
          otpReference: rest.data.reference,
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

    await verifyOtpMutation.mutateAsync({
      reference: form.otpReference,
      email: form.email,
      code: otp.toString(),
    });
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
