import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IBudget, Income, IAllocation, ISubAllocation, ICreateCategory } from '../Types';
import { v4 as uuidv4 } from 'uuid';
import { IPreviousBudget } from '../types/budget';

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
    budgets: IBudget[];
    allCategories: ICreateCategory[];
    previousBudget: IPreviousBudget | null;
    addToCategory: (data: ICreateCategory, id: string) => void
    addBudget: (budget: IBudget) => void;
    // createBudgetCategory: (index: string) => void
    // createAllocation: (budgetId: string, budgetCategory: string, color: string) => void; // New function
    addIncomeToBudget: (budgetId: string, newIncomes: Income[]) => void;
    updateIncomeInBudget: (budgetId: string, income: Income) => void;
    deleteIncomeFromBudget: (budgetId: string, incomeName: string) => void;
    addAllocationToBudget: (budgetId: string, allocation: IAllocation) => void;
    updateAllocationInBudget: (budgetId: string, allocation: IAllocation) => void;
    // deleteAllocationFromBudget: (budgetId: string, category: string) => void;
    clearBudgets: () => void;
    getLastBudget: () => IBudget | undefined;
    getPreviousBudget: () => IPreviousBudget | null;
    setPreviousBudget: (budget: IPreviousBudget) => void;
    clearPreviousBudget: () => void;
    // duplicateLastBudget: () => void;

}

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set, get) => ({
            budgets: [],
            allCategories: [],
            previousBudget: null,
            addToCategory: (data: ICreateCategory, id: string) =>
                set((state) => {
                    const existingCategory = state.allCategories.find(category => category.id === id);

                    if (existingCategory) {
                        // If category exists, update it
                        return {
                            allCategories: state.allCategories.map((category) => {
                                if (category.id === id) {
                                    return {
                                        ...category, // Retain existing properties
                                        ...data,     // Update with new data
                                    };
                                }
                                return category; // Return unchanged category
                            }),
                        };
                    } else {
                        // If category does not exist, add it to the array
                        return {
                            allCategories: [
                                ...state.allCategories,
                                { ...data }, // Add the new category data
                            ],
                        };
                    }
                }),


            // createBudgetCategory: (budgetId: string) =>
            //     set((state) => ({
            //         budgets: state.budgets.map((budget) => {
            //             // Match the budget by its id
            //             if (budget.id === budgetId) {
            //                 return {
            //                     ...budget,
            //                     allocations: [
            //                         ...(budget.allocations || []), // Use existing allocations, or default to an empty array if undefined
            //                         {
            //                             budgetCategory: budgetId, // Add only the budget ID as the budgetCategory
            //                         },
            //                     ],
            //                 };
            //             }
            //             return budget; // Return unchanged budget if id doesn't match
            //         }),
            //     })),



            // createAllocation: (budgetId: string, budgetCategory: string, color: string) => {
            //     const newAllocation: IAllocation = {
            //         budgetCategory,
            //         amount: 0, // Default amount
            //         color: '', // Use provided color
            //         percentage: 0, // Default percentage
            //         subAllocations: [] // Default empty subAllocations
            //     };
            //     set((state) => ({
            //         budgets: state.budgets.map((budget) =>
            //             budget.id === budgetId
            //                 ? { ...budget, allocations: [...(budget.allocations || []), newAllocation] }
            //                 : budget
            //         ),
            //     }));
            // },

            addBudget: (budget: IBudget) =>
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

            addAllocationToBudget: (budgetId: string, newAllocation: IAllocation) => {
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

                console.log('updatedAllocation', updatedAllocation);
                
                

                set((state) => ({
                    budgets: state.budgets.map((budget) =>
                        budget.id === budgetId
                            ? {
                    ...budget,
                   allocations: budget.allocations 
                        ? budget.allocations.some(allocation => allocation?.budgetCategory?.uid === newAllocation?.budgetCategory?.uid)
                            ? budget.allocations.map(allocation => 
                                allocation?.budgetCategory.uid === newAllocation?.budgetCategory?.uid
                                    ? updatedAllocation 
                                    : allocation
                            )
                            : [...budget.allocations, updatedAllocation]
                        : [updatedAllocation]
                }
                            : budget
                    ),
                }));
            },

            updateAllocationInBudget: (budgetId: string, updatedAllocation: IAllocation) =>
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

            // deleteAllocationFromBudget: (budgetId: string, category: string) =>
            //     set((state) => ({
            //         budgets: state.budgets.map((budget) =>
            //             budget.id === budgetId
            //                 ? {
            //                     ...budget,
            //                     allocations: budget.allocations?.filter(
            //                         (allocation) => allocation.budgetCategory !== category
            //                     ) || [],
            //                 }
            //                 : budget
            //         ),
            //     })),

            clearBudgets: () => set({ budgets: [] }),

            getLastBudget: () => {
                const { budgets } = get();
                return budgets[budgets.length - 1];
            },

            // duplicateLastBudget: () => {
            //     const lastBudget = get().getLastBudget();
            //     if (lastBudget) {
            //         const newBudget: IBudget = {
            //             ...lastBudget,
            //             id: uuidv4(),
            //         };
            //         set((state) => ({
            //             budgets: [...state.budgets, newBudget],
            //         }));
            //     }
            // },
            getPreviousBudget: () => {
                const { previousBudget } = get();
                return previousBudget;
            },
            setPreviousBudget: (budget: IPreviousBudget) => {
                set({ previousBudget: budget });
            },
            clearPreviousBudget: () => {
                set({ previousBudget: null });
            }
        }),
        {
            name: 'budget-storage',
            storage: createJSONStorage(() => localStorage), // Using createJSONStorage to wrap localStorage
        }
    )
);
