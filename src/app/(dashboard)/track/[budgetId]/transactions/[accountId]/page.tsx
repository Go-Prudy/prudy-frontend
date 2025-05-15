'use client';
import Image from 'next/image';
import emptyState from '/public/images/empty-state/transaction.png';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getSingleBudgetApi, reauthorizeAccountApi } from '@/app/services/BudgetService';
import {
  fetchAccountInfoApi,
  fetchAccountTransactionsApi,
  syncAccountTransactionsApi,
} from '@/app/services/AccountService';
import { useInfiniteQuery } from '@tanstack/react-query';
import Header from '@/components/header';
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

interface Transaction {
  uid: string;
  narration: string;
  date: string;
  amount: number;
}

interface TransactionsPage {
  docs: Transaction[]; // List of transactions
  next?: { page: number }; // Information about the next page
}

interface Transaction {
  id: number;
  name: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
}

const formatTime = (seconds: number): Date => {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date;
};

export default function Page({
  params,
}: {
  params: { budgetId: string; accountId: string };
}) {
  const { userData } = useAuthStore();

  // const [showAccountProcessingModal, setShowAccountProcessingModal] = useState(true);
  const [showReauthorizeAccountModal, setShowReauthorizeAccountModal] = useState(false);
  const [showSplitExapenseDrawer, setShowSplitExapenseDrawer] = useState<boolean>(false);
  const [showAssignExpenseDrawer, setShowAssignExpenseDrawer] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<Transaction>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategoryForTransaction, setSelectedCategoryForTransaction] =
    useState(null);

  const limit = 12; // Items per page
  const [showBalance, setShowBalance] = useState(true); // Track balance visibility

  const toggleBalanceVisibility = () => {
    setShowBalance((prevState) => !prevState);
  };

  // query to fetch account information with account id
  const { data: selectedBankAccount = {}, isLoading: selectedBankAccountLoading } =
    useQuery({
      queryKey: ['getSelectedAccountInfo', params.accountId],
      queryFn: () => fetchAccountInfoApi(userData?.token ?? '', params.accountId),
      enabled: !!userData?.token,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const { data: singleBudgetData = [] } = useQuery({
    queryKey: ['singleBudgetData' + params.budgetId],
    queryFn: () => getSingleBudgetApi(userData?.token ?? '', params.budgetId),
    enabled: !!userData?.token && !!params.budgetId,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });

  // const {
  //   data: syncAccountTransactions = [],
  //   isLoading: isSyncing,
  //   refetch: refetchSyncedAccountTransactions,
  // } = useQuery({
  //   queryKey: ['accountInfo', params.accountId],
  //   queryFn: () => syncAccountTransactionsApi(userData?.token ?? '', params.accountId),
  //   enabled: showAccountProcessingModal, // Disables automatic fetching
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   refetchInterval: false,
  // });

  // const handleSyncTransactions = async () => {
  //   await refetchSyncedAccountTransactions();
  //   setShowAccountProcessingModal(false);
  // };

  // re-authorize account
  const handleReauthorizeAccount = useMutation({
    mutationFn: async (id: string) =>
      reauthorizeAccountApi(userData?.token ?? '', id ?? ''),
    onSuccess: (data) => {
      window.location.href = data.data.url;
      setShowReauthorizeAccountModal(false);
    },
    onError: (error) => {
      console.error('Error reauthorizing account:', error);
    },
  });

  const assignExpense = (transactionId: string, transaction: Transaction) => {
    setTransactionId(transactionId);
    setShowAssignExpenseDrawer(true);
    setTransactionDetails(transaction);
  };

  // Fetch transactions API
  const {
    data: transactionData,
    isLoading: isLoadingGetAllAccountTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TransactionsPage, Error>({
    queryKey: ['getAllAccountTransactions', params.accountId],
    queryFn: async ({ pageParam = 1 }: any) =>
      await fetchAccountTransactionsApi(
        userData?.token ?? '',
        params.accountId,
        limit,
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage.next?.page ?? undefined, // Fetch the next page based on the API response
    enabled: !!userData?.token && !!params.accountId,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (transactionData?.pages && transactionData.pages.length > 0) {
      setTransactions(
        transactionData.pages.flatMap((page: TransactionsPage) => page.docs) || [],
      );
    }
  }, [transactionData]);

  useEffect(() => {
    // if (selectedBankAccount?.accountStatus === 'PROCESSING') {
    //   setShowAccountProcessingModal(true);
    // } else
    if (selectedBankAccount?.reauthRequired) {
      setShowReauthorizeAccountModal(true);
    }
  }, [selectedBankAccount]);

  // // account processing timer
  // const [timeLeft, setTimeLeft] = useState<number>(30);
  // useEffect(() => {
  //   if (showAccountProcessingModal) {
  //     if (timeLeft <= 0) return;

  //     const timer = setInterval(() => {
  //       setTimeLeft((prevTime) => prevTime - 1);
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   } else setTimeLeft(30);
  // }, [timeLeft, showAccountProcessingModal]);

  return (
    <div className="w-full">
      <Header link="/track" title={'Transactions'} />

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
                  {transactions.map((transaction, index) => (
                    <div
                      key={transaction.uid}
                      onClick={() => assignExpense(transaction.uid, transaction)}
                      className="flex justify-between items-end bg-white rounded-2xl border border-gray-200 p-4 text-sm text-black-800"
                    >
                      <div>
                        <p className="font-medium ">{transaction.narration}</p>
                        <p className="text-gray-600 text-xs">
                          {/* {formatDateTime(transaction.date)} */}
                          {transaction.date}
                        </p>
                      </div>
                      <div className="font-medium whitespace-nowrap">
                        ₦ {transaction.amount.toLocaleString()}
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

      {/* account processing modal */}
      {/* <TrackPageModal
        title="Account Processing"
        text="Your account status will be available in a few seconds"
        isOpen={showAccountProcessingModal}
        onClose={() => setShowAccountProcessingModal(false)}
        showFooter={timeLeft === 0}
        onClick={() => handleSyncTransactions()}
        footerButtonText="Sync Transactions Now"
      >
        <div className="w-fit mx-auto">
          <span className="h-[22px] p-1 bg-[#eef4fd] rounded p-px text-center text-[#3172dd] text-sm font-normal leading-[14px]">
            {format(formatTime(timeLeft), 'mm')}
          </span>{' '}
          :{' '}
          <span className="h-[22px] p-1 bg-[#eef4fd] rounded p-px text-center text-[#3172dd] text-sm font-normal leading-[14px]">
            {format(formatTime(timeLeft), 'ss')}
          </span>
        </div>
      </TrackPageModal> */}

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
      {/* bottom navigation */}
      <BottomButton>
        <Button
          // className="!bg-lemonGreen-100 !text-lemonGreen-900"
          // onClick={() => handleTabSelection('allocations')}
        >
          {Icons.magicIcon}
          Auto-Categorize with Prudy AI
        </Button>
      </BottomButton>
    </div>
  );
}
