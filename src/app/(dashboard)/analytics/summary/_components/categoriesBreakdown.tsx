import CategoryBreakdownDrawer from '@/app/_components/drawers/CategoryBreakdown';
import {
  ExpenseBreakdownCategory,
  OverallExpenseCategory,
  SubscriptionTransactions,
} from '@/app/types/analytics';
import cn from 'classnames';
import { useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { createPortal } from 'react-dom';

type Props<
  T = OverallExpenseCategory | ExpenseBreakdownCategory | SubscriptionTransactions,
> = {
  buttonColor: string;
  buttonTextColor: string;
  title: string;
  showAmountSpent?: boolean;
  isSubscription?: boolean;
  categories?: T[];
};

export default function CategoriesBreakdown<
  T extends OverallExpenseCategory | ExpenseBreakdownCategory | SubscriptionTransactions,
>({
  buttonColor,
  buttonTextColor,
  title,
  showAmountSpent = false,
  isSubscription = false,
  categories = [],
}: Props<T>) {
  const slicedCategories = categories.slice(0, 2);

  const [showCategoryBreakdownDrawer, setShowCategoryBreakdownDrawer] =
    useState<boolean>(false);

  return (
    <div className="text-left space-y-3 rounded-3xl bg-white p-4 w-full">
      <p className=" text-black-800">{title}</p>
      {slicedCategories.length > 0 ? (
        slicedCategories.map((category) => (
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
        ))
      ) : (
        <div className="p-3 flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-2xl">
          <div className="w-10 h-10 bg-white rounded-full" />
          <div
            className={cn(
              'space-y-2 w-[calc(100%-40px)]',
              !showAmountSpent && 'flex justify-between items-center',
            )}
          >
            <div className="flex justify-between">
              <p className="text-black-800 font-medium">Food</p>
              {showAmountSpent && (
                <p className="text-xs text-gray-600">₦20,000 left to spend</p>
              )}
            </div>
            <div className="flex justify-between">
              <p className="text-black-800 font-medium">₦250,000</p>
              {showAmountSpent && <p className="text-xs text-gray-600">70%</p>}
            </div>
          </div>
        </div>
      )}
      {categories.length > 0 && (
        <button
          className={cn(
            'rounded-2xl py-3 px-2 text-sm font-medium w-[90%] mx-auto flex items-center justify-center gap-2',
            buttonColor,
            buttonTextColor,
          )}
          onClick={() => setShowCategoryBreakdownDrawer(true)}
        >
          <span>
            See other {isSubscription ? 'subscriptions' : 'categories'} breakdown
          </span>
          <BsArrowRight />
        </button>
      )}
      {showCategoryBreakdownDrawer &&
        typeof window !== 'undefined' &&
        createPortal(
          <CategoryBreakdownDrawer
            show={showCategoryBreakdownDrawer}
            setShow={setShowCategoryBreakdownDrawer}
            categories={categories}
            isSubscription={isSubscription}
            showAmountSpent={showAmountSpent}
          />,
          document.body,
        )}
    </div>
  );
}
