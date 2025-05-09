'use client';
import { motion } from 'framer-motion';

import DashboardHeader from '@/components/Header/DashboardHeader';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import Image from 'next/image';
import summaryImage from '/public/images/analytics/1.png';
import Button from '@/app/_components/button';
import Link from 'next/link';
import { useBudgetStore } from '@/app/store/useBudgetStore';
import { useAnalyticsStore } from '@/app/store/useAnalyticsStore';

const filters = [
  {
    name: 'Planned budget vs Actual',
    link: '',
  },
  {
    name: 'Top Expenses',
    link: '',
  },
  {
    name: 'Best performing category',
    link: '',
  },
  {
    name: 'Subscriptions',
    link: '',
  },
  {
    name: 'Worst performing category',
    link: '',
  },
  {
    name: 'Spending trends',
    link: '',
  },
  {
    name: 'Left to spend',
    link: '',
  },
  {
    name: 'Overspending',
    link: '',
  },
  {
    name: 'Income to Expense ratio',
    link: '',
  },
];

export default function Page() {
  const { budgets, isLoadingBudgets } = useBudgetStore();
  const { setSelectedBudgetId } = useAnalyticsStore();

  const handleBudgetChange = (selectedUid: string) => {
    const budget = budgets.find((budget) => budget.uid === selectedUid);
    setSelectedBudgetId(budget?.uid || '');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px]"
    >
      <DashboardWrapper>
        <DashboardHeader
          type="dashboard"
          title="Analytics"
          budgets={budgets}
          handleBudgetChange={handleBudgetChange}
          isLoadingBudgets={isLoadingBudgets}
        />
        <div className="px-6 py-8 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 -top-2 bg-[#F89446] rounded-3xl w-[92%] mx-auto" />
            <div className="absolute inset-0 -top-1 bg-[#11CDEF] rounded-3xl w-[96%] mx-auto" />
            <div
              style={{
                background:
                  'radial-gradient(163.31% 501.24% at 36.22% 30.66%, #7544D4 0%, #C09FFF 100%)',
              }}
              className="py-5 px-6 rounded-[32px] text-white relative z-10"
            >
              <div className="space-y-4 text-white">
                <h3 className="text-[32px] leading-9 font-bold">
                  What was your <br /> money up to last week?
                </h3>
                <p className="">See what your spending patterns looked like last week</p>
                <Link className="inline-block w-full" href="/analytics/summary">
                  <Button className="text-black-900 bg-white !font-bold">
                    Open weekly summary
                  </Button>
                </Link>
              </div>
              <Image
                className="mx-auto -mt-5"
                src={summaryImage}
                alt=""
                width={210}
                height={210}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter, index) => (
              <div
                key={filter.name}
                className="bg-gray-100 border border-gray-200 rounded-xl py-1.5 px-3 text-sm font-medium text-gray-800"
              >
                {filter.name}
              </div>
            ))}
          </div>
        </div>
      </DashboardWrapper>
    </motion.div>
  );
}
