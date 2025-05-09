export interface Income {
  createdAt: string;
  updatedAt: string;
  //   deletedAt: string | null;
  id: number;
  uid: string;
  name: string;
  amount: number;
}

export interface BudgetStats {
  totalIncome: number;
  totalExpense: number;
  amountLeft: number;
}

export interface BudgetDetails {
  uid: string;
  name: string;
  totalAmountLeft: number;
  totalExpenses: number;
  totalIncome: number;
  budgetCategories: BudgetAllocation[];
  collaborators: Collaborator[];
  createdAt: string;
  updatedAt: string;
  endDate: string;
}

export interface BudgetAllocation {
  uid: string;
  allocationId: string;
  name: string;
  color: string;
  amountAllocated: number;
  amountSpent: number;
  amountLeft: number;
  percentageLeft: number;
}

export interface Collaborator {
  uid: string;
  name: string;
  picture: string;
  isHost: boolean;
  email?: string;
}

export interface SubAllocation {
  subCategory: string;
  amount: number;
}

export interface SubAllocationForm {
  name: string;
  amount: number;
}

// OLD
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

export interface Allocation {
  uid: string;
  amountAllocated: number;
  amountLeft: number;
  percentage: 10;
  budgetCategory: BudgetCategory;
  subCategoryAllocations: {
    uid: string;
    amount: number;
    budgetSubCategory: {
      uid: string;
      name: string;
    };
  }[];
}

export interface BudgetApiResponse<T> {
  totalRecords: number;
  pageTotal: number;
  next: object;
  prev: object;
  offset: number;
  limit: number;
  docs: T;
}

export interface Budget {
  uid: string;
  name: string;
  type: string;
  totalExpenses: number;
  totalIncome: number;
  createdAt: string;
  updatedAt: string;
  collaborators: Collaborator[];
}

export interface Category {
  id: number;
  name: string;
  totalAmount: number;
  remaining: number;
  color: string;
  selected: boolean;
}

export interface BudgetDistributionCategory {
  name: string;
  percentage: number;
  color: string;
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
