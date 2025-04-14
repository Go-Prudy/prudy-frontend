'use client';
import { CircularProgress } from '@nextui-org/react';
import Header from '@/components/header';
import OtpInput from '@/components/OtpInput';
import Success from '../../_components/Success';
import useVerify from './useVerify';

const VerifyOtpPage = () => {
  const {
    otpValues,
    setOtpValues,
    focusedInput,
    setFocusedInput,
    verifyOtpMutation,
    timeLeft,
    canResend,
    handleResendCode,
  } = useVerify();
  return (
    <div>
      <Header link={'/signup/verify'} title="Create account" isHeaderDark />
      <form
        id="otp-form"
        className="py-10 px-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleResendCode();
        }}
      >
        <div className="space-y-4">
          <h1 className="font-medium text-xl text-black-800">
            Verify your email address
          </h1>
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
    </div>
  );
};

export default VerifyOtpPage;
