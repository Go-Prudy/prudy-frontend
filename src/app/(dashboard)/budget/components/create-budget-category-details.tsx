'use client';

import MoneyIcon from '@/icons/money';
import { useState } from 'react';

const footerShadow = {
  boxShadow: '0px -4px 4px 0px #EFF0F680',
};
const recurringExpenseShadow = {
  boxShadow: '0px 20px 48px 0px #AAAAAA4A',
};

export default function CreateBudgetCategoryDetails() {
  const [recurringExpense, setRecurringExpense] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="px-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-graySubtitle w-[175px] grow shrink-0">
            Assign amount/percentage of income for this category
          </p>

          <div className="h-8 rounded-lg border border-grayDefault bg-graySubtle py-1 px-2 ms-8">
            <div className="h-full flex items-center gap-2">
              <div className="inline-flex items-center gap-1">
                <input type="number" name="" id="" className="w-full bg-transparent" />
                <span className="bg-white p-[2px] rounded-sm">%</span>
              </div>
              <div className="w-[1px] bg-grayDefault h-6 flex-1"></div>
              <div className="inline-flex items-center gap-1">
                <span className="bg-white p-[2px] rounded-sm">N</span>
                <input type="number" name="" id="" className="w-full bg-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-[20px] bg-graySubtle border border-grayDefault flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Map income categories and amount */}
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#01B0C5] text-center grid grid-cols-1 place-items-center">
              <MoneyIcon className="fill-white" />
            </div>
            <div className="flex gap-2">
              <input type="text" name="" id="" className="w-auto bg-transparent" />
              <div className="py-1 px-2 rounded-lg bg-white inline-flex gap-1">
                <span>N</span>
                <input type="number" name="" id="" className="w-full bg-transparent" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#01B0C5] text-center text-white">
              +
            </div>
            <button type="button">Add another</button>
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-sm text-graySubtitle">Is this a recurring expense?</p>

          <div className="p-1 rounded-lg bg-graySubtle border border-grayDefault ms-auto">
            <button
              type="button"
              className={`${!recurringExpense && 'bg-white'} p-1 text-xs text-graySubtitle`}
              style={!recurringExpense ? recurringExpenseShadow : {}}
              onClick={() => setRecurringExpense(false)}
            >
              No
            </button>
            <button
              type="button"
              className={`${recurringExpense && 'bg-white'} p-1 text-xs text-graySubtitle`}
              style={recurringExpense ? recurringExpenseShadow : {}}
              onClick={() => setRecurringExpense(true)}
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 border border-t-[#eff0f6] rounded-t-3xl" style={footerShadow}>
        <button
          type="submit"
          className="py-[14px] bg-base-black inline-flex items-center justify-center gap-2 w-full rounded-[32px]"
        >
          <span className="font-medium text-white">Save</span>
        </button>
      </div>
    </div>
  );
}
