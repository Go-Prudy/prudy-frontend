import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteBudgetApi } from '@/app/services/BudgetService';
import { getPendingInvitesApi } from '@/app/services/InviteService';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useBudgetStore } from '@/app/store/useBudgetStore';
import api from '@/app/utils/axiosInstance';
import { CreateBudgetForm } from '@/app/types/budget';

export default function useBudgets() {
  const queryClient = useQueryClient();
  const { budgets, isLoadingBudgets } = useBudgetStore();
  const { userData } = useAuthStore();

  const [showInvitesModal, setShowInvitesModal] = useState<boolean>(false);
  const [createBudgetComponent, setCreateBudgetComponent] = useState<boolean>(false);
  const [showInviteCollaboratorDrawer, setShowInviteCollaboratorDrawer] =
    useState<boolean>(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState<boolean>(false);

  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [typeOfDrawer, setTypeOfDrawer] = useState<'create' | 'edit'>('create');
  const [budgetData, setBudgetData] = useState<CreateBudgetForm>();

  const { data: getPendingInvitesApiData = [] } = useQuery({
    queryKey: ['getPendingInvites'],
    queryFn: () => getPendingInvitesApi(userData?.token ?? ''),
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (getPendingInvitesApiData?.length > 0) {
      setShowInvitesModal(true);
    }
  }, [getPendingInvitesApiData]);

  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => deleteBudgetApi(userData?.token ?? '', id ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getAllBudgets'] });
      console.log('Budget deleted successfully!');
      toast.success('Budget deleted');
    },
    onError: (error: unknown) => {
      console.error('Error inviting collaborator:', error);
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: (data: { inviteId: string; budgetId: string }) =>
      api.post(`invites/${data.inviteId}/budget/${data.budgetId}/accept`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getPendingInvites'] });
      console.log('Invite accepted successfully!');
      toast.success('Invite accepted');
      setShowInvitesModal(false);
    },
    onError: (error: unknown) => {
      console.error('Error accepting invite:', error);
    },
  });

  const rejectInviteMutation = useMutation({
    mutationFn: (data: { inviteId: string; budgetId: string }) =>
      api.post(`invites/${data.inviteId}/budget/${data.budgetId}/reject`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getPendingInvites'] });
      console.log('Invite rejected successfully!');
      toast.success('Invite rejected');
      setShowInvitesModal(false);
    },
    onError: (error: unknown) => {
      console.error('Error rejecting invite:', error);
    },
  });

  const duplicateBudgeteMutation = useMutation({
    mutationFn: (id: string) => api.post(`budgets/${id}/duplicate`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getAllBudgets'] });
      console.log('Budget duplicated successfully!');
    },
    onError: (error: unknown) => {
      console.error('Error duplicating budget:', error);
    },
  });

  return {
    showInvitesModal,
    setShowInvitesModal,
    createBudgetComponent,
    setCreateBudgetComponent,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetId,
    setBudgetId,
    typeOfDrawer,
    setTypeOfDrawer,
    budgetData,
    setBudgetData,
    budgets,
    deleteBudgetMutation,
    isPending: isLoadingBudgets,
    getPendingInvitesApiData,
    showDeleteBudgetModal,
    setShowDeleteBudgetModal,
    rejectInviteMutation,
    acceptInviteMutation,
    duplicateBudgeteMutation,
  };
}
