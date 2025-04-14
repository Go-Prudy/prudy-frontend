'use client';

import ForwardArrow from '@/icons/forward-arrow';
import Link from 'next/link';
import cn from 'classnames';

type HeaderProps = React.ComponentPropsWithoutRef<'div'> & {
  title: string;
  link: string;
  childern?: React.ReactNode;
  isHeaderDark?: boolean;
};

const Header = ({ title, link, childern, isHeaderDark = false }: HeaderProps) => {
  return (
    <div
      className={cn(
        'relative flex w-full justify-between items-center px-6 py-3',
        isHeaderDark && 'bg-gray-100',
      )}
    >
      <Link
        href={link}
        className={cn(
          'rounded-full w-10 h-10 inline-flex justify-center items-center',
          isHeaderDark ? 'bg-white' : 'bg-gray-100',
        )}
      >
        <ForwardArrow className="rotate-180" />
      </Link>

      <p className="text-lg font-medium text-black mx-auto">{title}</p>

      {childern}
    </div>
  );
};

export default Header;
