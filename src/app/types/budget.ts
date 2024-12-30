export interface SubAllocation {
    subCategory: string;
    amount: number;
}

export interface BudgetAllocation {
    uid: string;
    amount: number;
    percentage: number;
    subAllocations: SubAllocation[];
}

export interface BudgetCategory {
    id: string;
    name: string;
    color: string;
    uid: string;
} 