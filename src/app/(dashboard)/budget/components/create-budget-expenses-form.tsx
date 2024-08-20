import { formatCurrency } from '@/app/lib/utils';
import BudgetCategoryCard from './budget-category-card';
import RightArrowIcon from '@/icons/right-arrow';

const footerShadow = {
  boxShadow: '0px -4px 4px 0px #EFF0F680',
};

export default function CreateBudgetExpensesForm() {
  return (
    <div className="flex flex-col gap-6 px-6 mt-10">
      <div className="flex gap-2 h-2">
        <div className="rounded-[4px] bg-lemonGreen-700 grow"></div>
        <div className="rounded-[4px] bg-lemonGreen-700 grow"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-medium text-xl">Set your Expenses</div>

        <div className="p-4 rounded-[20px] bg-graySubtle border border-grayDefault">
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-medium">{formatCurrency(1245679)}</span>
              <span className="ms-2 text-xs text-graySubtitle">left of income</span>
            </div>
            <progress
              className="h-2 rounded w-full bg-white new-budget-expense"
              value="2"
              data-category="expenses"
              max={100}
            ></progress>
          </div>
        </div>

        <div className="flex items-center">
          <div className="font-medium">Budget Categories</div>
          <button
            type="button"
            className="text-xs font-medium rounded-[32px] bg-grayDefault py-1 px-2 ms-auto"
          >
            <span className="text-base">+</span> Create new
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-7">
        {/* Map these */}
        <BudgetCategoryCard />
      </div>

      <div
        className="p-6 border border-t-[#eff0f6] rounded-t-3xl -mx-6"
        style={footerShadow}
      >
        <button
          type="submit"
          className="py-[14px] bg-base-black inline-flex items-center justify-center gap-2 w-full rounded-[32px]"
        >
          <span className="font-medium text-white">Proceed</span>
          <RightArrowIcon className="fill-white" />
        </button>
      </div>
    </div>
  );
}
