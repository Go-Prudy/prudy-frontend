import { ErrorResponse } from '@/app/types/index';
import api from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function useInviteCollaborator({
  setShow,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
}) {
  const [showSuccessfulModal, setShowSuccessfulModal] = useState<boolean>(false);
  const [invitedEmail, setInvitedEmail] = useState<string>('');

  const inviteCollaboratorMutation = useMutation({
    mutationFn: async (values: { email: string }) =>
      await api.post(`/budgets/${budgetId}/invite`, values),
    onSuccess: () => {
      // setShow(false);
      setShowSuccessfulModal(true);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log('Error inviting collaborator:', error);
      toast.error(error?.response?.data?.message || 'Error inviting collaborator');
    },
  });

  const onSubmit: SubmitHandler<{
    email: string;
  }> = async (data) => {
    console.log('log data', data);
    setInvitedEmail(data.email);
    await inviteCollaboratorMutation.mutateAsync(data);
  };
  return {
    onSubmit,
    inviteCollaboratorMutation,
    invitedEmail,
    showSuccessfulModal,
    handleCloseSuccessfulModal: () => setShowSuccessfulModal(false),
  };
}
