export interface Currency {
  country: string;
  countryCode: string;
  flag: string;
  countryFlag?: string;
  abbreviation: string;
  name: string;
  symbol: string;
}

export interface Settings {
  countryFlag: string;
  currency: string;
  currencySymbol: string;
  isReminderActive: boolean;
  reminderTime: number;
  reminderTimeUnit: 'PM' | 'AM';
  hasFreeTrial: boolean;
}

export interface SelectedCurrency {
  countryFlag: string;
  currency: string;
  currencySymbol: string;
}
