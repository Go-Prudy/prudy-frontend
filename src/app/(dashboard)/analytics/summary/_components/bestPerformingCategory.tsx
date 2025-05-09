import Image from 'next/image';
import Performance from './performance';
import performanceImage from '/public/images/analytics/2.png';
import { Breakdown, Remark } from '@/app/types/analytics';

type Props = {
  analytics: {
    breakdown: Breakdown;
    remark: Remark;
  } | null;
  isLoadingAnalytics: boolean;
};

export default function BestPerformingCategory({ analytics, isLoadingAnalytics }: Props) {
  return (
    <div className="space-y-7">
      <div className="relative w-[114%] left-[-7%]">
        <Image
          src={performanceImage}
          alt=""
          width={390}
          height={473}
          className="-mt-[100px] mx-auto min-w-[350px]"
        />

        <div className="w-full space-y-1 absolute h-fit top-[37%] right-0 left-0">
          <p className="text-sm font-medium max-w-[110px] mx-auto">{analytics?.breakdown.title}</p>
          <h4 className="font-bold text-xl">
            ₦{analytics?.breakdown.actualExpenses.toLocaleString()}
          </h4>
        </div>
      </div>
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">{analytics?.remark.title}</h6>
        <p>
         {analytics?.remark.description}
        </p>
      </div>
      <Performance
        title={analytics?.breakdown.title ?? ''}
        plannedBudget={analytics?.breakdown.totalBudgeted ?? 0}
        actualExpenses={analytics?.breakdown.actualExpenses ?? 0}
      />
    </div>
  );
}
