import { SubscriptionPlans } from '../types/subscription';

export const planOptions: Array<keyof SubscriptionPlans> = [
  'monthly',
  'quaterly',
  'yearly',
];

export const analyticPagebackgrounds = [
  'bg-planned-vs-actual',
  'bg-top-expenses',
  'bg-best-performing',
  'bg-worst-performing',
  'bg-subscription',
  'bg-spedning-trends',
  'bg-income-breakdown',
  'bg-expenses-breakdown',
];
