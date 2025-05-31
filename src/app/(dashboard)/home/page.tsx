'use client';

import { motion } from 'framer-motion';
import { EmptyStateDarkBg } from '@/app/_components/emptyState';
import DashboardHeader from '@/app/_components/Header/DashboardHeader';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import GetStarted from './_components/getStarted';
import Analytics from './_components/analytics';

import homeHeaderIcon from '/public/images/header/home.png';
import emptyBudgetImage from '/public/images/empty-state/budget.png';
import { Skeleton } from '@nextui-org/react';
import BudgetItemHome from '@/app/_components/budgetComponents/budgetItemHome';
import { Budget, BudgetApiResponse } from '@/app/types/budget';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { ApiResponse } from '../../types/index';

const HomePage = () => {
  const { userData } = useAuthStore();

  const { data: budgets, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['recentBudgets'],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetApiResponse<Budget[]>>>('/budgets/?limit=1')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px]"
    >
      <DashboardWrapper>
        <div className="relative w-full max-w-[680px] transition-all duration-300 ease-out min-h-screen">
          <DashboardHeader
            type="home"
            headerTitle="Take the first step to financial freedom."
            headerIcon={homeHeaderIcon}
            headerIconClass="-mr-2 w-[100px]"
            description="Budget & track your expenses easily."
          />

          <div className="space-y-6 py-5">
            <div className="px-4">
              <GetStarted budgetId={budgets?.data.docs[0]?.uid || ''} />
            </div>

            <Analytics />
            <div className="px-6">
              {isLoadingBudgets ? (
                <div className="flex flex-col mb-[90px] gap-6 p-6">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-[100px] w-full rounded-[20px]" />
                  ))}
                </div>
              ) : Array.isArray(budgets?.data.docs) && budgets.data.docs.length > 0 ? (
                budgets.data.docs.map((budget: Budget) => (
                  <BudgetItemHome
                    key={budget.uid}
                    name={budget.name}
                    collaborators={budget.collaborators}
                    percentageIncomeUsed={
                      (budget.totalExpenses / budget.totalIncome) * 100
                    }
                    totalIncome={budget.totalIncome}
                    leftToSpend={budget.totalIncome - budget.totalExpenses}
                    budgetId={budget.uid}
                  />
                ))
              ) : (
                <EmptyStateDarkBg
                  image={emptyBudgetImage}
                  title="No recent budget created yet"
                />
              )}
            </div>
          </div>
        </div>
      </DashboardWrapper>
    </motion.div>
  );
};

export default HomePage;
