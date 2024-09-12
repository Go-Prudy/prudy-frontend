// TYPES FOR CREATING BUDGET

export interface SubAllocation {
    subCategory: string;
    amount: number;
}

export interface Allocation {
    budgetCategory: string; // Category like Housing, Transportation
    amount: number;         // Total amount for the category
    color: string; // Add this field
    percentage: number;     // Optional percentage representation
    subAllocations?: SubAllocation[]; // Expenses under each category
}

export interface Income {
    name: string;
    amount: number;
}


export interface Budget {
    id: string; // Unique identifier for the budget
    name: string;
    purpose: string;
    startDate: string;
    endDate: string;
    incomes?: Income[]; // Array of incomes
    allocations?: Allocation[]; // Array of expense categories with expenses
}
