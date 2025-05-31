'use client';
import budgetHeaderIcon from '/public/images/header/budget.png';
import noBudgetImg from '/public/images/List 2.webp';
import { motion } from 'framer-motion';
import { Skeleton } from '@nextui-org/react';
import Button from '@/app/_components/button';
import DashboardHeader from '@/app/_components/Header/DashboardHeader';
import CreateBudgetDrawer from '@/app/_components/drawers/CreateBudget';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import InviteCollaboratorDrawer from '@/app/_components/drawers/InviteCollaborator';
import useBudgets from './useBudgets';
import EmptyState from '@/app/_components/emptyState';
import { Budget } from '@/app/types/budget';
import BudgetItem from '@/app/_components/budgetComponents/budgetItem';
import LoadingModal from '@/app/_components/modals/LoadingModal';
import DeleteBudgetModal from '@/app/_components/modals/DeleteBudget';
import ActionModal from '@/app/_components/modals/ActionModal';
import handShakeGif from '/public/images/hand-shake.gif';
import { BsChevronDown } from 'react-icons/bs';
import AppPopover from '@/app/_components/popover';
import { Icons } from '@/app/icons';

const actions = [
  {
    name: 'Create Budget',
    key: 'create',
    icon: Icons.add,
  },
  {
    name: 'Duplicate Budget',
    key: 'duplicate',
    icon: Icons.copy,
  },
];

const BudgetPage = () => {
  const {
    showInvitesModal,
    setShowInvitesModal,
    createBudgetComponent,
    setCreateBudgetComponent,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetId,
    setBudgetId,
    typeOfDrawer,
    setTypeOfDrawer,
    budgetData,
    setBudgetData,
    budgets,
    deleteBudgetMutation,
    isPending,
    getPendingInvitesApiData,
    showDeleteBudgetModal,
    setShowDeleteBudgetModal,
    // refetchAllBudgets,
    rejectInviteMutation,
    acceptInviteMutation,
    duplicateBudgeteMutation,
  } = useBudgets();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[72px]"
    >
      <DashboardWrapper>
        <div className="">
          <div className="relative w-full">
            <DashboardHeader
              type="dashboard"
              title="Budgets"
              description="Be a step ahead of your expenses"
              headerIcon={budgetHeaderIcon}
              headerTitle="Budget smarter, Live better."
              headerIconClass="mr-[-14px] w-[112px] h-[112px]"
            />

            <div className="flex items-center justify-between gap-3 w-full pt-6 pb-4 px-6 relative">
              <h2 className="text-lg font-medium">All Budgets</h2>

              <AppPopover
                trigger={
                  <button className="flex items-center gap-1 bg-lemonGreen-400 font-medium text-xs py-2 px-3 rounded-xl !w-fit">
                    Create Budget <BsChevronDown size={12} />
                  </button>
                }
                placement="bottom-end"
              >
                {actions.map((action) => (
                  <button
                    onClick={() => {
                      if (action.key === 'create') {
                        setCreateBudgetComponent(true);
                      } else if (action.key === 'duplicate') {
                        setCreateBudgetComponent(true);
                      }
                    }}
                    key={action.key}
                  >
                    {action.name}
                  </button>
                ))}
              </AppPopover>
            </div>

            <div className="w-full">
              {isPending ? (
                <div className="flex flex-col gap-4 p-4">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-[100px] w-full rounded-[20px]" />
                  ))}
                </div>
              ) : budgets?.length === 0 ? (
                <EmptyState
                  image={noBudgetImg}
                  title="You do not have any budget history yet."
                />
              ) : (
                <div className="space-y-4 p-4 bg-gray-100">
                  {budgets?.map((budget: Budget) => {
                    const totalBudgetIncome = Number(budget?.totalIncome) || 0;
                    const totalBudgetExpenses = Number(budget?.totalExpenses) || 0;

                    const maxBudgetValue =
                      Math.max(totalBudgetIncome, totalBudgetExpenses) || 0;

                    const incomeWidth =
                      maxBudgetValue > 0
                        ? Math.min((totalBudgetIncome / maxBudgetValue) * 100, 100)
                        : 0;
                    const expenseWidth =
                      maxBudgetValue > 0
                        ? Math.min((totalBudgetExpenses / maxBudgetValue) * 100, 100)
                        : 0;

                    return (
                      <BudgetItem
                        key={budget.uid}
                        budget={budget}
                        incomeWidth={incomeWidth}
                        expenseWidth={expenseWidth}
                        setBudgetId={setBudgetId}
                        setShowInviteCollaboratorDrawer={setShowInviteCollaboratorDrawer}
                        setShowDeleteBudgetModal={setShowDeleteBudgetModal}
                        setTypeOfDrawer={setTypeOfDrawer}
                        setCreateBudgetComponent={setCreateBudgetComponent}
                        setBudgetData={setBudgetData}
                        duplicateBudget={async (id) =>
                          duplicateBudgeteMutation.mutateAsync(id)
                        }
                        duplicateBudgetLoading={duplicateBudgeteMutation.isPending}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardWrapper>
      {createBudgetComponent && (
        <CreateBudgetDrawer
          type={typeOfDrawer}
          show={createBudgetComponent}
          setShow={setCreateBudgetComponent}
          budgetData={budgetData}
          budgetId={budgetId ?? ''}
        />
      )}

      <ActionModal
        image={handShakeGif}
        isOpen={showInvitesModal}
        onClose={() => setShowInvitesModal(false)}
        title="Collaboration Invite"
        text={`You have been invited by ${getPendingInvitesApiData?.[0]?.owner ? getPendingInvitesApiData?.[0]?.owner?.firstName + ' ' + getPendingInvitesApiData?.[0]?.owner?.lastName : 'Unknown User'} to collaborate on ${getPendingInvitesApiData?.[0]?.budget?.name ?? 'Unnamed Budget'}`}
        showCloseButton={false}
      >
        <Button
          onClick={() =>
            rejectInviteMutation.mutate(
              getPendingInvitesApiData[0]?.uid,
              getPendingInvitesApiData[0]?.budget?.uid,
            )
          }
          loading={rejectInviteMutation.isPending}
          className="!bg-lemonGreen-100 !text-lemonGreen-900"
        >
          Decline
        </Button>
        <Button
          onClick={() =>
            acceptInviteMutation.mutate(
              getPendingInvitesApiData[0]?.uid,
              getPendingInvitesApiData[0]?.budget?.uid,
            )
          }
          loading={acceptInviteMutation.isPending}
        >
          Accept invite
        </Button>
      </ActionModal>

      {showInviteCollaboratorDrawer && (
        <InviteCollaboratorDrawer
          budgetId={budgetId ?? ''}
          show={showInviteCollaboratorDrawer}
          setShow={setShowInviteCollaboratorDrawer}
        />
      )}
      <LoadingModal
        isOpen={deleteBudgetMutation.isPending}
        onClose={() => {}}
        text="Please wait..."
      />
      <DeleteBudgetModal
        showDeleteBudgetModal={showDeleteBudgetModal}
        handleCloseDeleteModal={() => setShowDeleteBudgetModal(false)}
        budgetId={budgetId ?? ''}
        handleOpenSuccessfulModal={() => {}}
      />
    </motion.div>
  );
};

export default BudgetPage;
