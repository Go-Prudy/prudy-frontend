import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import Button from '../../button';
import { planOptions } from '@/app/utils/constants';
import Loader from '../../loader';
import { RadioGroup } from '@nextui-org/react';
import {
  PaymentMethod,
  SubscriptionPlan,
  SubscriptionPlans,
} from '@/app/types/subscription';
import useSubscriptionPlans from './useSubscriptionPlans';
import SubscriptionRadio from '../../subscriptionRadio';
import useSubscription from '@/app/(dashboard)/subscription/useSubscription';
import { useEffect, useState } from 'react';
import LoadingModal from '../../modals/LoadingModal';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  isGetAllPlansPending?: boolean;
  subscriptionPlans?: SubscriptionPlans;
  paymentMethods: PaymentMethod[];
  // handleMakePayment: () => void;
}

export default function SubscriptionPlansDrawer({
  setShow,
  show,
  isGetAllPlansPending,
  subscriptionPlans,
  paymentMethods,
  // handleMakePayment,
}: Props) {
  const { plans, isGetAllPlansLoading } = useSubscriptionPlans({
    subscriptionPlans,
  });

  const {
    selectedPlan,
    selectedPlanItem,
    setSelectedPlanItem,
    handleSelectPlan,
    showSuccessfulModal,
    setShowSuccessfulModal,
    fetchPaymentMethods,
    setFetchPaymentMethods,
    addPaymentMedthodMutation,
    isGetPaymentMethodLoading,
    checkoutSubscriptionMutation,
    completeAddPaymentMethodMutation,
  } = useSubscription();

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button
            onClick={() => {
              if (selectedPlanItem) {
                // TODO:
                // NOTE: If user is downgrading plan, and the user has more than the number of accounts for the plan, then,
                // show the downgrade modal

                const defaultPaymentMethod = paymentMethods.find(
                  (method) => method?.isDefault,
                );

                if (defaultPaymentMethod) {
                  const planData = plans?.[selectedPlan].find(
                    (plan) => plan.uid === selectedPlanItem,
                  );

                  checkoutSubscriptionMutation.mutateAsync({
                    planPricingId: planData?.planPricingId || '',
                    paymentMethodId: defaultPaymentMethod?.uid || '',
                    // accountsToKeep: [],
                  });

                  localStorage.setItem('your-selected-plan', JSON.stringify(planData));
                } else {
                  setFetchPaymentMethods(true);
                }
              }
            }}
            type="submit"
            className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA]  flex items-center justify-center gap-[8px] font-[500]"
            disabled={!selectedPlanItem}
          >
            Subscribe
          </Button>
        }
        label="Subscription plans"
        back={false}
        show={show}
        close={true}
        onClose={() => {
          setShow(false);
          setFetchPaymentMethods(false);
        }}
      >
        <div className="space-y-4">
          <div className="p-1 bg-gray-100 rounded-xl flex justify-center w-fit mx-auto">
            {planOptions.map((option: string) => (
              <button
                onClick={() => handleSelectPlan(option as keyof SubscriptionPlans)}
                className={`${option.toLowerCase() === selectedPlan.toLowerCase() && 'rounded-xl text-white bg-lemonGreen-600 '} p-2 text-sm font-medium capitalize`}
                key={option}
              >
                {option}
              </button>
            ))}
          </div>
          {isGetAllPlansPending || isGetAllPlansLoading ? (
            <Loader />
          ) : (
            <RadioGroup
              orientation="vertical"
              className="space-y-4"
              color="success"
              value={selectedPlanItem}
              onValueChange={(value) => setSelectedPlanItem(value)}
            >
              <div className="mb-[10px] flex flex-col w-full gap-[16px]">
                {planOptions?.map(
                  (period) =>
                    selectedPlan?.toLowerCase() === period &&
                    plans?.[selectedPlan]
                      ?.slice()
                      .reverse()
                      .map((plan: SubscriptionPlan) => (
                        <SubscriptionRadio
                          key={plan?.uid}
                          header1={`${plan?.name} ${plan?.name === 'prudy lite' ? '💫' : plan?.name === 'money master' ? '💪🏽' : '🚀'}`}
                          header2={` ${plan?.basePrice === 0 ? 'Free' : (plan.currency ?? '') + plan?.basePrice.toLocaleString()}`}
                          header3={
                            period === 'monthly'
                              ? plan?.weeklyAmount && plan.weeklyAmount > 0
                                ? `${plan.currency} ${plan.weeklyAmount.toLocaleString()}/week`
                                : null
                              : plan?.monthlyAmount && plan.monthlyAmount > 0
                                ? `${plan.currency} ${plan?.monthlyAmount.toLocaleString()}/month`
                                : null
                          }
                          className="flex w-full justify-between"
                          value={plan?.uid}
                          label={plan?.discount ? `save ${plan?.discount}%` : null}
                        >
                          <ul className="flex flex-col gap-[8px] pl-[1.5rem] mt-[5px] list-disc">
                            {plan?.benefits?.map((benefit: string, index: number) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </SubscriptionRadio>
                      )),
                )}
              </div>
            </RadioGroup>
          )}
        </div>
      </BottomDrawer>

      <LoadingModal
        isOpen={
          addPaymentMedthodMutation.isPending ||
          isGetPaymentMethodLoading ||
          completeAddPaymentMethodMutation.isPending ||
          checkoutSubscriptionMutation.isPending
        }
        onClose={() => {}}
        text="Please wait..."
      />
    </motion.div>
  );
}
