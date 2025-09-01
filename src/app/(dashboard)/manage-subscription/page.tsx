'use client';
import { BsX } from 'react-icons/bs';
import SuccessfulModal from '@/app/_components/modals/SuccessfulModal';
import { Tabs, Tab } from '@nextui-org/react';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import useManageSubscription from './useManageSubscription';
import SubscriptionPlans from './_components/subscriptionPlans';
import BillingCycle from './_components/billingCycle';
import { UserSubscription } from '@/app/types/subscription';

const Page = () => {
  const { userSubscription, isGetUserSubscriptionLoading, paymentMethods } =
    useManageSubscription();

  return (
    <div className="relative">
      <InnerPageHeader
        link="/profile"
        title="Manage Subscription"
        icon={<BsX />}
        isHeaderDark
      />

      <Tabs className="py-3 px-6" fullWidth>
        <Tab key="subscriptionPlans" title="Subscription Plans" className="w-full">
          <SubscriptionPlans />
        </Tab>
        <Tab key="billingCycle" title="Billing Cycle" className="w-full">
          <BillingCycle
            userSubscription={userSubscription ?? ({} as UserSubscription)}
            isGetUserSubscriptionLoading={isGetUserSubscriptionLoading}
            paymentMethods={Array.isArray(paymentMethods) ? paymentMethods : []}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
