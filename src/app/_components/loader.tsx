import { CircularProgress } from '@nextui-org/react';
import React from 'react';

type Props = {};

export default function Loader({}: Props) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <CircularProgress size="md" color="default" />
    </div>
  );
}
