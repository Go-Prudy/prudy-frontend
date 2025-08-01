import React from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import {
  ExpenseBreakdownCategory,
  OverallExpenseCategory,
  SubscriptionTransactions,
} from '@/app/types/analytics';
import cn from 'classnames';

type Props<
  T = OverallExpenseCategory | ExpenseBreakdownCategory | SubscriptionTransactions,
> = {
  setShow: (i: boolean) => void;
  show: boolean;
  categories?: T[];
  isSubscription?: boolean;
  showAmountSpent?: boolean;
};

export default function CategoryBreakdownDrawer({
  show,
  setShow,
  categories,
  isSubscription = false,
  showAmountSpent,
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
        label={isSubscription ? 'Subscriptions Breakdown' : 'Budget Categories'}
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-3">
          {!isSubscription && (
            <p className="text-black-800 font-medium">Categories Breakdown</p>
          )}
          <div className="space-y-4">
            {categories?.map((category) => (
              <div
                key={category.name}
                className="p-3 flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-2xl"
              >
                <div className="w-10 h-10 bg-white rounded-full" />
                <div
                  className={cn(
                    'space-y-2 w-[calc(100%-40px)] flex justify-between items-center',
                  )}
                >
                  <div className="">
                    <p className="text-black-800 font-medium">{category.name}</p>
                    {showAmountSpent && 'amountLeft' in category && (
                      <p className="text-xs text-gray-600">
                        ₦{(category as OverallExpenseCategory).amountLeft} left to spend
                      </p>
                    )}
                  </div>
                  <div className="">
                    <p className="text-black-800 font-medium">
                      ₦
                      {'plannedAmount' in category
                        ? (category as OverallExpenseCategory).plannedAmount
                        : (category as ExpenseBreakdownCategory).amount}
                    </p>
                    {showAmountSpent && 'percentage' in category && (
                      <p className="text-xs text-gray-600 text-right">
                        {(category as OverallExpenseCategory).percentage}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BottomDrawer>
    </motion.div>
  );
}
