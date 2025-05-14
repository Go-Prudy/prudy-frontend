'use client';

import Image from 'next/image';
import fireIcon from '/public/images/rewards/fire.png';
import rewardsImage from '/public/images/rewards/1.png';
import pointsImage from '/public/images/rewards/points.png';

import RewardValues from '../_components/rewardValues';
import { BsChevronRight, BsX } from 'react-icons/bs';
import { useState } from 'react';
import PointsHistoryDrawer from '@/app/_components/drawers/PointsHistory';
import Link from 'next/link';

const Page = () => {
  const [showPointsHistoryDrawer, setShowPointsHistoryDrawer] = useState(false);
  return (
    <div className="space-y-4 bg-rewards-bg min-h-screen bg-no-repeat bg-cover">
      <div className="w-full flex justify-between items-center px-6 py-2">
        <Link
          href="/profile"
          className="flex justify-center items-center text-white bg-[#52AE3C] rounded-full"
        >
          <BsX size={24} />
        </Link>
        <h1 className="font-medium text-white text-lg mx-auto">Rewards</h1>
      </div>

      <div className="relative w-fit mx-auto ">
        <Image className="mx-auto" src={rewardsImage} alt="" width={165} height={165} />
        <div className="absolute inset-0 h-fit m-auto flex flex-col items-center gap-2">
          <Image src={fireIcon} alt="" width={24} height={24} />
          <p className="text-center text-xs font-medium">
            9 days <br /> streak
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="p-3 space-y-3 bg-white rounded-[32px]">
          <div className="p-3 border border-gray-200 bg-gray-100 space-y-2 rounded-[20px]">
            <p>Your Stats</p>
            <RewardValues
              isRewardPage
              points={20}
              longestStreak={20}
              currentStreak={20}
            />
          </div>
          <div className="p-3 border border-gray-200 space-y-2 rounded-[20px]">
            <p>Your Daily Streak</p>
            {/* calendar */}
          </div>
          <button
            onClick={() => setShowPointsHistoryDrawer(true)}
            className="w-full py-2 px-3 flex items-center justify-between gap-2 bg-lemonGreen-100 rounded-2xl text-lemonGreen-950"
          >
            <div className="flex gap-2 items-center">
              <div className="bg-white rounded-lg p-1">
                <Image src={pointsImage} alt="" width={24} height={24} />
              </div>
              <p className="font-medium">See all Points History</p>
            </div>
            <BsChevronRight size={20} />
          </button>
        </div>
      </div>
      {showPointsHistoryDrawer && (
        <PointsHistoryDrawer
          show={showPointsHistoryDrawer}
          setShow={setShowPointsHistoryDrawer}
          items={['1']}
        />
      )}
    </div>
  );
};

export default Page;
