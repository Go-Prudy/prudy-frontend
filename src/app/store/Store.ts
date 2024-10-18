import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Budget, Income, Allocation, SubAllocation } from '../Types';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a random color
const generateRandomColor = (): string => {
    return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;
}

// Function to get a unique color
const getUniqueColor = (usedColors: Set<string>): string => {
    let color: string;
    do {
        color = generateRandomColor();
    } while (usedColors.has(color));
    usedColors.add(color);
    return color;
}

interface BudgetState {
    budgets: Budget[];
    addBudget: (budget: Budget) => void;
    createAllocation: (budgetId: string, budgetCategory: string, color: string) => void; // New function

    addIncomeToBudget: (budgetId: string, newIncomes: Income[]) => void;
    updateIncomeInBudget: (budgetId: string, income: Income) => void;
    deleteIncomeFromBudget: (budgetId: string, incomeName: string) => void;
    addAllocationToBudget: (budgetId: string, allocation: Allocation) => void;
    updateAllocationInBudget: (budgetId: string, allocation: Allocation) => void;
    deleteAllocationFromBudget: (budgetId: string, category: string) => void;
    clearBudgets: () => void;
    getLastBudget: () => Budget | undefined;
    duplicateLastBudget: () => void;

}

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set, get) => ({
            budgets: [],

            createAllocation: (budgetId: string, budgetCategory: string, color: string) => {
                const newAllocation: Allocation = {
                    budgetCategory,
                    amount: 0, // Default amount
                    color, // Use provided color
                    percentage: 0, // Default percentage
                    subAllocations: [] // Default empty subAllocations
                };
                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? { ...budget, allocations: [...(budget.allocations || []), newAllocation] }
                            : budget
                    ),
                }));
            },

            addBudget: (budget: Budget) =>
                set((state) => ({
                    budgets: [...state.budgets, budget],
                })),

            addIncomeToBudget: (budgetId: string, newIncomes: Income[]) => {
                const uniqueIncomes = newIncomes.filter((income, index, self) =>
                    index === self.findIndex((i) => i.name === income.name && i.amount === income.amount)
                );
                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? { ...budget, incomes: uniqueIncomes }
                            : budget
                    ),
                }));
            },

            updateIncomeInBudget: (budgetId: string, updatedIncome: Income) =>
                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? {
                                ...budget,
                                incomes: budget.incomes?.map((income) =>
                                    income.name === updatedIncome.name ? updatedIncome : income
                                ) || [],
                            }
                            : budget
                    ),
                })),

            deleteIncomeFromBudget: (budgetId: string, incomeName: string) =>
                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? {
                                ...budget,
                                incomes: budget.incomes?.filter((income) => income.name !== incomeName) || [],
                            }
                            : budget
                    ),
                })),

            addAllocationToBudget: (budgetId: string, newAllocation: Allocation) => {
                const usedColors = new Set<string>();
                // Extract existing colors to avoid duplication
                const existingColors = (newAllocation.subAllocations || []).map(() => newAllocation.color).filter(Boolean) as string[];
                existingColors.forEach(color => usedColors.add(color));

                // Assign unique colors to new subAllocations
                const updatedSubAllocations = (newAllocation.subAllocations || []).map(sub => ({
                    ...sub
                }));

                // Only set color for the allocation itself
                const updatedAllocation = {
                    ...newAllocation,
                    color: newAllocation.color || getUniqueColor(usedColors),
                    subAllocations: updatedSubAllocations
                };

                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? { ...budget, allocations: [...(budget.allocations || []), updatedAllocation] }
                            : budget
                    ),
                }));
            },

            updateAllocationInBudget: (budgetId: string, updatedAllocation: Allocation) =>
                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? {
                                ...budget,
                                allocations: budget.allocations?.map((allocation) =>
                                    allocation.budgetCategory === updatedAllocation.budgetCategory ? { ...updatedAllocation } : allocation
                                ) || [],
                            }
                            : budget
                    ),
                })),

            deleteAllocationFromBudget: (budgetId: string, category: string) =>
                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? {
                                ...budget,
                                allocations: budget.allocations?.filter(
                                    (allocation) => allocation.budgetCategory !== category
                                ) || [],
                            }
                            : budget
                    ),
                })),

            clearBudgets: () => set({ budgets: [] }),

            getLastBudget: () => {
                const { budgets } = get();
                return budgets[budgets.length - 1];
            },

            duplicateLastBudget: () => {
                const lastBudget = get().getLastBudget();
                if (lastBudget) {
                    const newBudget: Budget = {
                        ...lastBudget,
                        id: uuidv4(),
                    };
                    set((state) => ({
                        budgets: [...state.budgets, newBudget],
                    }));
                }
            },
        }),
        {
            name: 'budget-storage',
            getStorage: () => localStorage,
        }
    )
);
