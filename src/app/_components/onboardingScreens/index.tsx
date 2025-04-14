'use client';
import SplashScreen1 from './SplashScreen1';
import SplashScreen2 from './SplashScreen2';
import useOnboardingScreens from './useOnboardingScreens';
import OnboardingSlide from './OnboardingSlide';
import slide1Image from '/public/images/onboarding/1.png';
import slide1Image2 from '/public/images/onboarding/11.png';

import slide2Image from '/public/images/onboarding/2.png';
import slide2Image2 from '/public/images/onboarding/22.png';

import slide3Image from '/public/images/onboarding/3.png';
import slide4Image from '/public/images/onboarding/4.png';
import slide5Image from '/public/images/onboarding/5.png';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EffectCreative } from 'swiper/modules';

const onboardingSlideItems = [
  {
    greenText: 'budgeting & expense tracking',
    blackText: 'AI powered',
    greenFirst: false,
    description: 'Simple, smart, and stress-free. Do it the Prudy way.',
    image: slide1Image,
    image2: slide1Image2,
  },
  {
    greenText: 'Collaborate',
    blackText: 'with your loved ones',
    greenFirst: true,
    description: 'Team up with your loved ones. Manage money together, effortlessly!',
    image: slide2Image,
    image2: slide2Image2,
  },
  {
    greenText: 'bank accounts',
    blackText: 'Securely link all your',
    greenFirst: false,
    description:
      'Even if you have up to 10 accounts, you can link them all so you don’t lose sight of any expense.',
    image: slide3Image,
  },
  {
    greenText: 'Insightful Analytics',
    blackText: 'for your expenses',
    greenFirst: true,
    description: 'Simple, smart, and stress-free. Do it the Prudy way.',
    image: slide4Image,
  },
  {
    greenText: 'Receipt Scanning',
    blackText: 'AI powered',
    greenFirst: false,
    description: 'Simple, smart, and stress-free. Do it the Prudy way.',
    image: slide5Image,
  },
];

const OnboardingScreen: React.FC = () => {
  const { currentScreen } = useOnboardingScreens();

  return (
    <div className="w-full">
      {currentScreen === 'splash' ? (
        <>
          <SplashScreen1 />
          <SplashScreen2 />
        </>
      ) : (
        <Swiper
          grabCursor={true}
          effect={'creative'}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          modules={[EffectCreative]}
          className=""
        >
          {onboardingSlideItems.map((item, index) => (
            <SwiperSlide key={index}>
              <OnboardingSlide
                slide={index}
                image={item.image}
                image2={item.image2}
                greenText={item.greenText}
                blackText={item.blackText}
                greenFirst={item.greenFirst}
                description={item.description}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default OnboardingScreen;
