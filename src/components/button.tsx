import { CircularProgress } from '@nextui-org/react';
import cn from 'classnames';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  [key: string]: any;
};

export default function Button({
  className,
  loading,
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'text-lemonGreen-950 p-[14px] bg-lemonGreen-400 w-full rounded-2xl font-medium text-base flex gap-2 justify-center items-center',
        className,
        disabled && 'opacity-50',
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <CircularProgress color="default" size="sm" /> : children}
    </button>
  );
}
