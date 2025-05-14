import { Icons } from '@/app/icons';
import cn from 'classnames';
import { ReactNode } from 'react';

type Props = {
  isRewardPage?: boolean;
  points: number;
  currentStreak: number;
  longestStreak: number;
};

const ValueItem = ({
  icon,
  text,
  value,
  isRewardPage,
}: {
  icon: ReactNode;
  text?: string;
  value: string;
  isRewardPage: boolean;
}) => (
  <p
    className={cn(
      'flex flex-col items-center text-sm w-full',
      isRewardPage ? 'text-gray-600' : 'text-white',
    )}
  >
    {icon}
    {text && <span className="text-[10px]">{text}</span>}
    <span>{value}</span>
  </p>
);

export default function RewardValues({
  isRewardPage = false,
  points,
  currentStreak,
  longestStreak,
}: Props) {
  return (
    <div
      className={cn(
        'w-full flex justify-between divide-x',
        isRewardPage ? 'bg-white p-2.5 rounded-b-xl' : 'divide-[#E8FCD83B] py-2',
      )}
    >
      <ValueItem
        icon={isRewardPage ? Icons.flashRewards : Icons.flash}
        text={isRewardPage ? 'Current Streak' : ''}
        value={`${currentStreak} days`}
        isRewardPage={isRewardPage}
      />

      <ValueItem
        icon={isRewardPage ? Icons.coinRewards : Icons.coin}
        text={isRewardPage ? 'Points Earned' : ''}
        value={`${points} pts`}
        isRewardPage={isRewardPage}
      />

      <ValueItem
        icon={isRewardPage ? Icons.flashyRewards : Icons.flashy}
        text={isRewardPage ? 'Longest Streak' : ''}
        value={`${longestStreak} pts`}
        isRewardPage={isRewardPage}
      />
    </div>
  );
}
