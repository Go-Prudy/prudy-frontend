import { ExpenseBreakdownCategory, Remark } from '@/app/types/analytics';
import BudgetVisualization from '@/components/BudgetVisualization';
import React, { useEffect, useState } from 'react';

type Props = {
  analytics: {
    income: ExpenseBreakdownCategory[];
    remark: Remark;
    totalIncome: number;
  } | null;
};

export default function IncomeBreakdown({ analytics }: Props) {
  const [filteredDistributions, setFilteredDistributions] = useState<
    ExpenseBreakdownCategory[]
  >([]);

  useEffect(() => {
    if (analytics?.income) {
      const newDistributions =
        analytics.income.map((item: ExpenseBreakdownCategory) => ({
          ...item,
        })) || [];

      setFilteredDistributions(newDistributions);
    }
  }, [analytics]);

  return (
    <div className="space-y-7">
      <div className="rounded-3xl p-4 bg-white">
        <BudgetVisualization
          totalBudget={analytics?.totalIncome ?? 0}
          distributions={filteredDistributions}
          text="Total Income"
          size={250}
          id="income-breakdown-chart"
        />
        <div className="bg-white flex flex-col gap-3 divide-y divide-gray-200 w-full -mt-7">
          {filteredDistributions?.map(
            (income: ExpenseBreakdownCategory, index: number) => (
              <div
                key={`income-${index}`}
                className="flex justify-between w-full items-center pt-3 text-xs"
              >
                {/* Category Name */}
                <div className="flex gap-[8px] items-center">
                  <span
                    className="inline-block size-[12px] rounded-full"
                    style={{ backgroundColor: income.color }}
                  />
                  <span className="text-black-800 font-medium">{income.name}</span>
                </div>

                <div className="flex items-center gap-1 divide-x divide-gray-200">
                  <span className="text-black-950 font-medium">
                    ₦{income?.amount?.toLocaleString()}
                  </span>
                  <span className="text-gray-700 pl-1">
                    {income.percentage.toFixed(1)}%
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
  );
}
