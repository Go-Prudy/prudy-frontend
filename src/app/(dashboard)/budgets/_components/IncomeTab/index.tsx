import React, { useState } from 'react';
import Button from '@/app/_components/button';
import moneyImg from '/public/images/budget/total-income.png';
import inviteCollabratorImg from '/public/images/budget/invite-collaborator.png';

import moneyIcon from '/public/images/icons/money.svg';

import emptyListImg from '/public/images/empty-list.png';

import Image from 'next/image';
import { getSingleBudgetApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { FaUser } from 'react-icons/fa';
import AddIncomeDrawer from '@/app/_components/drawers/AddIncome';
import { BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import EmptyState from '@/app/_components/emptyState';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import AppPopover from '@/app/_components/popover';

type Props = { budgetId: string };

export default function IncomeTab({ budgetId }: Props) {
  const { authenticatedUser } = useAuthentication();
  const [showIncomeDrawer, setShowIncomeDrawer] = useState<boolean>(false);

  //   const { data: budgetInfo = [], isPending: isBudgetInfoPending } = useQuery({
  //     queryKey: ['getSingleBudgetInfo' + budgetId],
  //     queryFn: () => getSingleBudgetApi(authenticatedUser?.token ?? '', budgetId),
  //     enabled: !!authenticatedUser?.token && !!budgetId,
  //     refetchOnWindowFocus: true, // This should be directly in the options object.
  //   });

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 bg-white rounded-3xl ">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-lemonGreen-200 flex items-center justify-center">
            <Image src={moneyImg} width={45} height={40} alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Total Income</p>
            <h6 className="text-xl text-black-800 font-bold">₦250,000.00</h6>
          </div>
        </div>
        <div className="px-4 py-5">
          <div className="flex items-center justify-between">
            <p className="text-black-800 font-medium">All Income Stream</p>
            <Button
              onClick={() => setShowIncomeDrawer(true)}
              buttonIcon={<BsPlus size={16} />}
              buttonTitle="Add income"
              buttonType="icon"
            />
          </div>

          {/* income list.... TODO: Fetch income list from API */}
          <div className=" py-[10px] pb-5">
            <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2">
                <Image src={moneyIcon} className="size-8" alt={'icon'} />
                <p className="text-black-800 text-base font-medium">Salary</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-black-800 text-base font-medium">₦ 250,000</p>
                <AppPopover
                  trigger={
                    <button className="dots-button">
                      <BsThreeDotsVertical className="text-gray-400" />
                    </button>
                  }
                >
                  <button>Edit</button>
                  <button>Delete</button>
                </AppPopover>
              </div>
            </div>
          </div>

          {/* empty state*/}

          {/* <EmptyState
            image={emptyListImg}
            title="You are yet to add your income"
            description=" Click the “Add Income” button above to get started."
          /> */}
        </div>
      </div>
      <div className="border border-gray-200 bg-white rounded-3xl p-6">
        <div className="">
          <p className="text-black-800 font-medium text-lg">Collaborators</p>
          <div className="space-y-4">
            {/* TODO: Fetch colaborator list from API */}
            {/* {budgetInfo.collaborators.map((collaborator) => (
              <div
                key={collaborator?.uid}
                className="bg-gray-100 rounded-2xl border border-gray-200 p-4 flex items-start gap-1 justify-between"
              >
                <div className="flex items-center gap-3">
                  {collaborator?.picture ? (
                    <Image
                      src={collaborator.picture}
                      alt={collaborator.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover object-center rounded-full "
                    />
                  ) : (
                    <FaUser className="text-[30px] text-[#A3A3A3]" />
                  )}
                  <div className="space-y-2">
                    <p className="text-black-800 text-base font-medium text-center">
                      {collaborator.name}
                    </p>
                    <p className="text-gray-400">{collaborator?.email}</p>
                  </div>
                </div>
                <p className="text-gray-400 rounded-[10px] bg-white text-[10px] px-2 py-0.5">
                  {collaborator.isHost ? 'HOST' : 'GUEST'}
                </p>
              </div>
            ))} */}
            <div className="bg-lemonGreen-50 rounded-2xl border border-lemonGreen-600 p-4 flex items-center gap-3">
              <button>
                <Image
                  src={inviteCollabratorImg}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover object-center rounded-full "
                />
              </button>
              <p className="text-black-800 text-base font-medium text-center">
                Invite a collaborator
              </p>
            </div>
          </div>
        </div>
      </div>

      {showIncomeDrawer && (
        <AddIncomeDrawer
          show={showIncomeDrawer}
          setShow={setShowIncomeDrawer}
          budgetId={budgetId}
        />
      )}
    </div>
  );
}
