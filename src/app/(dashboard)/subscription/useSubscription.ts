import { useAuthStore } from '@/app/store/useAuthStore';
import { SubscriptionPlans } from '@/app/types/subscription';
import api from '@/app/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiResponse } from '@/app/types/index';

export default function useSubscription() {
  const { userData } = useAuthStore();
  const [showSubscriptionPlan, setShowSubscriptionPlan] = useState<boolean>(false);
  const [makePayment, setMakePayment] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  const handleSelectPlan = (option: string) => {
    setSelectedPlan(option);
    setPopoverIsOpen(false);
  };

  const handleMakePayment = () => {
    setMakePayment(true);
  };

  const [showSuccessfulModal, setShowSuccessfulModal] = useState<boolean>(false);

  const { data: getAllPlansData = [], isPending: isGetAllPlansPending } = useQuery({
    queryKey: ['getAllPlans'],
    queryFn: async () =>
      (await api.get<ApiResponse<SubscriptionPlans>>('/subscriptions/plans')).data,
    enabled: !!userData?.token,
  });

  return {
    subscriptionPlans: getAllPlansData?.data ?? {
      monthly: [],
      quarterly: [],
      yearly: [],
    },
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
  };
}
