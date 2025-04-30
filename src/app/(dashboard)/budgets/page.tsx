'use client';
import budgetHeaderIcon from '/public/images/header/budget.png';
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import noBudgetImg from '/public/images/List 2.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from '@nextui-org/react';
import InviteModal from '@/components/InviteModal';
import Button from '@/app/_components/button';
import DashboardHeader from '@/components/Header/DashboardHeader';
import CreateBudgetDrawer from '@/app/_components/drawers/CreateBudget';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import InviteCollaboratorDrawer from '@/app/_components/drawers/InviteCollaborator';
import useBudgets from './useBudgets';
import { useRouter } from 'next/navigation';

interface Partner {
  image: string;
  uid: string;
  name: string;
  picture: string;
}

interface AvatarGroupProps {
  partners: Partner[];
  expenseWidth: number;
  treshold: number;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  partners,
  expenseWidth,
  treshold,
}) => {
  const maxAvatarsToShow = 3; // Maximum avatars to display
  const additionalCount = partners?.length - maxAvatarsToShow;

  return (
    <div
      className={`relative flex  items-center ${expenseWidth <= treshold ? 'mt-0' : ''}`}
    >
      {partners
        ?.slice(0, maxAvatarsToShow)
        ?.map((partner, index) =>
          partner.picture ? (
            <Image
              key={partner.uid}
              width={32}
              height={32}
              src={partner.picture}
              alt={partner.name}
              className={`relative inline-block rounded-full border-2 border-white object-cover w-8 h-8 ${index > 0 ? '-ml-2' : ''}`}
              style={{ zIndex: maxAvatarsToShow - index }}
            />
          ) : (
            <BsPersonFill
              key={partner.uid}
              className={`relative size-[32px] p-1 inline-block rounded-full border-2 border-white text-[#828282] object-cover ${index > 0 ? '-ml-2' : ''}`}
            />
          ),
        )}

      {additionalCount > 0 && (
        <div className="relative ml-[-0.35rem] w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center">
          +{additionalCount}
        </div>
      )}
    </div>
  );
};

