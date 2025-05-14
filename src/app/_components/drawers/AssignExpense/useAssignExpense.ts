import useTrackProgress from '@/app/_hooks/useTrackProgress';
import { AssignCategoryToTransactionApi } from '@/app/services/TransactionService';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  accountId: string;
  budgetId: string;
  transactionId: string;
  setShow: (i: boolean) => void;
};

export default function useAssignExpense({
  accountId,
  budgetId,
  transactionId,
  setShow,
}: Props) {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();
  const { trackProgressMutation } = useTrackProgress();

  const [showAssignExpenseSuccessModal, setShowAssignExpenseSuccessModal] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const assignCategoryMutation = useMutation({
    mutationFn: async (data: {
      accountId: string;
      transactionId: string;
      budgetId: string;
      categoryId: any;
    }) =>
      AssignCategoryToTransactionApi(
        data.accountId,
        data.transactionId,
        data.budgetId,
        data.categoryId,
        userData?.token ?? '',
      ),

    onSuccess: (data) => {
      trackProgressMutation.mutate('assign_expense');

      toast.success('Transaction updated with selected category!');
      setSelectedCategory(null);
      queryClient.invalidateQueries({
        queryKey: ['getAllAccountTransactions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['singleBudgetData', budgetId],
      });
      setShow(false);
      setShowAssignExpenseSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error assigning category:', error);
      toast.error('Failed to assign category. Please try again.');
    },
  });

  const handleAssignCategory = () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    assignCategoryMutation.mutate({
      accountId,
      transactionId,
      budgetId,
      categoryId: selectedCategory,
    });
  };
  return {
    handleAssignCategory,
    assignCategoryMutation,
    selectedCategory,
    setSelectedCategory,
    showAssignExpenseSuccessModal,
    handleCloseAssignExpenseSuccessModal: () => setShowAssignExpenseSuccessModal(false),
  };
}
