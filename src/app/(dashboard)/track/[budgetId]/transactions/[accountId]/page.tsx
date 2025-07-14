'use client';
import Image from 'next/image';
import emptyState from '/public/images/empty-state/transaction.png';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getSingleBudgetApi, reauthorizeAccountApi } from '@/app/services/BudgetService';
import {
  fetchAccountInfoApi,
  fetchAccountTransactionsApi,
} from '@/app/services/AccountService';
import { useInfiniteQuery } from '@tanstack/react-query';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import AssignExpenseDrawer from '@/app/_components/drawers/AssignExpense';
import { useAuthStore } from '@/app/store/useAuthStore';
import SplitExpenseDrawer from '@/app/_components/drawers/SplitExpense';
import Loader from '@/app/_components/loader';
import TrackPageModal from '@/app/_components/modals/trackPageModal';
import { format } from 'date-fns';
import { EmptyStateDarkBg } from '@/app/_components/emptyState';
import BottomButton from '@/app/(dashboard)/budget/[budgetId]/_components/bottomButton';
import Button from '@/app/_components/button';
import { Icons } from '@/app/icons';
import cn from 'classnames';
import toast from 'react-hot-toast';
import useAccountPage from './useAccountPage';
import AutoCategorizeDrawer from '@/app/_components/drawers/AutoCategorize';
import AutoCategorizeExpensesDrawer from '@/app/_components/drawers/AutoCategorize/expenses';
import LoadingModal from '@/app/_components/modals/LoadingModal';

