import { Icons } from '@/app/icons';
import { Collaborator } from '@/app/types/budget';
import { Avatar, AvatarGroup } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import {  BsChevronRight } from 'react-icons/bs';

type Props = {
  name: string;
  collaborators: Collaborator[];
  percentageIncomeUsed: number;
  totalIncome: number;
  leftToSpend: number;
  budgetId:string
};

export default function BudgetItemHome({
  name,
  collaborators,
  percentageIncomeUsed,
  totalIncome,
  leftToSpend,
  budgetId,
}: Props) {
  return (
    <div className="bg-gray-100 rounded-[20px] flex flex-col relative border border-gray-200 gap-2 pt-3 pb-4">
      <div className="space-y-4">
        <div className="px-4 w-full justify-between items-center flex">
          <p className="font-medium">{name}</p>
          <Link
            href={`/budget/${budgetId}`}
            className="inline-block bg-white rounded-full h-10 w-10 flex items-center justify-center"
          >
            <span className="*:size-4">{Icons.export}</span>
          </Link>
        </div>
        <div className="px-4 space-y-2 w-full">
          <div className="flex justify-between text-[10px] text-gray-800 font-medium">
            <p className="">
              Budget <br />
              <span className="text-xs"> ₦{totalIncome.toLocaleString()}</span>
            </p>
            <p className="">
              Left to Spend <br />{' '}
              <span className="text-xs">₦{leftToSpend.toLocaleString()}</span>
            </p>
          </div>
          <div className="w-full rounded h-3 relative overflow-hidden">
            <div className="bg-white rounded h-3 absolute top-0 left-0 w-full" />
            <div
              className="bg-[#FB8417] rounded h-3 relative"
              style={{ width: `${percentageIncomeUsed}%` }} // Used part
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-1 border-t border-gray-200 pt-2 px-4 flex items-center justify-between">
        <AvatarGroup>
          {collaborators.map((collaborator) => (
            <Avatar key={collaborator.uid} src={collaborator.picture} />
          ))}
        </AvatarGroup>
        <Link
          href={`/budget/${budgetId}`}
          className="flex gap-1 items-center text-lemonGreen-600 text-sm"
        >
          <span>Review Expenses</span> <BsChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
