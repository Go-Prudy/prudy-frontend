import React from 'react';
import Button from '../../button';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import useEditCategory from './useEditCategory';
import SuccessfulModal from '../../modals/SuccessfulModal';
import ActionModal from '../../modals/ActionModal';
import { BsPlus } from 'react-icons/bs';
import AddSubCategoryDrawer from '../../modals/AddSubCategory';
import { Switch } from '@nextui-org/react';
import AllocationItem from '../../allocationItem';
import cn from 'classnames';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  name: string;
  totalIncome: number;
  budgetCategoryId: string;
  budgetId: string;
}

export default function EditCategoryDrawer({
  show,
  setShow,
  name,
  totalIncome,
  budgetCategoryId,
  budgetId,
}: Props) {
  const {
    handleSubmit,
    handleAmountChange,
    handlePercentageChange,
    amount,
    percentage,
    showDeleteSuccessModal,
    handleCloseDeleteSuccessModal,
    showDeleteCategoryModal,
    handleCloseDeletCategoryModal,
    handleOpenDeletCategoryModal,
    showAddSubCategoryDrawer,
    setShowAddSubCategoryModal,
    showAddSubAllocations,
    setShowAddSubAllocations,
    subAllocations,
    setSubAllocations,
    remainingUnallocatedAmount,
    handleDeleteSubAllocation,
    createAllocationMutation,
  } = useEditCategory({
    setShow,
    totalIncome,
    budgetCategoryId,
    budgetId,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <div className="flex gap-4">
            <Button
              onClick={handleOpenDeletCategoryModal}
              className="bg-red-200 text-red-600"
            >
              Delete category
            </Button>
            <Button loading={createAllocationMutation.isPending} onClick={handleSubmit}>
              Save
            </Button>
          </div>
        }
        label={`${name} Budget`}
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-600 font-medium">Category amount/percentage</p>
            <div className="relative bg-gray-100 text-gray-600 border border-gray-200 w-full px-4 py-3 rounded-[20px] flex justify-between">
              <div className="w-full flex flex-col">
                <label htmlFor="amount" className="text-xs text-gray-500">
                  Amount
                </label>
                <input
                  id="amount"
                  placeholder="e.g ₦ 200,000"
                  className="bg-transparent max-w-[120px]"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
              <div className="bg-white pt-0 pb-1 pl-[10px] pr-4 rounded-[10px] w-fit max-w-[88px]">
                <label htmlFor="amount" className="text-xs text-gray-500">
                  Percentage
                </label>
                <input
                  id="percentage"
                  placeholder="20%"
                  className="bg-transparent max-w-[62px]"
                  value={percentage}
                  onChange={handlePercentageChange}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      e.target.value = `${value}%`;
                    }
                  }}
                  onFocus={(e) => {
                    e.target.value = e.target.value.replace('%', '');
                  }}
                />
              </div>
            </div>

            {/* sub categories */}
            <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm font-medium">Add Sub-Categories</p>
                <Switch
                  isSelected={showAddSubAllocations}
                  onChange={() => setShowAddSubAllocations(!showAddSubAllocations)}
                  size="sm"
                  color="success"
                />
              </div>
              {showAddSubAllocations && (
                <div className="space-y-3">
                  {subAllocations.length > 0 && (
                    <>
                      {subAllocations.map((allocation, index) => (
                        <AllocationItem
                          type="allocation"
                          key={index}
                          name={allocation.name}
                          amount={allocation.amount}
                        />
                      ))}
                      <div className="bg-gray-200 rounded-lg p-2 text-xs text-gray-600 font-medium">
                        ₦{remainingUnallocatedAmount} left to categorize
                      </div>
                    </>
                  )}

                  <div
                    className={cn(
                      'flex justify-center items-center',
                      subAllocations.length > 0 ? '' : 'py-10',
                    )}
                  >
                    <Button
                      onClick={() => setShowAddSubCategoryModal(true)}
                      buttonIcon={<BsPlus size={16} />}
                      buttonTitle="Add Sub-Category"
                      buttonType="icon"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </BottomDrawer>

      {showAddSubCategoryDrawer && (
        <AddSubCategoryDrawer
          show={showAddSubCategoryDrawer}
          setShow={setShowAddSubCategoryModal}
          subAllocations={subAllocations}
          setSubAllocations={setSubAllocations}
          allocatedAmount={amount}
        />
      )}

      <ActionModal
        title="Delete category"
        text="Are you sure you want to delete this category from your budget?"
        isOpen={showDeleteCategoryModal}
        onClose={handleCloseDeletCategoryModal}
      >
        <Button className="!bg-lemonGreen-100 !text-lemonGreen-900">Yes, delete</Button>
      </ActionModal>

      <SuccessfulModal
        title="Deleted successfully"
        isOpen={showDeleteSuccessModal}
        onClose={handleCloseDeleteSuccessModal}
      />
    </motion.div>
  );
}
