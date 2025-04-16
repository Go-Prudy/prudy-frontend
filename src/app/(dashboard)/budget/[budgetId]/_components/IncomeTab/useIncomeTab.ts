import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/utils/axiosInstance';
import { Income } from '@/app/Types';

interface BudgetIncomesResponse {
  data: Income[];
  message?: string;
  status?: number;
}

export default function useIncomeTab({ budgetId }: { budgetId: string }) {
  const { userData } = useAuthStore();
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

  return {
    showIncomeDrawer,
    setShowIncomeDrawer,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetIncomes: budgetIncomes?.data ?? [],
    isLoadingBudgetIncomes,
    totalIncome,
  };
}
