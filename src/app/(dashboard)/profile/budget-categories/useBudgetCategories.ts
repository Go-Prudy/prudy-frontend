import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { BudgetCategory } from '@/app/types/budget';
import { ApiResponse } from '@/app/types/index';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useState } from 'react';
import { devNull } from 'node:os';

export default function useBudgetCategories() {
  const { userData } = useAuthStore();
  const [showCreateCategoryDrawer, setShowCreateCategoryDrawer] =
    useState<boolean>(false);
  const [showEditCategoryDrawer, setShowEditCategoryDrawer] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)

  const { data: budgetCategories, isLoading: isBudgetCategriesLoading } = useQuery<
    ApiResponse<BudgetCategory[]>
  >({
    queryKey: ['getAllBudgetCategories'],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetCategory[]>>('budgets/category')).data,
    enabled: !!userData?.token,
    // refetchOnWindowFocus: true,
  });

  return {
    budgetCategories: budgetCategories?.data ?? [],
    isBudgetCategriesLoading,
    showCreateCategoryDrawer,
    setShowCreateCategoryDrawer,
    showEditCategoryDrawer,
    setShowEditCategoryDrawer,
    selectedCategory,
    setSelectedCategory,
  };
}
