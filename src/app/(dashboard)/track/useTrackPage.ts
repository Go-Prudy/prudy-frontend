import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getActiveBudgetCategoriesApi,
  GetAllBudgetsApi,
} from '@/app/services/BudgetService';
import {
  getAllAccountsApi,
  initLinkAccountApi,
  removeAccountApi,
} from '@/app/services/AccountService';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function useTrackPage() {
  const { userData } = useAuthStore();

  const [showSelectBankAccountDrawer, setShowSelectBankAccountDrawer] = useState(false);
  const [showAddManualDrawer, setShowAddManualDrawer] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const { data: budgets = [], isLoading: isLoadingBudgets } = useQuery({
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

  // Fetch active categories for the selected budget
  const {
    data: activeBudgetCategories = [],
    isLoading: isLoadingCategories,
    refetch: refetchActiveBudgetCategories,
  } = useQuery({
    queryKey: ['activeBudgetCategories', selectedBudgetId],
    queryFn: () =>
      getActiveBudgetCategoriesApi(userData?.token ?? '', selectedBudgetId ?? ''),
    enabled: !!selectedBudgetId, // Only fetch if a valid budget is selected
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
    staleTime: Infinity, // Keep the data fresh indefinitely
  });

  // Set the first budget as the default if no budget is selected
  useEffect(() => {
    if (budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].uid); // Set the first budget as default
    }
  }, [budgets, selectedBudgetId]);

  const linkAccountMutation = useMutation({
    mutationFn: () => initLinkAccountApi(userData?.token ?? ''),
    onSuccess: (data) => {},
    onError: (error: unknown) => {
      console.error('Error linking account:', error);
    },
  });

  const handleBudgetChange = (selectedUid: string) => {
    const budget = budgets.find((budget) => budget.uid === selectedUid);
    setSelectedBudgetId(budget.uid);
    refetchActiveBudgetCategories();
  };

  const handleRemoveAccount = async (id: string) => {
    const response = await removeAccountApi(userData?.token ?? '', id);
    if (response.success) {
      // TODO: invalidate getAllLinkedAccountsQuery
    }
  };
  return {
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
  };
}
