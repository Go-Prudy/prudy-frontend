import Image from 'next/image';
import Button from '@/app/_components/button';
import expenseImg from '/public/images/budget/total-expense.png';
import emptyListImg from '/public/images/empty-state/list.png';

import { BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import CreateCategoryDrawer from '@/app/_components/drawers/CreateCategory';
import Loader from '@/app/_components/loader';
import useIncomeTab from '../IncomeTab/useIncomeTab';
import EmptyState from '@/app/_components/emptyState';
import AddAllocationDrawer from '@/app/_components/drawers/AddAllocation';
import { Allocation } from '@/app/types/budget';
import { Progress } from '@nextui-org/react';
import useAllocationsTab from './useAllocationsTab';
import AppPopover from '@/app/_components/popover';
import { Icons } from '@/app/icons';

type Props = {
  budgetId: string;
  isLoadingBudgetDetails: boolean;
  handleTabSelection: (key: string) => void;
};

export default function AllocationsTab({ budgetId, handleTabSelection }: Props) {
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
    totalAllocations,
    deleteMutation,
    handleEdit,
    selectedAllocation,
  } = useAllocationsTab({ budgetId });

  return (
    <div className="space-y-6 bg-gray-100 p-4">
      <div className="border border-gray-200 bg-white rounded-3xl">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
            <Image src={expenseImg} width={45} height={40} alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Total Planned Expenses</p>
            <h6 className="text-xl text-black-800 font-bold">
              <span>₦{totalAllocations.toLocaleString()}</span>
              <span className="text-sm">.00</span>
            </h6>
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
              disabled={
                totalIncome === 0 || totalIncome === undefined || totalIncome === null
              }
            />
          </div>

          {isBudgetAllocationsLoading ? (
            <Loader />
          ) : budgetAllocations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {budgetAllocations.map((allocation: Allocation) => (
                <div
                  key={allocation.uid}
                  className="relative p-3 space-y-2 bg-gray-100 border border-gray-200 rounded-[20px] text-black-800 text-sm font-medium"
                >
                  <div className="size-10 bg-white rounded-full"></div>
                  <p className="">{allocation.budgetCategory.name}</p>
                  {/* <p className=""> ₦ {allocation.amountAllocated}</p> */}
                  <p className="">
                    <span className="font-medium text-sm">
                      ₦ {allocation.amountLeft.toLocaleString()}{' '}
                    </span>
                    <span className="text-[10px] text-gray-400">left</span>
                  </p>
                  <Progress
                    aria-label="Progress showing amount spent and left"
                    value={allocation?.amountLeft}
                    maxValue={allocation?.amountAllocated}
                    size="md"
                    color="warning"
                    radius="md"
                    classNames={{
                      base: 'max-w-md',
                      track: 'bg-gray-200 h-1.5',
                      indicator: 'bg-gray-600 h-1.5',
                      label: 'tracking-wider font-medium text-default-600',
                      value: 'text-foreground/60',
                    }}
                    showValueLabel={false}
                  />
                  <AppPopover
                    trigger={
                      <button className="!m-0 absolute top-3 right-3 bg-white rounded w-5 h-5 flex items-center justify-center">
                        <BsThreeDotsVertical className="text-gray-400" />
                      </button>
                    }
                    placement="bottom-end"
                  >
                    <button
                      onClick={() => handleEdit(allocation)}
                      className="text-left text-xs text-gray-600 flex items-center gap-0.5"
                    >
                      {Icons.edit}
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(allocation.uid)}
                      className="text-left text-xs text-gray-600 flex items-center gap-0.5"
                    >
                      {Icons.trash}
                      {deleteMutation.isPending ? 'Loading...' : <span>Delete </span>}
                    </button>
                  </AppPopover>
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
          totalAllocations={totalAllocations}
          selectedAllocation={selectedAllocation}
        />
      )}
    </div>
  );
}
