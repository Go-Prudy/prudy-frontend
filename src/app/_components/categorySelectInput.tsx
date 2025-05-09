import React, { Dispatch, SetStateAction } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { BudgetCategory } from '../types/budget';
import { ScannedItem } from '../types/scan';

type Props = {
  setShowCategoriesDrawer: Dispatch<SetStateAction<boolean>>;
  category?: BudgetCategory|null;
  scannedItem?: ScannedItem;
};

export default function CategorySelectInput({
  setShowCategoriesDrawer,
  category,
  scannedItem,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => setShowCategoriesDrawer(true)}
      className="rounded-2xl w-full p-4 bg-gray-100 border border-gray-200 space-y-1 text-left"
    >
      <p className="text-xs text-gray-500">Name of category</p>
      <div className="flex items-center justify-between text-gray-600">
        <div className="flex items-center gap-2">
          {/* image */}
          <span>{scannedItem?.categoryName || category?.name}</span>
        </div>
        <BsChevronDown />
      </div>
    </button>
  );
}
