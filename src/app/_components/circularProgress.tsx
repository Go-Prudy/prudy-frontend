import { CircularProgress } from '@nextui-org/react';
import React from 'react';

type Props = { color?: string; size?: 'lg' | 'sm' | 'md'; value: number };

export default function CircularProgressBar({ color, size, value }: Props) {
  return (
    <CircularProgress
      aria-label="progress"
      classNames={{
        svg: 'w-[150px] h-[150px] drop-shadow-md',
        indicator: color || 'stroke-[#E7F846] w-3',
        track: 'stroke-white/10',
        value: 'text-2xl font-medium text-white',
      }}
      showValueLabel={true}
      size={size || 'lg'}
      value={value}
      // formatOptions={{ style: 'unit', unit: 'percentage' }}
    />
  );
}
