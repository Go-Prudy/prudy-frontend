'use client';
import budgetHeaderIcon from '/public/images/header/budget.png';
import noBudgetImg from '/public/images/List 2.webp';
import { motion } from 'framer-motion';
import { Skeleton } from '@nextui-org/react';
import InviteModal from '@/components/InviteModal';
import Button from '@/app/_components/button';
import DashboardHeader from '@/components/Header/DashboardHeader';
import CreateBudgetDrawer from '@/app/_components/drawers/CreateBudget';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import InviteCollaboratorDrawer from '@/app/_components/drawers/InviteCollaborator';
import useBudgets from './useBudgets';
import EmptyState from '@/app/_components/emptyState';
import { Budget } from '@/app/types/budget';
import BudgetItem from '@/app/_components/budgetComponents/budgetItem';
import LoadingModal from '@/app/_components/modals/LoadingModal';
import DeleteBudgetModal from '@/app/_components/modals/DeleteBudget';

const BudgetPage = () => {
  const {
    showInvites,
    setShowInvites,
    createBudgetComponent,
    setCreateBudgetComponent,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    budgetId,
    setBudgetId,
    budgets,
    deleteBudgetMutation,
    isPending,
    getPendingInvitesApiData,
    showDeleteBudgetModal,
    setShowDeleteBudgetModal,
    // refetchAllBudgets,
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

            <div className="flex items-center justify-between gap-3 w-full pt-6 pb-4 px-6">
              <h2 className="text-lg font-medium">All Budgets</h2>
              <Button
                onClick={() => setCreateBudgetComponent(!createBudgetComponent)}
                className="text-xs py-2 px-3 rounded-xl !w-fit"
              >
                Create Budget
              </Button>
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
                        budget={budget}
                        incomeWidth={incomeWidth}
                        expenseWidth={expenseWidth}
                        setBudgetId={setBudgetId}
                        setShowInviteCollaboratorDrawer={setShowInviteCollaboratorDrawer}
                        setShowDeleteBudgetModal={setShowDeleteBudgetModal}
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
          show={createBudgetComponent}
          setShow={setCreateBudgetComponent}
        />
      )}
      {showInvites && getPendingInvitesApiData.length > 0 && (
        <InviteModal
          // refetchAllBudgets={refetchAllBudgets}
          getPendingInvitesApiData={getPendingInvitesApiData}
          show={showInvites}
          setShow={setShowInvites}
        />
      )}
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
