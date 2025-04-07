import { StaticImageData } from 'next/image';
import React from 'react';
import Image from 'next/image';

type Props = { image: StaticImageData; title: string; description?: string };

export default function EmptyState({ image, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-[250px] gap-4">
      <Image src={image} width={67} height={67} alt="" />

      <div className="space-y-2 text-center">
        <p className="font-medium text-gray-600">{title}</p>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </div>
  );
}
