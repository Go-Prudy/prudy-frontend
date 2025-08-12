import { useEffect, useState } from 'react';
import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getSingleBudgetApi, reauthorizeAccountApi } from '@/app/services/BudgetService';
import {
  fetchAccountInfoApi,
  fetchAccountTransactionsApi,
} from '@/app/services/AccountService';
import { useAuthStore } from '@/app/store/useAuthStore';
import toast from 'react-hot-toast';
import api from '@/app/utils/axiosInstance';
import { AutoCategorizedCategory } from '@/app/types/autoCategorize';

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

export default function useAccountPage({
  budgetId,
  accountId,
}: {
  budgetId: string;
  accountId: string;
}) {
  const { userData } = useAuthStore();

  // const [showAccountProcessingModal, setShowAccountProcessingModal] = useState(true);
  const [showReauthorizeAccountModal, setShowReauthorizeAccountModal] =
    useState<boolean>(false);
  const [showSplitExapenseDrawer, setShowSplitExapenseDrawer] = useState<boolean>(false);
  const [showAssignExpenseDrawer, setShowAssignExpenseDrawer] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<Transaction>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategoryForTransaction, setSelectedCategoryForTransaction] =
    useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [toggleAutoCategorize, setToggleAutoCategorize] = useState<boolean>(false);
  const [showTransactionCategoryDrawer, setShowTransactionCategoryDrawer] =
    useState<boolean>(false);
  const [autoCategorizedData, setAutoCategorizedData] = useState<
    AutoCategorizedCategory[]
  >([]);

  const [showTransactionCategoryExpenseDrawer, setShowTransactionCategoryExpenseDrawer] =
    useState(false);
  const [selectedTransactionIndexToReview, setSelectedTransactionIndexToReview] =
    useState<number>(0);

  const limit = 12; // Items per page
  const [showBalance, setShowBalance] = useState(true); // Track balance visibility

  const toggleBalanceVisibility = () => {
    setShowBalance((prevState) => !prevState);
  };

  // query to fetch account information with account id
  const { data: selectedBankAccount = {}, isLoading: selectedBankAccountLoading } =
    useQuery({
      queryKey: ['getSelectedAccountInfo', accountId],
      queryFn: () => fetchAccountInfoApi(userData?.token ?? '', accountId),
      enabled: !!userData?.token,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const { data: singleBudgetData = [] } = useQuery({
    queryKey: ['singleBudgetData' + budgetId],
    queryFn: () => getSingleBudgetApi(userData?.token ?? '', budgetId),
    enabled: !!userData?.token && !!budgetId,
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

  const autoCategorizeTransactions = useMutation({
    mutationFn: async (transactionIds: string[]) =>
      api.post(`accounts/${accountId}/transactions/categorize`, {
        transactionIds: transactionIds,
      }),
    onSuccess: (data) => {
      setToggleAutoCategorize(false);
      setShowTransactionCategoryDrawer(true);
      const updatedData = data.data.data.map((item: Transaction) => ({
        ...item,
        yetToReview: true,
      }));
      setAutoCategorizedData(updatedData);
    },
    onError: (error) => {
      console.error('Error auto categorizing account:', error);
    },
  });

  const assignExpense = (transactionId: string, transaction: Transaction) => {
    setTransactionId(transactionId);
    setShowAssignExpenseDrawer(true);
    setTransactionDetails(transaction);
  };

  const handleSelectTransaction = (uid: string) => {
    setSelectedTransactions((prev) => {
      if (prev.includes(uid)) {
        return prev.filter((id) => id !== uid);
      } else {
        if (prev.length < 15) {
          return [...prev, uid];
        }
        toast.error('Maximum 15 transactions can be selected');
        return prev;
      }
    });
  };

  useEffect(() => {
    if (selectedTransactions.length === 0) {
      setToggleAutoCategorize(false);
    }
  }, [selectedTransactions]);

  // Fetch transactions API
  const {
    data: transactionData,
    isLoading: isLoadingGetAllAccountTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TransactionsPage, Error>({
    queryKey: ['getAllAccountTransactions', accountId],
    queryFn: async ({ pageParam = 1 }: any) =>
      await fetchAccountTransactionsApi(
        userData?.token ?? '',
        accountId,
        limit,
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage?.next?.page ?? undefined, // Fetch the next page based on the API response
    enabled: !!userData?.token && !!accountId,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (transactionData?.pages && transactionData.pages.length > 0) {
      setTransactions(
        transactionData.pages.flatMap((page: TransactionsPage) => page?.docs) || [],
      );
    }
  }, [transactionData]);

  useEffect(() => {
    if (selectedBankAccount?.reauthRequired) {
      setShowReauthorizeAccountModal(true);
    }
  }, [selectedBankAccount]);
  return {
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
  };
}
