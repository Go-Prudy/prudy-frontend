import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useEffect, useState } from 'react';

export default function useSelectSyncPeriod({
  selectedBudgetId,
  accountId,
}: {
  selectedBudgetId: string;
  accountId: string;
}) {
  const navigate = useRouter();
  const { userData } = useAuthStore();
  const [enableSync, setEnableSync] = useState<boolean>(false);

  const {
    data: syncAccountTransactions = [],
    isLoading: isSyncing,
    isSuccess,
  } = useQuery({
    queryKey: ['syncAccountTransactions', accountId],
    queryFn: async () => (await api.get(`accounts/${accountId}/transactions/sync`)).data,
    enabled: !!userData?.token && enableSync,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (isSuccess) {
      navigate.push(`/track/${selectedBudgetId}/transactions/${accountId}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSyncing) {
      console.log('===syncing===');
    }
  }, [isSyncing]);

  return { setEnableSync, isSyncing };
}
