import CircularProgressBar from '@/app/_components/circularProgress';
import CategoriesBreakdown from './categoriesBreakdown';
import { Breakdown, Remark } from '@/app/types/analytics';

type Props = {
  analytics: {
    breakdown: Breakdown;
    remark: Remark;
  } | null;
  isLoadingAnalytics: boolean;
};

export default function PlannedVsActual({ analytics, isLoadingAnalytics }: Props) {
  // TODO:  Add loading state
  return (
    <div className="flex flex-col gap-7 items-center">
      <CircularProgressBar
        value={
          analytics?.breakdown?.actualExpenses
            ? (analytics?.breakdown?.actualExpenses /
                analytics?.breakdown?.totalBudgeted) *
              100
            : 0
        }
      />
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">{analytics?.remark.title}</h6>
        <p>{analytics?.remark.description}</p>
        <div className="border bg-[#B092F480] rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <p className="space-x-2">
              <span className="inline-block align-middle w-4 h-4 rounded-[6px] bg-[#CBB7F7]" />
              <span className="text-sm">Planned Budget</span>
            </p>
            <p className="font-bold">
              ₦{analytics?.breakdown.totalBudgeted?.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="space-x-2">
              <span className="inline-block align-middle w-4 h-4 rounded-[6px] bg-[#E7F846]" />
              <span className="text-sm">Actual Budget</span>
            </p>
            <p className="font-bold">
              ₦{analytics?.breakdown.actualExpenses?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* TODO: fetch categries for this */}
      <CategoriesBreakdown
        title="Categories Breakdown"
        buttonColor="bg-[#CBB7F7]"
        showAmountSpent
      />
    </div>
  );
}
