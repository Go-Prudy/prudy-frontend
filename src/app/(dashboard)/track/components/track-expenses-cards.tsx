import ForwardArrow from '@/icons/forward-arrow';
import Image from 'next/image';

const buttonShadow = {
  boxShadow: '0px 4px 4px 0px #7F5BDD0F',
};

export default function TrackExpensesCards() {
  return (
    <div className="p-6 flex flex-col gap-4 bg-white">
      <h2 className="font-medium text-lg">3 ways to track your expenses</h2>

      <div className="flex flex-col gap-6">
        {/* Assign expense */}
        <div className="rounded-3xl border border-purple-100 p-4 bg-[#F3F0FA] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Image src="/assign-expense.png" alt="" width={40} height={40} />
            <p className="font-medium leading-1.2">
              Assign transactions from your bank account
            </p>
          </div>
          <p className="text-sm">
            Assign your transactions from your bank account to the right budget category
            and win 20 points
          </p>
          <button
            className="inline-flex items-center gap-1 text-base-white bg-white rounded-[32px] py-2 px-4 ms-auto"
            style={buttonShadow}
          >
            <span className="text-xs text-purple-500 font-medium">Assign now</span>
            <ForwardArrow className="text-purple-500" />
          </button>
        </div>

        {/* Scan expense */}
        <div className="rounded-3xl border border-orange-100 p-4 bg-orange-50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Image src="/scan-expense.png" alt="" width={54.35} height={40} />
            <p className="font-medium leading-1.2">Scan your receipts</p>
          </div>
          <p className="text-sm">
            Scan receipts from shopping to track the expenses effectively
          </p>
          <button
            className="inline-flex items-center gap-1 text-base-white bg-white rounded-[32px] py-2 px-4 ms-auto"
            style={buttonShadow}
          >
            <span className="text-xs text-orange-600 font-medium">Scan now</span>
            <ForwardArrow className="text-orange-600" />
          </button>
        </div>

        {/* Add expense */}
        <div className="rounded-3xl border border-turquoise-100 p-4 bg-turquoise-50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Image src="/add-expense.png" alt="" width={47.14} height={40} />
            <p className="font-medium leading-1.2">Add manually</p>
          </div>
          <p className="text-sm">Add your expense details manually</p>
          <button
            className="inline-flex items-center gap-1 text-base-white bg-white rounded-[32px] py-2 px-4 ms-auto"
            style={buttonShadow}
          >
            <span className="text-xs text-turquoise-500 font-medium">Add now</span>
            <ForwardArrow className="text-turquoise-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
