import React, { useState } from 'react';
import fireIcon from '/public/images/icons/fire.png';
import Image from 'next/image';
import ActionModal from '@/app/_components/modals/ActionModal';
import Button from '@/app/_components/button';
import { UserSubscription } from '@/app/types/subscription';
import Loader from '@/app/_components/loader';
import { formatDate } from 'date-fns';
import useBillingCycle from './useBillingCycle';
import emptyBudgetImage from '/public/images/empty-state/budget.png';
import { EmptyStateDarkBg } from '@/app/_components/emptyState';
import succesGif from '/public/images/success.gif';
import SuccessfulModal from '@/app/_components/modals/SuccessfulModal';

type Props = {
  userSubscription: UserSubscription;
  isGetUserSubscriptionLoading: boolean;
};

export default function BillingCycle({
  userSubscription,
  isGetUserSubscriptionLoading,
}: Props) {
  const {
    billingHistory,
    isGetBillingHistoryLoading,
    showCancelSubscriptionModal,
    setShowCancelSubscriptionModal,
    showSuccessfulModal,
    setShowSuccessfulModal,
  } = useBillingCycle();
  return (
    <div className="space-y-4 text-black-800">
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-base">Billing Cycle </p>
          <button
            className="text-xs text-red-600"
            onClick={() => setShowCancelSubscriptionModal(true)}
          >
            Cancel Subscription
          </button>
        </div>
        {isGetUserSubscriptionLoading ? (
          <Loader />
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-2xl">
            <div className="space-y-2">
              <p className="text-sm">Next billing date</p>
              <p className="text-xs text-gray-400">
                {formatDate(userSubscription?.nextBillingDate ?? '', 'dd MMMM yyyy')}
              </p>
            </div>
            <p>{userSubscription?.plan?.basePrice?.toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-200" />
      <div className="space-y-2 px-6">
        <p className="font-medium text-base">Billing History </p>
        {isGetBillingHistoryLoading ? (
          <Loader />
        ) : (
          <div className="divide-y divide-gray-200">
            {billingHistory && billingHistory?.length > 0 ? (
              billingHistory?.map((history, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg w-10 h-10 flex items-center justify-center">
                      <Image src={fireIcon} alt="" width={20} height={24} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Next billing date</p>
                      <p className="text-xs text-gray-400">06 July, 2024</p>
                    </div>
                  </div>
                  <p>3,000</p>
                </div>
              ))
            ) : (
              <EmptyStateDarkBg image={emptyBudgetImage} title="No billing history yet" />
            )}
          </div>
        )}
      </div>
      <ActionModal
        isOpen={showCancelSubscriptionModal}
        onClose={() => setShowCancelSubscriptionModal(false)}
        title="Cancel Subscription"
        text="You are about to cancel your subscription from Prudy. Are you sure you want to proceed with this action?"
      >
        <Button className="!bg-lemonGreen-100 !text-lemonGreen-900">Yes, cancel</Button>
      </ActionModal>
      <SuccessfulModal
        title="Your subscription has been cancelled successfully"
        isOpen={showSuccessfulModal}
        onClose={() => setShowSuccessfulModal(false)}
        image={succesGif}
      />
    </div>
  );
}
