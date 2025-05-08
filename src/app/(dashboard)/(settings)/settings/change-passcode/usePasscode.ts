import api from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

type ChangePasscodeInputs = {
  oldPasscode: string;
  newPasscode: string;
  confirmPasscode: string;
};
export default function usePasscode() {
  const [showSuccessfulModal, setShowSuccessfulModal] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => api.post('settings/change-passcode', data),
    onSuccess: (result) => {
      console.log(result);
      setShowSuccessfulModal(true);
    },
    onError: (error) => console.error('Error updating password', error),
  });

  const onSubmit: SubmitHandler<ChangePasscodeInputs> = async (data) => {
    console.log(data);
    await changePasswordMutation.mutateAsync(data);
  };
  return {
    onSubmit,
    changePasswordMutation,
    showSuccessfulModal,
    setShowSuccessfulModal,
  };
}
