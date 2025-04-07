'use client';
import { useRouter } from 'next/navigation';
import slide1Image from '/public/images/onboarding/1.png';
import slide2Image from '/public/images/onboarding/2.png';
import slide3Image from '/public/images/onboarding/3.png';
import slide4Image from '/public/images/onboarding/4.png';
import slide5Image from '/public/images/onboarding/5.png';
import Image from 'next/image';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import Button from '../../app/_components/button';

interface OnboardingSlidesProps {
  slide: number;
  handlePrev: () => void;
  handleNext: () => void;
  skipSlides: () => void;
}

const onboardingSlideItems = [
  {
    greenText: 'budgeting & expense tracking',
    blackText: 'AI powered',
    greenFirst: false,
    description: 'Simple, smart, and stress-free. Do it the Prudy way.',
    image: slide1Image,
  },
  {
    greenText: 'Collaborate',
    blackText: 'with your loved ones',
    greenFirst: true,
    description: 'Team up with your loved ones. Manage money together, effortlessly!',
    image: slide2Image,
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

const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({
  slide,
  handlePrev,
  handleNext,
  skipSlides,
}) => {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="w-full">
        <div className="h-[448px] relative">
          <Image
            className="object-cover h-full rounded-b-[32px]"
            src={onboardingSlideItems[slide].image}
            alt=""
          />
          <div className="absolute bottom-0 w-full h-[66px] bg-onboarding-overlay" />
          <div className="z-10 absolute bottom-4 inline-flex w-full justify-center items-center gap-1">
            {Array.from(Array(5).keys()).map((el) => (
              <div
                key={el}
                className={`rounded-full h-2 transition-all duration-200 ${el === slide ? 'bg-lemonGreen-600 w-8' : 'bg-white w-2'}`}
              />
            ))}
          </div>
        </div>
        <div className="p-6 text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {onboardingSlideItems[slide].greenFirst ? (
                <>
                  <span className="text-lemonGreen-600 italic">
                    {onboardingSlideItems[slide].greenText}{' '}
                  </span>
                  <span className="text-gray-500">
                    {onboardingSlideItems[slide].blackText}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">
                    {onboardingSlideItems[slide].blackText}{' '}
                  </span>
                  <span className="text-lemonGreen-600 italic">
                    {onboardingSlideItems[slide].greenText}
                  </span>
                </>
              )}
            </h1>
            <p className="text-base text-gray-500">
              {onboardingSlideItems[slide].description}
            </p>
          </div>

          <div className="inline-flex gap-4">
            <button
              className={`w-14 h-[60px] bg-lemonGreen-50 rounded-2xl inline-flex justify-center items-center
                ${slide === 0 ? 'opacity-30' : ''}
                `}
              onClick={handlePrev}
            >
              <BsArrowLeft size={20} className="text-lemonGreen-900" />
            </button>
            <button
              className={`w-14 h-[60px] rounded-2xl inline-flex justify-center items-center ${
                slide === 4
                  ? 'bg-lemonGreen-50 opacity-30'
                  : 'bg-gradient-to-b to-[#66C227] from-[#2A860A]'
              }`}
              onClick={handleNext}
            >
              <BsArrowRight
                size={20}
                className={`${slide === 4 ? 'text-lemonGreen-900' : 'text-white'}`}
              />
            </button>
          </div>

          {slide === 4 ? (
            <Button onClick={() => navigate.push('/signup')}>Get Started</Button>
          ) : (
            <button className="w-full" onClick={skipSlides}>
              <p className="text-base text-gray-500">Skip</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlides;
