'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Link from 'next/link';
import { BsX } from 'react-icons/bs';
import cn from 'classnames';
import PlannedVsActual from './_components/plannedVsActual';
import TopExpenses from './_components/topExpenses';
import WorstPerformingCategory from './_components/worstPerformingCategory';
import BestPerformingCategory from './_components/bestPerformingCategory';
import Subscriptions from './_components/subscriptions';
import SpendingTrends from './_components/spendingTrends';
import IncomeBreakdown from './_components/incomeBreakdown';
import ExpenseBreakdown from './_components/expenseBreakdown';
import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { useAnalyticsStore } from '@/app/store/useAnalyticsStore';
import { Autoplay } from 'swiper/modules';

const Header = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center pb-4 text-white">
    <Link
      href="/analytics"
      className="flex justify-center items-center size-9 bg-[#F7F7F933] rounded-full"
    >
      <BsX size={25} />
    </Link>
    <p>{title}</p>
    <div></div>
  </div>
);

const SummaryWrapper = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) => (
  <div className={cn('p-6 text-center w-full h-full', className)}>
    <Header title="Analytics" />
    <div className="space-y-10 text-white pt-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      {children}
    </div>
  </div>
);

const backgrounds = [
  'bg-planned-vs-actual',
  'bg-top-expenses',
  'bg-best-performing',
  'bg-worst-performing',
  'bg-subscription',
  'bg-spedning-trends',
  'bg-income-breakdown',
  'bg-expenses-breakdown',
];

export default function Page() {
  const { analytics, isLoadingAnalytics } = useAnalyticsStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 8;

  return (
    <div className={cn('relative min-h-screen w-full h-full', backgrounds[activeIndex])}>
      <div className="absolute top-[78px] left-0 right-0 w-[calc(100%-24px)] mx-auto flex justify-center gap-2 z-50 w-full">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 w-full rounded-[2px] bg-transparent transition-all duration-300',
              index <= activeIndex && '!bg-white',
            )}
          />
        ))}
      </div>
      <div className="absolute top-[78px] left-0 right-0 w-[calc(100%-24px)] mx-auto z-50 h-1 w-full rounded-[2px] bg-white/10" />

      <Swiper
        grabCursor
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        autoplay={{
          delay: 15000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay]}
      >
        <SwiperSlide>
          <SummaryWrapper title="Planned vs Actual">
            <PlannedVsActual
              analytics={analytics?.overall ?? null}
              isLoadingAnalytics={isLoadingAnalytics}
            />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Your Top Expenses">
            <TopExpenses
              analytics={analytics?.topExpenses ?? null}
              isLoadingAnalytics={isLoadingAnalytics}
            />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Best Performing Category">
            <BestPerformingCategory
              analytics={analytics?.bestPerformingCategory ?? null}
              isLoadingAnalytics={isLoadingAnalytics}
            />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Worst Performing Category">
            <WorstPerformingCategory
              analytics={analytics?.worstPerformingCategory ?? null}
              isLoadingAnalytics={isLoadingAnalytics}
            />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Subscriptions">
            <Subscriptions />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Spending Trends">
            <SpendingTrends />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Income Breakdown">
            <IncomeBreakdown />
          </SummaryWrapper>
        </SwiperSlide>

        <SwiperSlide>
          <SummaryWrapper title="Expenses Breakdown">
            <ExpenseBreakdown />
          </SummaryWrapper>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
