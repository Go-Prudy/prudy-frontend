import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { Allocation, BudgetCategory } from '@/app/types/budget';
import { ApiResponse } from '@/app/types/index';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useState } from 'react';

export default function useCategoriesTab({ budgetId }: { budgetId: string }) {
  const { userData } = useAuthStore();
  const [showCreateCategoryDrawer, setShowCreateCategoryDrawer] =
    useState<boolean>(false);
  const [showAddAllocation, setShowAddAllocation] = useState<boolean>(false);

  const { data: budgetCategories, isLoading: isBudgetCategriesLoading } = useQuery<
    ApiResponse<BudgetCategory[]>
  >({
    queryKey: ['getAllBudgetCategories'],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetCategory[]>>('budgets/category')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

  const { data: budgetAllocations, isLoading: isBudgetAllocationsLoading } = useQuery<
    ApiResponse<Allocation[]>
  >({
    queryKey: ['getAllBudgetAllocations'],
    queryFn: async () =>
      (await api.get<ApiResponse<Allocation[]>>(`budgets/${budgetId}/allocations`)).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

  return {
    budgetCategories: budgetCategories?.data ?? [],
    isBudgetCategriesLoading,
    budgetAllocations: budgetAllocations?.data ?? [],
    isBudgetAllocationsLoading,
    showCreateCategoryDrawer,
    setShowCreateCategoryDrawer,
    showAddAllocation,
    setShowAddAllocation,
  };
}
