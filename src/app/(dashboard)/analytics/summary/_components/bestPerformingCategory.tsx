import Image from 'next/image';
import Performance from './performance';
import performanceImage from '/public/images/analytics/2.png';
import coinImage from '/public/images/analytics/coin.png';

type Props = {};

export default function BestPerformingCategory({}: Props) {
  return (
    <div className="space-y-7">
      <div className="relative">
        <Image
          src={coinImage}
          alt=""
          width={200}
          height={200}
          className="-mt-5 mb-[150px] mx-auto"
        />
        {/* <Image
          src={performanceImage}
          alt=""
          width={354}
          height={473}
          className="mx-auto absolute top-[-62px] sm:top-[-98px] left-[-37px] sm:left-0 right-0 min-h-[410px] sm:min-h-[473px] min-w-[320px] sm:min-w-[354px]"
        /> */}

        <div className="max-w-[126px] space-y-1 absolute h-fit top-0 right-0 left-0 bottom-0 m-auto ">
          <p className="text-sm font-medium">Transportation</p>
          <h4 className="font-bold text-xl">₦250,000</h4>
        </div>
      </div>
      <div className="text-white space-y-4">
        <h6 className="text-xl font-bold space-y-4">Good one mate! 😊👏🏽</h6>
        <p>
          Obviously, you have been able to keep up with your budget for Transportation.
          You should keep this up.
        </p>
      </div>
      <Performance title="Transportation" plannedBudget={200000} actualExpenses={50000} />
    </div>
  );
}
