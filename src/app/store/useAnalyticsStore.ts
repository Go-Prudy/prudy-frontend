import { create } from 'zustand';
import { Analytics } from '../types/analytics';

interface AnalyticsState {
  analytics: Analytics | null;
  isLoadingAnalytics: boolean;
  setAnalytics: (analytics: Analytics) => void;
  setLoading: (isLoading: boolean) => void;
  selectedBudgetId: string;
  setSelectedBudgetId: (id: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  analytics: null,
  isLoadingAnalytics: false,
  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (isLoading) => set({ isLoadingAnalytics: isLoading }),
  selectedBudgetId: '',
  setSelectedBudgetId: (selectedBudgetId) => set({ selectedBudgetId }),
}));
