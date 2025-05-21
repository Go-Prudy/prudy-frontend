import React from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import cn from 'classnames';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  items: string[];
  handleCategorySelect: (categoryName: string) => void;
  selectedCategories: string[];
}

export default function FilterCategoriesDrawer({
  show,
  items,
  setShow,
  handleCategorySelect,
  selectedCategories,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Filter budget categories"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="flex gap-4 flex-wrap">
          {items.map((category: string) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={cn(
                'text-sm p-3 rounded-xl transition-colors duration-200',
                selectedCategories.includes(category)
                  ? 'bg-lemonGreen-100 border border-lemonGreen-900 text-lemonGreen-900'
                  : 'bg-gray-100 border border-gray-200 text-gray-700',
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </BottomDrawer>
    </motion.div>
  );
}
