import FilterCategoriesDrawer from '@/app/_components/drawers/FilterCategories';
import EmptyState from '@/app/_components/emptyState';
import Loader from '@/app/_components/loader';
import BudgetVisualization from '@/components/BudgetVisualization';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import noBudgetImg from '/public/images/empty-state/list.png';
import { BudgetDistributionCategory } from '@/app/types/budget';

type Props = {
  isLoading: boolean;
  totalBudget: number;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  distributions: BudgetDistributionCategory[];
};

export default function ActualExpenses({
  isLoading,
  totalBudget,
  selectedCategories,
  setSelectedCategories,
  distributions,
}: Props) {
  const [showFilterCategoriesDrawer, setShowFilterCategoriesDrawer] =
    useState<boolean>(false);
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

      <EmptyState
        image={noBudgetImg}
        title="You have not made any expenses yet"
        description="Begin tracking your expenses to see the summary here."
      />
      {showFilterCategoriesDrawer && (
        <FilterCategoriesDrawer
          show={showFilterCategoriesDrawer}
          setShow={setShowFilterCategoriesDrawer}
          items={['All categories', ...distributions.map((item) => item.name)]}
          handleCategorySelect={handleCategorySelect}
          selectedCategories={selectedCategories}
        />
      )}
    </div>
  );
}
