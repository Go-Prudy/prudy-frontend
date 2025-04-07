'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

interface SectionHeaderProp {
  title: string;
  customButton?: ReactNode;
  link?: string;
  isIconButton?: boolean;
  isCustomButton?: boolean;
  icon?: ReactNode;
  linkText?: string;
}

const SectionHeader = ({
  title,
  customButton,
  link,
  isIconButton,
  isCustomButton,
  icon,
  linkText,
}: SectionHeaderProp) => {
  return (
    <div className="flex justify-between items-center">
      <h4 className="text-lg text-black-900">{title}</h4>
      {isCustomButton ? (
        customButton
      ) : isIconButton ? (
        <Link
          href={link ?? ''}
          className="w-9 h-9 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full"
        >
          {icon}
        </Link>
      ) : (
        link && (
          <Link
            href={link}
            className="px-3 py-1.5 bg-lemonGreen-100 rounded-xl border border-gray-200 flex items-center gap-2 text-lemonGreen-950 text-xs font-medium"
          >
            {icon && icon}
            {linkText}
          </Link>
        )
      )}
    </div>
  );
};

export default SectionHeader;