const BudgetPage = () => {
  const {
    showInvites,
    setShowInvites,
    createBudgetComponent,
    setCreateBudgetComponent,
    treshold,
    setTreshold,
    showInviteCollaboratorDrawer,
    setShowInviteCollaboratorDrawer,
    activeTooltip,
    setActiveTooltip,
    inviteBudgetId,
    setInviteBudgetId,
    budgets,
    deleteBudgetMutation,
    isPending,
    getPendingInvitesApiData,
    refetchAllBudgets,
  } = useBudgets();

  const navigate = useRouter();

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
          <div className="relative w-full max-w-[500px] overscroll-none bg-no-repeat bg-contain bg-top transition-all duration-300 ease-out min-h-screen">
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

            <div className="min-h-[400px] w-full">
              {isPending ? (
                <div className="flex flex-col mb-[90px] gap-6 p-6">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-[100px] w-full rounded-[20px]" />
                  ))}
                </div>
              ) : budgets?.length === 0 ? (
                <div className="py-[65px] text-center flex-col gap-2 flex justify-center items-center px-[51px]">
                  <Image
                    src={noBudgetImg.src}
                    width={1000}
                    height={1000}
                    className="size-[124px] mb-[8px]"
                    alt=""
                  />
                  <h1 className="font-medium leading-[24px]">
                    You do not have any budget history yet.
                  </h1>
                  <h1 className="text-[14px] text-[#828282] leading-[16.8px]">
                    Click the create button above to <br /> get started.
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col pb-[90px] gap-6 p-6 bg-gray-100">
                  {budgets?.map((budget: any, index: any) => {
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

                    const dynamicThreshold =
                      (totalBudgetIncome / maxBudgetValue) * 100 || 15;

                    return (
                      <div
                        onClick={() => navigate.push(`/budget/${budget.uid}`)}
                        key={index}
                        className="cursor-pointer bg-white rounded-[20px] flex flex-col relative border border-gray-200 gap-2 py-4"
                      >
                        <div className="px-4 w-full justify-between items-center flex">
                          <h1 className="text-[16px] font-medium leading-[24px]">
                            {budget.name}
                          </h1>
                          <div className="flex items-center text-xs gap-[12px] text-[#828282]">
                            <button className="bg-gray-100 rounded-[10px] px-[8px] py-[2px]">
                              {budget.type}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(
                                  activeTooltip === budget.uid ? null : budget.uid,
                                );
                              }}
                              className="bg-gray-100 z-20 rounded-full h-6 w-6 flex items-center justify-center px-2 py-0.5"
                            >
                              <BsThreeDotsVertical />
                            </button>
                            {activeTooltip === budget.uid && (
                              <div className="absolute z-[12] bg-gray-100 border flex flex-col gap-[8px] top-[40px] right-[10px] rounded shadow-md mt-2 p-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTooltip(null);
                                  }}
                                  className="block w-full text-left"
                                >
                                  Duplicate
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBudgetMutation.mutate(budget.uid);
                                  }}
                                  className="block w-full text-left"
                                >
                                  {deleteBudgetMutation.isPending
                                    ? 'deleting...'
                                    : 'Delete'}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInviteBudgetId(budget.uid);
                                    setShowInviteCollaboratorDrawer(true);
                                    setActiveTooltip(null);
                                  }}
                                  className="block w-full text-left"
                                >
                                  Invite Collaborator
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="px-4 mt-[8px] flex flex-col gap-2 w-full">
                          <div className="flex flex-col gap-1">
                            <h1 className="flex justify-between w-full text-gray-600">
                              <span className="text-[10px]">Income</span>
                              <span className={`font-medium text-xs`}>
                                {totalBudgetIncome.toLocaleString('en-NG', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                            </h1>
                            <div className="relative w-full bg-white rounded">
                              <div
                                style={{
                                  width: `${incomeWidth}%`,
                                  backgroundColor: '#11CDEF',
                                  maxWidth: '100%',
                                }}
                                className="h-3 rounded"
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              width: `${expenseWidth}%`,
                              maxWidth: '100%',
                            }}
                            className="flex flex-col relative  gap-1"
                          >
                            <h1 className="flex justify-between w-full text-gray-600">
                              <span className="text-[10px]">Expenses</span>
                              <span
                                className={` ${expenseWidth <= dynamicThreshold ? 'hidden' : 'block'} font-medium text-xs`}
                              >
                                ₦ {totalBudgetExpenses.toLocaleString()}
                              </span>
                            </h1>
                            <div className="relative w-full bg-white rounded">
                              <div
                                style={{
                                  width: `${expenseWidth}%`,
                                  backgroundColor: '#F89446',
                                  maxWidth: '100%',
                                }}
                                className="h-3 rounded"
                              />
                            </div>
                            <div
                              className={` flex  ${expenseWidth <= dynamicThreshold ? 'block' : 'hidden'} text-gray-600 font-medium text-xs`}
                            >
                              ₦{totalBudgetExpenses.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className=" z-1 relative w-full border-t border-gray-200 pt-2 px-4">
                          {budget?.collaborators.length === 0 ? null : (
                            <AvatarGroup
                              partners={budget?.collaborators}
                              expenseWidth={3}
                              treshold={treshold}
                            />
                          )}
                        </div>
                      </div>
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
          refetchAllBudgets={refetchAllBudgets}
          getPendingInvitesApiData={getPendingInvitesApiData}
          show={showInvites}
          setShow={setShowInvites}
        />
      )}
      {showInviteCollaboratorDrawer && (
        <InviteCollaboratorDrawer
          budgetId={inviteBudgetId ?? ''}
          show={showInviteCollaboratorDrawer}
          setShow={setShowInviteCollaboratorDrawer}
        />
      )}
    </motion.div>
  );
};

export default BudgetPage;
