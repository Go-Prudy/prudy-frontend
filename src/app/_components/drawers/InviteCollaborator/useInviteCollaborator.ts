import {
  createBudgetCategoryApi,
  inviteCollaboratorApi,
} from '@/app/services/BudgetService';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function useInviteCollaborator({
  setShow,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
}) {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();

  const inviteCollaboratorMutation = useMutation({
    mutationFn: (email: string) =>
      inviteCollaboratorApi(userData?.token ?? '', budgetId ?? '', email),
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
    await inviteCollaboratorMutation.mutateAsync(data.email);
  };
  return { onSubmit, inviteCollaboratorMutation };
}
