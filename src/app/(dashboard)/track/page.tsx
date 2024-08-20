import LinkedAccounts from './components/linked-accounts';
import NoLinkedAccounts from './components/no-linked-accounts';
import TrackExpensesCards from './components/track-expenses-cards';
import TrackFinances from './components/track-finances';

export default function Page() {
  return (
    <div className="bg-base-white h-full">
      <h1 className="py-[22px] font-medium text-lg text-center bg-base-white">
        Track expenses
      </h1>

      {/* <div className="flex flex-col gap-1">
        <NoLinkedAccounts />
        <TrackExpensesCards />
      </div> */}

      <div className="flex flex-col gap-1">
        <LinkedAccounts />
        <TrackFinances />
      </div>
    </div>
  );
}
