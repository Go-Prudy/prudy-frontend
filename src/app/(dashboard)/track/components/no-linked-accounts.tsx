import ForwardArrow from '@/icons/forward-arrow';
import Image from 'next/image';

export default function NoLinkedAccounts() {
  return (
    <div className="p-6 flex flex-col gap-4 bg-white">
      <h2 className="font-medium text-lg">Linked Accounts</h2>

      <div className="border text-center border-grayDefault bg-graySubtle p-6 rounded-2xl">
        <Image
          src="/mindmap.png"
          alt="Link bank accounts mindmap"
          className="inline"
          width={94.42}
          height={84}
        />
        <p className="font-medium leading-1.2 mb-2">
          Link your bank accounts to track your transactions easily
        </p>
        <button className="inline-flex gap-1 text-base-white bg-lemonGreen-700 rounded-[32px] py-2 px-4">
          <span className="text-sm">Link now</span>
          <ForwardArrow className="text-base-white" />
        </button>
      </div>
    </div>
  );
}
