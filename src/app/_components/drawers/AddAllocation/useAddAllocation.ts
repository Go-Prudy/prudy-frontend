import { BudgetCategory, SubAllocationForm } from '@/app/types/budget';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AllocationForm {
  budgetCategoryId: string;
  amount: number;
  percentage: number;
  subAllocations: SubAllocationForm[];
}

const formatAmount = (value: string) => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '');

  // Format with commas
  const parts = numericValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Add Naira symbol
  return `₦${parts.join('.')}`;
};

// Calculate percentage based on amount
const calculatePercentage = (amount: number, totalIncome: number): number => {
  return Number(((amount / totalIncome) * 100).toFixed(2));
};

// Calculate amount based on percentage
const calculateAmount = (percentage: number, totalIncome: number): number => {
  return Number(((percentage / 100) * totalIncome).toFixed(2));
};

export default function useEditCategory({
  setShow,
  totalIncome,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  totalIncome: number;
  budgetId: string;
}) {
  const queryClient = useQueryClient();
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState<boolean>(false);
  const [showAddSubCategoryDrawer, setShowAddSubCategoryModal] = useState<boolean>(false);
  const [showAddSubAllocations, setShowAddSubAllocations] = useState<boolean>(false);
  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [subAllocations, setSubAllocations] = useState<SubAllocationForm[]>([]);

  const parsedCategoryAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount.replace(/[₦,\s]/g, ''));
    return isNaN(parsedAmount) ? 0 : parsedAmount;
  }, [amount]);

  const remainingUnallocatedAmount = useMemo(() => {
    const totalSubAllocated = subAllocations.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );
    return parsedCategoryAmount - totalSubAllocated;
  }, [subAllocations, parsedCategoryAmount]);

  const handleDeleteSubAllocation = (index: number) => {
    const updatedSubAllocations = [...subAllocations];
    updatedSubAllocations.splice(index, 1);
    setSubAllocations(updatedSubAllocations);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value.replace(/[₦,\s]/g, '');
    const numericValue = parseFloat(currentValue);

    if (!currentValue) {
      setAmount('');
      setPercentage(0);
      return;
    }

    if (!isNaN(numericValue)) {
      if (numericValue > totalIncome) {
        toast.error(
          `Amount cannot exceed total income of ${formatAmount(totalIncome.toString())}`,
        );
        return;
      } else {
        const newPercentage = calculatePercentage(numericValue, totalIncome);
        setPercentage(newPercentage);
        setAmount(formatAmount(numericValue.toString()));
      }
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value.replace('%', '');
    const percentageValue = parseFloat(currentValue);

    if (!currentValue) {
      setAmount('');
      setPercentage(0);
      return;
    }

    if (!isNaN(percentageValue)) {
      if (percentageValue > 100) {
        toast.error('Percentage cannot exceed 100%');
        return;
      } else {
        const newAmount = calculateAmount(percentageValue, totalIncome);
        setAmount(formatAmount(newAmount.toString()));
        setPercentage(percentageValue);
      }
    }
  };

  const createAllocationMutation = useMutation({
    mutationFn: (values: AllocationForm) =>
      api.post(`/budgets/${budgetId}/allocations`, values),
    onSuccess: async (data) => {
      console.log(data.data);
      await queryClient.invalidateQueries({ queryKey: ['getAllBudgetAllocations'] });

      setShow(false);
    },
    onError: (error: unknown) => {
      console.error('Error creating allocation:', error);
    },
  });

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount.replace(/[₦,\s]/g, ''));

    console.log({
      amount: numericAmount,
      percentage: percentage,
      budgetCategoryId: selectedCategory?.uid,
      subAllocations,
    });
    await createAllocationMutation.mutateAsync({
      amount: numericAmount,
      percentage: percentage,
      budgetCategoryId: selectedCategory?.uid ?? '',
      subAllocations,
    });
  };

  return {
    handleSubmit,
    handleAmountChange,
    handlePercentageChange,
    amount,
    percentage,
    showCategoriesDrawer,
    setShowCategoriesDrawer,
    showDeleteSuccessModal,
    handleCloseDeleteSuccessModal: () => setShowDeleteSuccessModal(false),
    showDeleteCategoryModal,
    handleCloseDeletCategoryModal: () => setShowDeleteCategoryModal(false),
    handleOpenDeletCategoryModal: () => setShowDeleteCategoryModal(true),
    showAddSubCategoryDrawer,
    setShowAddSubCategoryModal,
    showAddSubAllocations,
    setShowAddSubAllocations,

    subAllocations,
    setSubAllocations,
    remainingUnallocatedAmount,
    handleDeleteSubAllocation,
    createAllocationMutation,
    selectedCategory,
    setSelectedCategory,
  };
}
