'use client';
import Cookies from 'js-cookie';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { BsBell, BsPerson } from 'react-icons/bs';
import { useAuthentication } from '@/app/store/AuthStore';
import { IAuthenticatedUser } from '@/app/Types';
import { fetchUserProfile } from '@/app/services/AuthenticationService';

interface DashboardHeaderProp {
  title?: string;
  type: 'budget' | 'dashboard' | 'home';
  headerIcon: StaticImageData;
  headerIconClass: string;
  headerTitle?: string;
  description?: string;
  children?: ReactNode;
}

const DashboardHeader = ({
  type,
  title,
  headerIcon,
  headerIconClass,
  headerTitle,
  description,
  children,
}: DashboardHeaderProp) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { updateAuthenticatedUser, authenticatedUser } = useAuthentication();
  const [userData, setUserData] = useState<IAuthenticatedUser>({
    token: '',
    profile: {
      createdAt: '',
      updatedAt: '',
      uid: '',
      hasFreeTrial: false,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      registeredWith: '',
      isVerified: false,
      hasOnboarded: false,
      accountProviderId: '',
      profilePhotoUrl: '',
    },
  });

  const { data: userProfile = {}, status: getUserProfileStatus } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => fetchUserProfile(),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userProfile.success) {
      updateAuthenticatedUser({
        token: Cookies.get('token') || '',
        profile: userProfile.data,
      });
    }
  }, [getUserProfileStatus]);

  useEffect(() => {
    if (authenticatedUser) {
      setUserData(authenticatedUser);
    }
  }, [authenticatedUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          'z-[30] w-full max-w-[500px] fixed top-0 pt-8 pb-2 px-6 flex justify-between items-center backdrop-brightness-105 backdrop-blur-lg text-gray-600',
          scrolled ? 'scrolled-bg text-white' : 'bg-white',
        )}
      >
        {type === 'home' ? (
          <div className="text-black-970 flex gap-2 items-start">
            <div
              className={`rounded-full ${!userData.profile.profilePhotoUrl ? 'p-1 border border-gray-600' : 'p-0'} `}
            >
              {userData?.profile?.profilePhotoUrl ? (
                <Image
                  src={userData.profile.profilePhotoUrl}
                  alt="profile"
                  width={1000}
                  height={1000}
                  className=" size-10 rounded-full object-cover"
                />
              ) : (
                <BsPerson className="text-gray-600 size-10" />
              )}
            </div>
            <div className="text-gray-600">
              <p className="text-xs">Welcome 👋</p>
              <h1 className="font-medium">
                {userData.profile.lastName ? userData.profile.lastName : 'User'}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="text-black-970 font-bold text-2xl">{title}</h1>
        )}

        {pathname === 'home' && (
          <div className="size-12 bg-gray-100 rounded-full flex justify-center items-center">
            <BsBell size={24} />
          </div>
        )}
      </div>
      <div className="px-6 pb-6 bg-header-gradient rounded-b-[32px]">
        <div className="flex items-center gap-1">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">{headerTitle}</h3>
            {description && <p className="text-black-800 text-sm">{description}</p>}
          </div>
          <Image
            src={headerIcon}
            width={135}
            height={135}
            alt=""
            className={headerIconClass}
          />
        </div>
        {children}
      </div>
    </>
  );
};

export default DashboardHeader;
