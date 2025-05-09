import { ExpenseCategory } from '@/app/types/analytics';
import cn from 'classnames';
import { BsArrowRight } from 'react-icons/bs';

type Props = {
  buttonColor: string;
  title: string;
  showAmountSpent?: boolean;
  categories?: ExpenseCategory[];
};

export default function CategoriesBreakdown({
  buttonColor,
  title,
  showAmountSpent,
  categories = [],
}: Props) {
  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 w-full">
      <p className="text-left text-black-800">{title}</p>
      {categories.length > 0 ? (
        categories.map((category: ExpenseCategory) => (
          <div className="p-3 flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-full" />
            <div
              className={cn(
                'space-y-2 w-[calc(100%-40px)]',
                !showAmountSpent && 'flex justify-between items-center',
              )}
            >
              <div className="flex justify-between">
                <p className="text-black-800 font-medium">{category.name}</p>
                {showAmountSpent && (
                  <p className="text-xs text-gray-600">
                    ₦{category.amountLeft} left to spend
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <p className="text-black-800 font-medium">₦{category.amountAllocated}</p>
                {showAmountSpent && (
                  <p className="text-xs text-gray-600">{category.percentageLeft}%</p>
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
      <button
        className={cn(
          'rounded-2xl py-3 px-2 text-sm font-medium w-[85%] mx-auto flex items-center justify-center gap-2',
          buttonColor,
        )}
      >
        <span>See other categories breakdown</span> <BsArrowRight />
      </button>
    </div>
  );
}
