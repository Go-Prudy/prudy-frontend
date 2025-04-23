import Image from 'next/image';
import React from 'react';
import { BsPerson } from 'react-icons/bs';

type Props = { picture: string; name: string; email?: string; isHost: boolean };

export default function CollaboratorItem({ picture, name, email, isHost }: Props) {
  return (
    <div className="bg-gray-100 rounded-2xl border border-gray-200 p-4 flex items-start gap-1 justify-between">
      <div className="flex items-center gap-3">
        {picture ? (
          <Image
            src={picture}
            alt={name}
            width={40}
            height={40}
            className="w-10 h-10 object-cover object-center rounded-full "
          />
        ) : (
          <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
            <BsPerson />
          </div>
        )}
        <div className="space-y-2">
          <p className="text-black-800 text-base font-medium text-center">{name}</p>
          {email && <p className="text-gray-400">{email}</p>}
        </div>
      </div>
      <p className="text-gray-400 rounded-[10px] bg-white text-[10px] px-2 py-0.5">
        {isHost ? 'HOST' : 'GUEST'}
      </p>
    </div>
  );
}
