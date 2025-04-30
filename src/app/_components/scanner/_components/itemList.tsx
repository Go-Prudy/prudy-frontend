import { ScannedItem } from '@/app/types/scan';
import React from 'react';
import { BsPencil } from 'react-icons/bs';

export default function ItemList({
  items,
  onCategoryClick,
}: {
  items: ScannedItem[];
  onCategoryClick: (index: number) => void;
}) {
  return (
    <div className="bg-gray-100 p-4 space-y-3">
      {items.map((item, index) => (
        <ItemCard
          key={index}
          item={item}
          onCategoryClick={() => onCategoryClick(index)}
        />
      ))}
    </div>
  );
}

const ItemCard = ({
  item,
  onCategoryClick,
}: {
  item: ScannedItem;
  onCategoryClick: () => void;
}) => (
  <div className="bg-white border border-gray-200 p-4 rounded-2xl space-y-3">
    <div className="flex justify-between gap-2 text-black-800">
      <p className="font-medium">{item.name}</p>
      <p className="font-bold">₦{item.totalAmount.toLocaleString()}</p>
    </div>
    <div className="flex justify-between gap-2 text-gray-600 text-xs">
      <p className="bg-gray-100 border border-gray-200 rounded-lg py-1 px-2">
        x{item.quantity} / ₦{item.baseAmount.toLocaleString()}
      </p>
      <button
        onClick={onCategoryClick}
        className="bg-gray-100 border border-gray-200 rounded-lg py-1 px-2 flex items-center gap-2 hover:bg-gray-200 transition-colors"
      >
        {item.categoryName}
        <BsPencil className="w-3 h-3" />
      </button>
    </div>
  </div>
);
