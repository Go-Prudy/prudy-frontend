import React from 'react';
import { BsCheck } from 'react-icons/bs';

type Props = {};

export default function Success({}: Props) {
  return (
    <div className="flex items-start gap-x-2">
      <BsCheck className="size-[16px]  text-success-500" />
      <p className="text-success-500 block text-xs">success</p>
    </div>
  );
}
