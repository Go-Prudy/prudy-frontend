import { useAuthStore } from '@/app/store/useAuthStore';
import { PaymentMethod, UserSubscription } from '@/app/types/subscription';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiResponse } from '@/app/types/index';
import toast from 'react-hot-toast';
import { AxiosError, AxiosResponse } from 'axios';

export default function useManageSubscription() {
  const { userData } = useAuthStore();
  const queryClient = useQueryClient();
  const [showSubscriptionPlan, setShowSubscriptionPlan] = useState<boolean>(false);

  const { data: userSubscription, isLoading: isGetUserSubscriptionLoading } = useQuery({
    queryKey: ['getUserSubscription'],
    queryFn: async () =>
      (await api.get<AxiosResponse<UserSubscription>>('subscriptions/me')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: false,
  });

  const { data: getPaymentMethodData, isPending: isGetPaymentMethodLoading } = useQuery({
    queryKey: ['getPaymentMethods'],
    queryFn: async () =>
      (await api.get<ApiResponse<PaymentMethod>>('/billing/payment-methods')).data,
    enabled: !!userData?.token,
  });

  const addPaymentMedthodMutation = useMutation({
    mutationFn: () => api.post('/billing/payment-methods/add'),
    onSuccess: (data) => {
      console.log(data.data.data.link);
      window.location.href = data.data.data.link;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      toast.error(error.response?.data.message || 'Failed to add payment method.');
    },
  });

  const markCardAsDefaultMutation = useMutation({
    mutationFn: (cardId: string) =>
      api.patch(`billing/payment-methods/${cardId}/set-default`),
    onSuccess: async (data) => {
      console.log(data.data.data);
      await queryClient.invalidateQueries({ queryKey: ['getPaymentMethods'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      toast.error(error.response?.data.message || 'Failed to mark as default.');
    },
  });

  const deletePaymentMedthodMutation = useMutation({
    mutationFn: (cardId: string) => api.delete(`billing/payment-methods/${cardId}`),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getPaymentMethods'] });
      console.log(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      toast.error(error.response?.data.message || 'Failed to delete payment method.');
    },
  });

  return {
    paymentMethods: getPaymentMethodData?.data ?? [],
    isGetPaymentMethodLoading,
    userSubscription: userSubscription?.data,
    isGetUserSubscriptionLoading,
    addPaymentMedthodMutation,
    markCardAsDefaultMutation,
    deletePaymentMedthodMutation,
    showSubscriptionPlan,
    setShowSubscriptionPlan,
  };
}
