'use client';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import OtpInput from '@/components/OtpInput';
import Button from '@/app/_components/button';
import useSetPasscode from './useSetPasscode';

const Page = () => {
  const {
    password,
    setPassword,
    focusedPasswordInput,
    setFocusedPasswordInput,
    confirmPassword,
    setConfirmPassword,
    focusedConfirmPasswordInput,
    setFocusedConfirmPasswordInput,
    setPasscodeMutation,
    handleSubmit,
    passCodeLength,
    error,
  } = useSetPasscode();

  return (
    <div>
      <InnerPageHeader link={'/signup/verify'} title="Create account" isHeaderDark />
      <div className="px-6 py-10 space-y-6">
        <div className="w-full">
          <p className="font-[500] text-[20px] leading-[28px] text-[#2D2D2D]">
            Set your passcode
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-gray-400 text-sm">Enter Passcode</p>
          <OtpInput
            otpValues={password}
            setOtpValues={setPassword}
            inputLength={passCodeLength}
            focusedInput={focusedPasswordInput}
            setFocusedInput={setFocusedPasswordInput}
          />
          <p className="text-gray-400 text-sm">Confirm Passcode</p>
          <OtpInput
            otpValues={confirmPassword}
            setOtpValues={setConfirmPassword}
            inputLength={passCodeLength}
            focusedInput={focusedConfirmPasswordInput}
            setFocusedInput={setFocusedConfirmPasswordInput}
          />
          <div className="flex items-center gap-2 justify-between"></div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button
            // disabled={!!error}
            type="submit"
            loading={setPasscodeMutation.isPending}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
