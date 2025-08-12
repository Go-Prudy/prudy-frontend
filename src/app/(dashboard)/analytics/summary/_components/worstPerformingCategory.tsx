import Image from 'next/image';
import Performance from './performance';
import performanceImage from '/public/images/analytics/3.png';
import { Breakdown, Remark } from '@/app/types/analytics';

type Props = {
  analytics: {
    actualAmount: number;
    categoryId: string;
    categoryName: string;
    plannedAmount: number;
    remark: Remark;
  } | null;
};

export default function WorstPerformingCategory({ analytics }: Props) {
  return (
    <div className="space-y-10">
      <div className="bg-white py-8 mx-auto max-w-[260px] rounded-3xl border-[10px] border-[#368EF5] text-black-800">
        <p className="text-lg"> {analytics?.categoryName}</p>
        <p className="text-2xl font-bold">₦{analytics?.actualAmount?.toLocaleString()}</p>
      </div>
      <Image
        src={performanceImage}
        alt=""
        width={200}
        height={200}
        className="!-mt-1 !-mb-7 mx-auto"
      />
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">{analytics?.remark?.title}</h6>
        <p>{analytics?.remark?.description}</p>
      </div>
      <Performance
        title={analytics?.categoryName ?? ''}
        plannedBudget={analytics?.plannedAmount ?? 0}
        actualExpenses={analytics?.actualAmount ?? 0}
      />
    </div>
  );
}
