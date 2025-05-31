import { Avatar, AvatarGroup } from '@nextui-org/react';
import React, { Dispatch, SetStateAction } from 'react';
import { BsChevronRight, BsThreeDotsVertical } from 'react-icons/bs';
import AppPopover from '../popover';
import { Budget, CreateBudgetForm } from '@/app/types/budget';
import cn from 'classnames';
import Link from 'next/link';

type Props = {
  budget: Budget;
  incomeWidth: number;
  expenseWidth: number;
  setBudgetId: Dispatch<SetStateAction<string | null>>;
  setShowInviteCollaboratorDrawer: Dispatch<SetStateAction<boolean>>;
  setShowDeleteBudgetModal: Dispatch<SetStateAction<boolean>>;
  setTypeOfDrawer?: Dispatch<SetStateAction<'create' | 'edit'>>;
  setCreateBudgetComponent?: Dispatch<SetStateAction<boolean>>;
  setBudgetData?: Dispatch<SetStateAction<CreateBudgetForm | undefined>>;
  duplicateBudget?: (id: string) => void;
  duplicateBudgetLoading?: boolean;
};

const actions = [
  { name: 'Edit Budget', key: 'edit' },
  { name: 'Duplicate', key: 'duplicate' },
  { name: 'Delete', key: 'delete' },
  { name: 'Invite Collaborator', key: 'invite' },
];

export default function BudgetItem({
  budget,
  incomeWidth,
  expenseWidth,
  setBudgetId,
  setShowInviteCollaboratorDrawer,
  setShowDeleteBudgetModal,
  setTypeOfDrawer,
  setCreateBudgetComponent,
  setBudgetData,
  duplicateBudget,
  duplicateBudgetLoading,
}: Props) {
  return (
    <div className="bg-white rounded-[20px] flex flex-col relative border border-gray-200 gap-2 py-4">
      <div className="px-4 w-full justify-between items-center flex">
        <h1 className="text-[16px] font-medium leading-[24px]">{budget?.name}</h1>
        <div className="flex items-center text-xs gap-[12px] text-[#828282]">
          <button className="bg-gray-100 rounded-[10px] px-[8px] py-[2px]">
            {budget?.type}
          </button>
          <AppPopover
            placement="bottom-end"
            trigger={
              <button className="bg-gray-100 z-20 rounded-full h-6 w-6 flex items-center justify-center px-2 py-0.5">
                <BsThreeDotsVertical />
              </button>
            }
          >
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => {
                  if (action.key === 'edit') {
                    setTypeOfDrawer?.('edit');
                    setBudgetId(budget?.uid);
                    setBudgetData?.({
                      name: budget?.name,
                      purpose: budget?.purpose,
                      startDate: budget?.startDate,
                      endDate: budget?.endDate,
                    });
                    setCreateBudgetComponent?.(true);
                  }
                  if (action.key === 'duplicate') {
                    duplicateBudget?.(budget?.uid);
                  }
                  if (action.key === 'delete') {
                    setBudgetId(budget?.uid);
                    setShowDeleteBudgetModal(true);
                  }
                  if (action.key === 'invite') {
                    setBudgetId(budget?.uid);
                    setShowInviteCollaboratorDrawer(true);
                  }
                }}
                className="block w-full text-left"
              >
                {action.key === 'duplicate' && duplicateBudgetLoading
                  ? 'loading...'
                  : action.name}
              </button>
            ))}
          </AppPopover>
        </div>
      </div>
      <div className="px-4 mt-[8px] flex flex-col gap-2 w-full">
        <div className="space-y-1">
          <h1 className="flex justify-between w-full text-gray-600">
            <span className="text-[10px]">Income</span>
            <span className={`font-medium text-xs`}>
              ₦ {budget?.totalIncome.toLocaleString()}
            </span>
          </h1>
          <div
            style={{
              width: `${incomeWidth}%`,
              backgroundColor: '#11CDEF',
              maxWidth: '100%',
            }}
            className="h-3 rounded"
          />
        </div>

        <div
          className="relative space-y-1 w-fit"
          // style={{ width: `${expenseWidth}%`, minWidth: '75px' }}
        >
          <p className="flex justify-between w-full text-gray-600 gap-2">
            <span className="text-[10px]">Expenses</span>
            <span
              className={cn(
                'font-medium text-xs',
                // expenseWidth < 25 ? 'hidden' : 'block',
              )}
            >
              ₦ {budget?.totalExpenses.toLocaleString()}
            </span>
          </p>
          <div
            style={{
              width: `${expenseWidth}%`,
              backgroundColor: '#F89446',
              maxWidth: '100%',
            }}
            className="h-3 rounded"
          />
          {/* <span
            className={cn('font-medium text-xs', expenseWidth < 25 ? 'block' : 'hidden')}
          >
            ₦ {budget?.totalExpenses.toLocaleString()}
          </span> */}
        </div>
      </div>
      <div className="w-full mt-1 border-t border-gray-200 pt-2 px-4 flex items-center justify-between">
        <AvatarGroup>
          {budget?.collaborators.map((collaborator) => (
            <Avatar key={collaborator.uid} src={collaborator.picture} />
          ))}
        </AvatarGroup>
        <Link
          href={`/budget/${budget?.uid}`}
          className="flex gap-1 items-center text-lemonGreen-600 text-sm"
        >
          <span>View details</span> <BsChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
