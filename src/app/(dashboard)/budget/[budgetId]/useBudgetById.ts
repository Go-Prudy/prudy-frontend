import { useQuery } from '@tanstack/react-query';
import api from '@/app/utils/axiosInstance';
import { useAuthStore } from '@/app/store/useAuthStore';
import { ApiResponse } from '@/app/types/index';
import { BudgetDetails, BudgetStats } from '@/app/types/budget';
import { useEffect, useState } from 'react';
import { getAllAccountsApi } from '@/app/services/AccountService';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function useBudgetById({ budgetId }: { budgetId: string }) {
  const { userData } = useAuthStore();

  const [selectedTab, setSelectedTab] = useState<string>('income');
  const [showTrackExpensesDrawer, setShowTrackExpensesDrawer] = useState<boolean>(false);
  const [showSelectBankAccountDrawer, setShowSelectBankAccountDrawer] = useState(false);
  const [showAddManualDrawer, setShowAddManualDrawer] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [showSyncPeriodDrawer, setShowSyncPeriodDrawer] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>();
  const [value, setValue] = useState<Value>(new Date());

  const { data: budgetDetails, isLoading: isLoadingBudgetDetails } = useQuery<
    ApiResponse<BudgetDetails>
  >({
    queryKey: ['getSingleBudget', budgetId],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetDetails>>(`/budgets/${budgetId}`)).data,
    enabled: !!userData?.token && !!budgetId,
    refetchOnWindowFocus: true,
  });

  const { data: budgetStats, isLoading: isLoadingBudgetStats } = useQuery<
    ApiResponse<BudgetStats>
  >({
    queryKey: ['getBudgetStats', budgetId],
    queryFn: async () =>
      (await api.get<ApiResponse<BudgetStats>>(`/budgets/${budgetId}/stats`)).data,
    enabled: !!userData?.token && !!budgetId,
    refetchOnWindowFocus: true,
  });

  // React Query hook
  const { data: linkedAccounts = [], isLoading: isGetAllLinkedAccountsLoading } =
    useQuery({
      queryKey: ['getAllLinkedaccounts'],
      queryFn: () => getAllAccountsApi(userData?.token ?? ''),
      enabled: !!userData?.token && showSelectBankAccountDrawer,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
    });

  const handleTabSelection = (key: string) => {
    setSelectedTab(key);
  };

  return {
    budgetStats: budgetStats?.data || { totalIncome: 0, totalExpense: 0, amountLeft: 0 },
    isLoadingBudgetStats,
    budgetDetails: budgetDetails?.data,
    isLoadingBudgetDetails,
    handleTabSelection,
    selectedTab,
    showTrackExpensesDrawer,
    setShowTrackExpensesDrawer,
    showSelectBankAccountDrawer,
    setShowSelectBankAccountDrawer,
    showAddManualDrawer,
    setShowAddManualDrawer,
    showScanner,
    setShowScanner,
    showSyncPeriodDrawer,
    setShowSyncPeriodDrawer,
    selectedAccountId,
    setSelectedAccountId,
    value,
    setValue,
    linkedAccounts,
    isGetAllLinkedAccountsLoading,
  };
}
