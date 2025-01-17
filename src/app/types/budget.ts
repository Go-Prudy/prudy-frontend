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

export interface IPreviousBudgetAllocation {
    uid: string;
    budgetCategory: string;
    color: string;
    amount: number;
    percentage: number;
    subAllocations: {
        uid: string;
        subCategory: string;
        amount: number;
    }[];
}

export interface IPreviousBudget {
    id: string;
    name: string;
    purpose: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    allocations: IPreviousBudgetAllocation[];
    collaborations: any[];
    incomes: {
        uid: string;
        name: string;
        amount: number;
    }[];
}