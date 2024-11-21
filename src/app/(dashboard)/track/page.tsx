'use client'
import Header2 from "@/components/create-budget/Header2";
import Image from "next/image";
import linkIcon from '@/images/Mindmap.png'
import Icon1 from '@/images/Add Category.png'
import Icon2 from '@/images/Write Content.png'
import Icon3 from '@/images/Add Files.png'
import wema from '@/images/wema.png'
import kuda from '@/images/kuda.png'
import gt from '@/images/gt.png'
import sync from '@/images/sync.png'
import scan from '@/images/scan.png'
import lunch from '@/images/Launch.png'
import mono1 from '@/images/mono1.png'
import addManual from '@/images/addManually.png'
import { BsCheck, BsChevronRight, BsPlus, BsThreeDotsVertical, BsX } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import BottomDrawer from "@/components/create-budget/BottomDrawer";
import { useRouter } from "next/navigation";
import Tesseract from 'tesseract.js';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthentication } from "@/app/store/AuthStore";
import { GetAllBudgetsApi } from "@/app/services/BudgetService";
import { fetchAccountInfoApi, fetchAccountTransactionsApi, getAllAccountsApi, initLinkAccountApi, syncAccountTransactionsApi } from "@/app/services/AccountService";
import { RadioGroup, useRadio, VisuallyHidden, cn, CircularProgress } from "@nextui-org/react";
import { useInfiniteQuery } from '@tanstack/react-query';
import toast from "react-hot-toast";
import { format, parseISO } from 'date-fns';


interface Bank {
  name: string;
  balance: number;
  logo: any;
  user: string,
  number: string
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

  interface FetchAccountTransactionsApiResponse {
    token: string;
    accountId: string;
    limit: number;
    page: number;
  }