export default function Page({
  params,
}: {
  params: { budgetId: string; accountId: string };
}) {
  const {
    transactions,
    isLoadingGetAllAccountTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedBankAccount,
    selectedBankAccountLoading,
    showReauthorizeAccountModal,
    setShowReauthorizeAccountModal,
    showSplitExapenseDrawer,
    setShowSplitExapenseDrawer,
    showAssignExpenseDrawer,
    setShowAssignExpenseDrawer,
    transactionId,
    transactionDetails,
    selectedCategoryForTransaction,
    setSelectedCategoryForTransaction,
    selectedTransactions,
    setSelectedTransactions,
    toggleAutoCategorize,
    setToggleAutoCategorize,
    showBalance,
    setShowBalance,
    toggleBalanceVisibility,
    singleBudgetData,
    handleReauthorizeAccount,
    assignExpense,
    handleSelectTransaction,
    autoCategorizeTransactions,
    showTransactionCategoryDrawer,
    setShowTransactionCategoryDrawer,
    autoCategorizedData,
    setAutoCategorizedData,
    showTransactionCategoryExpenseDrawer,
    setShowTransactionCategoryExpenseDrawer,
    selectedTransactionIndexToReview,
    setSelectedTransactionIndexToReview,
  } = useAccountPage({ budgetId: params.budgetId, accountId: params.accountId });
  return (
    <div className="w-full">
      <InnerPageHeader link="/track" title={'Transactions'} />

      <div className="px-6 py-4 border-b border-gray-200">
        <div className="p-4 rounded-3xl bg-gradient-to-tl from-[#66C227] to-[#2A860A]">
          <div className="space-y-4 w-full gap-6 p-2 rounded-[20px] ">
            <div className="flex justify-between text-white text-xs font-medium">
              <p className="capitalize">
                {selectedBankAccount?.accountName?.toLowerCase()}
              </p>
              <p>{selectedBankAccount.accountNumber}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-600">Current balance</p>
                <div className="flex gap-2 items-center">
                  <Image
                    src={selectedBankAccount.institutionLogo}
                    width={24}
                    height={24}
                    alt={selectedBankAccount.institutionName}
                    className="w-6 rounded-[32px] bg-white border border-white"
                  />
                  <h1 className="uppercase text-xs">
                    {selectedBankAccount.institutionName}
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <h1 className="font-bold aeonik text-[#242424]">
                  {showBalance ? (
                    <>₦ {selectedBankAccount.accountBalance}</>
                  ) : (
                    '  ₦ *******'
                  )}
                </h1>
                <button
                  onClick={toggleBalanceVisibility}
                  className=" bg-[#E7E7EA] text-black-800 text-[10px] h-6 px-2 rounded-xl "
                >
                  {showBalance ? 'Hide balance' : 'Show balance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="px-6 py-[18px] text-black-800 font-medium">Latest transactions</p>

      <div className="bg-gray-100 h-full w-full pb-20">
        {isLoadingGetAllAccountTransactions ? (
          <Loader />
        ) : (
          <div className="px-6 py-4 h-full space-y-4">
            {transactions.length > 0 ? (
              <>
                <div className="space-y-2">
                  {transactions?.map((transaction) => (
                    <div
                      key={transaction.uid}
                      onClick={() =>
                        toggleAutoCategorize
                          ? handleSelectTransaction(transaction.uid)
                          : assignExpense(transaction.uid, transaction)
                      }
                      className={cn(
                        'relative flex justify-between items-end rounded-2xl border p-4 text-sm text-black-800',
                        toggleAutoCategorize &&
                          selectedTransactions.includes(transaction.uid)
                          ? 'bg-lemonGreen-300 border-lemonGreen-600'
                          : 'border-gray-200 bg-white',
                      )}
                    >
                      <div>
                        <p className="font-medium ">{transaction.narration}</p>
                        <p className="text-gray-600 text-xs">{transaction.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-medium whitespace-nowrap">
                          ₦ {transaction.amount.toLocaleString()}
                        </div>
                        {toggleAutoCategorize && (
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center absolute top-[10px] right-[10px]
                            ${
                              selectedTransactions.includes(transaction.uid)
                                ? 'bg-lemonGreen-600 text-white'
                                : 'border border-gray-200'
                            }`}
                          >
                            {selectedTransactions.includes(transaction.uid) && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {isFetchingNextPage && (
                  <p className=" text-[#66C227] mx-auto w-full">Loading more...</p>
                )}
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="mt-8 bg-[#66C227]  flex justify-center items-center mx-auto text-white p-2 rounded disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? 'Loading...'
                    : hasNextPage
                      ? 'Load More'
                      : 'No More Data'}
                </button>
              </>
            ) : (
              <EmptyStateDarkBg
                image={emptyState}
                title="You have not synced your transactions"
                description="This page is empty because you have not synced your transactions yet."
              />
            )}
          </div>
        )}
      </div>

      {/* re authorize modal */}
      <TrackPageModal
        title="Re-Authorization `Required"
        text="To keep your accounts safe and your transactions sync running smoothly, kindly re-authorize your bank account."
        isOpen={showReauthorizeAccountModal}
        onClose={() => setShowReauthorizeAccountModal(false)}
        showFooter
        onClick={() => handleReauthorizeAccount.mutate(selectedBankAccount.uid)}
        footerButtonText="Proceed"
      />

      {showSplitExapenseDrawer && (
        <SplitExpenseDrawer
          setShow={setShowSplitExapenseDrawer}
          show={showSplitExapenseDrawer}
          transactionDetails={transactionDetails ?? null}
          singleBudgetData={singleBudgetData}
          setShowAssignCategories={setShowAssignExpenseDrawer}
          accountId={params.accountId}
          transactionId={transactionId}
          budgetId={params.budgetId}
        />
      )}

      {showAssignExpenseDrawer && (
        <AssignExpenseDrawer
          show={showAssignExpenseDrawer}
          setShow={setShowAssignExpenseDrawer}
          setShowSplitExapenseDrawer={setShowSplitExapenseDrawer}
          accountId={params.accountId}
          transactionId={transactionId}
          transactionDetails={transactionDetails ?? null}
          budgetId={params.budgetId}
          budgetCategories={singleBudgetData?.budgetCategories || []}
        />
      )}

      {showTransactionCategoryDrawer && (
        <AutoCategorizeDrawer
          show={showTransactionCategoryDrawer}
          setShow={setShowTransactionCategoryDrawer}
          autoCategorizedData={autoCategorizedData}
          setSelectedTransactionIndexToReview={setSelectedTransactionIndexToReview}
          setShowTransactionCategoryExpenseDrawer={
            setShowTransactionCategoryExpenseDrawer
          }
          budgetId={params.budgetId}
          accountId={params.accountId}
        />
      )}
      {showTransactionCategoryExpenseDrawer && (
        <AutoCategorizeExpensesDrawer
          show={showTransactionCategoryExpenseDrawer}
          setShow={setShowTransactionCategoryExpenseDrawer}
          transactions={
            autoCategorizedData?.[selectedTransactionIndexToReview]?.transactions
          }
          autoCategorizedData={autoCategorizedData}
          setAutoCategorizedData={setAutoCategorizedData}
          indexToReview={selectedTransactionIndexToReview}
          name={autoCategorizedData?.[selectedTransactionIndexToReview]?.categoryName}
        />
      )}

      <LoadingModal
        isOpen={autoCategorizeTransactions.isPending}
        onClose={() => {}}
        text="Categorizing..."
      />

      {/* bottom navigation */}
      <BottomButton>
        {toggleAutoCategorize ? (
          <Button
            // loading={autoCategorizeTransactions.isPending}
            onClick={() => {
              autoCategorizeTransactions.mutate(selectedTransactions);
            }}
          >
            {Icons.magicIcon}
            Auto-Categorize with Prudy AI
          </Button>
        ) : (
          <Button
            // loading={autoCategorizeTransactions.isPending}
            onClick={() => {
              setToggleAutoCategorize(true);
              // Pre-select first 15 transactions
              const transactionsToSelect = transactions?.slice(
                0,
                Math.min(15, transactions.length),
              );
              setSelectedTransactions(transactionsToSelect.map((t) => t.uid));
            }}
          >
            {Icons.magicIcon}
            Auto-Categorize with Prudy AI
          </Button>
        )}
      </BottomButton>
    </div>
  );
}
