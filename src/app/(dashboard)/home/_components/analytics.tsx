import Link from 'next/link';
import Image from 'next/image';
import homeAnalyticsImage from '/public/images/home-analytics.png';

type Props = {};

export default function Analytics({}: Props) {
  return (
    <Link href="/analytics" className="inline-block w-full px-6">
      <div className="relative mt-4">
        <div className="absolute inset-0 -top-2 bg-[#F89446] rounded-3xl w-[92%] mx-auto" />
        <div className="absolute inset-0 -top-1 bg-[#11CDEF] rounded-3xl w-[96%] mx-auto" />
        <div
          style={{
            background:
              'radial-gradient(163.31% 501.24% at 36.22% 30.66%, #7544D4 0%, #C09FFF 100%)',
          }}
          className="p-[18px] rounded-3xl text-white flex items-center justify-between relative z-10"
        >
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl leading-5 font-bold">
              Where did <br /> your money go?
            </h3>
            <p className="text-xs sm:text-sm">
              See what your spending patterns looked like last week
            </p>
          </div>
          <Image
            className="-my-7 -mr-4 w-[120px] sm:w-[150px] h-auto"
            src={homeAnalyticsImage}
            alt=""
            width={150}
            height={150}
          />
        </div>
      </div>
    </Link>
  );
}
