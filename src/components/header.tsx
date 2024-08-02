import ForwardArrow from '@/icons/forward-arrow';
import React from 'react';

type HeaderProps = React.ComponentPropsWithoutRef<'div'> & {
    title: string
}

const Header = ({ title, ...props}: HeaderProps) => {
  return (
    <div className="sticky top-0 flex w-full items-center h-[70px] bg-[#F7F7F9] pl-6" {...props}>
      <button className="rounded-full bg-white w-10 h-10 inline-flex justify-center items-center">
        <ForwardArrow className="rotate-180" />
      </button>
      <p className="text-lg font-medium mx-auto">{title}</p>
    </div>
  );
};

export default Header;
