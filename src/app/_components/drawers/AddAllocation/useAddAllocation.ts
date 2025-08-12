import { Allocation, BudgetCategory, SubAllocationForm } from '@/app/types/budget';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateAllocationForm {
  budgetCategoryId: string;
  amount: number;
  percentage: number;
  subAllocations: SubAllocationForm[];
}

interface EditAllocationForm {
  amount: number;
  percentage: number;
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
  isEditing,
  selectedAllocation,
}: {
  setShow: (i: boolean) => void;
  totalIncome: number;
  budgetId: string;
  isEditing?: boolean;
  selectedAllocation?: Allocation;
}) {
  const queryClient = useQueryClient();
  const [showAddSubCategoryDrawer, setShowAddSubCategoryModal] = useState<boolean>(false);
  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState<boolean>(false);
  const [showAddSubAllocations, setShowAddSubAllocations] = useState<boolean>(
    selectedAllocation && selectedAllocation?.subCategoryAllocations?.length > 0
      ? true
      : false,
  );

  const [amount, setAmount] = useState<string>(
    selectedAllocation?.amountAllocated.toLocaleString() ?? '',
  );
  const [percentage, setPercentage] = useState<number>(
    selectedAllocation?.percentage ?? 0,
  );
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(
    selectedAllocation?.budgetCategory ?? null,
  );
  const [subAllocations, setSubAllocations] = useState<SubAllocationForm[]>(
    selectedAllocation?.subCategoryAllocations
      ? selectedAllocation.subCategoryAllocations.map((sa) => ({
          name: sa.budgetSubCategory?.name ?? '',
          amount: sa.amount,
        }))
      : [],
  );

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
    mutationFn: (values: CreateAllocationForm) =>
      api.post(`/budgets/${budgetId}/allocations`, values),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['getAllBudgetAllocations', budgetId],
      });

      setShow(false);
    },
    onError: (error: unknown) => {
      console.error('Error creating allocation:', error);
    },
  });

  const editAllocationMutation = useMutation({
    mutationFn: (values: EditAllocationForm) =>
      api.patch(`/budgets/${budgetId}/allocations/${selectedAllocation?.uid}`, values),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['getAllBudgetAllocations', budgetId],
      });

      setShow(false);
    },
    onError: (error: unknown) => {
      console.error('Error editing allocation:', error);
    },
  });

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount.replace(/[₦,\s]/g, ''));

    // console.log({
    //   amount: numericAmount,
    //   percentage: percentage,
    //   budgetCategoryId: selectedCategory?.uid,
    //   subAllocations,
    // });

    if (isEditing) {
      await editAllocationMutation.mutateAsync({
        amount: numericAmount,
        percentage: percentage,
      });
    } else {
      await createAllocationMutation.mutateAsync({
        amount: numericAmount,
        percentage: percentage,
        budgetCategoryId: selectedCategory?.uid ?? '',
        subAllocations,
      });
    }
  };

  return {
    handleSubmit,
    handleAmountChange,
    handlePercentageChange,
    amount,
    percentage,
    showCategoriesDrawer,
    setShowCategoriesDrawer,

    showAddSubCategoryDrawer,
    setShowAddSubCategoryModal,
    showAddSubAllocations,
    setShowAddSubAllocations,

    subAllocations,
    setSubAllocations,
    remainingUnallocatedAmount,
    handleDeleteSubAllocation,
    createAllocationMutation,
    editAllocationMutation,
    selectedCategory,
    setSelectedCategory,
  };
}
