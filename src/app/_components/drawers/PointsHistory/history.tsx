import React from 'react';
import PointItem from './pointItem';
import pointsImage from '/public/images/rewards/points.png';
import badgeImage from '/public/images/rewards/badge.png';
import Image from 'next/image';

type Props = { items: string[] };

export default function History({ items }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 p-3 bg-orange-100 text-xs rounded-xl">
          <div className="bg-white rounded-lg p-1 w-fit">
            <Image src={pointsImage} alt="" width={24} height={24} />
          </div>
          <p className="text-black-800">Total Points Earned</p>
          <p className="text-orange-600 font-black">50pts </p>
        </div>
        <div className="space-y-2 p-3 bg-purple-100 text-xs rounded-xl">
          <div className="bg-purple-600 rounded-lg p-1 w-fit">
            <Image src={badgeImage} alt="" width={24} height={24} />
          </div>
          <p className="text-black-800">
            Earn extra <span className="text-orange-600 font-black">50pts </span>
            with a 7 day uninterrupted streak every week
          </p>
        </div>
      </div>
      <div className="divide-y">
        <PointItem />
        <PointItem />
        <PointItem />
        <PointItem />
      </div>
    </div>
  );
}
