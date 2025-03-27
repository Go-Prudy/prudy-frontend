'use client';
import { motion } from 'framer-motion';
import SplashScreen1 from './SplashScreen1';
import SplashScreen2 from './SplashScreen2';
import Slide3 from './OnboardingSlides';
import useOnboardingScreens from './useOnboardingScreens';

const OnboardingSlides: React.FC = () => {
  const { currentScreen, handleNext, handlePrev, onboardingSlide, skipSlides } =
    useOnboardingScreens();

  return (
    <div className="w-full">
      {currentScreen === 'splash' ? (
        <>
          <SplashScreen1 />
          <SplashScreen2 />
        </>
      ) : (
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <Slide3
            slide={onboardingSlide}
            handlePrev={handlePrev}
            handleNext={handleNext}
            skipSlides={skipSlides}
          />
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingSlides;