  // Create the array of card items
  const cardItems: CardItem[] = [
    {
      color: '#E0E7FF', // Light blue
      title: 'Assign transactions from your bank account',
      subtext: 'Assign your transactions from your bank account to the right budget category and win 20 points',
      btnText: 'Assign now',
      border: '1px solid #F3F0FA', // Example border color
      image: Icon1, // Replace with actual image path
      buttonColor: '#8A62D8'
    },
    {
      color: '#FDF4EC', // Light yellow
      title: 'Scan your receipts',
      subtext: 'Scan receipts from shopping to track the expenses effectively',
      btnText: 'Scan now',
      border: '1px solid #FBE9DA', // Example border color
      image: Icon2, // Replace with actual image path
      buttonColor: '#E67731'
    },
    {
      color: '#EBFAFD', // Light cyan
      title: 'Add manually',
      subtext: 'Add your expense details manually',
      btnText: 'Add now',
      border: '1px solid #D7F4FB', // Example border color
      image: Icon3, // Replace with actual image path
      buttonColor: '#11CDEF'
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

  interface IAccount {
    createdAt: string; // ISO string representation of the creation date
    updatedAt: string; // ISO string representation of the last update date
    deletedAt: string | null; // Nullable field for deletion timestamp
    id: number; // Unique identifier for the account
    uid: string; // Universally unique identifier
    providerAccountId: string; // Provider-specific account ID
    accountName: string; // Name of the account holder
    accountNumber: string; // Account number
    accountType: 'SAVINGS_ACCOUNT' | 'CURRENT_ACCOUNT' | 'OTHER'; // Account type
    accountBalance: number; // Account balance
    accountBvn: string; // Bank Verification Number (optional)
    accountStatus: 'AVAILABLE' | 'FROZEN' | 'CLOSED'; // Status of the account
    institutionName: string; // Name of the financial institution
    institutionCode: string; // Institution code (e.g., bank code)
    institutionType: 'PERSONAL_BANKING' | 'CORPORATE_BANKING' | 'OTHER'; // Type of institution
  }



  interface Category {
    id: number;
    name: string;
    totalAmount: number;
    remaining: number;
    color: string;
    selected: boolean;
  }
  type ManualData = {
    itemName: string;
    amount: number;
    category: string;
    date: string;
  };

  const initialCategories: Category[] = [
    { id: 1, name: 'Housing', totalAmount: 5000000, remaining: 4250000, color: '#01B0C5', selected: false },   // Blue
    { id: 2, name: 'Food', totalAmount: 450000, remaining: 450000, color: '#FB8417', selected: false },       // Orange
    { id: 3, name: 'Transport', totalAmount: 450000, remaining: 450000, color: '#A858EE', selected: false },  // Purple
    { id: 4, name: 'Education', totalAmount: 450000, remaining: 450000, color: '#F18987', selected: false },  // Pink
    { id: 5, name: 'Entertainment', totalAmount: 600000, remaining: 300000, color: '#99DFAD', selected: false }, // Green
    { id: 6, name: 'Health', totalAmount: 200000, remaining: 150000, color: '#6F6C8F', selected: false },     // Red
    { id: 7, name: 'Utilities', totalAmount: 1000000, remaining: 700000, color: '#E3B53C', selected: false }, // Yellow
    { id: 8, name: 'Shopping', totalAmount: 800000, remaining: 600000, color: '#FDC1C1', selected: false },   // Teal
    { id: 9, name: 'Travel', totalAmount: 900000, remaining: 800000, color: '#97E0F7', selected: false },     // Indigo
    { id: 10, name: 'Miscellaneous', totalAmount: 300000, remaining: 150000, color: '#66C227', selected: false }, // Gray
  ];







  const navigation = useRouter()

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




  const [bankData, setBankData] = useState<Bank[]>(bank_data)
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showSyncDataModal, setShowSyncDataModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<IAccount>({
    createdAt: '',
    updatedAt: '',
    deletedAt: null,
    id: 0,
    uid: '',
    providerAccountId: '',
    accountName: '',
    accountNumber: '',
    accountType: 'SAVINGS_ACCOUNT',
    accountBalance: 0,
    accountBvn: '',
    accountStatus: 'AVAILABLE',
    institutionName: '',
    institutionCode: '',
    institutionType: 'PERSONAL_BANKING',
  });
  const [showCategories, setShowCategories] = useState(false);
  const [syncBank, setSyncBank] = useState<any>(bankData[0]);
  const [showSyncTransactionFirstModal, setShowSyncTransactionFirstModal] = useState<any>(bankData[0]);
  const [selectBankDetail, setSelectBankdetail] = useState<any>('');
  const [currentView, setCurrentView] = useState('syncedData'); // default, loading, syncedData
  const [isSyncing, setIsSyncing] = useState(false);
  // ADD MANUAL STATE
  const [AddManualModal, setAddManualModal] = useState<boolean>(false);
  const [manualData, setManualData] = useState<ManualData>({
    itemName: '',
    amount: 0,
    category: initialCategories[0].name, // Default category
    date: '',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // SCAN RECEIPT 
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [page, setPage] = useState(1); // Current page
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Loading state for more data

  const limit = 12; // Items per page


  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [showBalance, setShowBalance] = useState(true); // Track balance visibility

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setShowBalance(prevState => !prevState);
  };

  // FUNCTION TO SCAN RECEIPT DATA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }

    return () => {
      // Clean up video stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0);
        scanReceipt();
      }
    }
  };

  const scanReceipt = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      setLoading(true);
      Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (m) => console.log(m), // Log progress
        }
      )
        .then(({ data: { text } }) => {
          setText(text);
          setLoading(false);
          // Stop video stream after capturing
          if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            setVideoStream(null);
          }
        })
        .catch((error) => {
          console.error('Error scanning receipt:', error);
          setLoading(false);
        });
    }
  };


  // FUNCTION TO ADD MANUALLY
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSaveManually = () => {
    console.log('Saved Item Data:', manualData);
    setAddManualModal(!AddManualModal)
  };






  // Function to handle category selection
  const handleSelectCategory = (id: number) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, selected: true } : { ...category, selected: false }
    );
    setCategories(updatedCategories);
  };

  const handleAssign = () => {
    if (selectedCategory) {
      console.log('Assigned category:', selectedCategory.name);
      // Handle assignment logic here...
    }
  };

  // Calculate total combined balance
  const totalBalance = bankData.reduce((acc, bank) => acc + bank.balance, 0);

  // Toggle the balance view
  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

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
    showSyncModal && handleSyncTransaction()
  }, [showSyncModal])


  const AssignExpense = () => {
    try {

      setShowCategories(!showCategories)
    } catch (error) {

    }
  }


  const abbreviateNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`; // Millions
    }

    return num.toLocaleString(); // Less than thousand
  };





  const handleSyncTransactions = async () => {
    // Show loader when syncing starts
    setCurrentView('loading');
    setIsSyncing(true); // Indicate syncing state

    try {
      // Manually trigger the fetch (queryFn)
      await refetch();

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



  const { authenticatedUser } = useAuthentication();

  const { data: budgets = [], isLoading, isPending, error } = useQuery({
    queryKey: ['allBudgetCategories'],
    queryFn: () => GetAllBudgetsApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token,
    refetchOnWindowFocus: true,
  });


  const params = {
    sortBy: 'accountName',
    sortDir: 'ASC',
    limit: 12,
    page: 12,
  };

  // React Query hook
  const { data: accounts = [], isPending: isGetAllAccountPending, isError } = useQuery({
    queryKey: ['accounts', params],
    queryFn: () => getAllAccountsApi(authenticatedUser?.token ?? '', params),
    enabled: !!authenticatedUser?.token, // Only fetch if token exists
    refetchOnWindowFocus: true,
  });


  console.log(accounts);


  // React Query mutation to link an account
  const linkAccountMutation = useMutation({
    mutationFn: () => initLinkAccountApi(authenticatedUser?.token ?? ''),
    onSuccess: (data) => {

      console.log('Account linked successfully!', data);
      // Any other success handling logic such as redirecting or updating UI
    },
    onError: (error: unknown) => {
      console.error('Error linking account:', error);
      // Handle additional error states if necessary
    },
  });



  useEffect(() => {
    if (linkAccountMutation.isPending) {
      setShowSyncModal(true)
      console.log(linkAccountMutation.isPending);
    }
  }, [linkAccountMutation])

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



  const accountId = selectedBankAccount.uid || ''; // Replace with actual account ID
  const { data: accountInfo = [], isPending: fetchAccountInfoIspending } = useQuery({
    queryKey: ['accountInfo', accountId],
    queryFn: () => fetchAccountInfoApi(authenticatedUser?.token ?? '', accountId),
    enabled: !!authenticatedUser?.token && !!accountId, // Only fetch if token and id are available
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });


  const { data: syncAccountTransactions = [], isLoading: syncAccountTransactionsisLoading, isError: syncAccountTransactionsisError, refetch } = useQuery({
    queryKey: ['accountInfo', accountId],
    queryFn: () => syncAccountTransactionsApi(authenticatedUser?.token ?? '', accountId),
    enabled: false, // Disables automatic fetching
    refetchOnWindowFocus: false, // Optionally disable this
  });

  console.log(syncAccountTransactions);










  // Fetch transactions API

  const {
    data,
    isLoading: isLoadingfetchAccountTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TransactionsPage, Error>({
    queryKey: ['accountTransactions', accountId],
    queryFn: async ({ pageParam = 1 }: any) =>
      await fetchAccountTransactionsApi(authenticatedUser?.token ?? '', accountId, limit, pageParam),
    getNextPageParam: (lastPage) => lastPage.next?.page ?? undefined,
    enabled: !!authenticatedUser?.token && !!accountId,
    initialPageParam: 1, // Define the initial page number
  });

  console.log(data);


  // // Flatten all transaction pages into a single array
  // const transactions: Transaction[] = data?.pages.flatMap((page: any) => page.docs) || [];

  useEffect(() => {
    if (data?.pages && data.pages.length > 0) {
      setTransactions(data.pages.flatMap((page: TransactionsPage) => page.docs) || []);
    }
  }, [data]);

  useEffect(() => {
    if (syncAccountTransactions && syncAccountTransactions.length > 0) {
      console.log(syncAccountTransactions);

      setTransactions(syncAccountTransactions || []);
    }
  }, [syncAccountTransactions]);



  const { data: syncedTransactions, isPending: syncedTransactionsIsPending } = useQuery({
    queryKey: ['syncAccountTransactions', accountId],
    queryFn: () => syncAccountTransactionsApi(authenticatedUser?.token ?? '', accountId),
    enabled: !!authenticatedUser?.token && !!accountId, // Only fetch if token and account ID are available
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });



  // Handle form input changes
  const [selectedBankIndex, setSelectedBankIndex] = useState(-1); // -1 indicates no selection initially

  const handleBankSelect = (index: any) => {
    setSelectedBankIndex(index);
    setSelectedBankAccount(accounts[index])
    console.log(selectedBankAccount);

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
          "group mb-[24px] inline-flex flex-1 hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
          "w-full cursor-pointer border-1 border-default rounded-[20px] gap-4 p-4",
          "data-[selected=true]:border-[#66C227] bg-[#F7F7F9]  data-[selected=true]:bg-[#F5FEED]",
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
            <span className="text-[12px] max-w-[229px] font-[500] text-foreground opacity-70">{children}</span>


          )}
        </div>
      </Component>
    );
  };

  return (
    <div className="bg-base-white w-full h-full">
      <Header2 title={'Track expenses'} />



      <div className={` mt-[66px]  border-t-[4px] border-t-[#F7F7F9]  py-[24px] w-full   ${bankData ? 'mb-0' : 'mb-[16px]'} `}>
        <div className=" border-b-[4px] px-[24px] py-[16px]  border-b-[#F7F7F9]">
          <select
            name=""
            className="bg-[#F7F7F9] rounded-[8px] px-[12px] py-[8px] border-[#EFEFF0] border-[0.4px] w-full"
            id=""
          >
            {budgets?.docs?.map((budget: any) => (
              <option key={budget.id} value={budget.name || ''}>
                {budget.name}
              </option>
            ))}
          </select>

        </div>

        <div className=" flex px-[24px] mt-[27px] justify-between">
          <h1 className=" text-[18px] font-[500] leading-[21.6px]">Linked Accounts</h1>

          {accounts.length > 0 && <button onClick={() => handleLinkAccount()} className=" py-[4px] px-[8px] items-center justify-center bg-[#EFEFF0] rounded-[32px] font-[500] text-[12px] flex gap-[4px] "><BsPlus size={20} /> Add new</button>}
        </div>

        <div className={` w-full mb-[24px]  ${!bankData ? 'border-b-[#fafafa] w-full  border-b-[4px]' : 'border-b-[#F7F7F9] w-full  border-b-[0px]'}`}>
          <div className=" w-full px-[24px] ">

            {isGetAllAccountPending ?

              <div className=' flex gap-2 items-center justify-center mx-auto w-full'>
                <CircularProgress color='default' size='sm' />

              </div>
              :
              <>
                {accounts.length > 0 ?
                  <>
                    <div className="   w-full  mt-[19px]   rounded-t-[24px] gap-[24px] grid grid-cols-2  ">
                      {/* Show loading state */}


                      {/* Show error state */}
                      {isError && <div>Failed to load accounts. Please try again later.</div>}

                      {/* Render account details */}
                      {!isGetAllAccountPending && !isError && accounts.length > 0 && (
                        accounts.map((account: any, index: any) => (
                          <div
                            onClick={() => {
                              setShowSyncDataModal(true)
                              setSelectedBankAccount(account)
                            }}
                            key={account.id}
                            className="flex px-[16px] border-[1px] py-[12px] rounded-[16px] border-[#EFEFF0] bg-[#F7F7F9] w-full justify-between">
                            <div className="flex gap-[14px] flex-col items-start">
                              {/* Placeholder for bank logo */}
                              <Image
                                width={10000}
                                height={1000}
                                src={account.institutionLogo}
                                alt={account.institutionName}
                                className=" size-[24px] rounded-[12px]  mr-[8px]"
                              />
                              <span className="text-[14px]">{account.institutionName}</span>
                              <span className="text-[14px]">{account.accountName}</span>
                              <span className="text-[14px]">{account.accountNumber}</span>
                            </div>
                            <span
                              className="text-[14px] font-[500] size-[32px] grid place-content-center bg-white rounded-[8px] p-[16px]">
                              <BsThreeDotsVertical />
                            </span>
                          </div>))
                      )}
                    </div>
                  </>
                  :

                  <>
                    <div className="  border-[#EFEFF0] mb-[24px] mt-[19px] justify-center items-center  rounded-[24px] flex flex-col  p-[24px] bg-[#F7F7F9] border-[1px] ">
                      <Image src={linkIcon} className=" w-[94.42px] object-contain h-[84px] " width={1000} height={1000} alt="goprudy" />
                      <h1 className=" font-[500] text-center text-[#2D2D2D] leading-[19.2px]">Link your bank accounts to track your transactions easily</h1>
                      <button onClick={() => handleLinkAccount()} className=" text-[14px] mt-[8px] w-[108px] rounded-[32px] bg-[#66C227] px-[16px] py-[6px] text-[#FAFAFA] items-center justify-center flex gap-[4px] leading-[20px] text-center">
                        {!linkAccountMutation.isPending ?
                          <> Link now <BsChevronRight />
                          </>
                          :
                          'Linking...'
                        }

                      </button>
                    </div>
                    <p className=" text-[14px] leading-[16.8px]"> By continuing you agree to our <span className=" text-[#66C227] font-[500] ">Privacy Policy and Terms of Service .</span></p>
                  </>
                }
              </>}


          </div>
        </div>

        {accounts ?

          <div className="  pb-[106px] border-t-[4px] border-t-[#F7F7F9]  pt-[24px] px-[24px] ">
            <h1 className=" font-[500]   text-[#2D2D2D] mt-[0px] text-[18px]">Track your finances</h1>

            <div className=" flex mt-[24px] gap-[16px]">
              <Image onClick={() => setShowSyncTransactionFirstModal(!showSyncTransactionFirstModal)} width={1000} height={1000} src={sync} alt={'goprudy'} className="  h-[118px] w-[104px]  " />

              {videoStream ?
                <div className=" text-center h-full w-full grid  place-content-center gap-3 ">
                  <h1>please wait ....</h1>
                  <h1>or</h1>
                  <button onClick={() => {
                    setVideoStream(null)
                    setText('')
                  }} className=" text-[14px] mt-[8px] w-[108px] rounded-[32px] bg-[#000000] px-[16px] py-[6px] text-[#FAFAFA] items-center justify-center flex gap-[4px] leading-[20px] text-center">
                    cancel</button>
                </div>

                :
                <button
                  onClick={startCamera}
                  className=""
                >
                  <Image width={1000} height={1000} src={scan} alt={'goprudy'} className="  h-[118px] w-[104px]  " />
                </button>
              }



              <Image onClick={() => setAddManualModal(!AddManualModal)} width={1000} height={1000} src={addManual} alt={'goprudy'} className="  h-[118px] w-[104px]  " />

            </div>
            {/* SHOWING THE CAMERA TO SCAN THE RECEIPT */}
            {videoStream && <div className=" mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: 'auto' }}
              />
              <button className=" mx-auto text-[14px] mt-[8px] w-[108px] rounded-[32px] bg-[#66C227] px-[16px] py-[6px] text-[#FAFAFA] items-center justify-center flex gap-[4px] leading-[20px] text-center"
                onClick={captureImage}
              >
                Capture Receipt
              </button>

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            }



            {loading && <p className="mt-4">Scanning the receipt, please wait...</p>}
            {text && (
              <div className="mt-4">
                <h3 className="font-bold">Scanned Text:</h3>
                <p>{text}</p>
              </div>
            )}
          </div>
          :

          <div>

            <h1 className=" font-[500] px-[24px]  text-[#2D2D2D] mt-[28px] text-[18px]">3 ways to track your expenses</h1>
            <div className=" w-full px-[24px] mt-[24px]">
              <div className=" flex flex-col gap-[24px]">
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
                        <Image width={1000} height={1000} src={item.image.src} alt={item.title} className="  w-full  top-0 left-[-12px]  absolute  h-full" />
                      </div>

                      <h2 className="font-[500] mr-2 pb-[22px] leading-[19.2px]">{item.title}</h2>
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
        }



      </div>
      <div className=" bg-[#FAFAFA]  w-full " />


      {AddManualModal && <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
      > <BottomDrawer
        footer={<div className="w-full  grid gap-y-[16px]">
          <button onClick={() => { handleSaveManually() }} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">save </button>
        </div>}


        label={`Add Manual`}
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
                value={manualData.category}
                onChange={handleInputChange}
              >
                {initialCategories.map((category) => (
                  <option key={category.id} value={category.name}>
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
      </motion.div>}



      {showSyncModal && <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
      > <BottomDrawer

        label={`Sync transactions`}
        back={false}
        show={showSyncModal}
        close={true}
        onClose={() => setShowSyncModal(!showSyncModal)}
      >
          <div className=" flex justify-center items-center py-[60px] flex-col gap-[16px] w-full">
            <Image width={1000} height={1000} src={mono1} alt={'goprudy'} className=" h-[126px] w-[134.5px]" />
            <h1 className=" font-[500] text-[20px] leading-[24px]">Mono API</h1>
            <p className=" text-[#828282] text-[13px] leading-[20px]">Linking bank accounts</p>

          </div>


        </BottomDrawer>
      </motion.div>}




      {showSyncTransactionFirstModal && <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-[100vh] w-full flex justify-center items-center p-[24px] z-[40]  bottom-0 fixed bg-[#1c1c1c73]"
      > <div
        className=" bg-white p-[24px] w-full rounded-[40px] "
      >
          <div className=" w-full flex justify-between">
            <div></div>
            <div className=" text-[20px] font-[500]">Sync Transactions</div>
            <div className=" cursor-pointer "><BsX size={28} onClick={() => setShowSyncTransactionFirstModal(!showSyncTransactionFirstModal)} className=" bg-[#F7F7F9] rounded-[8px]" /></div>
          </div>
          <h1 className=" mb-[24px] font-[400] mt-[8px] leading-[24px] text-center ">Kindly select the bank account you <br /> would like to sync with</h1>
          <RadioGroup
            orientation="vertical"
            className=' flex flex-col w-full  '
            color='success'
            onValueChange={(value) => handleBankSelect(value)}

          >
            {/* Show loading state */}
            {isGetAllAccountPending && <div className=" mx-auto w-full my-[3rem]">Loading accounts...</div>}

            {/* Show error state */}
            {isError && <div>Failed to load accounts. Please try again later.</div>}

            {/* Render account details */}
            {!isGetAllAccountPending && !isError && accounts.length > 0 && (
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
                    <h1 className="text-[#2f1a1a] text-[14px]">{account.institutionName}</h1>

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
            )}

            {/* Fallback for no accounts */}
            {!isGetAllAccountPending && !isError && accounts.length === 0 && (
              <div>No accounts available for selection.</div>
            )}


          </RadioGroup>
          <button disabled={isGetAllAccountPending} onClick={() => {
            selectedBankAccount.accountName ?
              setShowSyncDataModal(true)
              :
              alert("Select a bank account")
          }

          } type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Proceed </button>
        </div>
      </motion.div>}


      {showSyncDataModal && <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
      >

        <div className=" text-[white] relative flex bg-gradient-to-tl from-[#66C227] to-[#2A860A] w-full   flex-col gap-[16px] ">
          <div className=" pt-[72px] px-[24px]">
            <button onClick={() => setShowSyncDataModal(!showSyncDataModal)} className=" grid place-content-center top-[24px] bg-[#7CD741] absolute right-[24px] size-[36px] rounded-full  ">
              <BsX size={'24px'} />
            </button>
            <div className="  w-full   gap-[16px] p-[8px] rounded-[20px] ">


              <h1 className="  uppercase mb-[12px] text-[12px] font-[400] ">{selectedBankAccount.institutionName}</h1>
              <div className=" flex justify-between">
                <h1>{selectedBankAccount.accountName}</h1>
                <h1>{selectedBankAccount.accountNumber}</h1>
              </div>
              <div className=" border-[#5EB325] border rounded-[8px] mt-[12px] bg-[#4A9F11] p-[8px] ">
                <h1 className=" text-[12px] ">Available balance</h1>
                <div className=" flex justify-between w-full">
                  <h1 className="font-[700] aeonik mt-[8px] ">
                    {showBalance ? <> ₦ {selectedBankAccount.accountBalance}</> : '  ₦ *******'}

                  </h1>
                  <button onClick={toggleBalanceVisibility} className=" bg-[#368B00] text-[10px] py-[4px] px-[8px] rounded-[12px] ">
                    {showBalance ? 'Hide balance' : 'Show balance'}
                  </button>
                </div>
              </div>
            </div>

          </div>
          <div className=" bg-white  w-full">
            <h1 className=" px-[24px] my-[16px] text-center mx-auto w-full text-[#828282] text-[13px] leading-[20px]">Click on the transaction to assign it to the right category</h1>



            <div className=" w-full">

              <div className=" flex px-[24px] w-full items-center justify-between">
                <h1 className=" text-[#2d2d2d] font-[500] leading-[19.2px]">Latest transactions</h1>
                <button
                  onClick={handleSyncTransactions}
                  className="bg-[#EFEFF0] font-[500] text-[12px] text-[#2D2D2D] py-[4px] px-[8px] rounded-[32px]"
                  disabled={isSyncing} // Disable button while syncing
                >
                  {isSyncing ? 'Syncing...' : 'Sync Latest'}
                </button>
              </div>
              <div className="py-[16px] bg-[#F7F7F9] min- h-[534px]  mt-[16px] w-full">

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
                    <h1 className="font-[500] text-[24px] text-[#2d2d2d] leading-[28.8px]">Yaay! 😎</h1>
                    <h1 className="text-[#828282] text-[16px] leading-[19.2px]">You’re all synced up</h1>
                  </div>
                )}

                {currentView === 'syncedData' && (
                  <div className="px-[24px] max-h-[50vh] overflow-y-scroll space-y-4 mt-[16px]">
                    {transactions.map((transaction, index) => (
                      <div
                        key={transaction.uid}
                        onClick={AssignExpense}
                        className={`flex justify-between items-center ${index !== transactions.length - 1 ? 'border-b border-b-[#E7E7EA]' : ''
                          } pb-2`}
                      >
                        <div>
                          <p className="font-[500] text-[14px] text-[#2d2d2d]">{transaction.narration}</p>
                          <p className="text-[#575757] flex gap-3  text-[12px]">{formatDateTime(transaction.date)}
                          </p>
                        </div>
                        <div className="font-[500] text-[14px] text-[#2d2d2d]">
                          ₦ {transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}

                    {isFetchingNextPage && <p className=" text-[#66C227] mx-auto w-full">Loading more...</p>}

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
          </div>
        </div>


      </motion.div>
      }



      {
        showCategories && (
          <div className="h-[100vh] w-full z-[40] fixed bottom-0">
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
                  <button className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Assign </button>
                }
                onClose={() => setShowCategories(!showCategories)}
              >


                <div className="bg-white  pt-4 pb-[32px] px-4   rounded-t-lg shadow-lg">
                  <h1 className="text-[16px] font-[500] text-[#514F6E] mb-[24px]">Select category</h1>

                  <div className="grid grid-cols-3 max-h-[50vh]  overflow-y-scroll gap-4">
                    {categories.map((category) => (
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
                    ))}
                  </div>
                </div>
              </BottomDrawer>
            </motion.div>
          </div>
        )
      }




    </div >
  );
}
