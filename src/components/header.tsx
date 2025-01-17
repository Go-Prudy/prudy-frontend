'use client';

import ForwardArrow from '@/icons/forward-arrow';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BsX } from 'react-icons/bs';

type HeaderProps = React.ComponentPropsWithoutRef<'div'> & {
  title: string;
  link: string;
  light?: boolean;
};

const Header = ({ title, light = true, link, ...props }: HeaderProps) => {
  const navigate = useRouter();
  const [isLight, setIsLight] = useState(light);

  useEffect(() => {
    setIsLight(light);
  }, [light]);

  return (
    <div
      className={`relative top-0 flex w-full items-center h-[70px] ${
        isLight ? 'bg-[#F7F7F9] ' : 'bg-[#24020205] backdrop-blur-lg'
      } pl-6`}
      {...props}
    >
      <Link href={link}>
        <button
          // onClick={() => navigate.back()}
          className={`absolute rounded-full ${isLight ? 'bg-white text-black' : 'text-white bg-[#FFFFFF0A]'}  w-10 h-10 inline-flex justify-center items-center`}
        >
          <ForwardArrow className="rotate-180" />
        </button>
      </Link>

      <p
        className={`text-lg font-medium ${
          isLight ? 'text-black ' : 'text-white'
        } mx-auto `}
      >
        {title}
      </p>
    </div>
  );
};

export default Header;
