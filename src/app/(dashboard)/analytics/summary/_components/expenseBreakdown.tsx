import { ExpenseBreakdownCategory, Remark } from '@/app/types/analytics';
import { BudgetDistributionCategory } from '@/app/types/budget';
import { generateUniqueColors } from '@/app/utils/functions';
import BudgetVisualization from '@/components/BudgetVisualization';
import React, { useEffect, useState } from 'react';

type Props = {
  analytics: {
    expenses: ExpenseBreakdownCategory[];
    remark: Remark;
    totalExpenses: number;
  } | null;
};

export default function ExpenseBreakdown({ analytics }: Props) {
  const [filteredDistributions, setFilteredDistributions] = useState<
    ExpenseBreakdownCategory[]
  >([]);

  useEffect(() => {
    if (analytics?.expenses) {
      const newDistributions =
        analytics.expenses.map((item: ExpenseBreakdownCategory) => ({
          ...item,
        })) || [];

      setFilteredDistributions(newDistributions);
    }
  }, [analytics]);

  return (
    <div>
      <div className="space-y-7">
        <div className="rounded-3xl p-4 bg-white">
          <BudgetVisualization
            totalBudget={analytics?.totalExpenses ?? 0}
            distributions={filteredDistributions}
            text="Total Expenses"
            size={250}
          />
          <div className="bg-white flex flex-col gap-3 divide-y divide-gray-200 w-full -mt-7">
            {filteredDistributions?.map(
              (expense: ExpenseBreakdownCategory, index: number) => (
                <div
                  key={`expense-${index}`}
                  className="flex justify-between w-full items-center pt-3 text-xs"
                >
                  {/* Category Name */}
                  <div className="flex gap-[8px] items-center">
                    <span
                      className="inline-block size-[12px] rounded-full"
                      style={{ backgroundColor: expense.color }}
                    />
                    <span className="text-black-800 font-medium">{expense.name}</span>
                  </div>

                  <div className="flex items-center gap-1 divide-x divide-gray-200">
                    <span className="text-black-950 font-medium">
                      ₦{expense?.amount?.toLocaleString()}
                    </span>
                    <span className="text-gray-700 pl-1">
                      {expense.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="text-white space-y-4">
          <p>{analytics?.remark?.description}</p>
        </div>
      </div>
    </div>
  );
}
