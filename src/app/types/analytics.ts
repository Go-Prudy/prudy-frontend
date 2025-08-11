export type AnalyticsResponse = {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: Analytics;
};

export type Analytics = {
  overall: {
    remark: Remark;
    actualExpenses: number;
    categoriesBreakdown: OverallExpenseCategory[];
    percentage: number;
    plannedExpenses: number;
  };
  topExpenses: {
    expenseBreakdown: ExpenseBreakdownCategory[];
    remark: Remark;
  };
  bestPerformingCategory: {
    actualAmount: number;
    categoryId: string;
    categoryName: string;
    plannedAmount: number;
    remark: Remark;
  };
  worstPerformingCategory: {
    actualAmount: number;
    categoryId: string;
    categoryName: string;
    plannedAmount: number;
    remark: Remark;
  };
  subscription: {
    totalSubscriptionAmount: number;
    transactions: SubscriptionTransactions[];
    remark: Remark;
  };
  spendingTrends: {
    day: string;
    amount: number;
  }[];

  incomeBreakdown: {
    income: ExpenseBreakdownCategory[];
    remark: Remark;
    totalIncome: number;
  };
  expenseBreakdown: {
    expenses: ExpenseBreakdownCategory[];
    remark: Remark;
    totalExpenses: number;
  };
};

export type Breakdown = {
  title: string;
  totalBudgeted: number;
  actualExpenses: number;
};

export type Remark = {
  title: string;
  description: string;
};

export type OverallExpenseCategory = {
  name: string;
  color: string;
  amountSpent: number;
  amountLeft: number;
  percentage: number;
  plannedAmount: number;
};

export type SubscriptionTransactions = {
  name: string;
  amount: number;
};

export type ExpenseBreakdownCategory = {
  amount: number;
  color: string;
  name: string;
  percentage: number;
};
