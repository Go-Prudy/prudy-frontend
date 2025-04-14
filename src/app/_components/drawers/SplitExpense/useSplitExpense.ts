import {
  AssignCategoryToTransactionApi,
  AssignSplitCategoryToTransactionApi,
} from '@/app/services/TransactionService';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface Transaction {
  id: number;
  name: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  narration: string;
}

type Props = {
  accountId: string;
  budgetId: string;
  transactionId: string;
  setShow: (i: boolean) => void;
  transactionDetails: Transaction | null;
};
interface SplitCategory {
  allocationId: string;
  amount: string | number;
}
export default function useSplitExpense({
  accountId,
  budgetId,
  transactionId,
  setShow,
  transactionDetails,
}: Props) {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();

  const [showSplitExpenseSuccessModal, setShowSplitExpenseSuccessModal] = useState(false);
  const [splitCategories, setSplitCategories] = useState<SplitCategory[]>([]); // Array of categories to split the expense into

  const [amountDetails, setAmountDetails] = useState({
    amountLeft: transactionDetails?.amount,
    percentageIncomeUsed: 0,
  });

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const rawValue = e.target.value;
      const value = Number(parseFloat(e.target.value.replace(/,/g, '')).toFixed(2)) || 0;
      const amountToSplit = transactionDetails?.amount || 0;

      // Check if category already exists in splitCategories
      const categoryExists = splitCategories.some((cat) => cat.allocationId === id);

      // Calculate total of all other categories
      const otherCategoriesTotal = splitCategories.reduce((total, category) => {
        if (category.allocationId !== id) {
          return total + (Number(category.amount) || 0);
        }
        return total;
      }, 0);

      const availableAmount = amountToSplit - otherCategoriesTotal;

      if (value <= availableAmount) {
        setSplitCategories((prev: SplitCategory[]) => {
          if (!categoryExists && value > 0) {
            // Add new category if it doesn't exist and value is greater than 0
            return [...prev, { allocationId: id, amount: rawValue }];
          } else if (categoryExists && value > 0) {
            // Update existing category if value is greater than 0
            return prev.map((category) =>
              category.allocationId === id ? { ...category, amount: rawValue } : category,
            );
          } else if (value === 0) {
            // Remove category if value is 0
            return prev.filter((category) => category.allocationId !== id);
          }
          return prev;
        });

        const newTotal = otherCategoriesTotal + value;
        setAmountDetails((prev) => ({
          ...prev,
          amountLeft: Number((amountToSplit - newTotal).toFixed(2)),
          percentageIncomeUsed: Number(((newTotal / amountToSplit) * 100).toFixed(2)),
        }));
      } else {
        toast.error(
          `The amount you're entering exceeds the available amount (₦${availableAmount.toLocaleString()}) for ${
            transactionDetails?.name ?? transactionDetails?.narration
          }`,
        );
      }
    },
    [splitCategories, transactionDetails],
  );

  const handleSelectSplitCategory = (id: string) => {
    setSplitCategories((prev: SplitCategory[]) => {
      const existingIndex = prev.findIndex((item) => item.allocationId === id);

      if (existingIndex >= 0) {
        return prev.filter((item) => item.allocationId !== id);
      } else {
        return [...prev, { allocationId: id, amount: 0 }];
      }
    });
  };

  const assignSplitCategoryMutation = useMutation({
    mutationFn: async (data: {
      accountId: string;
      transactionId: string;
      budgetId: string;
      categories: SplitCategory[];
    }) =>
      AssignSplitCategoryToTransactionApi(
        data.accountId,
        data.transactionId,
        data.budgetId,
        data.categories,
        userData?.token ?? '',
      ),

    onSuccess: (data) => {
      toast.success('Transaction updated with selected category!');
      setSplitCategories([]);
      setShow(false);
      setShowSplitExpenseSuccessModal(true);
      queryClient.invalidateQueries({
        queryKey: ['getAllAccountTransactions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['singleBudgetData'],
      });
    },
    onError: (error) => {
      console.error('Error splitting category:', error);
      toast.error('Failed to split category. Please try again.');
    },
  });
  const handleAssignSplitCategory = () => {
    if (splitCategories.length === 0) {
      toast.error('Please select a category');
      return;
    }

    const processedCategories = splitCategories.map((category) => ({
      ...category,
      amount: parseFloat(category.amount.toString()),
    }));
    // .filter((category) => category.amount !== 0);

    // console.log(processedCategories);

    assignSplitCategoryMutation.mutate({
      accountId: accountId,
      transactionId: transactionId,
      budgetId: budgetId,
      categories: processedCategories,
    });
  };

  return {
    handleSelectSplitCategory,
    handleAssignSplitCategory,
    assignSplitCategoryMutation,
    handleAmountChange,
    amountDetails,
    splitCategories,
    setSplitCategories,
    showSplitExpenseSuccessModal,
    handleCloseSplitExpenseSuccessModal: () => setShowSplitExpenseSuccessModal(false),
  };
}
