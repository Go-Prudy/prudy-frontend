'use client';
import Image, { StaticImageData } from 'next/image';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import Button from '@/app/_components/button';
import { useSwiper } from 'swiper/react';
import cn from 'classnames';
import { useState } from 'react';
import SignupDrawer from '../drawers/Signup';

interface OnboardingSlideProps {
  slide: number;
  image: StaticImageData;
  image2?: StaticImageData;
  greenFirst: boolean;
  greenText: string;
  blackText: string;
  description: string;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  slide,
  image,
  image2,
  greenFirst,
  greenText,
  blackText,
  description,
}) => {
  const swiper = useSwiper();
  const [showSignupDrawer, setShowSignupDrawer] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="w-full">
        <div className="h-[448px] relative">
          <Image className="object-cover h-full rounded-b-[32px]" src={image} alt="" />
          {image2 && (
            <Image
              className={cn(
                'z-10 absolute left-0 right-0 mx-auto',
                slide === 0 ? 'bottom-4' : 'bottom-10',
              )}
              src={image2}
              alt=""
              width={210}
              height={60}
            />
          )}

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
              {greenFirst ? (
                <>
                  <span className="text-lemonGreen-600 italic">{greenText} </span>
                  <span className="text-gray-500">{blackText}</span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">{blackText} </span>
                  <span className="text-lemonGreen-600 italic">{greenText}</span>
                </>
              )}
            </h1>
            <p className="text-base text-gray-500">{description}</p>
          </div>

          <div className="inline-flex gap-4">
            <button
              className={`w-14 h-[60px] bg-lemonGreen-50 rounded-2xl inline-flex justify-center items-center
                ${slide === 0 ? 'opacity-30' : ''}
                `}
              onClick={() => swiper.slidePrev()}
              disabled={slide === 0}
            >
              <BsArrowLeft size={20} className="text-lemonGreen-900" />
            </button>
            <button
              className={`w-14 h-[60px] rounded-2xl inline-flex justify-center items-center ${
                slide === 4
                  ? 'bg-lemonGreen-50 opacity-30'
                  : 'bg-gradient-to-b to-[#66C227] from-[#2A860A]'
              }`}
              onClick={() => swiper.slideNext()}
              disabled={slide === 4}
            >
              <BsArrowRight
                size={20}
                className={`${slide === 4 ? 'text-lemonGreen-900' : 'text-white'}`}
              />
            </button>
          </div>

          {/* show */}
          {slide === 4 ? (
            <Button onClick={() => setShowSignupDrawer(true)}>Get Started</Button>
          ) : (
            <button className="w-full" onClick={() => swiper.slideTo(4)}>
              <p className="text-base text-gray-500">Skip</p>
            </button>
          )}
        </div>
      </div>
      {showSignupDrawer && (
        <SignupDrawer show={showSignupDrawer} setShow={setShowSignupDrawer} />
      )}
    </div>
  );
};

export default OnboardingSlide;
