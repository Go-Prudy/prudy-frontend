export type AnalyticsResponse = {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: Analytics;
};

export type Analytics = {
  overall: {
    breakdown: Breakdown;
    remark: Remark;
  };
  topExpenses: {
    categories: ExpenseCategory[];
    remark: Remark;
  };
  bestPerformingCategory: {
    breakdown: Breakdown;
    remark: Remark;
  };
  worstPerformingCategory: {
    breakdown: Breakdown;
    remark: Remark;
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

export type ExpenseCategory = {
  uid: string;
  name: string;
  color: string;
  amountAllocated: number;
  amountSpent: number;
  amountLeft: number;
  percentageLeft: number;
};
