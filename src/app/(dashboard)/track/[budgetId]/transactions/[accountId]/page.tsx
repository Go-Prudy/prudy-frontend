'use client';
import Image from 'next/image';
import lunch from '/public/images/Launch.png';
import emptyState from '/public/images/empty-transaction.png';
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

interface Bank {
  name: string;
  balance: number;
  logo: any;
  user: string;
  number: string;
}

// Example bank data array
const bank_data: Bank[] = [
  // { name: 'Wema Bank', user: 'Ayomide Asekun', number: '0248356709', balance: 450000, logo: wema },
  // { name: 'Kuda Bank', balance: 450000, logo: kuda, user: 'Ayomide Asekun', number: '0248356709' },
  // { name: 'GT Bank', balance: 450000, logo: gt, user: 'Ayomide Asekun', number: '0248356709' },
];

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

export default function Page({
  params,
}: {
  params: { budgetId: string; accountId: string };
}) {
  const { userData } = useAuthStore();

  const [bankData, setBankData] = useState<Bank[]>(bank_data);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showAccountProcessingModal, setShowAccountProcessingModal] = useState(false);
  const [showReauthorizeAccountModal, setShowReauthorizeAccountModal] = useState(false);
  const [showSplitExapenseDrawer, setShowSplitExapenseDrawer] = useState<boolean>(false);
  const [showAssignExpenseDrawer, setShowAssignExpenseDrawer] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<Transaction>();

  const [showSyncTransactionFirstModal, setShowSyncTransactionFirstModal] = useState<any>(
    bankData[0],
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategoryForTransaction, setSelectedCategoryForTransaction] =
    useState(null);

  const limit = 12; // Items per page
  const [showBalance, setShowBalance] = useState(true); // Track balance visibility

  const toggleBalanceVisibility = () => {
    setShowBalance((prevState) => !prevState);
  };

  const handleSyncTransaction = async () => {
    try {
      // Make the API call to sync transactions
      await syncAccountTransactionsApi(userData?.token ?? '', params.accountId);

      // On successful sync, show synced data
    } catch (error) {
      // Handle error (Optional: you can show an error state)
      console.error('Error syncing transactions:', error);
    }
  };

  useEffect(() => {
    showSyncModal && handleSyncTransaction();
  }, [showSyncModal]);

  // query to fetch account information with account id
  const { data: selectedBankAccount = {}, isLoading: selectedBankAccountLoading } =
    useQuery({
      queryKey: ['getSelectedAccountInfo', params.accountId],
      queryFn: () => fetchAccountInfoApi(userData?.token ?? '', params.accountId),
      enabled: !!userData?.token,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const assignExpense = (transactionId: string, transaction: Transaction) => {
    setTransactionId(transactionId);
    setShowAssignExpenseDrawer(true);
    setTransactionDetails(transaction);
  };

  const handleSyncTransactions = async () => {
    setShowAccountProcessingModal(false);
    // Show loader when syncing starts
    setIsSyncing(true); // Indicate syncing state

    try {
      // Manually trigger the fetch (queryFn)
      await refetchAccountTransactions();

      // Simulate a 2-second delay after fetching
      setTimeout(() => {
        setIsSyncing(false); // Stop syncing
      }, 2000); // 2-second delay after sync
    } catch (error) {
      console.error('Sync failed', error);
      setIsSyncing(false); // Stop syncing in case of error
    }
  };

  const { data: syncAccountTransactions = [], refetch: refetchAccountTransactions } =
    useQuery({
      queryKey: ['accountInfo', params.accountId],
      queryFn: () => syncAccountTransactionsApi(userData?.token ?? '', params.accountId),
      enabled: false, // Disables automatic fetching
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
    });

  const { data: singleBudgetData = [] } = useQuery({
    queryKey: ['singleBudgetData' + params.budgetId],
    queryFn: () => getSingleBudgetApi(userData?.token ?? '', params.budgetId),
    enabled: !!userData?.token && !!params.budgetId,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });

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
      <div className="flex px-6 py-[18px] w-full items-center justify-between">
        <p className="text-black-800 font-medium">Latest transactions</p>
        <button
          onClick={() => {
            // TODO: if accountStatus	 is 'PROCESSING', show modal else sync account
            if (selectedBankAccount?.accountStatus === 'PROCESSING') {
              setShowAccountProcessingModal(true);
            } else {
              handleSyncTransactions();
            }
          }}
          className="bg-gray-200 text-xs text-black-800 py-1 px-2 rounded-[32px]"
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing...' : 'Sync Latest'}
        </button>
      </div>

      <div className="bg-gray-100 h-full w-full pb-20">
        {isLoadingGetAllAccountTransactions ? (
          <div className="flex flex-col gap-[16px] h-[60vh] items-center justify-center w-full mt-[16px]">
            <motion.div
              initial={{ opacity: 0, y: 90 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <Image
                width={1000}
                height={1000}
                src={lunch}
                alt="loading"
                className="h-[141.27px] w-[126.52px]"
              />
            </motion.div>
          </div>
        ) : (
          <div className="px-6 py-4 h-full space-y-4">
            {transactions.length > 0 ? (
              <>
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
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Image
                  width={78}
                  height={56}
                  src={emptyState}
                  alt=""
                  className="h-[141.27px] w-[126.52px]"
                />
                <h1 className="font-[500] text-[20px] text-[#2d2d2d] leading-[24px]">
                  Yaay! You made it here 😎
                </h1>
                <p className="text-[#575757] text-sm">
                  This page is empty because you have not synced your transactions yet.
                  Click the button below to sync them now.
                </p>

                <button
                  onClick={() => {
                    // TODO: if accountStatus	 is 'PROCESSING', show modal else sync account
                    if (selectedBankAccount?.accountStatus === 'PROCESSING') {
                      console.log('check account status');

                      setShowAccountProcessingModal(true);
                    } else {
                      handleSyncTransactions();
                    }
                  }}
                  className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
                  disabled={isSyncing} // Disable button while syncing
                >
                  {isSyncing ? 'Syncing...' : 'Sync transactions now'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
          budgetId={params.budgetId}
          budgetCategories={singleBudgetData?.budgetCategories || []}
        />
      )}
    </div>
  );
}
