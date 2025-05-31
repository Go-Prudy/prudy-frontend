export interface ScannedResult {
  locationInfo: Location;
  items: ScannedItem[];
  subTotal: number;
  'vat(%)': number;
  totalAmount: number;
  date?: string;
  budgetId?: string;
}
interface Location {
  name: string;
  address: string;
  date: string;
  time: string;
}

export interface ScannedItem {
  description: string;
  amount: number;
  categoryName: string;
  categoryUid: string;
  isCategorySuggested: boolean;
  name?: string;
  quantity?: number;
  baseAmount?: number;
  totalAmount?: number;
}