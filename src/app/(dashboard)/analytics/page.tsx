'use client';
import { motion } from 'framer-motion';

import DashboardHeader from '@/components/Header/DashboardHeader';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import { useAuthStore } from '@/app/store/useAuthStore';
import Image from 'next/image';
import summaryImage from '/public/images/analytics/1.png';
import Button from '@/app/_components/button';
import Link from 'next/link';


export default function Page() {
  const { userData } = useAuthStore();

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

          // budgets={budgets}
          // handleBudgetChange={handleBudgetChange}
          // isLoadingBudgets={isLoadingBudgets}
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
        </div>
      </DashboardWrapper>
    </motion.div>
  );
}
