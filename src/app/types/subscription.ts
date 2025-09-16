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
  rank: number;
  features: [
    {
      createdAt: string;
      updatedAt: string;
      id: number;
      featureKey: string;
      maxUsage: number;
      access: boolean;
    },
    {
      createdAt: string;
      updatedAt: string;
      id: number;
      featureKey: string;
      maxUsage: number;
      access: boolean;
    },
    {
      createdAt: string;
      updatedAt: string;
      id: number;
      featureKey: string;
      maxUsage: number;
      access: boolean;
    },
    {
      createdAt: string;
      updatedAt: string;
      id: number;
      featureKey: string;
      maxUsage: number;
      access: boolean;
    },
    {
      createdAt: string;
      updatedAt: string;
      id: number;
      featureKey: string;
      maxUsage: null;
      access: boolean;
    },
  ];
  createdAt: string;
  updatedAt: string;
  weeklyAmount?: number;
  monthlyAmount?: number;
  discount: number;
  planPricingId: string;
};

export type SubscriptionPlans = {
  monthly: SubscriptionPlan[];
  quarterly: SubscriptionPlan[];
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
  status: 'active' | 'inactive';
  startDate: string;
  nextBillingDate: string;
  planPricing: {
    createdAt: string;
    updatedAt: string;
    id: string;
    price: string;
    currency: string;
    plan: {
      createdAt: string;
      updatedAt: string;
      id: number;
      uid: string;
      name: string;
      benefits: string[];
      basePrice: number;
      currency: string;
      rank: number;
      features: [
        {
          createdAt: string;
          updatedAt: string;
          id: number;
          featureKey: string;
          maxUsage: number;
          access: boolean;
        },
        {
          createdAt: string;
          updatedAt: string;
          id: number;
          featureKey: string;
          maxUsage: number;
          access: boolean;
        },
        {
          createdAt: string;
          updatedAt: string;
          id: number;
          featureKey: string;
          maxUsage: number;
          access: boolean;
        },
        {
          createdAt: string;
          updatedAt: string;
          id: number;
          featureKey: string;
          maxUsage: number;
          access: boolean;
        },
        {
          createdAt: string;
          updatedAt: string;
          id: number;
          featureKey: string;
          maxUsage: null;
          access: boolean;
        },
      ];
    };
    billingCycle: {
      createdAt: string;
      updatedAt: string;
      id: string;
      name: Interval;
      durationInMonths: number;
      discountRate: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type BillingHistory = {
  amount: number;
  date: string;
  planName: string;
};

type Interval = 'monthly' | 'quarterly' | 'yearly';
