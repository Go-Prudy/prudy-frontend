import { useEffect, useState } from 'react';

export default function useOnboardingScreens() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding'>('splash');

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

  return { currentScreen };
}
