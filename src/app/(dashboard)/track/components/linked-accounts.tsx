import { formatCurrency } from '@/app/lib/utils';
import Image from 'next/image';

const cardBottomGradient = {
  background: 'linear-gradient(267.76deg, #66C227 0.21%, #2A860A 123.87%)',
};

const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export default function LinkedAccounts() {
  return (
    <div className="flex flex-col gap-1">
      <div className="px-6 bg-white">
        <select className="w-full py-2" name="" id="">
          {monthsOfYear.map((month) => (
            <option key={month}>{month.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className="p-6 flex flex-col gap-4 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg">Linked Accounts</h2>
        </div>

        <div className="border text-center border-grayDefault bg-graySubtle rounded-2xl overflow-hidden">
          {/* Map bank accounts */}
          <div className="flex items-center gap-2 text-sm py-3 px-4">
            <Image
              src=""
              alt="Bank logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <p>Wema Bank</p>
            <p className="font-medium ms-auto">{formatCurrency(450000)}</p>
          </div>

          <div className="py-3 px-4 text-base-white" style={cardBottomGradient}>
            <div className="flex items-end">
              <div className="flex flex-col gap-2 text-start">
                <p className="text-xs">Combined balance</p>
                <p className="font-medium">{formatCurrency(19245679)}</p>
              </div>

              <button
                type="button"
                className="text-white text-[0.675rem] py-1 px-2 rounded-xl ms-auto bg-[#4A9F11]"
              >
                Hide balance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
