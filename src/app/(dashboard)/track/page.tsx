'use client';
import Image, { StaticImageData } from 'next/image';
import linkIcon from '/public/images/Mindmap.png';
import { BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthentication } from '@/app/store/AuthStore';
import {
  getActiveBudgetCategoriesApi,
  GetAllBudgetsApi,
} from '@/app/services/BudgetService';
import {
  getAllAccountsApi,
  initLinkAccountApi,
  removeAccountApi,
} from '@/app/services/AccountService';
import { CircularProgress } from '@nextui-org/react';
import Scanner from '../../../components/scanFeature';
import { IAddManualInput } from '@/app/Types';

import DashboardHeader from '@/components/Header/DashboardHeader';
import trackHeaderIcon from '/public/images/header/track.png';
import DashboardWrapper from '@/app/_components/dashboardWrapper';
import syncTransactionImage from '/public/images/quick-actions/4.png';
import scanReceiptImage from '/public/images/quick-actions/3.png';
import addManuallyImage from '/public/images/quick-actions/5.png';
import AddManualExpenseDrawer from '@/app/_components/drawers/AddManualExpense';
import SelectBankAccountDrawer from '@/app/_components/drawers/SelectBankAccount';
import SectionHeader from '@/components/Header/SectionHeader';
import Loader from '@/app/_components/loader';
import { EmptyStateDarkBg } from '@/app/_components/emptyState';
import { getLastFourDigits } from '@/app/utils/functions';
import AppPopover from '@/app/_components/popover';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';

interface QuickActionType {
  id: string;
  title: string;
  image: StaticImageData;
  bgColor: string;
  borderColor: string;
}

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
    title: 'Add Manually',
    image: addManuallyImage,
    bgColor: '#D9D9FA',
    borderColor: '#3A36F5',
  },
];

interface Category {
  id: number;
  name: string;
  totalAmount: number;
  remaining: number;
  color: string;
  selected: boolean;
}

