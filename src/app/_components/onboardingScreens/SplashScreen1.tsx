'use client';
import React from 'react';
import Logo from '/public/images/logo.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SplashScreen1 = () => {
  return (
    <div className="fixed top-0 bg-gradient-to-b to-[#66C227] from-[#2A860A] w-full h-screen flex justify-center items-center max-w-[680px]">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transition: { duration: 1 } }}
      >
        <Image
          className=" size-[80px] object-contain"
          src={Logo}
          width={1000}
          height={1000}
          alt="logo"
        />
      </motion.div>
    </div>
  );
};

export default SplashScreen1;
