'use client';
import Header2 from '@/components/create-budget/Header2';
import Image from 'next/image';
import linkIcon from '/public/images/Mindmap.png';
import Icon1 from '/public/images/Add Category.png';
import Icon2 from '/public/images/Write Content.png';
import Icon3 from '/public/images/Add Files.png';
import wema from '/public/images/wema.png';
import kuda from '/public/images/kuda.png';
import gt from '/public/images/gt.png';
import sync from '/public/images/sync.png';
import scan from '/public/images/scan.png';
import lunch from '/public/images/Launch.png';
import mono1 from '/public/images/mono1.png';
import addManual from '/public/images/addManually.png';
import {
  BsCheck,
  BsChevronRight,
  BsPlus,
  BsThreeDotsVertical,
  BsX,
} from 'react-icons/bs';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useRouter } from 'next/navigation';
import Tesseract from 'tesseract.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthentication } from '@/app/store/AuthStore';
import {
  getActiveBudgetCategoriesApi,
  GetAllBudgetsApi,
  getSingleBudgetApi,
  RecordExpenseApi,
} from '@/app/services/BudgetService';
import {
  fetchAccountInfoApi,
  fetchAccountTransactionsApi,
  getAllAccountsApi,
  initLinkAccountApi,
  removeAccountApi,
  syncAccountTransactionsApi,
} from '@/app/services/AccountService';
import {
  RadioGroup,
  useRadio,
  VisuallyHidden,
  cn,
  CircularProgress,
  Progress,
  Skeleton,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format, parseISO, set } from 'date-fns';
import Scanner from '../../../components/scanFeature';
import { AssignCategoryToTransactionApi } from '@/app/services/TransactionService';
import { IAddManualInput } from '@/app/Types';
import BudgetPageHeader from '@/components/create-budget/BudgetPageHeader';

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

