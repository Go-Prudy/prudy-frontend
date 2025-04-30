import React from 'react'
import CategoriesBreakdown from './categoriesBreakdown';
import Image from 'next/image';
import coinImage from '/public/images/analytics/coin.png';


type Props = {}

export default function Subscriptions({}: Props) {
  return (
    <div>
      <div className="space-y-7">
        <div className="relative">
          <Image
            src={coinImage}
            alt=""
            width={244}
            height={244}
            className="-my-5 mx-auto"
          />
          <div className='max-w-[126px] space-y-1 absolute h-fit top-0 right-0 left-0 bottom-0 m-auto '>
            <p className='text-sm font-medium'>Total Subscriptions amount</p>
            <h4 className='font-bold text-2xl'>₦500,000</h4>
          </div>
        </div>

        <div className="text-white space-y-4">
          <h6 className="text-xl font-bold space-y-4">Right on track! 😊👏🏽</h6>
          <p>
            Your total subscription amount is 50,000 which is about 15% of your entire
            income. Even though, it is not so much, you can consider cutting down on a few
            of them like Netflix.
          </p>
        </div>
        <CategoriesBreakdown title="Subscriptions" buttonColor="bg-[#A8B53A]" />
      </div>
    </div>
  );
}