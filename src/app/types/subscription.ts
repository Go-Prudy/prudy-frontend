type FeatureSet = {
  maxReceiptsScanning: number;
  maxAccountLinking: number;
  maxTransactionSyncing: number;
  maxCollaboratorInvites: number;
  budgetAnalytics: boolean;
};

export type SubscriptionPlan = {
  uid: string;
  name: string;
  benefits: string[];
  basePrice: number;
  currency: string;
  features: FeatureSet;
  discount: number;
  weeklyAmount?: number;
  monthlyAmount: number;
};

export type SubscriptionPlans = {
  monthly: SubscriptionPlan[];
  quaterly: SubscriptionPlan[];
  yearly: SubscriptionPlan[];
};

export type PaymentMethod = {
  uid: string;
  firstSixDigits: string;
  lastFourDigits: string;
  issuer: string;
  country: string;
  type: 'MASTERCARD' | 'VISA';
  expiry: string;
  isDefault: boolean;
};

export type UserSubscription = {
  uid: string;
  plan: {
    id: 1;
    uid: string;
    name: string;
    benefits: string[];
    basePrice: number;
    currency: string;
    features: {
      maxReceiptsScanning: number;
      maxAccountLinking: number;
      maxTransactionSyncing: number;
      maxCollaboratorInvites: number;
      budgetAnalytics: boolean;
    };
  };
  startDate: string;
  interval: Interval;
  isActive: boolean;
  nextBillingDate: string;
};

type Interval = 'monthly' | 'quaterly' | 'yearly';
