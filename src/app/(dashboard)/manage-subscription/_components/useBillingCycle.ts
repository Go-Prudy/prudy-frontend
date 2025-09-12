import { useAuthStore } from '@/app/store/useAuthStore';
import {
  BillingHistory,
  SubscriptionPlans,
  UserSubscription,
} from '@/app/types/subscription';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useBillingCycle() {
  const queryClient = useQueryClient();
  const navigate = useRouter();

  const { userData } = useAuthStore();
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState<boolean>(false);
  const [showSuccessfulModal, setShowSuccessfulModal] = useState<boolean>(false);
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState<string>('');

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
      (await api.get<AxiosResponse<BillingHistory[]>>('/billing/history')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: false,
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: (data: {
      planId: string;
      paymentFrequency: keyof SubscriptionPlans;
      paymentMethodId: string;
    }) => api.post('/subscriptions/checkout', data),
    onSuccess: (data) => {
      console.log(data);

      setCancelSuccessMessage(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['getuserSubscription'] });
      setShowSuccessfulModal(true);
      setShowCancelSubscriptionModal(false);
      navigate.push('/manage-subscription');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || 'Failed to cancel subscription.');
    },
  });

  return {
    billingHistory: billingHistory?.data,
    isGetBillingHistoryLoading,
    showCancelSubscriptionModal,
    setShowCancelSubscriptionModal,
    showSuccessfulModal,
    setShowSuccessfulModal,
    cancelSubscriptionMutation,
    cancelSuccessMessage,
  };
}
