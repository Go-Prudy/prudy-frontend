import BudgetCard from './budget-card';

export default function BudgetCardsList() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <BudgetCard month="January" status="surplus" />
      <BudgetCard month="February" status="deficit" />
    </div>
  );
}
