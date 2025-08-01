import CircularProgressBar from '@/app/_components/circularProgress';
import CategoriesBreakdown from './categoriesBreakdown';
import { OverallExpenseCategory, Remark } from '@/app/types/analytics';

type Props = {
  analytics: {
    remark: Remark;
    actualExpenses: number;
    categoriesBreakdown: OverallExpenseCategory[];
    percentage: number;
    plannedExpenses: number;
  } | null;
};

const calculatePercentage = (amount: number, total: number) => {
  if (total === 0 || amount === 0) return 0;
  return Math.round((amount / total) * 100);
};

export default function PlannedVsActual({ analytics }: Props) {
  return (
    <div className="flex flex-col gap-7 items-center">
      <CircularProgressBar
        value={calculatePercentage(
          analytics?.actualExpenses ?? 0,
          analytics?.plannedExpenses ?? 0,
        )}
      />
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">
          You have used up{' '}
          {calculatePercentage(
            analytics?.actualExpenses ?? 0,
            analytics?.plannedExpenses ?? 0,
          )}
          % of your planned budget already
        </h6>
        <p>{analytics?.remark?.description}</p>
        <div className="border border-[#BEB8FF] bg-[#B092F480] rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <p className="space-x-2">
              <span className="inline-block align-middle w-4 h-4 rounded-[6px] bg-[#CBB7F7]" />
              <span className="text-sm">Planned Budget</span>
            </p>
            <p className="font-bold">₦{analytics?.plannedExpenses?.toLocaleString()}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="space-x-2">
              <span className="inline-block align-middle w-4 h-4 rounded-[6px] bg-[#E7F846]" />
              <span className="text-sm">Actual Budget</span>
            </p>
            <p className="font-bold">₦{analytics?.actualExpenses?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <CategoriesBreakdown
        title="Categories Breakdown"
        buttonColor="bg-[#CBB7F7]"
        buttonTextColor="text-[#2B1076]"
        showAmountSpent
        categories={analytics?.categoriesBreakdown ?? []}
      />
    </div>
  );
}
