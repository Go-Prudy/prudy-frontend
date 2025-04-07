import { useState } from 'react';
import toast from 'react-hot-toast';

export default function useEditCategory({
  setShow,
  totalIncome,
}: {
  setShow: (i: boolean) => void;
  totalIncome: number;
}) {
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState<boolean>(false);
  const [showAddSubCategoryDrawer, setShowAddSubCategoryModal] = useState<boolean>(false);
  const [showSubCategories, setShowSubCategories] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);

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
          `Amount cannot exceed total income of ₦${formatAmount(totalIncome.toString())}`,
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/[₦,\s]/g, ''));

    console.log({
      amount: numericAmount,
      percentage: percentage,
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
    showSubCategories,
    setShowSubCategories,
  };
}
