'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../services/AuthenticationService';
import Loader from '../_components/loader';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { updateUserData } = useAuthStore();

  const {
    data: userProfile = {},
    isLoading,
    status: getUserProfileStatus,
  } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => fetchUserProfile(),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userProfile.success) {
      updateUserData({
        token: Cookies.get('token') || '',
        profile: userProfile.data,
      });
    }
  }, [getUserProfileStatus]);

  return <div className="">{isLoading ? <Loader /> : children}</div>;
}
