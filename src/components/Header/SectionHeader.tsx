'use client';

import { CircularProgress } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionHeaderProp {
  title: string;
  customButton?: ReactNode;
  link?: string;
  isIconButton?: boolean;
  isCustomButton?: boolean;
  icon?: ReactNode;
  buttonText?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const SectionHeader = ({
  title,
  customButton,
  link,
  isIconButton,
  isCustomButton,
  icon,
  buttonText,
  onClick,
  isLoading,
}: SectionHeaderProp) => {
  return (
    <div className="flex justify-between items-center">
      <h4 className="text-lg text-black-900">{title}</h4>
      {isCustomButton ? (
        customButton
      ) : isIconButton && link ? (
        <Link
          href={link}
          className="w-9 h-9 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full"
        >
          {icon}
        </Link>
      ) : (
        buttonText && (
          <button
            onClick={onClick}
            className="px-3 py-1.5 bg-lemonGreen-100 rounded-xl border border-gray-200 flex items-center gap-2 text-lemonGreen-950 text-xs font-medium"
          >
            {isLoading ? (
              <CircularProgress size="sm" />
            ) : (
              <>
                {icon && icon}
                {buttonText}
              </>
            )}
          </button>
        )
      )}
    </div>
  );
};

export default SectionHeader;
