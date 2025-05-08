'use client';
import Image from 'next/image';
import { BsChevronRight, BsPerson } from 'react-icons/bs';
import logout from '/public/images/logout.png';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthentication } from '@/app/store/AuthStore';
import { IAuthenticatedUser } from '@/app/Types';
import { useEffect, useState, type JSX } from 'react';
import Link from 'next/link';
import { getUserSubscription } from '@/app/services/SubscriptionService';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/Header/DashboardHeader';
import userAvatarIcon from '/public/images/icons/avatar.svg';
import { Icons } from '@/app/icons';
import { useAuthStore } from '@/app/store/useAuthStore';

const profileItems = [
  {
    category: 'TOOLS',
    items: [
      { name: 'Budget Categories', icon: Icons.category, link: '/profile/categories' },
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
  type ToolItem = {
    title: string;
    icon: JSX.Element; // Assuming you want to add an icon component here
    category: string;
    link: string; // Link property added
  };

  const navigation = useRouter();

  const { LogOut } = useAuthentication();

  const logOutMutation = useMutation({
    mutationFn: async () => LogOut(),
    onSuccess: (data) => {
      console.log('Logout successful', data);
    },
    onError: (error) => {
      console.error('Error during logout:', error);
    },
  });

  const { userData } = useAuthStore();

  const {
    data: usersubscription = {},
    isPending: isGetUserSubscriptionPending,
    isError: isGetUserSubscriptionError,
  } = useQuery({
    queryKey: ['getuserSubscription'],
    queryFn: () => getUserSubscription(userData?.token ?? ''),
    enabled: !!userData?.token, // Only fetch if token exists
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
  });

  // console.log(usersubscription);

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
            {/* user info */}
            <div
              onClick={() => navigation.push('/profile/user')}
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

            {/* stats info */}
            <div
              onClick={() => navigation.push('/profile/rewards')}
              className=" cursor-pointer bg-profile-stats rounded-t-2xl px-4 py-2 text-white"
            >
              <div>
                <p>Your Stats</p>
                <div className="w-full flex justify-between items-center py-2">
                  <p className="flex flex-col items-center text-white text-sm">
                    {Icons.flash}
                    <span>9 days</span>
                  </p>
                  <div className="w-[1px] h-full bg-lemonGreen-50" />
                  <p className="flex flex-col items-center text-white text-sm">
                    {Icons.flash}
                    <span>54 pts</span>
                  </p>
                  <div className="w-[1px] h-full bg-lemonGreen-50" />

                  <p className="flex flex-col items-center text-white text-sm">
                    {Icons.flashy}
                    <span>12 days</span>
                  </p>
                </div>
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
                  <Link
                    href={item.link}
                    key={item.name}
                    className="p-4 bg-gray-100 border border-gray-200 rounded-[20px] space-y-2 text-gray-600"
                  >
                    <span className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DashboardWrapper>
    </motion.div>
  );
}
