'use client';
import Image, { StaticImageData } from 'next/image';
import linkIcon from '/public/images/Mindmap.png';
import { BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import { motion } from 'framer-motion';

import DashboardHeader from '@/app/_components/Header/DashboardHeader';
import trackHeaderIcon from '/public/images/header/track.png';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import syncTransactionImage from '/public/images/quick-actions/4.png';
import scanReceiptImage from '/public/images/quick-actions/3.png';
import addManuallyImage from '/public/images/quick-actions/5.png';
import AddManualExpenseDrawer from '@/app/_components/drawers/AddManualExpense';
import SelectBankAccountDrawer from '@/app/_components/drawers/SelectBankAccount';
import SectionHeader from '@/app/_components/Header/SectionHeader';
import Loader from '@/app/_components/loader';
import { EmptyStateDarkBg } from '@/app/_components/emptyState';
import { getLastFourDigits } from '@/app/utils/functions';
import AppPopover from '@/app/_components/popover';
import { useRouter } from 'next/navigation';
import ScanReceipt from '@/app/_components/scanner';
import useTrackPage from './useTrackPage';
import { useState } from 'react';
import SelectSyncPeriodDrawer from '@/app/_components/drawers/SelectSyncPeriod';
import { DateValue } from '@/app/types/index';

type QuickActionType = {
  id: string;
  title: string;
  image: StaticImageData;
  bgColor: string;
  borderColor: string;
};

const quickActions: QuickActionType[] = [
  {
    id: 'sync',
    title: 'Sync Transactions',
    image: syncTransactionImage,
    bgColor: '#FBE9DA',
    borderColor: '#F89446',
  },
  {
    id: 'scan',
    title: 'Scan your Receipt',
    image: scanReceiptImage,
    bgColor: '#F4DEF2',
    borderColor: '#E149C0',
  },
  {
    id: 'manual',
    title: 'Add Exp. Manually',
    image: addManuallyImage,
    bgColor: '#D9D9FA',
    borderColor: '#3A36F5',
  },
];

export default function Page() {
  const {
    linkAccountMutation,
    handleBudgetChange,
    handleRemoveAccount,
    showSelectBankAccountDrawer,
    setShowSelectBankAccountDrawer,
    showAddManualDrawer,
    setShowAddManualDrawer,
    showScanner,
    setShowScanner,
    linkedAccounts,
    isGetAllLinkedAccountsLoading,
    activeBudgetCategories,
    isLoadingCategories,
    budgets,
    isLoadingBudgets,
    selectedBudgetId,
  } = useTrackPage();

  const [value, setValue] = useState<DateValue>(new Date());
  const [showSyncPeriodDrawer, setShowSyncPeriodDrawer] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px] pb-8"
    >
      <DashboardWrapper>
        <div className="bg-white w-full relative max-w-[680px]">
          <DashboardHeader
            type="dashboard"
            title="Track"
            headerIcon={trackHeaderIcon}
            headerTitle2="No Money Mysteries."
            headerTitle="Track It Like A Pro!"
            headerIconClass="mr-[-14px] w-[100px] h-[100px]"
            headerTitleClass="text-[28px]"
            description="Know where your money is going with Prudy"
            budgets={budgets}
            handleBudgetChange={handleBudgetChange}
            isLoadingBudgets={isLoadingBudgets}
          />

          <div className="px-6">
            {/* track finances */}
            <div className="space-y-4 py-6">
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="w-full px-3 py-4 rounded-3xl border text-black-800 flex flex-col items-center gap-2"
                    style={{
                      borderColor: action.borderColor,
                      backgroundColor: action.bgColor,
                    }}
                    onClick={() => {
                      if (action.id === 'sync') {
                        setShowSelectBankAccountDrawer(true);
                      }
                      if (action.id === 'scan') {
                        setShowScanner(true);
                      }
                      if (action.id === 'manual') {
                        setShowAddManualDrawer(true);
                      }
                    }}
                  >
                    <div className="bg-white rounded-xl w-fit p-1 w-[60px] h-[60px] flex items-center justify-center">
                      <Image src={action.image} alt={action.id} width={54} height={54} />
                    </div>
                    <p className="text-sm font-medium leading-4">{action.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* linked accounts */}
            <div className="space-y-4 pb-6">
              <SectionHeader
                title="Linked Accounts"
                onClick={async () => linkAccountMutation.mutateAsync()}
                buttonText="Add Account"
                icon={<BsPlus />}
                isLoading={linkAccountMutation.isPending}
              />

              {isGetAllLinkedAccountsLoading ? (
                <Loader />
              ) : linkedAccounts.length > 0 ? (
                linkedAccounts.map((account: any, index: any) => (
                  <div
                    onClick={() => {
                      setSelectedAccountId(account.uid);
                      setShowSyncPeriodDrawer(true);
                    }}
                    key={account.uid}
                    className="p-4 bg-gray-100 border border-gray-200 rounded-[20px] w-full flex justify-between relative cursor-pointer transition hover:opacity-70"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Image
                          width={100}
                          height={100}
                          src={account.institutionLogo}
                          alt={account.institutionName}
                          className="size-6 rounded-full"
                        />
                        <p className="font-medium ">{account.institutionName}</p>
                      </div>

                      <div className="flex gap-2 justify-between">
                        <p className="text-sm sm:text-base">{account.accountName}</p>
                        <p className="font-medium text-sm sm:text-base">
                          ****{getLastFourDigits(account.accountNumber)}
                        </p>
                      </div>
                    </div>
                    <AppPopover
                      trigger={
                        <button
                          className="size-5 flex items-center justify-center bg-white rounded text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BsThreeDotsVertical />
                        </button>
                      }
                      placement="bottom-end"
                    >
                      <button
                        className="flex gap-2 items-center justify-center text-xs text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAccount(account.uid);
                        }}
                      >
                        <span className="text-white size-4 rounded bg-red-500">-</span>
                        <p>Remove </p>
                      </button>
                    </AppPopover>
                  </div>
                ))
              ) : (
                <EmptyStateDarkBg
                  image={linkIcon}
                  title="You have no accounts linked yet. Add an account to begin tracking your expenses here."
                  buttonText="Add Account"
                  onClick={async () => linkAccountMutation.mutateAsync()}
                  icon={<BsPlus />}
                  isLoading={linkAccountMutation.isPending}
                />
              )}
            </div>
          </div>
        </div>
        {showSelectBankAccountDrawer && (
          <SelectBankAccountDrawer
            show={showSelectBankAccountDrawer}
            setShow={setShowSelectBankAccountDrawer}
            linkedAccounts={linkedAccounts}
            isLoading={isGetAllLinkedAccountsLoading}
            setShowSyncPeriodDrawer={setShowSyncPeriodDrawer}
            selectedAccountId={selectedAccountId ?? ''}
            setSelectedAccountId={setSelectedAccountId}
          />
        )}

        {showAddManualDrawer && (
          <AddManualExpenseDrawer
            show={showAddManualDrawer}
            setShow={setShowAddManualDrawer}
            categories={activeBudgetCategories}
            budgetId={selectedBudgetId || ''}
            isLoadingCategories={isLoadingCategories}
          />
        )}

        {/* select sync period */}
        {showSyncPeriodDrawer && (
          <SelectSyncPeriodDrawer
            show={showSyncPeriodDrawer}
            setShow={setShowSyncPeriodDrawer}
            value={value}
            onChange={setValue}
            accountId={selectedAccountId ?? ''}
            selectedBudgetId={selectedBudgetId ?? ''}
          />
        )}

        <ScanReceipt
          showScanner={showScanner}
          setShowScanner={setShowScanner}
          budgetId={selectedBudgetId || ''}
        />
      </DashboardWrapper>
    </motion.div>
  );
}
