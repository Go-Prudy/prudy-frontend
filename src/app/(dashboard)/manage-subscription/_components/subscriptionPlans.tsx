import React, { ReactNode } from 'react';
import { BsPlus, BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import useManageSubscription from '../useManageSubscription';
import { PaymentMethod } from '@/app/types/subscription';
import visa from '/public/images/visa.png';
import mastercard from '/public/images/mastercard.png';
import Image from 'next/image';
import cn from 'classnames';
import Loader from '@/app/_components/loader';
import AppPopover from '@/app/_components/popover';
import { CircularProgress, RadioGroup } from '@nextui-org/react';
import CustomRadio from '@/app/_components/radio';
import SubscriptionRadio from '@/app/_components/subscriptionRadio';
import LoadingModal from '@/app/_components/modals/LoadingModal';
import SubscriptionPlansDrawer from '@/app/_components/drawers/SubscriptionPlans';

type Props = {};

const paymentMethodActions = [
  {
    name: 'Make default',
    key: 'default',
  },
  {
    name: 'Delete card',
    key: 'delete',
  },
];

const SubscriptionPlansHeader = ({
  title,
  buttonText,
  onClick,
  icon,
  isLoading,
}: {
  title: string;
  buttonText: string;
  onClick: () => void;
  icon?: ReactNode;
  isLoading?: boolean;
}) => (
  <div className="flex items-center justify-between gap-2">
    <p>{title}</p>
    <button
      onClick={onClick}
      className="flex items-center p-2 text-sm text-gray-600 border border-gray-200 rounded-2xl"
    >
      {isLoading ? (
        <CircularProgress size="sm" />
      ) : (
        <>
          {icon} {buttonText}
        </>
      )}
    </button>
  </div>
);

export default function SubscriptionPlans({}: Props) {
  const {
    showSubscriptionPlan,
    setShowSubscriptionPlan,
    paymentMethods,
    isGetPaymentMethodLoading,
    addPaymentMedthodMutation,
    markCardAsDefaultMutation,
    deletePaymentMedthodMutation,
    userSubscription,
    isGetUserSubscriptionLoading,
  } = useManageSubscription();
  return (
    <div className="space-y-4 px-6">
      <SubscriptionPlansHeader
        title="Subscription plans"
        buttonText="Change plan"
        onClick={() => setShowSubscriptionPlan(true)}
      />
      {isGetUserSubscriptionLoading ? (
        <Loader />
      ) : (
        <RadioGroup defaultChecked>
          <SubscriptionRadio
            isDefaultSelected
            isCurrentPlan
            header1={`${userSubscription?.plan?.name} ${userSubscription?.plan?.name === 'prudy lite' ? '💫' : userSubscription?.plan?.name === 'money master' ? '💪🏽' : '🚀'}`}
            header2={` ${userSubscription?.plan?.basePrice === 0 ? 'Free' : '₦' + userSubscription?.plan?.basePrice.toLocaleString()}`}
            className="flex w-full justify-between"
            value={userSubscription?.plan?.basePrice}
          >
            <ul className="flex flex-col gap-[8px] pl-[1.5rem] mt-[5px] list-disc">
              {userSubscription?.plan?.benefits?.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </SubscriptionRadio>
        </RadioGroup>
      )}
      <SubscriptionPlansHeader
        title="Payment methods"
        buttonText="Add new card"
        onClick={() => addPaymentMedthodMutation.mutate()}
        isLoading={addPaymentMedthodMutation.isPending}
        icon={<BsPlus size={16} />}
      />
      {isGetPaymentMethodLoading ? (
        <Loader />
      ) : Array.isArray(paymentMethods) && paymentMethods.length > 0 ? (
        paymentMethods.map((item: PaymentMethod) => (
          <div
            key={item.uid}
            className={cn(
              'p-4 flex items-center justify-between rounded-2xl border',
              item.isDefault
                ? 'border-lemonGreen-900 bg-lemonGreen-50'
                : 'border-gray-200 bg-white',
            )}
          >
            <div className="flex items-start gap-2">
              <Image
                src={item.type === 'VISA' ? visa : mastercard}
                alt=""
                width={40}
                height={35}
              />
              <div className="space-y-1">
                <p className="font-medium text-sm text-black-800">
                  **** **** **** {item.lastFourDigits}
                </p>
                <p className="text-xs text-gray-600">Expiry {item.expiry}</p>
              </div>
              {/* default */}
              {item.isDefault && (
                <p className="px-2 py-0.5 bg-white rounded-xl text-[10px] text-lemonGreen-900 font-medium">
                  Default
                </p>
              )}
            </div>
            <AppPopover
              trigger={
                <button onClick={(e) => e.stopPropagation()}>
                  <BsThreeDots />
                </button>
              }
              placement="bottom-end"
            >
              {paymentMethodActions.map((action) => (
                <button
                  onClick={() => {
                    if (action.key === 'default') {
                      markCardAsDefaultMutation.mutate(item.uid);
                    } else if (action.key === 'delete') {
                      deletePaymentMedthodMutation.mutate(item.uid);
                    }
                  }}
                  key={action.key}
                >
                  {action.name}
                </button>
              ))}
            </AppPopover>
          </div>
        ))
      ) : (
        <p className="text-center">You don&#39;t have any payment method saved</p>
      )}

      <LoadingModal
        isOpen={
          markCardAsDefaultMutation.isPending || deletePaymentMedthodMutation.isPending
        }
        onClose={() => {}}
        text="Please wait..."
      />
      {showSubscriptionPlan && (
        <SubscriptionPlansDrawer
          show={showSubscriptionPlan}
          setShow={setShowSubscriptionPlan}
        />
      )}
    </div>
  );
}
