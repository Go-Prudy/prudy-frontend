'use client'
import SuccessModal from '@/components/SuccessModal';
import { useAuthentication } from '@/app/store/AuthStore';
import Header from '@/components/header';
import Input from '@/components/input';
import { useRouter } from 'next/navigation';
import successIcon from '/public/images/success-pJCKblmrv2.png'
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { IForgotPassword } from '@/app/Types';
import { forgotPassword as handleForgotPassword } from '@/app/services/AuthenticationService'
import { CircularProgress } from '@nextui-org/react';
const ChangePasscodePage = () => {
  const [passCode, setPasscode] = useState<string>('');
  const [confirmPassCode, setConfirmPasscode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { signup, ForgotPassword, ForgotPasswordForm, timeLeft, tick, startTimer, canResend } = useAuthentication();

  const navigate = useRouter()

  // forgot password mutation
  const ForgotPasswordMutation = useMutation({
    mutationFn: async (data: IForgotPassword) => {
      setIsLoading(true);
      const result = await handleForgotPassword(data);
      setIsLoading(false);
      return result;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        // toast.success('Password reset successfully!');
        setShowModal(true)
        setShowModal(true);
      }
    },
    onError: (error: any) => {
      setIsLoading(false);
      const errorMessage = error?.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    },
  });

  const handleResetPassword = async () => {
    // Validate if passcodes match and are 6 characters long
    if (passCode.length !== 6 || confirmPassCode.length !== 6) {
      setError('Passcode must be exactly 6 characters long.');
      return;
    }

    if (passCode !== confirmPassCode) {
      setError('Passcodes do not match.');
      return;
    }
    // Clear any previous errors
    setError('');
    try {
      await ForgotPassword({ ...ForgotPasswordForm, pin: passCode, confirmPin: confirmPassCode });
      ForgotPasswordMutation.mutateAsync({ ...ForgotPasswordForm, pin: passCode, confirmPin: confirmPassCode })
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };



  return (
    <div className="w-full">
      <Header title="Reset passcode" link='/change-passcode' />
      <div className="px-6 py-10">
        <div className="w-full mb-6">
          <p className="mb-6">Reset passcode</p>
        </div>

        <Input
          onChange={(value) => setPasscode(value)}
          label="Passcode"
          inputName="newPasscode"
          inputType="password"
          maxLength={6}
          placeholder="Enter new passcode"
        />
        <Input
          onChange={(value) => setConfirmPasscode(value)}
          label="Confirm passcode"
          inputName="confirmPasscode"
          inputType="password"
          maxLength={6}
          placeholder="Confirm new passcode"
        />

        {/* Display error message if passcodes don't match or are not valid */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <div className="sticky bottom-0 flex w-full items-center bg-white px-6 py-6 rounded-t-3xl shadow-[0_-4px_4px_0_#EFF0F650]">
        <button
          className="h-12 text-white bg-black rounded-3xl w-full"
          onClick={handleResetPassword}
        >
          {isLoading ? <div className='flex gap-[8px] justify-center items-center'>
            <CircularProgress className=' text-[#343434]  size-[30px] ' color='default' size='sm' />
            Resetting...
          </div> : 'Reset'}
        </button>
      </div>


      <SuccessModal btnColor='black' successIcon={successIcon} btnFunction={() => navigate.push('/login')} buttonText='Login' setShowModal={setShowModal} showModal={showModal} handleClose={() => setShowModal(!showModal)} text='Your password has been reset successfully' />
    </div>
  );
};

export default ChangePasscodePage;
