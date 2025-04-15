import Button from '@/app/_components/button';
import moneyImg from '/public/images/budget/total-income.png';
import inviteCollabratorImg from '/public/images/budget/invite-collaborator.png';
import moneyIcon from '/public/images/icons/money.svg';
import emptyListImg from '/public/images/empty-list.png';
import Image from 'next/image';
import AddIncomeDrawer from '@/app/_components/drawers/AddIncome';
import { BsPerson, BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import EmptyState from '@/app/_components/emptyState';
import AppPopover from '@/app/_components/popover';
import Loader from '@/app/_components/loader';
import { Collaborator, Income } from '@/app/types/budget';
import useIncomeTab from './useIncomeTab';
import { Icons } from '@/app/icons';
import InviteCollaboratorDrawer from '@/app/_components/drawers/InviteCollaborator';
import AllocationItem from '@/app/_components/allocationItem';

type Props = {
  budgetId: string;
  isLoadingBudgetDetails: boolean;
  collaborators: Collaborator[];
};

export default function IncomeTab({
  budgetId,
  isLoadingBudgetDetails,
  collaborators,
}: Props) {
  const {
    showIncomeDrawer,
    setShowIncomeDrawer,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetIncomes,
    isLoadingBudgetIncomes,
    totalIncome,
  } = useIncomeTab({ budgetId });

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 bg-white rounded-3xl ">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-lemonGreen-200 flex items-center justify-center">
            <Image src={moneyImg} width={45} height={40} alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Total Income</p>
            <h6 className="text-xl text-black-800 font-bold">
              ₦ {totalIncome?.toLocaleString()}
            </h6>
          </div>
        </div>
        <div className="px-4 py-5">
          <div className="space-y-[10px]">
            <div className="flex items-center justify-between">
              <p className="text-black-800 font-medium">All Income Stream</p>
              <Button
                onClick={() => setShowIncomeDrawer(true)}
                buttonIcon={<BsPlus size={16} />}
                buttonTitle="Add income"
                buttonType="icon"
              />
            </div>
            {isLoadingBudgetIncomes ? (
              <Loader />
            ) : budgetIncomes.length > 0 ? (
              budgetIncomes.map((income: Partial<Income>) => (
                <AllocationItem
                  type="income"
                  key={income.uid}
                  name={income.name ?? ''}
                  amount={income.amount ?? 0}
                />
              ))
            ) : (
              <EmptyState
                image={emptyListImg}
                title="You are yet to add your income"
                description=" Click the “Add Income” button above to get started."
              />
            )}
          </div>
        </div>
      </div>
      <div className="border border-gray-200 bg-white rounded-3xl p-6">
        <div className="space-y-4">
          <p className="text-black-800 font-medium text-lg">Collaborators</p>

          {isLoadingBudgetDetails ? (
            <Loader />
          ) : (
            // TODO: create a component for collaborator and import it
            collaborators.map((collaborator) => (
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
                    <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
                      <BsPerson />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-black-800 text-base font-medium text-center">
                      {collaborator.name}
                    </p>
                    {/* <p className="text-gray-400">{collaborator?.email}</p> */}
                  </div>
                </div>
                <p className="text-gray-400 rounded-[10px] bg-white text-[10px] px-2 py-0.5">
                  {collaborator.isHost ? 'HOST' : 'GUEST'}
                </p>
              </div>
            ))
          )}
          <div className="bg-lemonGreen-50 rounded-2xl border border-lemonGreen-600 p-4 flex items-center gap-3">
            <button onClick={() => setShowInviteCollaboratorDrawer(true)}>
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

      {showIncomeDrawer && (
        <AddIncomeDrawer
          show={showIncomeDrawer}
          setShow={setShowIncomeDrawer}
          budgetId={budgetId}
        />
      )}
      {showInviteCollaboratorDrawer && (
        <InviteCollaboratorDrawer
          show={showInviteCollaboratorDrawer}
          setShow={setShowInviteCollaboratorDrawer}
          budgetId={budgetId}
        />
      )}
    </div>
  );
}
