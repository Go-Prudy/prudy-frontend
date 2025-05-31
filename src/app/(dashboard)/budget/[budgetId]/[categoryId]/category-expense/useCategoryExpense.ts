// src/app/hooks/useCategoryExpenses.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  // Add other expense properties as needed
}

export const useCategoryExpense = (budgetId: string, categoryId: string) => {
  const { userData } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categoryExpenses', budgetId, categoryId],
    queryFn: async () => {
      const response = (
        await api.get(`/budgets/${budgetId}/categories/${categoryId}/expenses`)
      ).data;
      return response.data.data;
    },
    enabled: !!budgetId && !!categoryId && !!userData?.token,
  });

  return {
    expenses: data?.data?.docs ?? [],
    isLoading,
    error,
    refetch,
  };
};
