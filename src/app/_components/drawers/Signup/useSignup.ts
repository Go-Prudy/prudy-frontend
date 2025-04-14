import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useSignupStore } from '@/app/store/useSignupStore';
import {
  getGoogleUrl,
  sendOtp,
  validateUserEmailOnSignup,
} from '@/app/services/AuthenticationService';
import { IOtpResponse } from '@/app/Types';
import toast from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form';

type SignupInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default function useSignup() {
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  // const { signup } = useAuthentication();
  const { updateForm } = useSignupStore();
  const navigate = useRouter();

  const handleIsAgreedCheckbox = () => {
    setIsAgreed(!isAgreed);
  };

  // React Query mutation for sending OTP
  const otpMutation = useMutation({
    mutationFn: (values: {
      email: string;
      phoneNumber: string;
      firstName: string;
      lastName: string;
      type: string;
      channel: string;
    }) => sendOtp({ email: values.email, type: values.type, channel: values.channel }),
    onMutate: (values) => {
      return { ...values };
    },
    onSuccess: (data: IOtpResponse, _values, context) => {
      if (data?.success) {
        updateForm({
          firstName: context.firstName,
          lastName: context.lastName,
          email: context.email,
          phoneNumber: context.phoneNumber,
          registeredWith: 'form',
          otpReference: data.data.reference,
        });
        navigate.push('/signup/verify');
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  const validateEmailMutation = useMutation({
    mutationFn: (values: {
      email: string;
      phoneNumber: string;
      type: string;
      channel: string;
      firstName: string;
      lastName: string;
    }) => validateUserEmailOnSignup(values.email),
    onMutate: (values) => {
      return { ...values };
    },
    onSuccess: async (data, _values, context) => {
      if (data?.success) {
        if (data.data.taken) {
          console.log('Email is already taken', data.message);
          toast.error(data.message);
        } else {
          otpMutation.mutateAsync({
            firstName: context?.firstName,
            lastName: context?.lastName,
            email: context?.email,
            phoneNumber: context?.phoneNumber,
            type: context?.type,
            channel: context?.channel,
          });
        }
      }
    },
    onError: (error: Error) => {
      console.error('Error sending OTP:', error);
    },
  });

  const handleGoogle = async () => {
    window.location.href = getGoogleUrl();
  };

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    console.log(data);

    await validateEmailMutation.mutateAsync({
      email: data.email,
      phoneNumber: data.phoneNumber,
      type: 'signup',
      channel: 'email',
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };
  return {
    handleIsAgreedCheckbox,
    handleGoogle,
    onSubmit,
    isAgreed,
    validateEmailMutation,
    otpMutation,
  };
}
