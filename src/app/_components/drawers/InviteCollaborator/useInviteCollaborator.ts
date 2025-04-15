import api from '@/app/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function useInviteCollaborator({
  setShow,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
}) {
  const inviteCollaboratorMutation = useMutation({
    mutationFn: async (values: { email: string }) =>
      await api.post(`/budgets/${budgetId}/invite`, values),
    onSuccess: () => {
      setShow(false);
      toast.success('Invitation sent successfully');
    },
    onError: (error: unknown) => {
      console.error('Error inviting collaborator:', error);
    },
  });

  const onSubmit: SubmitHandler<{
    email: string;
  }> = async (data) => {
    console.log('log data', data);
    await inviteCollaboratorMutation.mutateAsync(data);
  };
  return { onSubmit, inviteCollaboratorMutation };
}
