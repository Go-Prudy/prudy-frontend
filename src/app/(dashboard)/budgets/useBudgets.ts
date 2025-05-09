import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteBudgetApi } from '@/app/services/BudgetService';
import { getPendingInvitesApi } from '@/app/services/InviteService';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useBudgetStore } from '@/app/store/useBudgetStore';

export default function useBudgets() {
  const queryClient = useQueryClient();
  const { budgets, isLoadingBudgets } = useBudgetStore();
  const { userData } = useAuthStore();

  const [showInvites, setShowInvites] = useState(false);
  const [createBudgetComponent, setCreateBudgetComponent] = useState<boolean>(false);
  const [showInviteCollaboratorDrawer, setShowInviteCollaboratorDrawer] =
    useState<boolean>(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState<boolean>(false);

  const [budgetId, setBudgetId] = useState<string | null>(null);

  const { data: getPendingInvitesApiData = [] } = useQuery({
    queryKey: ['getPendingInvites'],
    queryFn: () => getPendingInvitesApi(userData?.token ?? ''),
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (getPendingInvitesApiData) {
      setShowInvites(true);
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
  return {
    showInvites,
    setShowInvites,
    createBudgetComponent,
    setCreateBudgetComponent,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetId,
    setBudgetId,
    budgets,
    deleteBudgetMutation,
    isPending: isLoadingBudgets,
    getPendingInvitesApiData,
    showDeleteBudgetModal,
    setShowDeleteBudgetModal,
    // refetchAllBudgets,
  };
}
