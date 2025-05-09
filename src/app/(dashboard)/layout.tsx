'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';
import { useBudgetStore } from '../store/useBudgetStore';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../services/AuthenticationService';
import { GetAllBudgetsApi } from '../services/BudgetService';
import Loader from '../_components/loader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { updateUserData } = useAuthStore();
  const { setBudgets, setLoading } = useBudgetStore();

  const {
    data: userProfile = {},
    isLoading: isLoadingProfile,
    status: getUserProfileStatus,
  } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => fetchUserProfile(),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const {
    data: budgets,
    isLoading: isLoadingBudgets,
    status: getBudgetsStatus,
  } = useQuery({
    queryKey: ['getAllBudgets'],
    queryFn: () => GetAllBudgetsApi(Cookies.get('token') || ''),
    enabled: !!Cookies.get('token'),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userProfile.success) {
      updateUserData({
        token: Cookies.get('token') || '',
        profile: userProfile.data,
      });
    }
  }, [getUserProfileStatus, updateUserData, userProfile]);

  useEffect(() => {
    if (budgets) {
      setBudgets(budgets);
    }
  }, [budgets]);

  useEffect(() => {
    setLoading(isLoadingBudgets);
  }, [isLoadingBudgets]);

  return <div className="">{isLoadingProfile ? <Loader /> : children}</div>;
}
