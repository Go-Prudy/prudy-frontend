'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { ApiResponse } from '@/app/types/index';
import { Settings } from '@/app/types/settings';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { updateSettings } = useAuthStore();

  const {
    data: userSettings = {
      data: {
        countryFlag: '',
        currency: '',
        currencySymbol: '',
        reminderTime: 1,
        reminderTimeUnit: 'PM',
        hasFreeTrial: true,
        isReminderActive: false,
      },
    },
    isLoading,
    status: getUserProfileStatus,
  } = useQuery<ApiResponse<Settings>>({
    queryKey: ['getUserSettings'],
    queryFn: async () => (await api.get<ApiResponse<Settings>>('/settings')).data,
    enabled: true,
    refetchOnWindowFocus: false,
  });

  // TODO: show loader

  useEffect(() => {
    if (getUserProfileStatus === 'success') {
      updateSettings({
        ...userSettings.data,
      });
    }
  }, [getUserProfileStatus]);

  return children;
}
