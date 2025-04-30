export interface ScannedResult {
  locationInfo: Location;
  items: ScannedItem[];
  subTotal: number;
  'vat(%)': number;
  totalAmount: number;
}
interface Location {
  name: string;
  address: string;
  date: string;
  time: string;
}

export interface ScannedItem {
  name: string;
  quantity: number;
  baseAmount: number;
  totalAmount: number;
  categoryName: string;
  categoryUid: string;
  isCategorySuggested: boolean;
}
