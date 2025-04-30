import CircularProgressBar from '@/app/_components/circularProgress';
import CategoriesBreakdown from './categoriesBreakdown';

type Props = { plannedAmount?: string | number; actualAmount?: string | number };

export default function PlannedVsActual({ plannedAmount, actualAmount }: Props) {
  return (
    <div className="flex flex-col gap-7 items-center">
      <CircularProgressBar value={60} />
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">
          You have used up 60% of your planned budget already
        </h6>
        <p>Not bad for the 3rd week, but you have to watch it, else... 🥹</p>
        <div className="border bg-[#B092F480] rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <p className="space-x-2">
              <span className="inline-block align-middle w-4 h-4 rounded-[6px] bg-[#CBB7F7]" />
              <span className="text-sm">Planned Budget</span>
            </p>
            <p className="font-bold">{plannedAmount}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="space-x-2">
              <span className="inline-block align-middle w-4 h-4 rounded-[6px] bg-[#E7F846]" />
              <span className="text-sm">Actual Budget</span>
            </p>
            <p className="font-bold">{actualAmount}</p>
          </div>
        </div>
      </div>
      <CategoriesBreakdown
        title="Categories Breakdown"
        buttonColor="bg-[#CBB7F7]"
        showAmountSpent
      />
    </div>
  );
}
