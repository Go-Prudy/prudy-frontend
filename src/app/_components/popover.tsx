import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { ReactNode } from 'react';

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

type Props = { trigger: ReactNode; children: ReactNode; placement?: PopoverPlacement };

export default function AppPopover({ trigger, children, placement }: Props) {
  return (
    <Popover placement={placement || 'right'}>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className="bg-white rounded-[10px] p-3 shadow-md space-y-2">
        {children}
      </PopoverContent>
    </Popover>
  );
}
