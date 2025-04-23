import Image from 'next/image';
import Button from '@/app/_components/button';
import expenseImg from '/public/images/budget/total-expense.png';
import emptyListImg from '/public/images/empty-state/list.png';

import { BsArrowLeft, BsArrowRight, BsPlus } from 'react-icons/bs';
import CreateCategoryDrawer from '@/app/_components/drawers/CreateCategory';
import Loader from '@/app/_components/loader';
import useCategoriesTab from './useCategoriesTab';
import useIncomeTab from '../IncomeTab/useIncomeTab';
import EmptyState from '@/app/_components/emptyState';
import AddAllocationDrawer from '@/app/_components/drawers/AddAllocation';
import { Allocation } from '@/app/types/budget';
import BottomButton from '../bottomButton';

type Props = {
  budgetId: string;
  isLoadingBudgetDetails: boolean;
  handleTabSelection: (key: string) => void;
};

export default function CategoriesTab({ budgetId, handleTabSelection }: Props) {
  const { totalIncome } = useIncomeTab({ budgetId });
  const {
    budgetCategories,
    isBudgetCategriesLoading,
    budgetAllocations,
    isBudgetAllocationsLoading,
    showCreateCategoryDrawer,
    setShowCreateCategoryDrawer,
    showAddAllocation,
    setShowAddAllocation,
  } = useCategoriesTab({ budgetId });

  return (
    <div className="space-y-6 mb-[100px]">
      <div className="border border-gray-200 bg-white rounded-3xl">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
            <Image src={expenseImg} width={45} height={40} alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Total Planned Expenses</p>
            <h6 className="text-xl text-black-800 font-bold">₦0.00</h6>
          </div>
        </div>
        <div className="px-4 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-black-800 font-medium">Budget Allocations</p>
            <Button
              onClick={() => {
                setShowAddAllocation(true);
              }}
              buttonIcon={<BsPlus size={16} />}
              buttonTitle="Add Allocations"
              buttonType="icon"
            />
          </div>

          {isBudgetAllocationsLoading ? (
            <Loader />
          ) : budgetAllocations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {budgetAllocations.map((allocation: Allocation) => (
                <div
                  key={allocation.uid}
                  className="p-3 space-y-2 bg-gray-100 border border-gray-200 rounded-[20px] text-black-800 text-sm font-medium"
                >
                  <div className="size-10 bg-white rounded-full"></div>
                  <p className="">{allocation.budgetCategory.name}</p>
                  <p className="">{allocation.amountAllocated}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              image={emptyListImg}
              title="You are yet to allocate your expenses"
              description="Click the “Add Allocations” button above to get started."
            />
          )}
        </div>
      </div>

      <BottomButton>
        <Button
          className="!bg-lemonGreen-100 !text-lemonGreen-900"
          onClick={() => handleTabSelection('income')}
        >
          <BsArrowLeft />
          Back
        </Button>

        <Button onClick={() => handleTabSelection('distribution')}>
          Continue <BsArrowRight />
        </Button>
      </BottomButton>

      {showCreateCategoryDrawer && (
        <CreateCategoryDrawer
          show={showCreateCategoryDrawer}
          setShow={setShowCreateCategoryDrawer}
        />
      )}
      {showAddAllocation && (
        <AddAllocationDrawer
          show={showAddAllocation}
          setShow={setShowAddAllocation}
          totalIncome={totalIncome ?? 0}
          budgetId={budgetId}
          budgetCategories={budgetCategories}
          isBudgetCategriesLoading={isBudgetCategriesLoading}
        />
      )}
    </div>
  );
}
