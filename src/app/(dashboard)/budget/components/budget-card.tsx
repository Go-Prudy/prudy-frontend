import Image from 'next/image';
import UnionIcon from '@/icons/union';
import BudgetCardProgress from './budget-card-progress';
import { uppercase } from '@/app/lib/utils';

interface BudgetCardProps {
  month: string;
  status: string;
}

export default function BudgetCard({ month, status }: BudgetCardProps) {
  return (
    <div className="rounded-[20px] p-4 border border-[#E7E7EA] bg-[#EFEFF0]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="text-base-gray font-medium">{month} budget</div>
          <div className="ms-auto">
            <span className="bg-white h-5 px-2 rounded-[10px] text-xs text-grayCaption inline-flex items-center justify-center">
              {uppercase(status)}
            </span>
            <button className="ms-3 rounded-[10px] bg-white w-8 h-5 inline-flex items-center justify-center">
              <UnionIcon className="fill-grayCaption" />
            </button>
          </div>
        </div>

        <BudgetCardProgress label="Income" amount={450000} category="income" />
        <BudgetCardProgress label="Expenses" amount={450000} category="expenses" />

        <div className="flex">
          <Image
            src="/avatar.png"
            alt="Collaborator avatar"
            width={32}
            height={32}
            className="border-2 border-white rounded-full"
          />
          <Image
            src="/avatar.png"
            alt="Collaborator avatar"
            width={32}
            height={32}
            className="border-2 border-white rounded-full -ms-3"
          />
          <Image
            src="/avatar.png"
            alt="Collaborator avatar"
            width={32}
            height={32}
            className="border-2 border-white rounded-full -ms-3"
          />
        </div>
      </div>
    </div>
  );
}