export default function Page() {
  // Define the type for the array items
  interface CardItem {
    color: string;
    title: string;
    subtext: string;
    btnText: string;
    border: string;
    image: any; // Assuming the image is a URL or path
    buttonColor: string;
  }

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

  // Create the array of card items
  const cardItems: CardItem[] = [
    {
      color: '#E0E7FF', // Light blue
      title: 'Assign transactions from your bank account',
      subtext:
        'Assign your transactions from your bank account to the right budget category and win 20 points',
      btnText: 'Assign now',
      border: '1px solid #F3F0FA', // Example border color
      image: Icon1, // Replace with actual image path
      buttonColor: '#8A62D8',
    },
    {
      color: '#FDF4EC', // Light yellow
      title: 'Scan your receipts',
      subtext: 'Scan receipts from shopping to track the expenses effectively',
      btnText: 'Scan now',
      border: '1px solid #FBE9DA', // Example border color
      image: Icon2, // Replace with actual image path
      buttonColor: '#E67731',
    },
    {
      color: '#EBFAFD', // Light cyan
      title: 'Add manually',
      subtext: 'Add your expense details manually',
      btnText: 'Add now',
      border: '1px solid #D7F4FB', // Example border color
      image: Icon3, // Replace with actual image path
      buttonColor: '#11CDEF',
    },
  ];

  interface Transaction {
    id: number;
    name: string;
    date: string;
    time: string;
    amount: number;
    currency: string;
  }

  interface Category {
    id: number;
    name: string;
    totalAmount: number;
    remaining: number;
    color: string;
    selected: boolean;
  }

  const { authenticatedUser } = useAuthentication();

  const lightenColor = (hex: string, percent: number): string => {
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgbToHex = (r: number, g: number, b: number) => {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    };

    const { r, g, b } = hexToRgb(hex);

    const newR = Math.min(255, Math.round(r + (255 - r) * percent));
    const newG = Math.min(255, Math.round(g + (255 - g) * percent));
    const newB = Math.min(255, Math.round(b + (255 - b) * percent));

    return rgbToHex(newR, newG, newB);
  };

  const [bankData, setBankData] = useState<Bank[]>(bank_data);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showSyncDataModal, setShowSyncDataModal] = useState(false);
  const [showAccountProcessingModal, setShowAccountProcessingModal] = useState(false);

  const [showCategories, setShowCategories] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [accountId, setAccountId] = useState<string>('');

  const [showSyncTransactionFirstModal, setShowSyncTransactionFirstModal] = useState<any>(
    bankData[0],
  );
  const [currentView, setCurrentView] = useState('syncedData'); // default, loading, syncedData
  const [isSyncing, setIsSyncing] = useState(false);
  // ADD MANUAL STATE
  const [AddManualModal, setAddManualModal] = useState<boolean>(false);
  const [manualData, setManualData] = useState<IAddManualInput>({
    itemName: '',
    amount: 0,
    category: '', // Default category
    date: '',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategoryForTransaction, setSelectedCategoryForTransaction] =
    useState(null);

  // SCAN RECEIPT

  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanState, setScanState] = useState<boolean>(false);
  const limit = 12; // Items per page
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null);
  const [showBalance, setShowBalance] = useState(true); // Track balance visibility
  const [showTooltipIndex, setShowTooltipIndex] = useState<number | null>(null); // Track which account's tooltip is open
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [addManualModalTitle, setAddManualModalTitle] = useState<string>('Add Manual');

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setShowBalance((prevState) => !prevState);
  };

  // const handleSaveManually = () => {
  //   // setAddManualModal(!AddManualModal)
  // };

  // Function to handle category selection
  const handleSelectCategory = (id: any) => {
    setSelectedCategoryForTransaction(id);
  };

  // const handleAssign = () => {
  //   if (selectedCategory) {
  //     // Handle assignment logic here...
  //   }
  // };

  // Calculate total combined balance
  // const totalBalance = bankData.reduce((acc, bank) => acc + bank.balance, 0);

  // Toggle the balance view
  // const toggleBalance = () => {
  //   setShowBalance(!showBalance);
  // };

  const handleSyncTransaction = async () => {
    // Set loading state when sync starts
    setCurrentView('loading');

    try {
      // Make the API call to sync transactions
      await syncAccountTransactionsApi(authenticatedUser?.token ?? '', accountId);

      // On successful sync, show synced data
      setCurrentView('syncedData');
    } catch (error) {
      // Handle error (Optional: you can show an error state)
      console.error('Error syncing transactions:', error);
      setCurrentView('idle');
    }
  };

  useEffect(() => {
    showSyncModal && handleSyncTransaction();
  }, [showSyncModal]);

  // hide <body/> scroll bar when showSyncDataModal modal is open
  useEffect(() => {
    if (showSyncDataModal) {
      window.document.body.style.overflow = 'hidden';
      window.document.body.style.height = '100vh';
    } else {
      window.document.body.style.overflow = 'auto';
      window.document.body.style.height = 'auto';
    }
  }, [showSyncDataModal]);

  // query to fetch account information with account id
  const {
    data: selectedBankAccount = {},
    isLoading: selectedBankAccountLoading,
    isPending: selectedBankAccountPending,
    error: selectedBankAccountError,
  } = useQuery({
    queryKey: ['getSelectedAccountInfo', accountId],
    queryFn: () => fetchAccountInfoApi(authenticatedUser?.token ?? '', accountId),
    enabled: !!authenticatedUser?.token && showSyncDataModal,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const AssignExpense = (transactionId: string) => {
    try {
      setTransactionId(transactionId);
      setShowCategories(!showCategories);
    } catch (error) {}
  };

  // const abbreviateNumber = (num: number): string => {
  //   if (num >= 1_000_000) {
  //     return `${(num / 1_000_000).toFixed(2)}M`; // Millions
  //   }

  //   return num.toLocaleString(); // Less than thousand
  // };

  const handleSyncTransactions = async () => {
    setShowAccountProcessingModal(false);
    // Show loader when syncing starts
    setCurrentView('loading');
    setIsSyncing(true); // Indicate syncing state

    try {
      // Manually trigger the fetch (queryFn)
      await refetchAccountTransactions();

      // Simulate a 2-second delay after fetching
      setTimeout(() => {
        setCurrentView('syncedData'); // Show the synced data after the delay
        setIsSyncing(false); // Stop syncing
      }, 2000); // 2-second delay after sync
    } catch (error) {
      console.error('Sync failed', error);
      setCurrentView('default'); // Reset view if there's an error
      setIsSyncing(false); // Stop syncing in case of error
    }
  };

  const {
    data: budgets = [],
    isLoading,
    isPending,
    error,
  } = useQuery({
    queryKey: ['allBudgetCategories'],
    queryFn: () => GetAllBudgetsApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token,
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
  });

  // React Query hook
  const {
    data: accounts = [],
    isPending: isGetAllAccountPending,
    isError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAllAccountsApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token, // Only fetch if token exists
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
  });

  useEffect(() => {
    try {
      if (isGetAllAccountPending) {
        setIsApiLoading(true);
      }
      if (accounts.length > 0) {
        setConnectedAccounts(accounts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsApiLoading(false);
    }
  }, [accounts]);

  // React Query mutation to link an account
  const linkAccountMutation = useMutation({
    mutationFn: () => initLinkAccountApi(authenticatedUser?.token ?? ''),
    onSuccess: (data) => {
      // Any other success handling logic such as redirecting or updating UI
    },
    onError: (error: unknown) => {
      console.error('Error linking account:', error);
      // Handle additional error states if necessary
    },
  });

  useEffect(() => {
    if (linkAccountMutation.isPending) {
      // setShowSyncModal(true)
    }
  }, [linkAccountMutation]);

  // Handler to call the mutation
  const handleLinkAccount = async () => {
    try {
      await linkAccountMutation.mutateAsync();
    } catch (error) {
      console.error('Error in handleLinkAccount:', error);
    }
  };

  function formatDateTime(dateTime: string): string {
    let dateObject: Date;

    // Check if the input contains a time component (denoted by 'T')
    const hasTime = dateTime.includes('T');

    if (hasTime) {
      // Parse ISO date-time string
      dateObject = new Date(dateTime);
    } else {
      // Parse only the date
      dateObject = parseISO(dateTime);
    }

    // Format based on the presence of time
    if (hasTime) {
      return format(dateObject, 'MMMM do | hh:mma'); // Include both date and time
    } else {
      return format(dateObject, 'MMMM do'); // Include only the date
    }
  }

  const {
    data: syncAccountTransactions = [],
    isLoading: syncAccountTransactionsisLoading,
    isError: syncAccountTransactionsisError,
    refetch: refetchAccountTransactions,
  } = useQuery({
    queryKey: ['accountInfo', accountId],
    queryFn: () => syncAccountTransactionsApi(authenticatedUser?.token ?? '', accountId),
    enabled: false, // Disables automatic fetching
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  const { data: singleBudgetData = [], isPending: singleBudgetStatus } = useQuery({
    queryKey: ['singleBudgetData' + selectedBudget?.uid],
    queryFn: () =>
      getSingleBudgetApi(authenticatedUser?.token ?? '', selectedBudget?.uid),
    enabled: !!authenticatedUser?.token && !!selectedBudget?.uid,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });

  // Fetch active categories for the selected budget
  const {
    data: activeBudgetCategories = [],
    isLoading: activeBudgetCategoriesIsLoading,
    isError: activeBudgetCategoriesIsError,
    refetch: refetchActiveBudgetCategories,
  } = useQuery({
    queryKey: ['activeBudgetCategories', selectedBudget?.uid],
    queryFn: () =>
      getActiveBudgetCategoriesApi(authenticatedUser?.token ?? '', selectedBudget?.uid),
    enabled: !!selectedBudget?.uid, // Only fetch if a valid budget is selected
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
    staleTime: Infinity, // Keep the data fresh indefinitely
  });

  useEffect(() => {
    if (activeBudgetCategories.length > 0) {
      setManualData((prevData) => ({
        ...prevData,
        category: activeBudgetCategories[0].uid, // Set the first category as default
      }));
    }
  }, [activeBudgetCategories]); // Run effect when activeBudgetCategories changes

  // Set the first budget as the default if no budget is selected
  useEffect(() => {
    if (budgets.length > 0 && !selectedBudget) {
      setSelectedBudget(budgets[0]); // Set the first budget as default
    }
  }, [budgets, selectedBudget]);

  const handleBudgetChange = (selectedUid: string) => {
    const budget = budgets.find((budget) => budget.uid === selectedUid);
    setSelectedBudget(budget); // Save the full budget object

    // Trigger active categories fetching for the selected budget
    refetchActiveBudgetCategories();
  };

  // Fetch transactions API

  const {
    data,
    isLoading: isLoadingfetchAccountTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TransactionsPage, Error>({
    queryKey: ['accountTransactions', accountId], // Use accountId to uniquely identify the query
    queryFn: async ({ pageParam = 1 }: any) =>
      await fetchAccountTransactionsApi(
        authenticatedUser?.token ?? '',
        accountId,
        limit,
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage.next?.page ?? undefined, // Fetch the next page based on the API response
    enabled: !!authenticatedUser?.token && !!accountId, // Fetch only if the token and accountId are available
    initialPageParam: 1, // Set the initial page parameter
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
    staleTime: Infinity, // Keep the data fresh indefinitely
  });

  useEffect(() => {
    if (data?.pages && data.pages.length > 0) {
      setTransactions(data.pages.flatMap((page: TransactionsPage) => page.docs) || []);
    }
  }, [data]);

  useEffect(() => {
    if (syncAccountTransactions && syncAccountTransactions.length > 0) {
      setTransactions(syncAccountTransactions || []);
    }
  }, [syncAccountTransactions]);

  // Handle form input changes
  const [selectedBankIndex, setSelectedBankIndex] = useState(-1); // -1 indicates no selection initially

  const handleBankSelect = (index: any) => {
    setSelectedBankIndex(index);
    // set accountId instead
    setAccountId(accounts[index].uid);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (activeBudgetCategories.length > 0) {
      const mappedCategories = activeBudgetCategories.map((category: any) => ({
        id: category?.uid,
        name: category.name,
        totalAmount: 0,
        remaining: 0,
        color: category.color,
        selected: category.isDefault,
      }));
      setSelectedCategory(categories[0]?.id);

      // Update categories only if they have changed
      setCategories((prevCategories) => {
        const isEqual =
          prevCategories.length === mappedCategories.length &&
          prevCategories.every((cat, index) => cat.id === mappedCategories[index].id);
        return isEqual ? prevCategories : mappedCategories;
      });

      // Handle single or default category logic
      if (mappedCategories.length === 1) {
        setSelectedCategory((prev: any) =>
          prev !== mappedCategories[0]?.id ? mappedCategories[0]?.id : prev,
        );
        setManualData((prevData) => ({
          ...prevData,
          category: mappedCategories[0]?.name,
        }));
        setSelectedCategory(categories[0]?.id);
      } else {
        const defaultCategory = mappedCategories.find(
          (category: any) => category.selected,
        );
        if (defaultCategory) {
          setManualData((prevData) => ({
            ...prevData,
            category: defaultCategory.name || '',
          }));
        }
        setSelectedCategory(categories[0]?.id);
      }

      setSelectedCategoryId(activeBudgetCategories[0]?.uid);
    } else {
      setCategories((prev) => (prev.length === 0 ? prev : []));
    }
  }, [activeBudgetCategories]);

  // Handle input changes for both the category select and other inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Parse amount to a number and remove non-numeric characters
      setManualData((prev) => ({
        ...prev,
        [name]: parseFloat(value.replace(/[^0-9.-]+/g, '')),
      }));
    } else {
      setManualData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addManualMutation = useMutation({
    mutationFn: async (data) =>
      RecordExpenseApi(
        selectedBudget.uid,
        selectedCategoryId,
        data,
        authenticatedUser?.token ?? '',
      ),
    onSuccess: (data) => {
      setAddManualModal(!AddManualModal);
    },
    onError: (error) => {
      console.error('Error during logout:', error);
    },
  });

  const handleAddManually = async () => {
    const expenseData: any = {
      amount: manualData.amount,
      narration: manualData.itemName,
      date: manualData.date,
    };

    try {
      setSelectedCategory(manualData.category);
      const result = await addManualMutation.mutateAsync(expenseData);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId: any = e.target.value; // Get the selected category ID
    const selectedCategory: any = categories.find(
      (category) => category.id === selectedCategoryId,
    ); // Find the category by ID

    if (selectedCategory) {
      setManualData((prevData) => ({
        ...prevData,
        category: selectedCategory.id, // Update the category in manualData with the selected category ID
      }));

      setSelectedCategory(selectedCategory.id);
      setSelectedCategoryId(categories[0].id);
    }
  };

  const assignCategoryMutation = useMutation({
    mutationFn: async (data: {
      accountId: string;
      transactionId: string;
      budgetId: string;
      categoryId: any;
    }) =>
      AssignCategoryToTransactionApi(
        data.accountId,
        data.transactionId,
        data.budgetId,
        data.categoryId,
        authenticatedUser?.token ?? '',
      ),
    onMutate: async (variables) => {
      // Store previous transactions state for rollback if needed
      const previousTransactions = transactions;

      // Optimistically update the transactions state
      setTransactions(
        (prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction.uid !== variables.transactionId,
          ), // Remove the assigned transaction
      );

      // Return context with previous transactions for rollback
      return { previousTransactions };
    },
    onSuccess: (data) => {
      toast.success('Transaction updated with selected category!');
      setSelectedCategoryForTransaction(null);
      // Close the categories modal
      setShowCategories(false);
    },
    onError: (error, variables, context) => {
      console.error('Error assigning category:', error);
      toast.error('Failed to assign category. Please try again.');

      // Rollback to previous state if there's an error
      if (context?.previousTransactions) {
        setTransactions(context.previousTransactions);
      }
    },
  });

  const handleAssignCategory = () => {
    if (!selectedCategoryForTransaction) {
      toast.error('Please select a category');
      return;
    }

    assignCategoryMutation.mutate({
      accountId: accountId,
      transactionId: transactionId,
      budgetId: selectedBudget?.uid,
      categoryId: selectedCategoryForTransaction,
    });
  };

  const handleRemoveAccount = async (id: string) => {
    setIsApiLoading(true);
    const response = await removeAccountApi(authenticatedUser?.token ?? '', id);
    if (response.success) {
      // delete the account from the accoumts array
      setConnectedAccounts(
        connectedAccounts.filter((account: any) => account.uid !== id),
      );
      setShowTooltipIndex(null);
    }
    setIsApiLoading(false);
  };

  // Custom Radio button implementation
  const CustomRadio = (props: any) => {
    const {
      Component,
      children,
      isSelected,
      description,
      getBaseProps,
      getWrapperProps,
      getInputProps,
      getLabelProps,
      getLabelWrapperProps,
      getControlProps,
    } = useRadio(props);

    return (
      <Component
        {...getBaseProps()}
        className={cn(
          'group mb-[24px] inline-flex flex-1 hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent',
          'w-full cursor-pointer border-1 border-default rounded-[20px] gap-4 p-4',
          'data-[selected=true]:border-[#66C227] bg-[#F7F7F9]  data-[selected=true]:bg-[#F5FEED]',
        )}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <span {...getWrapperProps()}>
          <span {...getControlProps()} />
        </span>
        <div {...getLabelWrapperProps()}>
          {children && (
            <span className="text-[12px] max-w-[229px] font-[500] text-foreground opacity-70">
              {children}
            </span>
          )}
        </div>
      </Component>
    );
  };

  // account processing timer
  const [timeLeft, setTimeLeft] = useState<number>(30);
  useEffect(() => {
    if (showAccountProcessingModal) {
      if (timeLeft <= 0) return;

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else setTimeLeft(30);
  }, [timeLeft, showAccountProcessingModal]);

  const formatTime = (seconds: number): Date => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date;
  };

  return (
    <div className="bg-white min-h-[100vh] w-[100vw] relative max-w-[500px] h-full">
      <BudgetPageHeader headerType="dashboard" title={'Track expenses'} />

      <div
        className={` mt-[66px]   border-t-[4px] border-t-[#F7F7F9]  py-[24px] w-full   ${bankData ? 'mb-0' : 'mb-[16px]'} `}
      >
        <div className=" border-b-[4px] px-[24px] py-[16px]  border-b-[#F7F7F9]">
          <select
            name="budget"
            className="bg-[#F7F7F9] rounded-[8px] px-[12px] py-[8px] border-[#EFEFF0] border-[0.4px] w-full"
            id="budget"
            onChange={(e) => handleBudgetChange(e.target.value)} // Pass the selected value
            disabled={isPending} // Disable the select when loading
          >
            {isPending ? (
              <option disabled>Loading....</option> // Show loading state
            ) : (
              budgets?.map((budget: any) => (
                <option key={budget.uid} value={budget.uid}>
                  {budget.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className=" flex px-[24px] mt-[27px] justify-between">
          <h1 className=" text-[18px] font-[500] leading-[21.6px]">Linked Accounts</h1>

          {connectedAccounts.length > 0 && (
            <button
              onClick={() => handleLinkAccount()}
              className=" py-[4px] px-[8px] items-center justify-center bg-[#EFEFF0] rounded-[32px] font-[500] text-[12px] flex gap-[4px] "
            >
              <BsPlus size={20} /> Add new
            </button>
          )}
        </div>

        <div
          className={` w-full mb-[24px]  ${!bankData ? 'border-b-[#fafafa] w-full  border-b-[4px]' : 'border-b-[#F7F7F9] w-full  border-b-[0px]'}`}
        >
          <div className=" w-full px-[24px] ">
            {isGetAllAccountPending ? (
              <div className=" flex gap-2 items-center justify-center mx-auto w-full">
                <CircularProgress color="default" size="sm" />
              </div>
            ) : (
              <>
                {connectedAccounts.length > 0 ? (
                  <>
                    <div className="   w-full  mt-[19px]   rounded-t-[24px] gap-[24px] grid grid-cols-2  ">
                      {/* Show loading state */}

                      {/* Show error state */}
                      {isError && (
                        <div>Failed to load accounts. Please try again later.</div>
                      )}

                      {/* Render account details */}
                      {!isError &&
                        connectedAccounts.length > 0 &&
                        connectedAccounts.map((account: any, index: any) => (
                          <div
                            onClick={() => {
                              setShowSyncDataModal(true);
                              // set accountId here instead
                              setAccountId(account.uid);
                            }}
                            key={account.id}
                            className="flex px-[16px] relative border-[1px] py-[12px] rounded-[16px] border-[#EFEFF0] bg-[#F7F7F9] w-full justify-between"
                          >
                            <div className="flex gap-[14px] flex-col items-start">
                              {/* Placeholder for bank logo */}
                              <Image
                                width={10000}
                                height={1000}
                                src={account.institutionLogo}
                                alt={account.institutionName}
                                className=" size-[24px] rounded-[12px]  mr-[8px]"
                              />
                              <span className="text-[14px]">
                                {account.institutionName}
                              </span>
                              <span className="text-[14px]">{account.accountName}</span>
                              <span className="text-[14px]">{account.accountNumber}</span>
                            </div>
                            <span
                              className="text-[14px] font-[500] size-[32px] grid place-content-center bg-white rounded-[8px] p-[16px]"
                              onClick={(e) => {
                                e.stopPropagation(); // Stop propagation to the parent div
                                setShowTooltipIndex(
                                  showTooltipIndex === index ? null : index,
                                ); // Toggle tooltip visibility for this account
                              }}
                            >
                              <BsThreeDotsVertical />
                            </span>
                            {showTooltipIndex === index && ( // Show tooltip only for the selected account
                              <div
                                className="absolute w-fit h-fit flex gap-[8px] right-[10px] top-[55px] items-center justify-center bg-white text-[12px] text-black px-[8px] py-[6px] rounded-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveAccount(account.uid);
                                }}
                              >
                                <span className=" text-white size-[16px] grid place-content-center rounded-[4px]  bg-[#F5365C]">
                                  -
                                </span>
                                <p>Remove </p>
                                {/* Add more options as needed */}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="  border-[#EFEFF0] mb-[24px] mt-[19px] justify-center items-center  rounded-[24px] flex flex-col  p-[24px] bg-[#F7F7F9] border-[1px] ">
                      <Image
                        src={linkIcon}
                        className=" w-[94.42px] object-contain h-[84px] "
                        width={1000}
                        height={1000}
                        alt="goprudy"
                      />
                      <h1 className=" font-[500] text-center text-[#2D2D2D] leading-[19.2px]">
                        Link your bank accounts to track your transactions easily
                      </h1>
                      <button
                        onClick={() => handleLinkAccount()}
                        className=" text-[14px] mt-[8px] w-[108px] rounded-[32px] bg-[#66C227] px-[16px] py-[6px] text-[#FAFAFA] items-center justify-center flex gap-[4px] leading-[20px] text-center"
                      >
                        {!linkAccountMutation.isPending ? (
                          <>
                            {' '}
                            Link now <BsChevronRight />
                          </>
                        ) : (
                          'Linking...'
                        )}
                      </button>
                    </div>
                    <p className=" text-[14px] leading-[16.8px]">
                      {' '}
                      By continuing you agree to our{' '}
                      <span className=" text-[#66C227] font-[500] ">
                        Privacy Policy and Terms of Service .
                      </span>
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {accounts ? (
          <div className="  pb-[106px] border-t-[4px] border-t-[#F7F7F9]  pt-[24px] px-[24px] ">
            <h1 className=" font-[500]   text-[#2D2D2D] mt-[0px] text-[18px]">
              Track your finances
            </h1>

            <div className=" flex justify-between  mt-[24px] gap-[16px]">
              <Image
                onClick={() => {
                  if (accounts.length === 1) {
                    setShowSyncDataModal(true);

                    // set accountId here instead
                    setAccountId(accounts[0].uid);
                  } else {
                    setShowSyncTransactionFirstModal(!showSyncTransactionFirstModal);
                  }
                }}
                width={1000}
                height={1000}
                src={sync}
                alt={'goprudy'}
                className="  h-[118px] w-[104px]  "
              />

              <button onClick={() => setScanState(true)} className="">
                <Image
                  width={1000}
                  height={1000}
                  src={scan}
                  alt={'goprudy'}
                  className="  h-[118px] w-[104px]  "
                />
              </button>

              <Image
                onClick={() => setAddManualModal(!AddManualModal)}
                width={1000}
                height={1000}
                src={addManual}
                alt={'goprudy'}
                className="  h-[118px] w-[104px]  "
              />
            </div>

            {loading && <p className="mt-4">Scanning the receipt, please wait...</p>}
            {text && (
              <div className="mt-4">
                <h3 className="font-bold">Scanned Text:</h3>
                <p>{text}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 className=" font-[500] px-[24px]  text-[#2D2D2D] mt-[28px] text-[18px]">
              3 ways to track your expenses
            </h1>
            <div className=" w-full px-[24px] mt-[24px]">
              <div className=" flex justify-center flex-col gap-[24px]">
                {cardItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: item.color,
                      border: item.border,
                      borderRadius: '24px',
                      padding: '16px',
                    }}
                    className=" w-full"
                  >
                    <div className="mb-[12px] items-center  flex gap-[0px]">
                      <div className=" relative w-[57.14px]    h-[50px]">
                        <Image
                          width={1000}
                          height={1000}
                          src={item.image.src}
                          alt={item.title}
                          className="  w-full  top-0 left-[-12px]  absolute  h-full"
                        />
                      </div>

                      <h2 className="font-[500] mr-2 pb-[22px] leading-[19.2px]">
                        {item.title}
                      </h2>
                    </div>

                    <p className="text-[14px] leading-[20px]">{item.subtext}</p>
                    <div className=" flex-1 flex  justify-end mt-[16px] w-full">
                      <button
                        style={{ color: item.buttonColor }}
                        className=" items-center text-[12px] font-[500]   px-[18px] py-[8px] flex shadow-sm gap-[4px] rounded-[16px] bg-white"
                      >
                        {item.btnText}
                        <BsChevronRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className=" bg-[#FAFAFA]  w-full " />

      {AddManualModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh] max-w-[500px] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        >
          {' '}
          <BottomDrawer
            footer={
              <div className="w-full  grid gap-y-[16px]">
                <button
                  onClick={() => {
                    handleAddManually();
                  }}
                  className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
                  disabled={addManualMutation.status === 'pending'}
                >
                  {' '}
                  {addManualMutation.status === 'pending' ? 'Saving...' : 'Save'}{' '}
                </button>
              </div>
            }
            label={addManualModalTitle}
            back={false}
            show={AddManualModal}
            close={true}
            onClose={() => setAddManualModal(!AddManualModal)}
          >
            <div className=" mb-[24px] pt-[24px] flex flex-col gap-[16px] w-full">
              <label className="bg-[#F7F7F9] p-[16px] rounded-[20px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">
                Name of item
                <input
                  name="itemName"
                  className="outline-none bg-[#ff000000] font-[500] leading-[24px] text-[16px] text-black"
                  placeholder="Enter name"
                  type="text"
                  value={manualData.itemName}
                  onChange={handleInputChange}
                />
              </label>

              <label className="bg-[#F7F7F9] p-[16px] rounded-[20px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">
                Amount
                <div className="flex text-[17px] gap-[4px] items-center">
                  ₦
                  <input
                    name="amount"
                    className="outline-none bg-[#ff000000] font-[500] leading-[24px] text-[16px] text-black"
                    placeholder="Enter amount"
                    type="text"
                    value={manualData.amount.toLocaleString()}
                    onChange={handleInputChange}
                  />
                </div>
              </label>

              <label className="bg-[#F7F7F9] p-[16px] rounded-[20px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">
                Category
                <select
                  name="category"
                  className="outline-none bg-[#ff000000] font-[500] leading-[24px] text-[16px] text-black"
                  value={manualData.category || ''} // Allow no default selection
                  onChange={handleCategoryChange}
                >
                  <option value="" disabled>
                    Select a category
                  </option>{' '}
                  {/* Placeholder option */}
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="bg-[#F7F7F9] p-[16px] rounded-[20px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">
                Date
                <input
                  name="date"
                  className="outline-none bg-[#ff000000] font-[500] leading-[24px] text-[16px] text-black"
                  type="date"
                  value={manualData.date}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </BottomDrawer>
        </motion.div>
      )}

      {showSyncModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh] w-full z-[40] bottom-0 fixed max-w-[500px] bg-[#1c1c1c73]"
        >
          {' '}
          <BottomDrawer
            label={`Sync transactions`}
            back={false}
            show={showSyncModal}
            close={true}
            onClose={() => setShowSyncModal(!showSyncModal)}
          >
            <div className=" flex justify-center items-center py-[60px] flex-col gap-[16px] w-full">
              <CircularProgress size="md" />
            </div>
          </BottomDrawer>
        </motion.div>
      )}

      {showSyncTransactionFirstModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh] w-[100vw] max-w-[500px] flex justify-center items-center p-[24px] z-[40]  bottom-0 fixed bg-[#1c1c1c73]"
        >
          {' '}
          <div className=" bg-white p-[24px] w-full rounded-[40px] ">
            <div className=" w-full flex justify-between">
              <div></div>
              <div className=" text-[20px] font-[500]">Sync Transactions</div>
              <div className=" cursor-pointer ">
                <BsX
                  size={28}
                  onClick={() =>
                    setShowSyncTransactionFirstModal(!showSyncTransactionFirstModal)
                  }
                  className=" bg-[#F7F7F9] rounded-[8px]"
                />
              </div>
            </div>
            <h1 className=" mb-[24px] font-[400] mt-[8px] leading-[24px] text-center ">
              Kindly select the bank account you <br /> would like to sync with
            </h1>
            <RadioGroup
              orientation="vertical"
              className=" flex flex-col w-full  "
              color="success"
              onValueChange={(value) => handleBankSelect(value)}
            >
              {
                // Show loading state
                isGetAllAccountPending ? (
                  <div className=" mx-auto w-full my-[3rem]">Loading accounts...</div>
                ) : // Show error state
                isError ? (
                  <div>Failed to load accounts. Please try again later.</div>
                ) : // Render account details
                accounts.length > 0 ? (
                  accounts.map((account: any, index: any) => (
                    <CustomRadio
                      key={index} // Key is important for performance optimization
                      isSelected={selectedBankIndex === index}
                      onChange={() => handleBankSelect(index)}
                      className="flex w-full justify-between"
                      value={index}
                    >
                      <div className="w-full">
                        {/* Display Bank Name */}
                        <h1 className="text-[#2f1a1a] text-[14px]">
                          {account.institutionName}
                        </h1>

                        {/* Display Account Details */}
                        <div className="w-full flex">
                          <h1 className="text-[14px] flex w-full text-base-black">
                            {account.accountName} |
                            <span className="font-[500]"> {account.accountNumber}</span>
                          </h1>
                        </div>
                      </div>
                    </CustomRadio>
                  ))
                ) : (
                  // Fallback for no accounts

                  accounts.length === 0 && <div>No accounts available for selection.</div>
                )
              }
            </RadioGroup>
            <button
              disabled={isGetAllAccountPending}
              onClick={() => {
                // use accountId here instead

                accountId ? setShowSyncDataModal(true) : alert('Select a bank account');
              }}
              type="submit"
              className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
            >
              Proceed
            </button>
          </div>
        </motion.div>
      )}

      {showAccountProcessingModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh] w-[100vw] max-w-[500px] flex justify-center items-center p-[24px] z-[100]  bottom-0 fixed bg-[#1c1c1c73]"
        >
          <div className=" bg-white p-[24px] w-full space-y-2 rounded-[40px]">
            <div className="cursor-pointer ml-auto w-fit">
              <BsX
                size={28}
                onClick={() => setShowAccountProcessingModal(false)}
                className=" bg-[#F7F7F9] rounded-[8px]"
              />
            </div>
            <Image
              src="/images/processing.gif"
              width={100}
              height={100}
              alt=""
              className="w-[100px] mx-auto"
            />

            <h1 className="text-center text-[20px] font-[500]">Account Processing</h1>

            <h1 className="font-[400] leading-[24px] text-base text-center text-[#575757]">
              Your account status will be available in a few seconds
            </h1>
            <div className="w-fit mx-auto">
              <span className="h-[22px] p-1 bg-[#eef4fd] rounded p-px text-center text-[#3172dd] text-sm font-normal leading-[14px]">
                {format(formatTime(timeLeft), 'mm')}
              </span>{' '}
              :{' '}
              <span className="h-[22px] p-1 bg-[#eef4fd] rounded p-px text-center text-[#3172dd] text-sm font-normal leading-[14px]">
                {format(formatTime(timeLeft), 'ss')}
              </span>
            </div>

            {timeLeft === 0 && (
              <button
                disabled={syncAccountTransactionsisLoading}
                onClick={handleSyncTransactions}
                type="submit"
                className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
              >
                {syncAccountTransactionsisLoading
                  ? 'Syncing...'
                  : 'Sync Transactions Now'}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {showSyncDataModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen h-full w-full overflow-auto max-w-[500px] z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        >
          <div className="h-full text-[white] relative flex bg-gradient-to-tl from-[#66C227] to-[#2A860A] w-full   flex-col gap-[16px] ">
            <div className="pt-[70px] px-6">
              <div className="space-y-4 w-full gap-[16px] p-[8px] rounded-[20px] ">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={selectedBankAccount.institutionLogo}
                      width={36}
                      height={36}
                      alt={selectedBankAccount.institutionName}
                      className="w-9 rounded-[32px] bg-white border border-white"
                    />
                    <h1 className="uppercase text-[12px] font-[400]">
                      {selectedBankAccountLoading ? (
                        <Skeleton className="w-1/2 h-5 opacity-30 rounded-sm" />
                      ) : (
                        selectedBankAccount.institutionName
                      )}
                    </h1>
                  </div>
                  <button
                    onClick={() => setShowSyncDataModal(!showSyncDataModal)}
                    className=" grid place-content-center top-[24px] bg-[#7CD741] size-[36px] rounded-full  "
                  >
                    <BsX size={'24px'} />
                  </button>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <h6>{selectedBankAccount.accountName}</h6>
                  <h6>{selectedBankAccount.accountNumber}</h6>
                </div>
                <div className="bg-[#FAFAFA] rounded-[12px] p-2 space-y-2">
                  <p className="text-[12px] text-[#575757]">Current balance</p>
                  <div className="flex items-center justify-between w-full">
                    {selectedBankAccountLoading ? (
                      <Skeleton className="w-1/2 h-5 opacity-30 rounded-sm" />
                    ) : (
                      <h1 className="font-[700] aeonik mt-[8px] text-[#242424]">
                        {showBalance ? (
                          <>₦ {selectedBankAccount.accountBalance}</>
                        ) : (
                          '  ₦ *******'
                        )}
                      </h1>
                    )}
                    <button
                      onClick={toggleBalanceVisibility}
                      className=" bg-[#E7E7EA] text-[#2D2D2D] text-[10px] h-6 px-2 rounded-[12px] "
                    >
                      {showBalance ? 'Hide balance' : 'Show balance'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white h-full w-full">
              {selectedBankAccountLoading ? (
                <>
                  <Skeleton className="w-[80%] mx-auto h-5 mt-7 opacity-30 rounded-sm" />
                  <Skeleton className="w-[80%] mx-auto h-20 mt-7 opacity-30 rounded-sm" />
                </>
              ) : (
                <>
                  <h1 className="px-6 my-4 text-center mx-auto w-full text-[#828282] text-[13px] leading-[20px]">
                    Click on the transaction to assign it to the right category
                  </h1>

                  <div className="h-full w-full space-y-4">
                    <div className="flex px-6 w-full items-center justify-between">
                      <h1 className=" text-[#2d2d2d] font-[500] leading-[19.2px]">
                        Latest transactions
                      </h1>
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
                        className="bg-[#EFEFF0] font-[500] text-[12px] text-[#2D2D2D] py-[4px] px-[8px] rounded-[32px]"
                        disabled={isSyncing} // Disable button while syncing
                      >
                        {isSyncing ? 'Syncing...' : 'Sync Latest'}
                      </button>
                    </div>
                    <div className="bg-[#F7F7F9] h-full w-full">
                      {/* Conditional Rendering based on currentView state */}
                      {currentView === 'loading' && (
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
                          <h1 className="font-[500] text-[24px] text-[#2d2d2d] leading-[28.8px]">
                            Yaay! 😎
                          </h1>
                          <h1 className="text-[#828282] text-[16px] leading-[19.2px]">
                            You’re all synced up
                          </h1>
                        </div>
                      )}

                      {currentView === 'syncedData' && (
                        <div className="px-6 py-4 h-full space-y-4">
                          {transactions.map((transaction, index) => (
                            <div
                              key={transaction.uid}
                              onClick={() => AssignExpense(transaction.uid)}
                              className={`flex justify-between items-center ${
                                index !== transactions.length - 1
                                  ? 'border-b border-b-[#E7E7EA]'
                                  : ''
                              } pb-2`}
                            >
                              <div>
                                <p className="font-[500] text-[14px] text-[#2d2d2d]">
                                  {transaction.narration}
                                </p>
                                <p className="text-[#575757] flex gap-3  text-[12px]">
                                  {formatDateTime(transaction.date)}
                                </p>
                              </div>
                              <div className="font-[500] text-[14px] text-[#2d2d2d] whitespace-nowrap">
                                ₦ {transaction.amount.toLocaleString()}
                              </div>
                            </div>
                          ))}

                          {isFetchingNextPage && (
                            <p className=" text-[#66C227] mx-auto w-full">
                              Loading more...
                            </p>
                          )}

                          <button
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                            className="mt-8 bg-[#66C227]  flex justify-center items-center mx-auto text-white p-2 rounded disabled:opacity-50"
                          >
                            {isLoadingfetchAccountTransactions
                              ? 'Loading...'
                              : isFetchingNextPage
                                ? 'Loading...'
                                : hasNextPage
                                  ? 'Load More'
                                  : 'No More Data'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {showCategories && (
        <div className="h-[100vh] w-[100vw] max-w-[500px] z-[40] fixed bottom-0">
          {/* Dark background */}
          <div
            className="h-full w-full bg-[#1c1c1c73] fixed"
            onClick={() => setShowCategories(false)} // Close on background click
          ></div>

          {/* Bottom drawer */}
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0  w-full z-[50]"
          >
            <BottomDrawer
              label={`Sync transactions`}
              back={false}
              show={showCategories}
              close={true}
              padding={1}
              removePadding={false}
              footer={
                <button
                  className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
                  onClick={handleAssignCategory}
                  disabled={assignCategoryMutation.isPending} // Disable button when loading
                >
                  {assignCategoryMutation.isPending ? (
                    // Show a loading spinner or some text when loading
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      <span className="ml-2">Assigning...</span>
                    </span>
                  ) : (
                    // Regular button text
                    'Assign'
                  )}
                </button>
              }
              onClose={() => setShowCategories(!showCategories)}
            >
              <div className="bg-white  pt-4 pb-[32px] px-4   rounded-t-lg shadow-lg">
                <h1 className="text-[16px] font-[500] text-[#514F6E] mb-[24px]">
                  Select category
                </h1>

                <div className="grid grid-cols-3 max-h-[50vh]  overflow-y-scroll gap-4">
                  {singleBudgetData?.budgetCategories?.map((category: any) => (
                    <div
                      key={category.uid}
                      className={`relative p-[8px] w-[105.67px] h-[100px] border rounded-[20px] ${
                        selectedCategoryForTransaction === category.uid
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      } cursor-pointer`}
                      onClick={() => handleSelectCategory(category.uid)}
                      style={{
                        backgroundColor:
                          selectedCategoryForTransaction === category.uid
                            ? lightenColor(category.color, 0.9)
                            : 'transparent',
                        borderColor:
                          selectedCategoryForTransaction === category.uid
                            ? category.color
                            : '#EFEFF0',
                      }}
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor:
                                selectedCategoryForTransaction === category.uid
                                  ? category.color
                                  : 'transparent',
                              borderColor: category.color,
                              borderWidth: '2px',
                            }}
                          >
                            {selectedCategoryForTransaction === category.uid && (
                              <BsCheck className="text-white" />
                            )}
                          </div>
                          <h1 className="text-[#2d2d2d] text-[12px] truncate">
                            {category.name}
                          </h1>
                        </div>
                        <h1 className="font-medium text-[14px] text-[#2d2d2d] truncate">
                          ₦ {category.amountLeft}
                          <span className="text-[#828282] text-[10px] font-[400]">
                            {' '}
                            left
                          </span>
                        </h1>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#575757] h-2 rounded-full"
                            style={{
                              width: `${
                                (category.amountLeft / category.amountAllocated) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`relative p-[8px] w-[105.67px] h-[100px] border rounded-[20px] ${category.selected ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
                        onClick={() => handleSelectCategory(category.id)}
                        style={{
                          backgroundColor: category.selected ? lightenColor(category.color, 0.9) : 'transparent',
                          borderColor: category.selected ? category.color : '#EFEFF0',
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="flex flex-col">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: category.selected ? category.color : 'transparent',
                                borderColor: category.color,
                                borderWidth: '2px',
                              }}
                            >
                              {category.selected && <BsCheck className="text-white" />}
                            </div>
                            <h1 className="text-[#2d2d2d] text-[12px] truncate">{category.name}</h1>
                          </div>
                          <h1 className="font-medium text-[14px] text-[#2d2d2d] truncate">
                            ₦ {abbreviateNumber(category.remaining)}
                            <span className="text-[#828282] text-[10px] font-[400]"> left</span>
                          </h1>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#575757] h-2 rounded-full"
                              style={{
                                width: `${(category.remaining / category.totalAmount) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))} */}
                </div>
              </div>
            </BottomDrawer>
          </motion.div>
        </div>
      )}

      {scanState && (
        <div className=" text-center w-full grid   place-content-center gap-3 ">
          <div className=" w-full ">
            {/* Dark background */}
            <div
              className="h-full top-6  left-0 z-40 w-full max-w-[500px] flex justify-center items-center bg-[#1c1c1c73] absolute"
              onClick={() => setScanState(false)} // Close on background click
            ></div>
            <Scanner
              scanState={scanState}
              setScanState={setScanState}
              setManualData={setManualData}
              setAddManualModal={setAddManualModal}
              defaultCategory={activeBudgetCategories[0]}
              setAddManualModalTitle={setAddManualModalTitle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
