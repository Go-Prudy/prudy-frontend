import Image from 'next/image';
import Performance from './performance';
import performanceImage from '/public/images/analytics/2.png';
import { Remark } from '@/app/types/analytics';

type Props = {
  analytics: {
    actualAmount: number;
    categoryId: string;
    categoryName: string;
    plannedAmount: number;
    remark: Remark;
  } | null;
};

export default function BestPerformingCategory({ analytics }: Props) {
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

        <div className="w-full space-y-1 absolute h-fit top-[35%] right-0 left-0">
          <p className="text-sm font-medium max-w-[110px] mx-auto">
            {analytics?.categoryName}
          </p>
          <h4 className="font-bold text-xl">
            ₦{analytics?.actualAmount?.toLocaleString()}
          </h4>
        </div>
      </div>
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
