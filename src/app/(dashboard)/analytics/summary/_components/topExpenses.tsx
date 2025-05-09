import { ExpenseCategory, Remark } from '@/app/types/analytics';
import CategoriesBreakdown from './categoriesBreakdown';
import cn from 'classnames';

type Props = {
  analytics: {
    categories: ExpenseCategory[];
    remark: Remark;
  } | null;
  isLoadingAnalytics: boolean;
};

const backgrounds = [
  'bg-top-expenses-bar1',
  'bg-top-expenses-bar2',
  'bg-top-expenses-bar3',
];

export default function TopExpenses({ analytics, isLoadingAnalytics }: Props) {
  return (
    <div className="space-y-7">
      <div className="p-[1px] bg-top-expenses-border rounded-[32px]">
        <div className="text-white space-y-4 bg-[#8D2A7B] rounded-[32px] p-6">
          <div className="flex items-end justify-center space-x-6 max-w-[300px] mx-auto">
            {analytics?.categories
              ?.slice(0, 3)
              .map((category, index) => (
                <Bar
                  key={category.uid}
                  label={category.name}
                  amount={category.amountSpent}
                  percentage={100 - category.percentageLeft}
                  color={backgrounds[index]}
                />
              ))}
          </div>
          <h6 className="text-xl font-bold space-y-4">{analytics?.remark.title}</h6>
          <p>{analytics?.remark.description}</p>
        </div>
      </div>
      <CategoriesBreakdown
        title="Top Expenses Breakdown"
        buttonColor="bg-[#C16CB2]"
        categories={analytics?.categories.splice(0, 3) ?? []}
      />
    </div>
  );
}

type BarProps = {
  label: string;
  amount: number;
  percentage: number;
  color: string;
};

const Bar = ({ label, amount, percentage, color }: BarProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-10 h-[180px] bg-[#7C146A] rounded-[10px] overflow-hidden">
        <div
          className={cn(
            'absolute bottom-0 w-full rounded-[10px] border-[0.24px] border-[#ffffffa1]',
            color,
          )}
          style={{
            height: `${percentage}%`,
          }}
        />
        <div className="absolute left-0 right-0 bottom-8 h-fit flex justify-center items-center font-bold text-white rotate-[-90deg]">
          {amount.toLocaleString()}
        </div>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
