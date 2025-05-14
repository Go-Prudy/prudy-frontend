import { useAuthStore } from '@/app/store/useAuthStore';
import { SubscriptionPlans } from '@/app/types/subscription';
import api from '@/app/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useSubscriptionPlans({
  subscriptionPlans,
}: {
  subscriptionPlans?: SubscriptionPlans;
}) {
  const { userData } = useAuthStore();

  const [plans, setPlans] = useState<SubscriptionPlans>(
    subscriptionPlans ?? {
      monthly: [],
      yearly: [],
      quaterly: [],
    },
  );

  const { data: getAllPlansData, isLoading: isGetAllPlansLoading } = useQuery({
    queryKey: ['getAllPlans'],
    queryFn: async () =>
      (await api.get<AxiosResponse<SubscriptionPlans>>('/subscriptions/plans')).data,
    enabled: !!userData?.token || !!subscriptionPlans,
  });

  useEffect(() => {
    if (getAllPlansData) {
      setPlans(getAllPlansData?.data);
    }
  }, [getAllPlansData]);

  return {
    plans,
    isGetAllPlansLoading,
  };
}
