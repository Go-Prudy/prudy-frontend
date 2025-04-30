import { ScannedResult } from '@/app/types/scan';
import Image from 'next/image';
import React from 'react';

type Props = {};

export default function LocationInfo({
  locationInfo,
  uploadedImageUrl,
}: {
  locationInfo: ScannedResult['locationInfo'];
  uploadedImageUrl: string;
}) {
  return (
    <div className="p-4 space-y-2">
      <p className="font-medium text-black-800">{locationInfo.name}</p>
      <div className="flex gap-8">
        <Image
          src={uploadedImageUrl}
          alt=""
          width={80}
          height={80}
          className="object-cover size-20 rounded"
        />
        <div className="space-y-2 text-sm text-gray-600">
          <p>{locationInfo.address}</p>
          <p>
            {locationInfo.date} at {locationInfo.time}
          </p>
        </div>
      </div>
    </div>
  );
}
