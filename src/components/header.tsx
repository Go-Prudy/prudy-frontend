'use client';

import ForwardArrow from '@/icons/forward-arrow';
import Link from 'next/link';

type HeaderProps = React.ComponentPropsWithoutRef<'div'> & {
  title: string;
  link: string;
  childern?: React.ReactNode;
};

const Header = ({ title, link, childern }: HeaderProps) => {
  return (
    <div className="relative flex w-full justify-between items-center px-6 py-3">
      <Link
        href={link}
        className="rounded-full w-10 h-10 bg-gray-100 inline-flex justify-center items-center"
      >
        <ForwardArrow className="rotate-180" />
      </Link>

      <p className="text-lg font-medium text-black mx-auto">{title}</p>

      {childern}
    </div>
  );
};

export default Header;
