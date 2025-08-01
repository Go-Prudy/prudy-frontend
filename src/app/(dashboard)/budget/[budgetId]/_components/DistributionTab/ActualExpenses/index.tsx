import FilterCategoriesDrawer from '@/app/_components/drawers/FilterCategories';
import EmptyState from '@/app/_components/emptyState';
import Loader from '@/app/_components/loader';
import BudgetVisualization from '@/components/BudgetVisualization';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import noBudgetImg from '/public/images/empty-state/list.png';
import { BudgetDistributionCategory } from '@/app/types/budget';
import { generateUniqueColors } from '@/app/utils/functions';
import {
  getActualExpenseApi,
  getBudgetDistributionApi,
} from '@/app/services/BudgetService';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

type Props = {
  budgetId: string;
};
export default function ActualExpenses({ budgetId }: Props) {
  const [showFilterCategoriesDrawer, setShowFilterCategoriesDrawer] =
    useState<boolean>(false);
  const { userData } = useAuthStore();

  const [distributions, setDistributions] = useState<BudgetDistributionCategory[]>([]);
  const [filteredDistributions, setFilteredDistributions] = useState<
    BudgetDistributionCategory[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'All categories',
  ]);

  const { data: budgetDistributionData, isLoading } = useQuery({
    queryKey: ['getActualExpense', budgetId],
    queryFn: () => getActualExpenseApi(userData?.token ?? '', budgetId),
    enabled: !!userData?.token && !!budgetId,
  });

  useEffect(() => {
    if (budgetDistributionData) {
      const colors = generateUniqueColors(budgetDistributionData?.distributions.length);

      const newDistributions =
        budgetDistributionData?.distributions?.map((item: any, index: number) => ({
          ...item,
          color: colors[index],
        })) || [];

      setDistributions(newDistributions);
      setFilteredDistributions(newDistributions);
    }
  }, [budgetDistributionData]);

  useEffect(() => {
    if (selectedCategories.includes('All categories')) {
      setFilteredDistributions(distributions);
    } else {
      const filtered = distributions.filter((distribution) =>
        selectedCategories.includes(distribution.name),
      );
      setFilteredDistributions(filtered);
    }
  }, [selectedCategories, distributions]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (categoryName === 'All categories') {
        return ['All categories'];
      }

      const newSelection = prev.filter((cat) => cat !== 'All categories');

      if (prev.includes(categoryName)) {
        const filtered = newSelection.filter((cat) => cat !== categoryName);
        return filtered.length === 0 ? ['All categories'] : filtered;
      } else {
        return [...newSelection, categoryName];
      }
    });
  };
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="w-full flex justify-between items-center">
        <p className="text-sm font-medium text-black-800">Distribution</p>
        <button
          onClick={() => setShowFilterCategoriesDrawer(true)}
          className="border border-gray-200 bg-gray-100 text-xs rounded-2xl p-2 flex items-center gap-1"
        >
          <h1>All categories</h1>
          <BsChevronDown size={10} className=" text-gray-500 " />
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : filteredDistributions.length > 0 ? (
        <>
          <BudgetVisualization
            totalBudget={budgetDistributionData?.totalExpense}
            distributions={filteredDistributions}
          />
          <div className="bg-white mt-2 flex flex-col gap-4 w-full">
            {filteredDistributions?.map((category: any, index: number) => (
              <div
                key={category.uid}
                className="flex justify-between w-full items-center p-[12px] bg-[#F7F7F9] rounded-[12px] border-[1px] border-[#EFEFF0]"
              >
                {/* Category Name */}
                <div className="flex gap-[8px] items-center">
                  <span
                    className="inline-block size-[12px] rounded-full"
                    style={{ backgroundColor: category.color }} // Dynamically set color for each category
                  ></span>
                  <span className="text-[#474747] text-[14px] font-medium">
                    {category.name}
                  </span>
                </div>

                {/* Percentage */}
                <span className="text-[#474747] text-[14px]">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          image={noBudgetImg}
          title=" You do not have any budget history yet."
        />
      )}
      {showFilterCategoriesDrawer && (
        <FilterCategoriesDrawer
          show={showFilterCategoriesDrawer}
          setShow={setShowFilterCategoriesDrawer}
          items={['All categories', ...filteredDistributions.map((item) => item.name)]}
          handleCategorySelect={handleCategorySelect}
          selectedCategories={selectedCategories}
        />
      )}
    </div>
  );
}
