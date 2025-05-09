'use client';

import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAnalyticsStore } from '@/app/store/useAnalyticsStore';
import { AnalyticsResponse } from '@/app/types/analytics';
import { useBudgetStore } from '@/app/store/useBudgetStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userData } = useAuthStore();
  const { budgets, isLoadingBudgets } = useBudgetStore();

  const { selectedBudgetId, setSelectedBudgetId, setAnalytics, setLoading } =
    useAnalyticsStore();

  const { data: analyticsData, isLoading: isLoadingAnalyticsData } =
    useQuery<AnalyticsResponse>({
      queryKey: ['getAnalyticsById', selectedBudgetId],
      queryFn: async () => (await api.get(`analytics/budgets/${selectedBudgetId}`)).data,
      enabled: !!userData?.token,
    });

  useEffect(() => {
    console.log(analyticsData);
    if (analyticsData) {
      setAnalytics(analyticsData.data);
    }
  }, [analyticsData]);

  useEffect(() => {
    setLoading(isLoadingAnalyticsData || isLoadingBudgets);
  }, [isLoadingAnalyticsData, isLoadingBudgets]);

  useEffect(() => {
    if (budgets.length > 0) {
      setSelectedBudgetId(budgets[0]?.uid);
    }
  }, [budgets]);

  return children;
}
