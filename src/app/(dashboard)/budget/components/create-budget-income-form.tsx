import MoneyIcon from '@/icons/money';
import RightArrowIcon from '@/icons/right-arrow';

const footerShadow = {
  boxShadow: '0px -4px 4px 0px #EFF0F680',
};

export default function CreateBudgetIncomeForm() {
  return (
    <div className="flex flex-col gap-6 px-6 mt-10">
      <div className="flex gap-2 h-2">
        <div className="rounded-[4px] bg-lemonGreen-700 grow"></div>
        <div className="rounded-[4px] bg-grayDefault grow"></div>
      </div>

      <div className="font-medium text-xl">Set your income</div>

      <div className="p-4 rounded-[20px] bg-graySubtle border border-grayDefault flex flex-col gap-2">
        <div className="font-medium text-graySubtitle">Income</div>
        <div className="bg-[#EFF0F6] h-[1px] -mx-4"></div>

        <div className="flex items-center gap-2">
          {/* Map income categories and amount */}
          <div className="h-7 w-7 shrink-0 rounded-full bg-[#01B0C5] text-center grid grid-cols-1 place-items-center">
            <MoneyIcon className="fill-white" />
          </div>
          <div className="flex gap-2">
            <input type="text" name="" id="" className="w-auto bg-transparent" />
            <div className="py-1 px-2 rounded-lg bg-white inline-flex gap-1">
              <span>N</span>
              <input type="number" name="" id="" className="w-full bg-transparent" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 shrink-0 rounded-full bg-[#01B0C5] text-center text-white">
            +
          </div>
          <button type="button">Add another</button>
        </div>
      </div>

      <div
        className="p-6 border border-t-[#eff0f6] rounded-t-3xl -mx-6"
        style={footerShadow}
      >
        <button
          type="submit"
          className="py-[14px] bg-base-black inline-flex items-center justify-center gap-2 w-full rounded-[32px]"
        >
          <span className="font-medium text-white">Proceed</span>
          <RightArrowIcon className="fill-white" />
        </button>
      </div>
    </div>
  );
}