export default function Page() {
  const { userData } = useAuthStore();

  const [showSelectBankAccountDrawer, setShowSelectBankAccountDrawer] = useState(false);

  // SCAN DATA
  const [accountId, setAccountId] = useState<string>('');

  // ADD MANUAL STATE
  const [showAddManualDrawer, setShowAddManualDrawer] = useState<boolean>(false);
  const [manualData, setManualData] = useState<IAddManualInput>({
    itemName: '',
    amount: 0,
    category: '', // Default category
    date: '',
  });

  // SCAN RECEIPT
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null);
  const [addManualModalTitle, setAddManualModalTitle] = useState<string>('Add Manual');

  const { data: budgets = [], isPending } = useQuery({
    queryKey: ['allBudgetCategories'],
    queryFn: () => GetAllBudgetsApi(userData?.token ?? ''),
    enabled: !!userData?.token,
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
  });

  // React Query hook
  const { data: linkedAccounts = [], isLoading: isGetAllLinkedAccountsLoading } =
    useQuery({
      queryKey: ['getAllLinkedaccounts'],
      queryFn: () => getAllAccountsApi(userData?.token ?? ''),
      enabled: !!userData?.token,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
    });

  // React Query mutation to link an account
  const linkAccountMutation = useMutation({
    mutationFn: () => initLinkAccountApi(userData?.token ?? ''),
    onSuccess: (data) => {},
    onError: (error: unknown) => {
      console.error('Error linking account:', error);
    },
  });

  // Fetch active categories for the selected budget
  const { data: activeBudgetCategories = [], refetch: refetchActiveBudgetCategories } =
    useQuery({
      queryKey: ['activeBudgetCategories', selectedBudgetId],
      queryFn: () =>
        getActiveBudgetCategoriesApi(userData?.token ?? '', selectedBudgetId ?? ''),
      enabled: !!selectedBudgetId, // Only fetch if a valid budget is selected
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
    if (budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].uid); // Set the first budget as default
    }
  }, [budgets, selectedBudgetId]);

  const handleBudgetChange = (selectedUid: string) => {
    const budget = budgets.find((budget) => budget.uid === selectedUid);
    setSelectedBudgetId(budget.uid);
    refetchActiveBudgetCategories();
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

  const handleRemoveAccount = async (id: string) => {
    const response = await removeAccountApi(userData?.token ?? '', id);
    if (response.success) {
      // invalidate getAllLinkedAccountsQuery
    }
  };

  const navigate = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-[90px]"
    >
      <DashboardWrapper>
        <div className="bg-white w-full relative max-w-[500px]">
          <DashboardHeader
            type="dashboard"
            title="Track"
            headerIcon={trackHeaderIcon}
            headerTitle2="No Money Mysteries."
            headerTitle="Track It Like A Pro!"
            headerIconClass="mr-[-14px] w-[100px] h-[100px]"
            headerTitleClass="text-[28px]"
            description="Know where your money is going with Prudy"
          />

          <div className="p-6 space-y-6">
            {/* track finances */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-black-900 text-lg">Track your finances</h1>
                {budgets.length > 0 && (
                  <select
                    name="budget"
                    className="bg-gray-100 rounded-xl p-2 border-gray-200 border-[0.4px] w-fit"
                    id="budget"
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <option disabled>
                        <CircularProgress size="sm" />
                      </option>
                    ) : (
                      budgets?.map((budget: any) => (
                        <option key={budget.uid} value={budget.uid}>
                          {budget.name}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
              <div className="flex gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="w-full p-4 space-y-2 rounded-3xl border text-black-800"
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
                    <div className="bg-white rounded-xl w-fit p-1 mx-auto">
                      <Image src={action.image} alt={action.id} width={54} height={54} />
                    </div>
                    <p className="text-sm font-medium">{action.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* linked accounts */}
            <div className="space-y-4">
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
                    onClick={() =>
                      navigate.push(
                        `/track/${selectedBudgetId}/transactions/${account.uid}`,
                      )
                    }
                    key={account.uid}
                    className="p-4 bg-gray-100 border border-gray-200 rounded-[20px] w-full flex justify-between relative cursor-pointer transition hover:opacity-70"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-sm">
                        <Image
                          width={100}
                          height={100}
                          src={account.institutionLogo}
                          alt={account.institutionName}
                          className="size-6 rounded-full"
                        />
                        <p className="font-medium">{account.institutionName}</p>
                      </div>

                      <div className="flex gap-2 justify-between">
                        <p className="">{account.accountName}</p>
                        <p className="font-medium">
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

            {/* important note */}
            {/* <ImportantNote className="pb-6" /> */}
          </div>
        </div>
        {showSelectBankAccountDrawer && (
          <SelectBankAccountDrawer
            show={showSelectBankAccountDrawer}
            setShow={setShowSelectBankAccountDrawer}
            linkedAccounts={linkedAccounts}
            isLoading={isGetAllLinkedAccountsLoading}
          />
        )}

        {showAddManualDrawer && (
          <AddManualExpenseDrawer
            show={showAddManualDrawer}
            setShow={setShowAddManualDrawer}
          />
        )}

        {/* <div className="">
          {loading && <p className="mt-4">Scanning the receipt, please wait...</p>}
          {text && (
            <div className="mt-4">
              <h3 className="font-bold">Scanned Text:</h3>
              <p>{text}</p>
            </div>
          )}
        </div> */}
        {showScanner && (
          <div className=" text-center w-full grid   place-content-center gap-3 ">
            <div className=" w-full ">
              {/* Dark background */}
              <div
                className="h-full top-6  left-0 z-40 w-full max-w-[500px] flex justify-center items-center bg-[#1c1c1c73] absolute"
                onClick={() => setShowScanner(false)} // Close on background click
              ></div>
              <Scanner
                scanState={showScanner}
                setScanState={setShowScanner}
                setManualData={setManualData}
                setAddManualModal={setShowAddManualDrawer}
                defaultCategory={activeBudgetCategories[0]}
                setAddManualModalTitle={setAddManualModalTitle}
              />
            </div>
          </div>
        )}
      </DashboardWrapper>
    </motion.div>
  );
}
