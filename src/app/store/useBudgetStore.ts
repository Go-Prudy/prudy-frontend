import { create } from 'zustand';
import { Budget } from '../types/budget';

interface BudgetState {
  budgets: Budget[];
  isLoadingBudgets: boolean;
  setBudgets: (budgets: Budget[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useBudgetStore = create<BudgetState>()((set) => ({
  budgets: [],
  isLoadingBudgets: false,
  setBudgets: (budgets) => set({ budgets }),
  setLoading: (isLoading) => set({ isLoadingBudgets: isLoading }),
}));
