'use client';
import Image, { StaticImageData } from 'next/image';
import cn from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BsBell } from 'react-icons/bs';
import { useAuthStore } from '@/app/store/useAuthStore';
import userAvatarIcon from '/public/images/icons/avatar.svg';
import { CircularProgress } from '@nextui-org/react';
import { Budget } from '@/app/types/budget';

interface DashboardHeaderProp {
  title?: string;
  type: 'budget' | 'dashboard' | 'home' | 'profile';
  headerIcon?: StaticImageData;
  headerIconClass?: string;
  headerTitle?: string;
  headerTitle2?: string;
  headerTitleClass?: string;
  description?: string;
  children?: ReactNode;
  isLoadingBudgets?: boolean;
  budgets?: Budget[];
  handleBudgetChange?: (value: string) => void;
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
  isLoadingBudgets,
  budgets,
  handleBudgetChange,
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
          scrolled ? 'text-white' : 'bg-white',
        )}
      >
        {type === 'home' ? (
          <div className="text-black-970 flex gap-2 items-start">
            <Image
              src={userData?.profile?.profilePhotoUrl || userAvatarIcon}
              alt="profile"
              width={40}
              height={40}
              className="size-10 rounded-xl object-cover"
            />
            <div className="text-gray-600">
              <p className="text-xs">Welcome 👋</p>
              <h1 className="font-bold">
                {userData?.profile.lastName ? userData?.profile.lastName : 'User'}
              </h1>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-black-970 font-bold text-2xl">{title}</h1>
            {budgets && budgets.length > 0 && (
              <select
                name="budget"
                className="bg-gray-100 rounded-xl p-2 border-gray-200 border w-fit text-sm"
                id="budget"
                onChange={(e) => handleBudgetChange && handleBudgetChange(e.target.value)}
                disabled={isLoadingBudgets}
              >
                {isLoadingBudgets ? (
                  <option disabled>
                    <CircularProgress size="sm" />
                  </option>
                ) : (
                  budgets?.map((budget: any) => (
                    <option key={budget.uid} value={budget.uid}>
                      {budget.name}
                    </option>
                  ))
                )}
              </select>
            )}
          </>
        )}

        {pathname === 'home' && (
          <div className="size-12 bg-gray-100 rounded-full flex justify-center items-center">
            <BsBell size={24} />
          </div>
        )}
      </div>
      {type === 'profile' && (
        <div className="px-6 bg-header-gradient rounded-b-[32px] overflow-hidden">{children}</div>
      )}
      {headerIcon && (
        <div className={cn('px-6 pb-6 bg-header-gradient rounded-b-[32px]')}>
          <div className="flex items-center justify-between gap-1">
            <div className="space-y-1">
              {headerTitle2 && (
                <h3 className="text-black-970 font-bold text-xl">{headerTitle2}</h3>
              )}
              <h3 className={cn('text-2xl font-bold', headerTitleClass)}>
                {headerTitle}
              </h3>
              {description && <p className="text-black-800 text-sm">{description}</p>}
            </div>
            {headerIcon && (
              <Image
                src={headerIcon}
                width={135}
                height={135}
                alt=""
                className={headerIconClass}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
