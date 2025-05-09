import Image from 'next/image';
import Performance from './performance';
import performanceImage from '/public/images/analytics/3.png';
import { Breakdown, Remark } from '@/app/types/analytics';

type Props = {
  analytics: {
    breakdown: Breakdown;
    remark: Remark;
  } | null;
  isLoadingAnalytics: boolean;
};

export default function WorstPerformingCategory({
  analytics,
  isLoadingAnalytics,
}: Props) {
  return (
    <div className="space-y-10">
      <div className="bg-white py-8 mx-auto max-w-[260px] rounded-3xl border-[10px] border-[#368EF5] text-black-800">
        <p className="text-lg">{analytics?.breakdown.title}</p>
        <p className="text-2xl font-bold">
          ₦{analytics?.breakdown.actualExpenses.toLocaleString()}
        </p>
      </div>
      <Image
        src={performanceImage}
        alt=""
        width={200}
        height={200}
        className="!-mt-1 !-mb-7 mx-auto"
      />
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">{analytics?.remark.title}</h6>
        <p>{analytics?.remark.description}</p>
      </div>
      <Performance
        title={analytics?.breakdown.title ?? ''}
        plannedBudget={analytics?.breakdown.totalBudgeted ?? 0}
        actualExpenses={analytics?.breakdown.actualExpenses ?? 0}
      />{' '}
    </div>
  );
}
