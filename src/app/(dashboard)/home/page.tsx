'use client';

import { motion } from 'framer-motion';
import { EmptyStateDarkBg } from '@/app/_components/emptyState';
import DashboardHeader from '@/components/Header/DashboardHeader';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import GetStarted from './_components/getStarted';
import Analytics from './_components/analytics';

// import images
import homeHeaderIcon from '/public/images/header/home.png';
import emptyBudgetImage from '/public/images/empty-state/budget.png';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px]"
    >
      <DashboardWrapper>
        <div className="relative w-full max-w-[500px] transition-all duration-300 ease-out min-h-screen">
          <DashboardHeader
            type="home"
            headerTitle="Take the first step to financial freedom."
            headerIcon={homeHeaderIcon}
            headerIconClass="mr-2 w-[100px]"
            description="Budget & track your expenses easily."
          />

          <div className="space-y-6 p-6">
            <GetStarted />
            <Analytics />
            <EmptyStateDarkBg
              image={emptyBudgetImage}
              title="No recent budget created yet"
            />
          </div>
        </div>
      </DashboardWrapper>
    </motion.div>
  );
};

export default HomePage;
