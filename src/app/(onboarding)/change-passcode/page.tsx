'use client';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/components/Modals/SuccessModal';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import Button from '@/app/_components/button';
import OtpInput from '@/components/OtpInput';
import Success from '../_components/Success';
import useChangePasscode from './useChangePasscode';

const ChangePasscodePage = () => {
  const navigate = useRouter();
  const {
    handleResetPassword,
    forgotPasswordMutation,
    focusedNewPasscode,
    setFocusedNewPasscode,
    focusedConfirmPasscode,
    setFocusedConfirmPasscode,
    newPasscode,
    setNewPasscode,
    confirmPasscode,
    setConfirmPasscode,
    error,
    showModal,
    setShowModal,
  } = useChangePasscode();

  return (
    <div className="w-full">
      <InnerPageHeader title="Remember passcode" link="/forgot-password" />
      <div className="px-6 py-10 space-y-6">
        <h1 className="font-medium text-xl text-black-800">Reset passcode</h1>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Enter Passcode</p>
          <OtpInput
            inputLength={6}
            otpValues={newPasscode}
            setOtpValues={setNewPasscode}
            focusedInput={focusedNewPasscode}
            setFocusedInput={setFocusedNewPasscode}
            isPassword
          />
          {forgotPasswordMutation.data && <Success />}
          <p className="text-gray-400 text-sm">Confirm Passcode</p>
          <OtpInput
            inputLength={6}
            otpValues={confirmPasscode}
            setOtpValues={setConfirmPasscode}
            focusedInput={focusedConfirmPasscode}
            setFocusedInput={setFocusedConfirmPasscode}
            isPassword
          />
          {forgotPasswordMutation.data && <Success />}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <Button
          disabled={
            newPasscode.join('').toString().length !== 6 ||
            confirmPasscode.join('').toString().length !== 6 ||
            error !== ''
          }
          onClick={handleResetPassword}
          loading={forgotPasswordMutation.isPending}
        >
          Reset
        </Button>
      </div>

      <SuccessModal
        btnFunction={() => navigate.push('/login')}
        buttonText="Login"
        showModal={showModal}
        handleClose={() => setShowModal(!showModal)}
        text="Your password has been reset successfully"
        title="Success 🎊"
      />
    </div>
  );
};

export default ChangePasscodePage;
