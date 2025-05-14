import Image from 'next/image';
import coinImage from '/public/images/rewards/coin.png';
import cn from 'classnames';

type Props = { showPrice?: boolean };

export default function PointItem({ showPrice }: Props) {
  return (
    <div className="flex justify-between gap-5 text-gray-600 text-sm py-3">
      <div className="flex gap-2 items-start">
        <Image src={coinImage} alt="" width={40} height={40} />
        <div className="max-w-[160px] space-y-2">
          <p className="text-gray-600 font-medium">Track Expenses - Sync Transactions</p>
          <p className="text-[10px]">Apr. 6, 2025</p>
        </div>
      </div>
      <div className="">
        <p className={cn(showPrice ? '' : 'font-bold')}>300 pts</p>
        {showPrice && <p className="text-orange-600 font-bold">-₦1,500</p>}
      </div>
    </div>
  );
}
