import React from 'react';
import PointItem from './pointItem';
import pointsImage from '/public/images/rewards/points.png';
import Image from 'next/image';


type Props = { items: string[] };

export default function Redeemed({ items }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-orange-100 rounded-xl">
        <div className="bg-white rounded-lg p-1">
          <Image src={pointsImage} alt="" width={24} height={24} />
        </div>
        <p className="text-black-800 font-bold text-sm">
          100 Prudy points = <span className="text-orange-600 font-black">50pts </span>
        </p>
      </div>
      <div className="divide-y">
        <PointItem showPrice />
        <PointItem showPrice />
        <PointItem showPrice />
        <PointItem showPrice />
      </div>
    </div>
  );
}
