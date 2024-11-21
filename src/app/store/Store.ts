import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IBudget, Income, IAllocation, ISubAllocation, ICreateCategory } from '../Types';
import { v4 as uuidv4 } from 'uuid';

interface BudgetState {
    budgets: IBudget[];
    allCategories: ICreateCategory[];
    addBudget: (budget: IBudget) => void;
    createBudgetCategory: (index: string) => void;
    addIncomeToBudget: (budgetId: string, newIncomes: Income[]) => void;
    addAllocationToBudget: (budgetId: string, allocation: IAllocation[]) => void;
    clearBudgets: () => void;
    getLastBudget: () => IBudget | undefined;
    duplicateLastBudget: () => void;
}

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set, get) => ({
            budgets: [],
            allCategories: [],


            createBudgetCategory: (budgetId: string) =>
                set((state) => ({
                    budgets: state.budgets.map((budget) => {
                        // Match the budget by its id
                        if (budget.id === budgetId) {
                            return {
                                ...budget,
                                allocations: [
                                    ...(budget.allocations || []), // Use existing allocations, or default to an empty array if undefined
                                    {
                                        budgetCategory: budgetId, // Add only the budget ID as the budgetCategory
                                    },
                                ],
                            };
                        }
                        return budget; // Return unchanged budget if id doesn't match
                    }),
                })),

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


            addAllocationToBudget: (budgetId: string, newAllocations: IAllocation[]) => {
                console.log('New Allocations:', newAllocations);
                console.log('Budget ID:', budgetId);

                // Process each new allocation
                const updatedAllocations = newAllocations.map((newAllocation) => {
                    // Handle subAllocations: if not provided, default to empty array
                    let updatedSubAllocations = newAllocation.subAllocations || [];

                    // If an empty array is provided for subAllocations, replace previous subAllocations with an empty array
                    if (Array.isArray(updatedSubAllocations) && updatedSubAllocations.length === 0) {
                        updatedSubAllocations = [];
                    }

                    // Ensure subAllocations are updated if passed, else retain defaults
                    const updatedAllocation = {
                        ...newAllocation,
                        subAllocations: updatedSubAllocations, // Handle missing subAllocations by setting to empty array
                    };

                    return updatedAllocation;
                });

                // Update the budget with all new allocations, ensuring no duplicates based on budgetCategory
                set((state) => ({
                    budgets: state.budgets.map((budget) => {
                        // Find the budget that matches the budgetId
                        if (budget.id === budgetId) {
                            console.log('Updating budget with id:', budgetId);

                            // Update or replace allocations: Check if any allocations have the same budgetCategory
                            const updatedAllocationsForBudget = budget.allocations?.map((existingAllocation) => {
                                const updatedAllocation = updatedAllocations.find(
                                    (newAlloc) => newAlloc.budgetCategory === existingAllocation.budgetCategory
                                );

                                if (updatedAllocation) {
                                    // If matching, replace the existing allocation with the updated one
                                    return updatedAllocation;
                                }

                                return existingAllocation; // No update needed if budgetCategory doesn't match
                            });

                            // Find new allocations that need to be added (not already in the current budget)
                            const addedAllocations = updatedAllocations.filter((newAlloc) =>
                                !budget.allocations?.some(
                                    (existingAlloc) => existingAlloc.budgetCategory === newAlloc.budgetCategory
                                )
                            );

                            // Combine the updated allocations with newly added ones
                            const finalAllocations = [
                                ...(updatedAllocationsForBudget || []),
                                ...addedAllocations,
                            ];

                            // Return the updated budget with the final allocations
                            return {
                                ...budget,
                                allocations: finalAllocations,
                            };
                        }

                        return budget; // Return unchanged budget if id doesn't match
                    }),
                }));
            },



            clearBudgets: () => set({ budgets: [] }),

            getLastBudget: () => {
                const { budgets } = get();
                return budgets[budgets.length - 1];
            },

            duplicateLastBudget: () => {
                const lastBudget = get().getLastBudget();
                if (lastBudget) {
                    const newBudget: IBudget = {
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
