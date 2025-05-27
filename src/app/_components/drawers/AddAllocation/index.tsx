import React from 'react';
import Button from '../../button';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import useEditCategory from './useAddAllocation';
import SuccessfulModal from '../../modals/SuccessfulModal';
import ActionModal from '../../modals/ActionModal';
import { BsChevronDown, BsPlus } from 'react-icons/bs';
import AddSubCategoryDrawer from '../../modals/AddSubCategory';
import { Switch } from '@nextui-org/react';
import AllocationItem from '../../allocationItem';
import cn from 'classnames';
import { Allocation, BudgetCategory } from '@/app/types/budget';
import SelectCategoryDrawer from '../SelectCategory';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  totalAllocations: number;
  totalIncome: number;
  budgetId: string;
  budgetCategories: BudgetCategory[];
  isBudgetCategriesLoading: boolean;
  selectedAllocation?: Allocation;
}

export default function AddAllocationDrawer({
  show,
  setShow,
  totalAllocations,
  totalIncome,
  budgetId,
  budgetCategories,
  isBudgetCategriesLoading,
  selectedAllocation,
}: Props) {
  const {
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
  } = useEditCategory({
    setShow,
    totalIncome,
    budgetId,
    isEditing: !!selectedAllocation,
    selectedAllocation,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button
            disabled={!selectedCategory}
            loading={
              createAllocationMutation.isPending || editAllocationMutation.isPending
            }
            onClick={handleSubmit}
          >
            Save
          </Button>
        }
        label="Add Budget Allocations"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="relative bg-gray-100 text-black-800 border border-gray-200 w-full p-2 rounded-2xl flex justify-between gap-2">
              <div className="bg-white rounded-lg w-1/2 space-y-1 p-2">
                <p className="text-xs text-gray-500">Total Budget</p>
                <p>₦{totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg w-1/2 space-y-1 p-2">
                <p className="text-xs text-gray-500">Left to allocate</p>
                <p>₦{(totalIncome - totalAllocations).toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={() =>
                !!selectedAllocation !== true && setShowCategoriesDrawer(true)
              }
              className="rounded-2xl w-full p-4 bg-gray-100 border border-gray-200 space-y-1 text-left"
            >
              <p className="text-xs text-gray-500">Name of category</p>
              <div
                className={cn(
                  'flex items-center justify-between text-gray-600',
                  !selectedCategory && 'opacity-60',
                )}
              >
                <div className="flex items-center gap-2">
                  {/* image */}
                  <span>{selectedCategory ? selectedCategory.name : 'e.g Food'}</span>
                </div>
                <BsChevronDown />
              </div>
            </button>

            {showCategoriesDrawer && (
              <SelectCategoryDrawer
                show={showCategoriesDrawer}
                setShow={setShowCategoriesDrawer}
                categories={budgetCategories}
                isLoading={isBudgetCategriesLoading}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}

            <div className="relative bg-gray-100 text-gray-600 border border-gray-200 w-full p-3 rounded-2xl flex justify-between items-center">
              <div className="w-1/2 flex flex-col">
                <label htmlFor="amount" className="text-xs text-gray-500">
                  Amount
                </label>
                <input
                  id="amount"
                  placeholder="e.g ₦ 200,000"
                  className="bg-transparent"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
              <div className="bg-white pt-0 pb-1 pl-[10px] pr-4 rounded-[10px] w-1/2 flex flex-col">
                <label htmlFor="amount" className="text-xs text-gray-500">
                  Percentage
                </label>
                <input
                  id="percentage"
                  placeholder="20%"
                  className="bg-transparent"
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
                  classNames={{
                    wrapper: showAddSubAllocations ? '!bg-[#58D50D]' : '!bg-[#78788029]',
                    thumb: 'data-[selected=true]:bg-white',
                  }}
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
                          handleDelete={() => handleDeleteSubAllocation(index)}
                          handleEdit={() => {}}
                          isLoadingDelete={false}
                          isLoadingEdit={false}
                          showActions={!!selectedAllocation ? false : true}
                        />
                      ))}
                      <div className="bg-gray-200 rounded-lg p-2 text-xs text-gray-600 font-medium">
                        ₦{remainingUnallocatedAmount.toLocaleString()} left to categorize
                      </div>
                    </>
                  )}

                  {!!selectedAllocation !== true && (
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
                  )}
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
    </motion.div>
  );
}
