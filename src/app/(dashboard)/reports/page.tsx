import Header from '@/components/header';
import Image from 'next/image';
import React from 'react';
import launchImage from '/public/images/Launch.png';
const page = () => {
  return (
    <div className="">
      <Header isHeaderDark link={`/profile`} title="Reports" />
      <div className="space-y-6 p-6">
        <p className="text-center text-gray-600">
          Export your transactions and use them in spreadsheets
        </p>

        <div className="space-y-4">
          <Image
            src={launchImage}
            className="h-[141px] w-[126px] mx-auto"
            height={141}
            width={126}
            alt=""
          />
          <p className="text-center">Coming soon 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default page;
