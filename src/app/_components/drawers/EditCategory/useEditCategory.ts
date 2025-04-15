import { SubAllocationForm } from '@/app/types/budget';
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

export default function useEditCategory({
  setShow,
  totalIncome,
  budgetCategoryId,
  budgetId,
}: {
  setShow: (i: boolean) => void;
  totalIncome: number;
  budgetCategoryId: string;
  budgetId: string;
}) {
  const queryClient = useQueryClient();
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState<boolean>(false);
  const [showAddSubCategoryDrawer, setShowAddSubCategoryModal] = useState<boolean>(false);
  const [showAddSubAllocations, setShowAddSubAllocations] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [subAllocations, setSubAllocations] = useState<SubAllocationForm[]>([]);

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
  const calculatePercentage = (amount: number): number => {
    return Number(((amount / totalIncome) * 100).toFixed(2));
  };

  // Calculate amount based on percentage
  const calculateAmount = (percentage: number): number => {
    return Number(((percentage / 100) * totalIncome).toFixed(2));
  };

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
        const newPercentage = calculatePercentage(numericValue);
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
        const newAmount = calculateAmount(percentageValue);
        setAmount(formatAmount(newAmount.toString()));
        setPercentage(percentageValue);
      }
    }
  };

  const createAllocationMutation = useMutation({
    mutationFn: (values: AllocationForm) =>
      api.post(`/budgets/${budgetId}/allocations`, values),
    onSuccess: (data) => {
      console.log(data.data);
      queryClient.invalidateQueries({ queryKey: ['getAllBudgetAllocations'] });
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
      budgetCategoryId,
      subAllocations,
    });
    await createAllocationMutation.mutateAsync({
      amount: numericAmount,
      percentage: percentage,
      budgetCategoryId,
      subAllocations,
    });

    setShow(false);
  };

  return {
    handleSubmit,
    handleAmountChange,
    handlePercentageChange,
    amount,
    percentage,
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
  };
}
