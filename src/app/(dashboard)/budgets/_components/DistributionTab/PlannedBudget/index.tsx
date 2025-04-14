import FilterCategoriesDrawer from '@/app/_components/drawers/FilterCategories';
import EmptyState from '@/app/_components/emptyState';
import Loader from '@/app/_components/loader';
import BudgetVisualization from '@/components/BudgetVisualization';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import noBudgetImg from '/public/images/List 2.webp';
import { BudgetDistributionCategory } from '@/app/utils/types';

type Props = {
  isLoading: boolean;
  totalBudget: number;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  distributions: BudgetDistributionCategory[];
};

export default function PlannedBudget({
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

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <BudgetVisualization totalBudget={totalBudget} distributions={distributions} />
          <div className="bg-white mt-[28px] p-4 flex flex-col gap-[16px]  w-full">
            {distributions.length > 0 ? (
              distributions?.map((category: any, index: number) => (
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
              ))
            ) : (
              <EmptyState
                image={noBudgetImg}
                title=" You do not have any budget history yet."
              />
            )}
          </div>
        </>
      )}

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
