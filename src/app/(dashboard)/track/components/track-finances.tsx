import Image from 'next/image';

export default function TrackFinances() {
  return (
    <div className="p-6 flex flex-col gap-6 bg-white">
      <h2 className="font-medium text-lg">Track your finances</h2>

      <div className="flex gap-4">
        {/* Assign expense */}
        <button
          type="button"
          className="rounded-3xl border border-purple-100 bg-[#F3F0FA] py-4 px-3 flex-1"
        >
          <div className="flex flex-col items-center gap-3">
            <Image src="/assign-expense.png" alt="" width={40.21} height={40} />
            <p className="text-sm leading-1.2 text-center">Sync transactions</p>
          </div>
        </button>

        {/* Scan expense */}
        <button
          type="button"
          className="rounded-3xl border border-orange-100 bg-orange-50 py-4 px-3 flex-1"
        >
          <div className="flex flex-col items-center gap-3">
            <Image src="/scan-expense.png" alt="" width={54.35} height={40} />
            <p className="text-sm leading-1.2 text-center">Scan receipts</p>
          </div>
        </button>

        {/* Add expense */}
        <button
          type="button"
          className="rounded-3xl border border-turquoise-100 bg-turquoise-50 py-4 px-3 flex-1"
        >
          <div className="flex flex-col items-center gap-3">
            <Image src="/add-expense.png" alt="" width={47.14} height={40} />
            <p className="text-sm leading-1.2 text-center">Add manually</p>
          </div>
        </button>
      </div>
    </div>
  );
}
