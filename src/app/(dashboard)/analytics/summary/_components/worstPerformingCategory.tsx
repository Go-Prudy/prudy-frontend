import Image from 'next/image';
import Performance from './performance';
import performanceImage from '/public/images/analytics/3.png';

type Props = {};

export default function WorstPerformingCategory({}: Props) {
  return (
    <div className="space-y-10">
      <div className="bg-white py-8 mx-auto max-w-[260px] rounded-3xl border-[10px] border-[#368EF5] text-black-800">
        <p className="text-lg">Generousity</p>
        <p className="text-2xl font-bold">₦250,000</p>
      </div>
      <Image
        src={performanceImage}
        alt=""
        width={200}
        height={200}
        className="!-mt-1 !-mb-7 mx-auto"
      />
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">
          Common man, you cannot save the world!
        </h6>
        <p>
          Let’s be frank. You out gave yourself this week. While this is not a bad thing,
          it is not sustainable for you. Let’s do better next time.
        </p>
      </div>
      <Performance title="Transportation" plannedBudget={200000} actualExpenses={50000} />
    </div>
  );
}
