import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddIncomeForm {
  name: string;
  amount: number;
}

export default function useAddIncome({
  setShow,
  budgetId,
  isEditing,
  incomeId,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
  isEditing: boolean;
  incomeId: string;
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
        queryClient.invalidateQueries({ queryKey: ['getAllBudgets'] }),
      ]);

      // queryClient.setQueryData(['getIncomes', budgetId], (old: any) => {
      //   if (!old) return { data: [data.data] };
      //   return {
      //     ...old,
      //     data: [...old.data, data.data.data],
      //   };
      // });

      setShow(false);
    },
    onError: (error: unknown) => {
      console.error('Error adding income:', error);
    },
  });

  const updateIncomeMutation = useMutation({
    mutationFn: async ({
      values,
      incomeId,
    }: {
      values: AddIncomeForm;
      incomeId: string;
    }) => api.put(`/budgets/${budgetId}/incomes/${incomeId}`, values),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIncomes', budgetId] });
      setShow(false);
      toast.success('Income updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update income');
      console.error('Update income error:', error);
    },
  });

  const onSubmit: SubmitHandler<{
    name: string;
    amount: string;
  }> = async (data) => {
    const amount = Number(data.amount.replace(/[^0-9.]/g, ''));

    if (isEditing) {
      updateIncomeMutation.mutateAsync({
        values: { name: data.name, amount: amount },
        incomeId,
      });
    } else {
      await addIncomeMutation.mutateAsync({
        name: data.name,
        amount: amount,
      });
    }
  };
  return { onSubmit, addIncomeMutation, updateIncomeMutation };
}
