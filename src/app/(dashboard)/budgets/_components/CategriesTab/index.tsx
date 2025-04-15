import Image from 'next/image';

import Button from '@/app/_components/button';
import expenseImg from '/public/images/budget/total-expense.png';

import { BsPlus } from 'react-icons/bs';
import CreateCategoryDrawer from '../../../../_components/drawers/CreateCategory';
import EditCategoryDrawer from '../../../../_components/drawers/EditCategory';
import Loader from '@/app/_components/loader';
import { Allocation, BudgetCategory } from '@/app/types/budget';
import useCategoriesTab from './useCategoriesTab';
import useIncomeTab from '../IncomeTab/useIncomeTab';

type Props = { budgetId: string; isLoadingBudgetDetails: boolean };

export default function CategoriesTab({ budgetId }: Props) {
  const { totalIncome } = useIncomeTab({ budgetId });
  const {
    budgetCategories,
    isBudgetCategriesLoading,
    budgetAllocations,
    isBudgetAllocationsLoading,
    showCreateCategoryDrawer,
    setShowCreateCategoryDrawer,
    showEditCategory,
    setShowEditCategory,
    selectedCategory,
    setSelectedCategory,
  } = useCategoriesTab({ budgetId });

  return (
    <div className="space-y-6">
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
        <div className="px-4 py-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-black-800 font-medium">Budget Categories</p>
            <Button
              onClick={() => setShowCreateCategoryDrawer(true)}
              buttonIcon={<BsPlus size={16} />}
              buttonTitle="Create New"
              buttonType="icon"
            />
          </div>
          <p className="text-sm text-gray-400">
            Click on the categories below to set their expenses.
          </p>

          {/* categories list */}
          {isBudgetCategriesLoading || isBudgetAllocationsLoading ? (
            <Loader />
          ) : (
            <ul className="grid grid-cols-2 gap-3 overflow-auto min-h-[322px]">
              {budgetCategories?.map((category: BudgetCategory, index: number) => {
                const matchingAllocation = budgetAllocations.find(
                  (allocation: Allocation) =>
                    allocation.budgetCategory.uid === category.uid,
                );
                // TODO: check why budgetAllocations query is not invalidated when an alocation is created
                return (
                  <li
                    key={category.uid}
                    onClick={() => {
                      console.log(index);

                      setSelectedCategory(category);
                      setShowEditCategory(true);
                    }}
                    className="bg-gray-100 border border-gray-200 p-3 rounded-[20px] space-y-2 text-gray-700"
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <p className="text-xs">{category.name}</p>
                    <p className="text-sm font-medium">
                      ₦
                      {matchingAllocation?.amountAllocated?.toLocaleString('en-US') ?? ''}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {showCreateCategoryDrawer && (
        <CreateCategoryDrawer
          show={showCreateCategoryDrawer}
          setShow={setShowCreateCategoryDrawer}
        />
      )}
      {showEditCategory && (
        <EditCategoryDrawer
          name={selectedCategory?.name || ''}
          show={showEditCategory}
          setShow={setShowEditCategory}
          totalIncome={totalIncome ?? 0}
          budgetCategoryId={selectedCategory?.uid || ''}
          budgetId={budgetId}
        />
      )}
    </div>
  );
}
