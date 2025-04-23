import React, { Dispatch, SetStateAction } from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import { BudgetCategory } from '@/app/types/budget';
import Loader from '../../loader';
import cn from 'classnames';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  categories: BudgetCategory[];
  isLoading: boolean;
  selectedCategory: BudgetCategory | null;
  setSelectedCategory: Dispatch<SetStateAction<BudgetCategory | null>>;
};
export default function SelectCategoryDrawer({
  show,
  setShow,
  categories,
  isLoading,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Select category"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div className={cn('grid grid-cols-3 gap-[14px] max-h-[360px] overflow-auto')}>
            {categories.map((category: BudgetCategory) => (
              <button
                key={category.uid}
                className={cn(
                  'flex flex-col items-center text-center p-3 space-y-2 bg-gray-100 border rounded-2xl',
                  selectedCategory === category
                    ? 'border-lemonGreen-600'
                    : 'border-gray-200',
                )}
                onClick={() => {
                  setSelectedCategory(category);
                  setShow(false);
                }}
              >
                <div className="size-10 bg-white rounded-full"></div>
                <p className="text-black-800 text-xs">{category.name}</p>
              </button>
            ))}
          </div>
        )}
      </BottomDrawer>
    </motion.div>
  );
}
