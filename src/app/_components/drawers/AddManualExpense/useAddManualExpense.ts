import { BudgetCategory } from '@/app/types/budget';
import api from '@/app/utils/axiosInstance';
import { convertAmountToNumber } from '@/app/utils/functions';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function useAddManualExpense({
  setShow,
  budgetId,
  categories,
}: {
  setShow: (i: boolean) => void;
  budgetId: string;
  categories: BudgetCategory[];
}) {
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory>(categories[0]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const addManualExpenseMutation = useMutation({
    mutationFn: async (values: { narration: string; amount: number; date: string }) =>
      api.post(
        `/budgets/${budgetId}/categories/${selectedCategory?.uid}/expenses`,
        values,
      ),
    onSuccess: (data) => {
      console.log(data);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error during logout:', error);
    },
  });

  const onSubmit: SubmitHandler<{
    narration: string;
    amount: string;
    date: string;
  }> = async (data) => {
    console.log('log data', {
      ...data,
      amount: convertAmountToNumber(data.amount),
    });
    addManualExpenseMutation.mutateAsync({
      ...data,
      amount: convertAmountToNumber(data.amount),
    });
  };

  return {
    onSubmit,
    showCategoriesDrawer,
    setShowCategoriesDrawer,
    selectedCategory,
    setSelectedCategory,
    showSuccessModal,
    handleCloseSuccessModal: () => {
      setShowSuccessModal(false);
      setShow(false);
    },
    addManualExpenseMutation,
  };
}
