'use client';
import React from 'react';
import Logo2 from '/public/images/logo2.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SplashScreen2 = () => {
  return (
    <div className="fixed top-0 w-full h-screen flex justify-center items-center max-w-[680px]">
      <motion.div
        initial={{
          opacity: 0,
          height: '10rem',
          width: '10rem',
          borderRadius: '100%',
        }}
        animate={{
          opacity: 1,
          height: '90rem',
          borderRadius: '0%',
          width: '90rem',
        }}
        transition={{ duration: 1 }}
        className="bg-white flex flex-col gap-4 justify-center items-center top-0"
      >
        <Image
          className="size-[80px] object-contain"
          src={Logo2}
          width={1000}
          height={1000}
          alt="logo"
        />
        <h1 className="font-bold italic text-[39.14px] text-lemonGreen-950 leading-[41.59px]">
          GoPrudy
        </h1>
        <p className="text-gray-600 text-base">Don’t take the back seat, be in charge!</p>
      </motion.div>
    </div>
  );
};

export default SplashScreen2;
