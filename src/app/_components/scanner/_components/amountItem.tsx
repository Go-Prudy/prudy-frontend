import cn from 'classnames';
import React from 'react';

export default function AmountItem({
  name,
  amount,
  type,
}: {
  name: string;
  amount: number;
  type?: 'total';
}) {
  return (
    <div
      className={cn(
        'flex justify-between items-center font-medium',
        type === 'total' ? 'text-base' : 'text-sm',
      )}
    >
      <p className="text-gray-600">{name}</p>
      <p className={cn('text-black-800', type === 'total' && 'font-bold')}>
        ₦{amount.toLocaleString()}
      </p>
    </div>
  );
}
