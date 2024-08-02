'use client';

import Image from 'next/image';
import React from 'react';
import FirstSlidePic from '@/images/smiling-woman.jpg';
import ForwardArrow from '@/icons/forward-arrow';
import FadeTransition from '../fade-transition';

const OnboardingSlides = () => {
  const [slide, setSlide] = React.useState(0);
  const handleNext = () => {
    setSlide((prev: number): number => {
      if (prev < 3) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handlePrev = () => {
    setSlide((prev: number): number => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  return (
    <div className="w-full h-full relative">
      <Image
        src={FirstSlidePic}
        width={76}
        height={71}
        alt="Nick's Signature"
        className="w-full h-full"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute mt-[50vh] bottom-10 left-0 px-6 w-full">
        <div className="px-6 pt-6 pb-10 bg-base-black min-h-10 w-full border border-[#212121] rounded-3xl">
          <FadeTransition shouldChange={String(slide)}>
            {slide === 0 && (
              <h1 className="text-3xl font-bold mb-6">
                <span className="text-lemonGreen-600 italic">Easy budgeting & tracking </span>
                <span className="text-white">like you’ve never known</span>
              </h1>
            )}
            {slide === 1 && (
              <h1 className="text-3xl font-bold mb-6">
                <span className="text-lemonGreen-600 italic">Collaborate </span>
                <span className="text-white">with your loved ones</span>
              </h1>
            )}
            {slide === 2 && (
              <h1 className="text-3xl font-bold mb-6">
                <span className="text-lemonGreen-600 italic">Link </span>
                <span className="text-white">your bank accounts easily</span>
              </h1>
            )}
            {slide === 3 && (
              <h1 className="text-3xl font-bold mb-6 text-balance">
                <span className="text-lemonGreen-600 italic">Insightful analytics </span>
                <span className="text-white">to keep you abreast of your spending patterns</span>
              </h1>
            )}
          </FadeTransition>
          <p className="text-gray-500">Simple, smart, and stress-free. Do it the Prudy way.</p>
          <div className="flex justify-between mt-10">
            <div className="inline-flex justify-center items-center gap-1">
              {Array.from(Array(4).keys()).map((el) => (
                <div
                  key={el}
                  className={`rounded-full h-2 transition-all duration-200 ${el === slide ? 'bg-lemonGreen-600 w-8' : 'bg-gray-600 w-2'}`}
                />
              ))}
            </div>
            <div className="inline-flex gap-4">
              <button
                className="rotate-180 w-14 h-14 hover:bg-[#2D2D2D] border border-gray-600 rounded-full inline-flex justify-center items-center"
                onClick={handlePrev}
              >
                <ForwardArrow className="text-white" />
              </button>
              <button
                className="w-14 h-14 border border-gray-600 hover:bg-[#2D2D2D] rounded-full inline-flex justify-center items-center"
                onClick={handleNext}
              >
                <ForwardArrow className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlides;
