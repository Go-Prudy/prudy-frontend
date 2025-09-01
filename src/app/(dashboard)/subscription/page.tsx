'use client';
import BottomDrawer from '@/app/_components/drawers/BottomDrawer';
import {
  BsCheck2Circle,
  BsChevronDown,
  BsChevronRight,
  BsChevronUp,
  BsX,
} from 'react-icons/bs';
import { motion } from 'framer-motion';
import mono1 from '/public/images/mono1.png';
import Image from 'next/image';
import SuccessfulModal from '@/app/_components/modals/SuccessfulModal';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import Loader from '@/app/_components/loader';
import useSubscription from './useSubscription';
import Button from '@/app/_components/button';
import { planOptions } from '@/app/utils/constants';
import SubscriptionPlansDrawer from '@/app/_components/drawers/SubscriptionPlans';
import succesGif from '/public/images/success.gif';
import { SubscriptionPlans } from '@/app/types/subscription';
import LoadingModal from '@/app/_components/modals/LoadingModal';

const Page = () => {
  const {
    subscriptionPlans,
    isGetAllPlansPending,
    showSubscriptionPlan,
    setShowSubscriptionPlan,
    makePayment,
    setMakePayment,
    selectedPlan,
    popoverIsOpen,
    setPopoverIsOpen,
    handleSelectPlan,
    handleMakePayment,
    showSuccessfulModal,
    setShowSuccessfulModal,
    setFetchPaymentMethods,
    addPaymentMedthodMutation,
    isGetPaymentMethodLoading,
    checkoutSubscriptionMutation,
    completeAddPaymentMethodMutation,
  } = useSubscription();

  if (
    addPaymentMedthodMutation.isPending ||
    isGetPaymentMethodLoading ||
    completeAddPaymentMethodMutation.isPending ||
    checkoutSubscriptionMutation.isPending
  ) {
    return <LoadingModal isOpen={true} onClose={() => {}} text="Please wait..." />;
  }

  return (
    <div className="relative min-h-screen bg-subscription-bg bg-no-repeat bg-cover pb-10">
      <InnerPageHeader
        link="/profile"
        title="Subscription"
        icon={<BsX />}
        isHeaderTransparent
      />

      <div className="space-y-6 px-6">
        <div className="space-y-3 text-white">
          <h1 className="text-4xl relative text-center font-medium">
            Activate free trial for <br /> 14 days
          </h1>
          <p className="px-5 py-0.5 w-fit mx-auto bg-green-600 backdrop-blur-md rounded-2xl text-xs">
            Cancel anytime
          </p>
        </div>

        <div className="bg-gray-100 relative text-gray-800 rounded-3xl p-4 space-y-3">
          {isGetAllPlansPending ? (
            <Loader />
          ) : (
            <>
              <div className="items-center flex justify-between w-full">
                <p className="text-lg font-semibold">
                  {
                    subscriptionPlans?.[
                      selectedPlan as keyof typeof subscriptionPlans
                    ]?.[2]?.name
                  }
                </p>
                <Popover
                  isOpen={popoverIsOpen}
                  onOpenChange={(open) => setPopoverIsOpen(!open)}
                  placement="bottom"
                >
                  <PopoverTrigger>
                    <button
                      onClick={() => setPopoverIsOpen(!popoverIsOpen)}
                      className="bg-white w-fit text-sm rounded-2xl px-2 py-1 flex items-center gap-2 capitalize"
                    >
                      {selectedPlan}
                      {!popoverIsOpen ? <BsChevronDown /> : <BsChevronUp />}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2 !rounded-none !rounded-ss-xl !rounded-b-xl shadow-md bg-white min-w-[90px]">
                    <div className="flex flex-col">
                      {planOptions.map((option) => (
                        <button
                          key={option}
                          className={`text-xs text-center capitalize py-1 text-gray-600 hover:bg-gray-200 ${
                            selectedPlan === option ? 'font-bold' : ''
                          }`}
                          onClick={() => handleSelectPlan(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="bg-white p-3 rounded-xl space-y-2">
                {subscriptionPlans?.[
                  selectedPlan as keyof typeof subscriptionPlans
                ][2]?.benefits?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <BsCheck2Circle
                      strokeWidth={1.6}
                      className="text-lemonGreen-900 size-4 min-w-[16px]"
                    />
                    <span className="text-sm leading-7">{feature}</span>
                  </div>
                ))}
                <div className="bg-lemonGreen-300 text-gray-600 p-3 w-full rounded-lg text-center text-sm">
                  30 days free, then{' '}
                  <span className=" font-bold text-base">
                    ₦{' '}
                    {
                      subscriptionPlans?.[
                        selectedPlan as keyof typeof subscriptionPlans
                      ][2]?.monthlyAmount
                    }
                  </span>{' '}
                  /monthly
                </div>
              </div>
              <Button
                className="bg-lemonGreen-500"
                onClick={() => setFetchPaymentMethods(true)}
              >
                Continue
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setShowSubscriptionPlan(!showSubscriptionPlan)}
          className="text-white font-medium w-full flex items-center justify-center gap-2"
        >
          See all subscriptions <BsChevronRight />
        </button>
      </div>

      {showSubscriptionPlan && (
        <SubscriptionPlansDrawer
          show={showSubscriptionPlan}
          setShow={setShowSubscriptionPlan}
          subscriptionPlans={subscriptionPlans as SubscriptionPlans}
          isGetAllPlansPending={isGetAllPlansPending}
          paymentMethods={[]}
          // handleMakePayment={handleMakePayment}
        />
      )}

      <SuccessfulModal
        title="Payment successful"
        isOpen={showSuccessfulModal}
        onClose={() => setShowSuccessfulModal(false)}
        image={succesGif}
      />
    </div>
  );
};

export default Page;
