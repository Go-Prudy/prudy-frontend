import { CircularProgress } from '@nextui-org/react';
import cn from 'classnames';

type Props = { className?: string };

export default function Loader({ className }: Props) {
  return (
    <div className={cn('flex justify-center items-center min-h-[200px]', className)}>
      <CircularProgress size="md" color="default" />
    </div>
  );
}
