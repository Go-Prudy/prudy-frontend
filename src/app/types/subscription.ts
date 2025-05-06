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
