import React from 'react';
import CategoriesBreakdown from './categoriesBreakdown';
import Image from 'next/image';
import coinImage from '/public/images/analytics/coin.png';
import { Remark, SubscriptionTransactions } from '@/app/types/analytics';

type Props = {
  analytics: {
    totalSubscriptionAmount: number;
    transactions: SubscriptionTransactions[];
    remark: Remark;
  } | null;
};

export default function Subscriptions({ analytics }: Props) {
  return (
    <div>
      <div className="space-y-7">
        <div className="relative">
          <Image
            src={coinImage}
            alt=""
            width={244}
            height={244}
            className="-my-5 mx-auto"
          />
          <div className="max-w-[126px] space-y-1 absolute h-fit top-0 right-0 left-0 bottom-0 m-auto ">
            <p className="text-sm font-medium">Total Subscriptions amount</p>
            <h4 className="font-bold text-2xl">
              ₦{analytics?.totalSubscriptionAmount?.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="text-white space-y-4">
          <h6 className="text-xl font-bold space-y-4">{analytics?.remark.title}</h6>
          <p>{analytics?.remark?.description}</p>
        </div>
        <CategoriesBreakdown
          buttonTextColor="text-white"
          title="Subscriptions"
          buttonColor="bg-[#A8B53A]"
          categories={analytics?.transactions ?? []}
          isSubscription
        />
      </div>
    </div>
  );
}
