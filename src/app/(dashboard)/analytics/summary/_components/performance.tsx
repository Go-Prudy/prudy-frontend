type Props = { title: string; plannedBudget: number; actualExpenses: number };

export default function Performance({ title, plannedBudget, actualExpenses }: Props) {
  return (
    <div className="text-left space-y-4 rounded-3xl bg-white p-4">
      <p className="text-black-800">{title}</p>
      <div className="space-y-3">
        <div className="bg-[#11CDEF] text-white text-[10px] rounded-r-[10px] px-[10px] py-[6px]">
          <span>Planned Budget - </span>
          <span className="font-bold">₦{plannedBudget.toLocaleString()}</span>
        </div>
        <div className="bg-[#F89446] text-white text-[10px] rounded-r-[10px] px-[10px] py-[6px]">
          <span>Actual Expenses - </span>
          <span className="font-bold">₦{actualExpenses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
