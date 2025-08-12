'use client';

import { createContext, useContext } from 'react';
import { DateValue } from '@/app/types/index';

interface CalendarContextType {
  dateRange: DateValue;
  setDateRange: (value: DateValue) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  calendarRef: React.RefObject<HTMLDivElement>;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};