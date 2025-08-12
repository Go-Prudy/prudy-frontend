import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/utils/axiosInstance';
import { Income } from '@/app/types/budget';
import toast from 'react-hot-toast';

interface BudgetIncomesResponse {
  data: Income[];
  message?: string;
  status?: number;
}

export default function useIncomeTab({ budgetId }: { budgetId: string }) {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [showIncomeDrawer, setShowIncomeDrawer] = useState<boolean>(false);
  const [showInviteCollaboratorDrawer, setShowInviteCollaboratorDrawer] =
    useState<boolean>(false);

  const { data: budgetIncomes, isLoading: isLoadingBudgetIncomes } = useQuery({
    queryKey: ['getIncomes', budgetId],
    queryFn: async () =>
      (await api.get<BudgetIncomesResponse>(`/budgets/${budgetId}/incomes`)).data,
    enabled: !!userData?.token && !!budgetId,
    refetchOnWindowFocus: true,
  });

  const totalIncome = useMemo(() => {
    return budgetIncomes?.data?.reduce(
      (total: number, income: Income) => total + income.amount,
      0,
    );
  }, [budgetIncomes]);

  const deleteIncomeMutation = useMutation({
    mutationFn: async (incomeId: string) => {
      const response = await api.delete(`/budgets/${budgetId}/incomes/${incomeId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIncomes', budgetId] });
      toast.success('Income deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete income');
      console.error('Delete income error:', error);
    },
  });

  const handleEdit = (income: Income) => {
    setSelectedIncome(income);
    setShowIncomeDrawer(true);
  };

  const handleDelete = async (income: Income) => {
    await deleteIncomeMutation.mutateAsync(income.uid);
  };

  return {
    showIncomeDrawer,
    setShowIncomeDrawer,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetIncomes: budgetIncomes?.data ?? [],
    isLoadingBudgetIncomes,
    totalIncome,
    handleEdit,
    handleDelete,
    selectedIncome,
    deleteIncomeMutation,
  };
}
