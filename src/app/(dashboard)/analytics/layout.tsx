/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { useAnalyticsStore } from '@/app/store/useAnalyticsStore';
import { AnalyticsResponse } from '@/app/types/analytics';
import { useBudgetStore } from '@/app/store/useBudgetStore';
import { DateValue } from '@/app/types/index';
import { CalendarContext } from './CalendarContext';
import { getDateParams } from '@/app/utils/functions';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userData } = useAuthStore();
  const { budgets, isLoadingBudgets } = useBudgetStore();

  const [dateRange, setDateRange] = useState<DateValue>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { selectedBudgetId, setSelectedBudgetId, setAnalytics, setLoading } =
    useAnalyticsStore();

  const { startDate, endDate, hasDateRange } = getDateParams(dateRange);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['getPlannedVsActual', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/spending-summary?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/spending-summary`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getTopExpenses', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/top-expenses?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/top-expenses`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getCategoryPerformance', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/category-performance?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/category-performance`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getSubscription', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/subscriptions?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/subscriptions`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getWeeklySpending', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/weekly-spending?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/weekly-spending`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getIncomeBreakdown', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/income-breakdown?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/income-breakdown`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
      {
        queryKey: ['getExpenseBreakdown', selectedBudgetId, startDate, endDate],
        queryFn: async () => {
          const url = hasDateRange
            ? `analytics/budgets/${selectedBudgetId}/expense-breakdown?startDate=${startDate}&endDate=${endDate}`
            : `analytics/budgets/${selectedBudgetId}/expense-breakdown`;
          return (await api.get(url)).data;
        },
        enabled: !!userData?.token && !!selectedBudgetId,
      },
    ],
  });

  const [
    plannedVsActualQuery,
    topExpensesQuery,
    categoryPerformanceQuery,
    subscriptionQuery,
    weeklySpendingQuery,
    incomeBreakdownQuery,

    expenseBreakdownQuery,
  ] = queries;

  const allQueriesLoaded = queries.every((query) => !query.isLoading);
  const anyQueryError = queries.some((query) => query.isError);

  const plannedVsActualQueryData = plannedVsActualQuery.data;
  const topExpensesQueryData = topExpensesQuery.data;
  const categoryPerformanceQueryData = categoryPerformanceQuery.data;
  const subscriptionQueryData = subscriptionQuery.data;
  const incomeBreakdownQueryData = incomeBreakdownQuery.data;
  const expenseBreakdownQueryData = expenseBreakdownQuery.data;
  const weeklySpendingQueryData = weeklySpendingQuery.data;

  useEffect(() => {
    setLoading(!allQueriesLoaded || isLoadingBudgets);

    // Update analytics only when all queries are loaded and have data
    if (allQueriesLoaded && !anyQueryError) {
      setAnalytics({
        overall: plannedVsActualQueryData?.data ?? {},
        topExpenses: topExpensesQueryData?.data ?? {},
        bestPerformingCategory: categoryPerformanceQueryData?.data?.best ?? {},
        worstPerformingCategory: categoryPerformanceQueryData?.data?.worst ?? {},
        subscription: subscriptionQueryData?.data ?? {},
        spendingTrends: weeklySpendingQueryData?.data ?? {},
        expenseBreakdown: expenseBreakdownQueryData?.data ?? {},
        incomeBreakdown: incomeBreakdownQueryData?.data ?? {},
      });
    }
  }, [allQueriesLoaded, isLoadingBudgets, anyQueryError]);

  useEffect(() => {
    if (budgets.length > 0) {
      setSelectedBudgetId(budgets[0]?.uid);
    }
  }, [budgets]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <CalendarContext.Provider
      value={{
        dateRange,
        setDateRange,
        showCalendar,
        setShowCalendar,
        calendarRef,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
