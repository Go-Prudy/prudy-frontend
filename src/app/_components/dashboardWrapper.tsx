import React, { ReactNode } from 'react';
import BottomNavigation from './nav/bottomNavigation';

type Props = { children: ReactNode };

export default function DashboardWrapper({ children }: Props) {
  return (
    <div className='pb-[100px]'>
      {children}
      <BottomNavigation />
    </div>
  );
}
