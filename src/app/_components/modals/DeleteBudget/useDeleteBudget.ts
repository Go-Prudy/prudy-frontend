import { ErrorResponse } from '@/app/types/index';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  budgetId: string;
  handleCloseDeleteModal: () => void;
  handleOpenSuccessfulModal: () => void;
};

export default function useDeleteBudget({
  budgetId,
  handleCloseDeleteModal,
  handleOpenSuccessfulModal,
}: Props) {
  const queryClient = useQueryClient();

  const deleteBudgetMutation = useMutation({
    mutationFn: async () => await api.delete(`/budgets/${budgetId}`),
    onSuccess: () => {
      handleCloseDeleteModal();
      handleOpenSuccessfulModal();
      queryClient.invalidateQueries({
        queryKey: ['allBudgets'],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log('Error deleting budget:', error);
      toast.error(error?.response?.data?.message || 'Error deleting budget');
    },
  });

  return {
    deleteBudgetMutation,
  };
}
