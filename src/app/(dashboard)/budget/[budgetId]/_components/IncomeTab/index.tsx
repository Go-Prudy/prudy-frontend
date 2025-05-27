import Button from '@/app/_components/button';
import moneyImg from '/public/images/budget/total-income.png';
import inviteCollabratorImg from '/public/images/budget/invite-collaborator.png';
import emptyListImg from '/public/images/empty-list.png';
import Image from 'next/image';
import AddIncomeDrawer from '@/app/_components/drawers/AddIncome';
import { BsPlus } from 'react-icons/bs';
import EmptyState from '@/app/_components/emptyState';
import Loader from '@/app/_components/loader';
import { Collaborator, Income } from '@/app/types/budget';
import useIncomeTab from './useIncomeTab';
import InviteCollaboratorDrawer from '@/app/_components/drawers/InviteCollaborator';
import AllocationItem from '@/app/_components/allocationItem';
import CollaboratorItem from './collaborator';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';

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
  const navigate = useRouter();
  const { userData } = useAuthStore();
  const {
    showIncomeDrawer,
    setShowIncomeDrawer,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetIncomes,
    isLoadingBudgetIncomes,
    totalIncome,
    handleEdit,
    handleDelete,
    selectedIncome,
    deleteIncomeMutation,
  } = useIncomeTab({ budgetId });

  return (
    <div className="space-y-6 bg-gray-100 p-4">
      <div className="border border-gray-200 bg-white rounded-3xl ">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-lemonGreen-200 flex items-center justify-center">
            <Image src={moneyImg} width={45} height={40} alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Total Income</p>
            <h6 className="text-xl text-black-800 font-bold">
              <span>₦{totalIncome?.toLocaleString()}</span>
              <span className="text-sm">.00</span>
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
              budgetIncomes.map((income: Income) => (
                <AllocationItem
                  type="income"
                  key={income.uid}
                  name={income.name ?? ''}
                  amount={income.amount ?? 0}
                  handleDelete={() => handleDelete(income)}
                  handleEdit={() => handleEdit(income)}
                  isLoadingDelete={deleteIncomeMutation.isPending}
                  isLoadingEdit={false}
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
          ) : collaborators.length > 0 ? (
            collaborators.map((collaborator) => (
              <CollaboratorItem
                key={collaborator?.uid}
                picture={collaborator?.picture}
                name={collaborator?.name}
                isHost={collaborator?.isHost}
                email={collaborator?.email}
              />
            ))
          ) : (
            <CollaboratorItem
              picture={userData?.profile.profilePhotoUrl || ''}
              name={`${userData?.profile.firstName} ${userData?.profile.lastName}`}
              email={userData?.profile.email}
              isHost
            />
          )}
          <div className="bg-lemonGreen-50 rounded-2xl border border-dashed border-lemonGreen-600 p-3 sm:p-4 flex items-center gap-3">
            <button onClick={() => setShowInviteCollaboratorDrawer(true)}>
              <Image
                src={inviteCollabratorImg}
                alt=""
                width={40}
                height={40}
                className="w-8 sm:w-10 h-8 sm:h-10 object-cover object-center rounded-full "
              />
            </button>
            <p className="text-black-800 text-sm sm:text-base font-medium text-center">
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
          name={selectedIncome?.name}
          amount={selectedIncome?.amount.toString()}
          incomeId={selectedIncome?.uid}
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
