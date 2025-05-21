'use client';
import Image from 'next/image';
import { BsChevronRight, BsPerson } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getUserSubscription } from '@/app/services/SubscriptionService';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import { motion } from 'framer-motion';
import DashboardHeader from '@/app/_components/Header/DashboardHeader';
import userAvatarIcon from '/public/images/icons/avatar.svg';
import { Icons } from '@/app/icons';
import { useAuthStore } from '@/app/store/useAuthStore';
import RewardValues from './_components/rewardValues';
import { useEffect } from 'react';
import api from '@/app/utils/axiosInstance';
import { AxiosResponse } from 'axios';
import { UserSubscription } from '@/app/types/subscription';
import { user } from '@nextui-org/react';

const profileItems = [
  {
    category: 'TOOLS',
    items: [
      {
        name: 'Budget Categories',
        icon: Icons.category,
        link: '/profile/budget-categories',
      },
      { name: 'Reminders', icon: Icons.toggle, link: '/reminders' },
      { name: 'Subscription', icon: Icons.crown, link: '/subscription' },
      { name: 'FAQs', icon: Icons.messageQuestion, link: '/faqs' },
      { name: 'Reports', icon: Icons.document, link: '/reports' },
      { name: 'Referrals', icon: Icons.messageQuestion, link: '/referrals' },
    ],
  },
  {
    category: 'SETTINGS',
    items: [
      {
        name: 'Passcode Settings',
        icon: Icons.keySquare,
        link: '/settings/change-passcode',
      },
      { name: 'Currency & Data', icon: Icons.moneyChange, link: '/settings/currency' },
    ],
  },
];

export default function Page() {
  const navigate = useRouter();


  // const logOutMutation = useMutation({
  //   mutationFn: async () => LogOut(),
  //   onSuccess: (data) => {
  //     console.log('Logout successful', data);
  //   },
  //   onError: (error) => {
  //     console.error('Error during logout:', error);
  //   },
  // });

  const { userData } = useAuthStore();

  const { data: userSubscription, isLoading: isGetUserSubscriptionLoading } = useQuery({
    queryKey: ['getuserSubscription'],
    queryFn: async () =>
      (await api.get<AxiosResponse<UserSubscription>>('subscriptions/me')).data,
    enabled: !!userData?.token,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(userSubscription?.data);
  }, [userSubscription]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px] pb-8"
    >
      <DashboardWrapper>
        <DashboardHeader type="profile" title="Profile" headerTitleClass="text-[28px]">
          <div className="w-full space-y-4">
            <div
              onClick={() => navigate.push('/profile/user')}
              className=" cursor-pointer p-4 flex justify-between items-center w-full bg-white rounded-2xl shadow-[8px_8px_8px_0px_#1847000D]"
            >
              <div className="flex items-center gap-1">
                <Image
                  src={userData?.profile?.profilePhotoUrl || userAvatarIcon}
                  alt="profile"
                  width={48}
                  height={48}
                  className="size-12 rounded-xl object-cover"
                />
                <div className="gap-1 justify-start items-start">
                  <h1 className="font-medium text-black-970 text-lg">
                    {userData?.profile.firstName
                      ? `${userData?.profile.firstName} ${userData?.profile.lastName}`
                      : 'User'}
                  </h1>
                  <div className="rounded-xl bg-[#3B9708] text-white text-xs flex items-center gap-1 w-fit px-1.5 py-1">
                    {Icons.crown}
                    <span>{userData?.profile.hasFreeTrial ? 'Free' : 'Premium'}</span>
                  </div>
                </div>
              </div>
              <BsChevronRight size={24} />
            </div>

            <div
              onClick={() => navigate.push('/profile/rewards')}
              className=" cursor-pointer bg-profile-stats rounded-t-2xl px-4 py-2 text-white"
            >
              <div>
                <p>Your Stats</p>
                <RewardValues points={20} longestStreak={20} currentStreak={20} />
              </div>
            </div>
          </div>
        </DashboardHeader>
        <div className="p-6 space-y-4">
          {profileItems.map((categories) => (
            <div key={categories.category} className="space-y-4">
              <p className="text-gray-600 text-sm">{categories.category}</p>
              <div className="grid grid-cols-2 gap-4">
                {categories.items.map((item) => (
                  <button
                    onClick={() => {
                      // if returning user, show manage subscription page
                      if (item.name === 'Subscription') {
                        if (userSubscription?.data.isActive) {
                          navigate.push('manage-subscription');
                        }
                      }
                      // if (userData?.profile.hasFreeTrial) {
                      //   navigate.push('manage-subscription');
                      // }
                      else {
                        navigate.push(item.link);
                      }
                    }}
                    key={item.name}
                    className="block p-4 bg-gray-100 border border-gray-200 rounded-[20px] space-y-2 text-gray-600"
                  >
                    <span className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span className="inline-block text-left w-full text-[13px]">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardWrapper>
    </motion.div>
  );
}
