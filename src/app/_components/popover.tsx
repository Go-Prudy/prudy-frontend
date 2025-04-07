import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { ReactNode } from 'react';

type Props = { trigger: ReactNode; children: ReactNode };

export default function AppPopover({ trigger, children }: Props) {
  return (
    <Popover placement="right">
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className="bg-white rounded-[10px] p-3 shadow-md space-y-2">
        {children}
      </PopoverContent>
    </Popover>
  );
}
