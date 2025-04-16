import React from 'react';
import ActionModal from '../ActionModal';
import Button from '../../button';
import useDeleteBudget from './useDeleteBudget';

type Props = {
  showDeleteBudgetModal: boolean;
  handleCloseDeleteModal: () => void;
  handleOpenSuccessfulModal: () => void;

  budgetId: string;
};

export default function DeleteBudgetModal({
  showDeleteBudgetModal,
  handleCloseDeleteModal,
  handleOpenSuccessfulModal,
  budgetId,
}: Props) {
  const { deleteBudgetMutation } = useDeleteBudget({
    budgetId,
    handleCloseDeleteModal,
    handleOpenSuccessfulModal,
  });

  return (
    <>
      <ActionModal
        title="Delete Budget"
        text="Are you sure you want to delete this budget?"
        isOpen={showDeleteBudgetModal}
        onClose={handleCloseDeleteModal}
      >
        <Button
          className="!bg-lemonGreen-100 !text-lemonGreen-900"
          onClick={() => deleteBudgetMutation.mutate()}
          loading={deleteBudgetMutation.isPending}
        >
          Yes, delete
        </Button>
      </ActionModal>
    </>
  );
}
