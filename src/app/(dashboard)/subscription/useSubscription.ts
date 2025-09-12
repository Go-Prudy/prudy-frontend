import { useAuthStore } from '@/app/store/useAuthStore';
import { PaymentMethod, SubscriptionPlans } from '@/app/types/subscription';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';

export default function useSubscription() {
  const queryClient = useQueryClient();
  const { userData } = useAuthStore();
  const navigate = useRouter();

  const [showSubscriptionPlan, setShowSubscriptionPlan] = useState<boolean>(false);
  const [makePayment, setMakePayment] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<keyof SubscriptionPlans>('monthly');
  const [selectedPlanItem, setSelectedPlanItem] = useState<string | null>(null);
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const [showSuccessfulModal, setShowSuccessfulModal] = useState<boolean>(false);
  const [fetchPaymentMethods, setFetchPaymentMethods] = useState<boolean>(false);

  const { data: getAllPlansData, isPending: isGetAllPlansPending } = useQuery({
    queryKey: ['getAllPlans'],
    queryFn: async () =>
      (await api.get<AxiosResponse<SubscriptionPlans>>('/subscriptions/plans')).data,
    enabled: !!userData?.token,
  });

  const {
    data: getPaymentMethodData,
    isLoading: isGetPaymentMethodLoading,
    isSuccess: isGetPaymentMethodSuccess,
    refetch: refetchGetPaymentMethods,
    error: getPaymentMethodError,
    isError: isGetPaymentMethodError,
  } = useQuery({
    queryKey: ['getPaymentMethods'],
    queryFn: async () =>
      (await api.get<AxiosResponse<PaymentMethod[]>>('/billing/payment-methods')).data,
    enabled: !!userData?.token && fetchPaymentMethods,
  });

  const addPaymentMedthodMutation = useMutation({
    mutationFn: () => api.post('/billing/payment-methods/add'),
    onSuccess: (data) => {
      // store selectedPlan in local storage
      const planData = selectedPlanItem
        ? getAllPlansData?.data?.[selectedPlan].find(
            (plan) => plan.uid === selectedPlanItem,
          )
        : getAllPlansData?.data?.[selectedPlan][2];

      localStorage.setItem('your-selected-plan', JSON.stringify(planData));
      setFetchPaymentMethods(false);

      console.log(data.data.data.link);
      window.location.href = data.data.data.link;
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to add payment method.');
    },
  });

  const checkoutSubscriptionMutation = useMutation({
    mutationFn: (data: {
      planId: string;
      paymentFrequency: keyof SubscriptionPlans;
      paymentMethodId: string;
      // accountToKeep?:string[]
    }) => api.post('/subscriptions/checkout', data),
    onSuccess: () => {
      setShowSuccessfulModal(true);
      localStorage.removeItem('your-selected-plan');
      navigate.push('/manage-subscription');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || 'Failed to checkout subscription.');
    },
  });

  const completeAddPaymentMethodMutation = useMutation({
    mutationFn: (transactionId: string) =>
      api.post('/billing/payment-methods', { paymentRef: transactionId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getPaymentMethods'] });

      const selectedPlanData = JSON.parse(
        localStorage.getItem('your-selected-plan') || '{}',
      );

      // Fetch the latest payment methods directly
      const paymentMethodsResponse = await refetchGetPaymentMethods();
      const paymentMethods = paymentMethodsResponse?.data?.data ?? [];

      if (paymentMethods?.length > 0 && selectedPlanData?.uid) {
        checkoutSubscriptionMutation.mutate({
          planId: selectedPlanData.uid,
          paymentFrequency: selectedPlan,
          paymentMethodId: paymentMethods[0].uid,
        });
      } else {
        navigate.push('/manage-subscription');
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response?.data?.message === 'card already added') {
        navigate.push('/manage-subscription');
      } else {
        toast.error(
          error.response?.data.message || 'Failed to complete payment method setup.',
        );
      }
    },
  });

  useEffect(() => {
    // TODO: this affect should only run when a user wants to change their plan
    if (isGetPaymentMethodSuccess) {
      if (getPaymentMethodData?.data.length === 0) {
        addPaymentMedthodMutation.mutate();
      } else {
        const selectedPlanData = JSON.parse(
          localStorage.getItem('your-selected-plan') || '{}',
        );
        if (selectedPlanData?.uid) {
          checkoutSubscriptionMutation.mutate({
            planId: selectedPlanData.uid,
            paymentFrequency: selectedPlan,
            paymentMethodId: getPaymentMethodData?.data[0].uid,
          });
        }
      }
    }
  }, [isGetPaymentMethodSuccess]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const transactionId = urlParams.get('transaction_id');

      if (status === 'successful' && transactionId) {
        console.log('Transaction successful:', transactionId);

        completeAddPaymentMethodMutation.mutate(transactionId);
      }
    }
  }, []);

  const handleSelectPlan = (option: keyof SubscriptionPlans) => {
    setSelectedPlan(option);
    setPopoverIsOpen(false);
  };

  const handleMakePayment = () => {
    setFetchPaymentMethods(true);
  };

  return {
    subscriptionPlans: getAllPlansData?.data,
    isGetAllPlansPending,
    showSubscriptionPlan,
    setShowSubscriptionPlan,
    makePayment,
    setMakePayment,
    selectedPlan,
    selectedPlanItem,
    setSelectedPlanItem,
    popoverIsOpen,
    setPopoverIsOpen,
    handleSelectPlan,
    handleMakePayment,
    showSuccessfulModal,
    setShowSuccessfulModal,
    addPaymentMedthodMutation,
    getPaymentMethodData,
    isGetPaymentMethodLoading,
    fetchPaymentMethods,
    setFetchPaymentMethods,
    completeAddPaymentMethodMutation,
    checkoutSubscriptionMutation,
  };
}
