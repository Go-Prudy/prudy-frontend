'use client';

import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/app/store/useAnalyticsStore';
import { AnalyticsResponse } from '@/app/types/analytics';
import { useBudgetStore } from '@/app/store/useBudgetStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userData } = useAuthStore();
  const { budgets, isLoadingBudgets } = useBudgetStore();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { selectedBudgetId, setSelectedBudgetId, setAnalytics, setLoading } =
    useAnalyticsStore();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['getPlannedVsActual', selectedBudgetId],
        queryFn: async () =>
          (await api.get(`analytics/budgets/${selectedBudgetId}/spending-summary`)).data,
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getTopExpenses', selectedBudgetId],
        queryFn: async () =>
          (await api.get(`analytics/budgets/${selectedBudgetId}/top-expenses`)).data,
        enabled: !!userData?.token,
      },
      {
        queryKey: ['getCategoryPerformance', selectedBudgetId],
        queryFn: async () =>
          (await api.get(`analytics/budgets/${selectedBudgetId}/category-performance`))
            .data,
        enabled: !!userData?.token,
      },
      {
        queryKey: ['getSubscription', selectedBudgetId],
        queryFn: async () =>
          (await api.get(`analytics/budgets/${selectedBudgetId}/subscriptions`)).data,
        enabled: !!userData?.token,
      },
      {
        queryKey: ['getExpenseBreakdown', selectedBudgetId],
        queryFn: async () =>
          (await api.get(`analytics/budgets/${selectedBudgetId}/expense-breakdown`)).data,
        enabled: !!userData?.token,
      },
    ],
  });

  const [
    plannedVsActualQuery,
    topExpensesQuery,
    categoryPerformanceQuery,
    subscriptionQuery,
    expenseBreakdownQuery,
  ] = queries;

  const allQueriesLoaded = queries.every((query) => !query.isLoading);
  const anyQueryError = queries.some((query) => query.isError);

  const plannedVsActualQueryData = plannedVsActualQuery.data;
  const topExpensesQueryData = topExpensesQuery.data;
  const categoryPerformanceQueryData = categoryPerformanceQuery.data;
  const subscriptionQueryData = subscriptionQuery.data;
  const expenseBreakdownQueryData = expenseBreakdownQuery.data;

  useEffect(() => {
    setLoading(!allQueriesLoaded || isLoadingBudgets);

    // Update analytics only when all queries are loaded and have data
    if (allQueriesLoaded && !anyQueryError) {
      console.log(
        plannedVsActualQueryData?.data,
        topExpensesQueryData?.data,
        categoryPerformanceQueryData?.data,
        subscriptionQueryData?.data,
        expenseBreakdownQueryData?.data,
      );
      setAnalytics({
        overall: plannedVsActualQueryData?.data ?? {},
        topExpenses: topExpensesQueryData?.data ?? {},
        bestPerformingCategory: categoryPerformanceQueryData?.data?.best ?? {},
        worstPerformingCategory: categoryPerformanceQueryData?.data?.worst ?? {},
        subscription: subscriptionQueryData?.data ?? {},
        expenseBreakdown: expenseBreakdownQueryData?.data ?? {},
      });
    }
  }, [allQueriesLoaded, isLoadingBudgets, anyQueryError]);

  useEffect(() => {
    if (budgets.length > 0) {
      setSelectedBudgetId(budgets[0]?.uid);
    }
  }, [budgets]);

  return children;
}
