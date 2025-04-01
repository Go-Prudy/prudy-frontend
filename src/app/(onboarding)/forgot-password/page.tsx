'use client';

import { motion } from 'framer-motion';
import { CircularProgress } from '@nextui-org/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Header from '@/components/header';
import Input from '@/components/input';
import Button from '@/components/button';
import OtpInput from '@/components/OtpInput';
import Success from '../_components/Success';
import { emailSchema } from '@/utils/validationSchema';
import useForgotPassword from './useForgotPassword';

const VerifyOtpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(emailSchema),
  });

  const {
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
  } = useForgotPassword();

  const onSubmitEmail: SubmitHandler<{ email: string }> = async (data) => {
    await sendOtpMutation.mutateAsync({
      channel: 'email',
      email: data.email,
      type: 'forgotPassword',
      isResendOtp: false,
    });
  };

  return (
    <div>
      <Header link={'/login'} title="Remember passcode" />

      {step === 1 ? (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <form
            id="otp-form"
            className="py-10 px-6 space-y-6"
            onSubmit={handleSubmit(onSubmitEmail)}
          >
            <div className="space-y-4">
              <h1 className="text-xl font-medium text-black-800">Forgot passcode?</h1>
              <p className="text-gray-400 text-base">
                Enter the email address associated with your account below
              </p>
            </div>

            <Input
              label="Email address"
              inputName="phoneNumber"
              inputType="email"
              {...register('email')}
              placeholder="example@email.com"
            />

            <Button type="submit" loading={sendOtpMutation.isPending}>
              Send OTP
            </Button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <form
            id="otp-form"
            className="py-10 px-6 space-y-6"
            onSubmit={(e) => handleResendOtp(e, getValues('email'))}
          >
            <div className="space-y-4">
              <h1 className="font-medium text-xl text-black-800">Forgot passcode?</h1>
              <p className="font-medium text-gray-400">
                Enter 6 digit pin sent to your email/phone number
              </p>
            </div>
            <div className="space-y-4">
              <OtpInput
                otpValues={otpValues}
                setOtpValues={setOtpValues}
                inputLength={6}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
            </div>
            {verifyOtpMutation.data && <Success />}
            <button
              type="submit"
              className={`font-medium flex justify-center w-full mx-auto text-lemonGreen-600 ${
                verifyOtpMutation.isSuccess ? '' : 'flex'
              }`}
              disabled={!canResend}
            >
              {canResend ? (
                verifyOtpMutation.isPending ? (
                  <CircularProgress />
                ) : (
                  <>Resend code</>
                )
              ) : (
                <>
                  Resend code in {Math.floor(timeLeft / 60)}:
                  {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default VerifyOtpPage;
