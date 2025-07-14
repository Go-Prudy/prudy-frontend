export interface AutoCategorizedTransaction {
  createdAt: string;
  updatedAt: string;
  id: number;
  uid: string;
  amount: number;
  narration: string;
  date: string;
  assigned: boolean;
}

export interface AutoCategorizedCategory {
  categoryName: string;
  categoryUid: string;
  isSuggested: boolean;
  transactions: AutoCategorizedTransaction[];
  yetToReview: boolean;
}
