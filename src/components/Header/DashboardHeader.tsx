'use client';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BsBell, BsPerson } from 'react-icons/bs';
import { useAuthStore } from '@/app/store/useAuthStore';

interface DashboardHeaderProp {
  title?: string;
  type: 'budget' | 'dashboard' | 'home';
  headerIcon: StaticImageData;
  headerIconClass: string;
  headerTitle?: string;
  headerTitle2?: string;
  headerTitleClass?: string;
  description?: string;
  children?: ReactNode;
}

const DashboardHeader = ({
  type,
  title,
  headerIcon,
  headerIconClass,
  headerTitle,
  headerTitle2,
  headerTitleClass,
  description,
  children,
}: DashboardHeaderProp) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { userData } = useAuthStore();

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
          'z-[30] w-full max-w-[500px] fixed top-0 left-0 right-0 mx-auto pt-8 pb-2 px-6 flex justify-between items-center backdrop-brightness-105 backdrop-blur-lg text-gray-600',
          scrolled ? 'scrolled-bg text-white' : 'bg-white',
        )}
      >
        {type === 'home' ? (
          <div className="text-black-970 flex gap-2 items-start">
            <div
              className={`rounded-full ${!userData?.profile.profilePhotoUrl ? 'p-1 border border-gray-600' : 'p-0'} `}
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
                {userData?.profile.lastName ? userData?.profile.lastName : 'User'}
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
        <div className="flex items-center justify-between gap-1">
          <div className="space-y-1">
            {headerTitle2 && (
              <h3 className="text-black-970 font-bold text-xl">{headerTitle2}</h3>
            )}
            <h3 className={cn('text-2xl font-bold', headerTitleClass)}>{headerTitle}</h3>
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
