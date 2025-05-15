'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/app/_components/button';
import OtpInput from '@/components/OtpInput';
import Input from '@/app/_components/input';
import { emailSchema } from '@/app/utils/validationSchema';
import GoogleLogo from '@/icons/google-logo';
import loginImage from '/public/images/onboarding/login.png';
import useLogin from './useLogin';
import SignupDrawer from '@/app/_components/drawers/Signup';

const LoginPage = () => {
  const {
    onSubmit,
    focusedPasswordInput,
    setFocusedPasswordInput,
    passCodeLength,
    passcode,
    setPasscode,
    error,
    loading,
    loginMutation,
    showSignupDrawer,
    setShowSignupDrawer,
  } = useLogin();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(emailSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[500px] h-[100vh] pb-6"
    >
      <div className="h-[298px]">
        <Image className="object-cover h-full rounded-b-[32px]" src={loginImage} alt="" />
      </div>
      <form className="space-y-8 p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            Welcome back,{' '}
            {/* <span className="text-lemonGreen-600">
              {firstName}
            </span> */}
          </h2>
          <p className="text-base text-[#2D2D2D]">
            Sign in to your account and enjoy easy budgeting and expense tracking
          </p>
          {/* <button
              type="button"
              className=" w-full py-4 gap-2 rounded-[20px] text-gray-600 justify-center inline-flex flex-col items-center bg-gray-100 border border-gray-200"
              onClick={(e) => handleGoogleLogin(e)}
            >
              <GoogleLogo scale={24} />
              <p className=" text-xs">Google</p>
            </button> */}
        </div>
        <div className="space-y-4">
          <Input
            label="Email address"
            inputName="email"
            type="email"
            placeholder="example@email.com"
            {...register('email')}
          />
          <div className="flex justify-between items-center gap-1">
            <p className="text-sm text-gray-600">Enter Passcode</p>
            <Link
              href="/forgot-password"
              className="flex font-medium text-xs text-gray-400"
            >
              Forgot passcode?
            </Link>
          </div>

          <OtpInput
            otpValues={passcode}
            setOtpValues={setPasscode}
            inputLength={passCodeLength}
            focusedInput={focusedPasswordInput}
            setFocusedInput={setFocusedPasswordInput}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <Button
          // use errors from react hook form

          disabled={passcode.length !== 6}
          type="submit"
          loading={loginMutation.isPending}
        >
          Sign in
        </Button>
        <p className="flex font-medium justify-center gap-2">
          <span className="text-gray-600">Don’t have an account? </span>{' '}
          <button
            onClick={() => setShowSignupDrawer(true)}
            className="text-lemonGreen-900"
          >
            Signup
          </button>
        </p>
      </form>
      {showSignupDrawer && (
        <SignupDrawer show={showSignupDrawer} setShow={setShowSignupDrawer} />
      )}
    </motion.div>
  );
};

export default LoginPage;
