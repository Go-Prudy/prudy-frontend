'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import Slide1 from './slides/Slide1';
import Slide2 from './slides/Slide2';
import Slide3 from './slides/Slide3';

const OnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slide, setSlide] = useState(0);
  const [hasTransitioned, setHasTransitioned] = useState(false);

  const handleNext = () => {
    setSlide((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    if (!hasTransitioned) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev < 2 ? prev + 1 : prev));
        setHasTransitioned(true);
      }, currentSlide === 0 ? 2000 : 2000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, hasTransitioned]);

  const renderCurrentSlide = () => {
    switch (currentSlide) {
      case 0:
        return <Slide1 />;
      case 1:
        return (
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Slide3
              slide={slide}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
          </motion.div>
        );
      default:
        return <Slide1 />;
    }
  };

  return <div className="w-full">{renderCurrentSlide()}</div>;
};

export default OnboardingSlides;
