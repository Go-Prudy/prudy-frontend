'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Link from 'next/link';
import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';
import cn from 'classnames';
import PlannedVsActual from './_components/plannedVsActual';
import TopExpenses from './_components/topExpenses';
import WorstPerformingCategory from './_components/worstPerformingCategory';
import BestPerformingCategory from './_components/bestPerformingCategory';
import Subscriptions from './_components/subscriptions';
import SpendingTrends from './_components/spendingTrends';
import IncomeBreakdown from './_components/incomeBreakdown';
import ExpenseBreakdown from './_components/expenseBreakdown';
import { useAnalyticsStore } from '@/app/store/useAnalyticsStore';
import { Autoplay } from 'swiper/modules';
import Loader from '@/app/_components/loader';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DateValue } from '@/app/types/index';
import { useCalendar } from '../CalendarContext';
import { analyticPagebackgrounds } from '@/app/utils/constants';
import { formatDateRange } from '@/app/utils/functions';

const Header = ({ title }: { title: string }) => {
  const { dateRange, setDateRange, showCalendar, setShowCalendar } = useCalendar();

  return (
    <div className="flex justify-between items-center pb-4 text-white relative">
      <Link
        href="/analytics"
        className="flex justify-center items-center size-9 bg-[#F7F7F933] rounded-full"
      >
        <BsX size={25} />
      </Link>
      <p>{title}</p>

      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="text-xs bg-[#F7F7F933] px-3 py-1 rounded-full"
      >
        {formatDateRange(dateRange)}
      </button>
    </div>
  );
};

const SummaryWrapper = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) => {
  return (
    <div className={cn('p-6 text-center w-full h-full', className)}>
      <Header title="Analytics" />
      <div className="space-y-10 text-white pt-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default function Page() {
  const { analytics, isLoadingAnalytics } = useAnalyticsStore();
  const { dateRange, setDateRange, showCalendar, setShowCalendar, calendarRef } =
    useCalendar();
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 8;

  return (
    <div
      className={cn(
        'relative min-h-screen w-full h-full',
        analyticPagebackgrounds[activeIndex],
      )}
    >
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

      {isLoadingAnalytics ? (
        <Loader className="pt-5" />
      ) : (
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
              <PlannedVsActual analytics={analytics?.overall ?? null} />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Your Top Expenses">
              <TopExpenses analytics={analytics?.topExpenses ?? null} />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Best Performing Category">
              <BestPerformingCategory
                analytics={analytics?.bestPerformingCategory ?? null}
              />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Worst Performing Category">
              <WorstPerformingCategory
                analytics={analytics?.worstPerformingCategory ?? null}
              />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Subscriptions">
              <Subscriptions analytics={analytics?.subscription ?? null} />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Spending Trends">
              <SpendingTrends analytics={analytics?.spendingTrends ?? null} />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Income Breakdown">
              <IncomeBreakdown analytics={analytics?.incomeBreakdown ?? null} />
            </SummaryWrapper>
          </SwiperSlide>

          <SwiperSlide>
            <SummaryWrapper title="Expenses Breakdown">
              <ExpenseBreakdown analytics={analytics?.expenseBreakdown ?? null} />
            </SummaryWrapper>
          </SwiperSlide>
        </Swiper>
      )}

      {showCalendar && (
        <div className="fixed top-0 left-0 h-full z-50 w-full">
          <div
            ref={calendarRef}
            className="absolute top-[60px] right-2 z-50 max-w-[300px]"
          >
            <Calendar
              onChange={(newValue) => {
                if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
                  const start = newValue[0];
                  const end = newValue[1];
                  const diffTime = Math.abs(end.getTime() - start.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  if (diffDays <= 6) {
                    setDateRange(newValue);
                  } else {
                    const limitedEnd = new Date(start);
                    limitedEnd.setDate(start.getDate() + 6);
                    setDateRange([start, limitedEnd]);
                  }
                } else {
                  setDateRange(newValue);
                }
              }}
              value={dateRange}
              selectRange
              prev2Label={null}
              next2Label={null}
              maxDate={new Date()}
              nextLabel={<BsChevronRight />}
              prevLabel={<BsChevronLeft />}
              className="!w-full !bg-white !border !border-gray-200 !rounded-2xl !p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
