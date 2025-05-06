'use client';

import Link from 'next/link';
import cn from 'classnames';
import { Icons } from '@/app/icons';

type HeaderProps = React.ComponentPropsWithoutRef<'div'> & {
  title: string;
  link: string;
  children?: React.ReactNode;
  isHeaderDark?: boolean;
  isHeaderTransparent?: boolean;
  icon?: React.ReactNode;
};

const Header = ({
  title,
  link,
  children,
  isHeaderDark = false,
  isHeaderTransparent,
  icon,
}: HeaderProps) => {
  return (
    <div
      className={cn(
        'relative flex w-full justify-between items-center px-6',
        isHeaderDark && 'bg-gray-100',
        isHeaderTransparent ? 'py-4' : 'py-3',
      )}
    >
      <Link
        href={link}
        className={cn(
          'rounded-full w-9 h-9 inline-flex justify-center items-center',
          isHeaderTransparent
            ? 'bg-[#FFFFFF1A] text-white'
            : isHeaderDark
              ? 'bg-white'
              : 'bg-gray-100',
        )}
      >
        <span className="rotate-180">{icon || Icons.forwardArrow}</span>
      </Link>

      <p
        className={cn(
          'text-lg font-medium mx-auto',
          isHeaderTransparent ? 'text-white' : 'text-black',
        )}
      >
        {title}
      </p>

      {children}
    </div>
  );
};

export default Header;
