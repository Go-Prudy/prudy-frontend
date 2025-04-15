import { CircularProgress } from '@nextui-org/react';
import cn from 'classnames';
import { ReactNode } from 'react';

type Props = {
  buttonType?: 'icon' | 'form';
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  buttonTitle?: string;
  buttonIcon?: ReactNode;
  onClick?: () => void;
  [key: string]: any;
};

export default function Button({
  className,
  loading,
  disabled,
  children,
  buttonType,
  buttonTitle,
  buttonIcon,
  onClick,
  ...rest
}: Props) {
  return buttonType === 'icon' ? (
    <button
      className={cn(
        'text-lemonGreen-950 p-2 bg-lemonGreen-100 border border-gray-200 w-fit rounded-xl font-medium text-xs flex gap-0.5 justify-center items-center',
        className,
        disabled && 'opacity-50',
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {buttonIcon} <span>{buttonTitle}</span>
    </button>
  ) : (
    <button
      className={cn(
        'text-lemonGreen-950 p-[14px] bg-lemonGreen-400 w-full rounded-2xl font-medium text-base flex gap-2 justify-center items-center',
        className,
        disabled && 'opacity-50',
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? <CircularProgress color="default" size="sm" /> : children}
    </button>
  );
}
