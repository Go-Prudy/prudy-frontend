interface BudgetCategoryCardProps {
  colour: string;
  category: string;
  amount: string | number;
  progress: number;
}

export default function BudgetCategoryCard() {
  return (
    <button
      type="button"
      className="w-[106px] p-2 bg-graySubtle border border-grayDefault rounded-[20px]"
    >
      <div className="flex flex-col gap-2 text-start">
        <div className="w-6 h-6 rounded-full bg-[#01B0C5]"></div>
        <div className="text-base-bodyDark text-xs leading-1.3">Housing</div>
        <div className="text-base-bodyDark text-sm leading-[1.142]">N</div>

        <progress
          className="h-1 rounded w-full bg-white new-budget-expense"
          value="2"
          data-category="expenses"
          max={100}
        ></progress>
      </div>
    </button>
  );
}
