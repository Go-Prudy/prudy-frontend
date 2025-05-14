import { useAuthStore } from '@/app/store/useAuthStore';
import { UserSubscription } from '@/app/types/subscription';
import api from '@/app/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export default function useBillingCycle() {
  const { userData } = useAuthStore();
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState<boolean>(false);
  const [showSuccessfulModal, setShowSuccessfulModal] = useState<boolean>(false);

  //   const { data: billingCycle, isLoading: isGetBillingCycleLoading } = useQuery({
  //     queryKey: ['getBillingCycle'],
  //     queryFn: async () =>
  //       (await api.get<AxiosResponse<UserSubscription>>('/billing/cycle')).data,
  //     enabled: !!userData?.token,
  //     refetchOnWindowFocus: false,
  //   });

  const { data: billingHistory, isLoading: isGetBillingHistoryLoading } = useQuery({
    queryKey: ['getBillingHistory'],
    queryFn: async () =>
      (await api.get<AxiosResponse<string[]>>('/billing/history')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(billingHistory);
  }, [billingHistory]);

  return {
    billingHistory: billingHistory?.data,
    isGetBillingHistoryLoading,
    showCancelSubscriptionModal,
    setShowCancelSubscriptionModal,
    showSuccessfulModal,
    setShowSuccessfulModal,
  };
}
