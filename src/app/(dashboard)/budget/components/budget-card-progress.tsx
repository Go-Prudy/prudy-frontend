import { formatCurrency } from '@/app/lib/utils';

interface BudgetCardProgressProps {
  label: 'Income' | 'Expenses';
  amount: number | string;
  category: 'income' | 'expenses';
}

export default function BudgetCardProgress({
  amount,
  label,
  category,
}: BudgetCardProgressProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-graySubtitle text-[0.675rem]">{label}</span>
        <span className="font-medium text-xs">{formatCurrency(amount)}</span>
      </div>
      <progress
        className="h-2 rounded w-full"
        data-category={category}
        value="90"
        max={100}
      ></progress>
    </div>
  );
}
