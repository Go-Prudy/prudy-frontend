import React from 'react';
import AppPopover from './popover';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Icons } from '../icons';
import moneyIcon from '/public/images/icons/money.svg';
import Image from 'next/image';

type Props = {
  name: string;
  amount: number;
  type: 'income' | 'allocation';
  handleDelete: () => void;
  handleEdit: () => void;
  isLoadingEdit: boolean;
  isLoadingDelete: boolean;
  showActions?: boolean;
};

export default function AllocationItem({
  name,
  amount,
  type,
  handleDelete,
  handleEdit,
  isLoadingEdit,
  isLoadingDelete,
  showActions = true,
}: Props) {
  return (
    <div className="p-4 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-between w-full gap-2">
      <div className="flex items-center gap-2">
        <Image src={moneyIcon} className="size-8" alt={'icon'} />
        <p className="text-black-800 text-base font-medium">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-black-800 text-base font-medium">
          ₦ {amount?.toLocaleString()}
        </p>
        {showActions && (
          <AppPopover
            trigger={
              <button className="dots-button">
                <BsThreeDotsVertical className="text-gray-400" />
              </button>
            }
            placement="bottom-end"
          >
            <button
              onClick={handleEdit}
              className="text-left text-xs text-gray-600 flex items-center gap-0.5"
            >
              {Icons.edit}
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="text-left text-xs text-gray-600 flex items-center gap-0.5"
            >
              {Icons.trash}
              {isLoadingDelete ? (
                'Loading...'
              ) : (
                <span>Delete {type === 'income' ? 'Income' : ''}</span>
              )}
            </button>
          </AppPopover>
        )}
      </div>
    </div>
  );
}
