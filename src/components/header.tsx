'use client';

import Link from 'next/link';
import cn from 'classnames';
import { Icons } from '@/app/icons';

type HeaderProps = React.ComponentPropsWithoutRef<'div'> & {
  title: string;
  link: string;
  children?: React.ReactNode;
  isHeaderDark?: boolean;
};

const Header = ({ title, link, children, isHeaderDark = false }: HeaderProps) => {
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
          'rounded-full w-9 h-9 inline-flex justify-center items-center',
          isHeaderDark ? 'bg-white' : 'bg-gray-100',
        )}
      >
        <span className="rotate-180">{Icons.forwardArrow}</span>
      </Link>

      <p className="text-lg font-medium text-black mx-auto">{title}</p>

      {children}
    </div>
  );
};

export default Header;
