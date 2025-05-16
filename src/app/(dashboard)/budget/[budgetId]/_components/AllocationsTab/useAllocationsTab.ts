import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { Allocation, BudgetCategory } from '@/app/types/budget';
import { ApiResponse } from '@/app/types/index';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export default function useAllocationsTab({ budgetId }: { budgetId: string }) {
  const queryClient = useQueryClient();
  const { userData } = useAuthStore();

  const [showAddAllocation, setShowAddAllocation] = useState<boolean>(false);
  const [showCreateCategoryDrawer, setShowCreateCategoryDrawer] =
    useState<boolean>(false);
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation>();

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
    queryKey: ['getAllBudgetAllocations', budgetId],
    queryFn: async () =>
      (await api.get<ApiResponse<Allocation[]>>(`budgets/${budgetId}/allocations`)).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: true,
  });

  const totalAllocations = useMemo(() => {
    return budgetAllocations?.data.reduce((acc, allocation) => {
      return acc + Number(allocation.amountAllocated);
    }, 0);
  }, [budgetAllocations]);

  const deleteMutation = useMutation({
    mutationFn: async (allocationId: string) => {
      const response = await api.delete(
        `/budgets/${budgetId}/allocations/${allocationId}`,
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['getAllBudgetAllocations', budgetId],
      });
      toast.success('Allocation deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete allocation');
      console.error('Delete allocation error:', error);
    },
  });

  const handleEdit = (alloation: Allocation) => {
    setSelectedAllocation(alloation);
    setShowAddAllocation(true)
  };

  return {
    budgetCategories: budgetCategories?.data ?? [],
    isBudgetCategriesLoading,
    budgetAllocations: budgetAllocations?.data ?? [],
    isBudgetAllocationsLoading,
    showCreateCategoryDrawer,
    setShowCreateCategoryDrawer,
    showAddAllocation,
    setShowAddAllocation,
    totalAllocations: totalAllocations ?? 0,
    deleteMutation,
    handleEdit,
    selectedAllocation,
  };
}
