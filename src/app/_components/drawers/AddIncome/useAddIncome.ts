import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

interface AddIncomeForm {
  name: string;
  amount: number;
}

export default function useAddIncome({
  setShow,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
}) {
  const queryClient = useQueryClient();

  const addIncomeMutation = useMutation({
    mutationFn: async (values: AddIncomeForm) =>
      await api.post(`/budgets/${budgetId}/incomes`, values),
    onSuccess: async (data) => {
      console.log(data.data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getIncomes', budgetId] }),
        queryClient.invalidateQueries({ queryKey: ['getBudgetStats', budgetId] }),
      ]);
      setShow(false);
    },
    onError: (error: unknown) => {
      console.error('Error adding income:', error);
    },
  });

  const onSubmit: SubmitHandler<{
    name: string;
    amount: string;
  }> = async (data) => {
    const amount = Number(data.amount.replace(/[^0-9.]/g, ''));

    await addIncomeMutation.mutateAsync({
      name: data.name,
      amount: amount,
    });
  };
  return { onSubmit, addIncomeMutation };
}
