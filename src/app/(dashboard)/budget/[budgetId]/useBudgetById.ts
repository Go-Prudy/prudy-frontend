import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { ApiResponse } from '@/app/types/index';
import { BudgetDetails, BudgetStats } from '@/app/types/budget';

export default function useBudgetById({ budgetId }: { budgetId: string }) {
  const { userData } = useAuthStore();

  const { data: budgetDetails, isLoading: isLoadingBudgetDetails } = useQuery<
    ApiResponse<BudgetDetails>
  >({
    queryKey: ['getSingleBudget' , budgetId],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetDetails>>(`/budgets/${budgetId}`)).data,
    enabled: !!userData?.token && !!budgetId,
    refetchOnWindowFocus: true,
  });

  const { data: budgetStats, isLoading: isLoadingBudgetStats } = useQuery<
    ApiResponse<BudgetStats>
  >({
    queryKey: ['getBudgetStats' , budgetId],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetStats>>(`/budgets/${budgetId}/stats`)).data,
    enabled: !!userData?.token && !!budgetId,
    refetchOnWindowFocus: true,
  });

  return {
    budgetStats: budgetStats?.data || { totalIncome: 0, totalExpense: 0, amountLeft: 0 },
    isLoadingBudgetStats,
    budgetDetails: budgetDetails?.data,
    isLoadingBudgetDetails,
  };
}
