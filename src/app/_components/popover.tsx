import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { ReactNode } from 'react';
import cn from 'classnames';

type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

type Props = {
  trigger: ReactNode;
  children: ReactNode;
  placement?: PopoverPlacement;
  shadow?: string;
};

export default function AppPopover({ trigger, children, placement, shadow }: Props) {
  return (
    <Popover placement={placement || 'right'}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn(
          'bg-white p-3 space-y-3 items-start text-xs text-gray-600',
          placement === 'bottom-end'
            ? 'rounded-none rounded-b-[10px] rounded-l-[10px] '
            : 'rounded-[10px]',
          shadow || 'shadow-[0px_4px_4px_-4px_#0C0C0D0D,0px_16px_16px_-8px_#0C0C0D1A] ',
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
