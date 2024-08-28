import Image from 'next/image';

export default function BudgetHeader() {
  return (
    <div className="h-[72px] py-4 px-6">
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center gap-2">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={48}
            height={48}
            className="rounded-full"
          />

          <div className="flex flex-col gap-[2px] text-white">
            <p className="text-xs">Welcome 👋</p>
            <p className="font-medium">Ayomide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
