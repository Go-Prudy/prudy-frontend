import { useEffect, useState } from 'react';

export default function useOnboardingScreens() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding'>('splash');
  const [onboardingSlide, setOnboardingSlide] = useState(0);

  const handleNext = () => {
    setOnboardingSlide((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setOnboardingSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const skipSlides = () => setOnboardingSlide(4)

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(
        () => {
          setCurrentScreen('onboarding');
        },
        currentScreen === 'splash' ? 2000 : 2000,
      );
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  return { currentScreen, handleNext, handlePrev, onboardingSlide, skipSlides };
}
