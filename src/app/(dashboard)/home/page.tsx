'use client';
import pics from '/public/images/frame.webp';
import { motion } from 'framer-motion';
import homeHeaderIcon from '/public/images/header/home.png';
import DashboardHeader from '@/components/Header/DashboardHeader';
import Button from '@/components/button';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px]"
    >
      <div className=" overscroll-none">
        <div
          className="relative w-full max-w-[500px] overscroll-none bg-no-repeat bg-contain bg-top transition-all duration-300 ease-out min-h-screen"
          style={{
            backgroundImage: `url(${pics.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <DashboardHeader
            type="home"
            headerTitle="Take the first step to financial freedom."
            headerIcon={homeHeaderIcon}
            headerIconClass="mr-[-24px] w-[120px]"
            description="Budget & track your expenses easily."
          />

          {/* quick actions */}
          <div>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
