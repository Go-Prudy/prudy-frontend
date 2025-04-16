import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteBudgetApi, GetAllBudgetsApi } from '@/app/services/BudgetService';
import { getPendingInvitesApi } from '@/app/services/InviteService';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function useBudgets() {
  const [showInvites, setShowInvites] = useState(false);
  const [createBudgetComponent, setCreateBudgetComponent] = useState(false);
  const [treshold, setTreshold] = useState(0);
  const [showInviteCollaboratorDrawer, setShowInviteCollaboratorDrawer] =
    useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [inviteBudgetId, setInviteBudgetId] = useState<string | null>(null);

  const { userData } = useAuthStore();

  const {
    data: budgets = [],
    isPending,
    refetch: refetchAllBudgets,
  } = useQuery({
    queryKey: ['allBudgets'],
    queryFn: () => GetAllBudgetsApi(userData?.token ?? ''),
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

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

  const queryClient = useQueryClient();

  // React Query mutation to delete budget
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => deleteBudgetApi(userData?.token ?? '', id ?? ''),
    onSuccess: () => {
      console.log('Budget deleted successfully!');
      toast.success('Budget deleted');
      queryClient.invalidateQueries({
        queryKey: ['allBudgets'],
      });
      setActiveTooltip(null);
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
    treshold,
    setTreshold,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    activeTooltip,
    setActiveTooltip,
    inviteBudgetId,
    setInviteBudgetId,
    budgets,
    deleteBudgetMutation,
    isPending,
    getPendingInvitesApiData,
    refetchAllBudgets,
  };
}
