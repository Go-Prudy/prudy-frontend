import cn from 'classnames';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import CreateBudgetDrawer from '@/app/_components/drawers/CreateBudget';

import createBudgetImage from '/public/images/quick-actions/1.png';
import trackExpenseImage from '/public/images/quick-actions/6.png';
import linkBankImage from '/public/images/quick-actions/2.png';
import scanReceiptImage from '/public/images/quick-actions/3.png';

interface QuickActionType {
  id: string;
  title: string;
  image: StaticImageData;
  bgColor: string;
  borderColor: string;
  size?: number;
}

const quickActions: QuickActionType[] = [
  {
    id: 'create',
    title: 'Create /n a Budget',

    image: createBudgetImage,
    bgColor: '#D7F4FB',
    borderColor: '#11CDEF',
  },
  {
    id: 'track',
    title: 'Track /n your Expenses',
    image: trackExpenseImage,
    bgColor: '#FBE9DA',
    borderColor: '#F39780',
    size: 46,
  },
  {
    id: 'scan',
    title: 'Scan /n your Receipt',
    image: scanReceiptImage,
    bgColor: '#F4DEF2',
    borderColor: '#E149C0',
  },
  {
    id: 'link',
    title: 'Link your /n Bank Accounts',
    image: linkBankImage,
    bgColor: '#D9D9FA',
    borderColor: '#3A36F5',
  },
];

type Props = {};

export default function GetStarted({}: Props) {
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState<boolean>(false);

  return (
    <div className="rounded-[36px] border border-gray-200">
      <div className="flex items-center justify-between bg-gray-100 px-6 py-2.5 rounded-t-[36px]">
        <p className="text-black-900 font-medium">Get Started with Prudy</p>
        <div className="relative h-12 w-12">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(#66C227 0% 0%, #D9D9D9 0% 100%)',
              //       background: 'conic-gradient(#66C227 0% 50%, #D9D9D9 50% 100%)',
            }}
          />
          <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center">
            <span className="text-black-800 text-xs font-bold">0%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="p-4 space-y-2 rounded-3xl border text-black-800 min-w-[160px]"
            style={{
              borderColor: action.borderColor,
              backgroundColor: action.bgColor,
            }}
            onClick={() => {
              if (action.id === 'create') {
                setShowCreateBudgetModal(true);
              }
            }}
          >
            <div className={cn('bg-white rounded-xl w-fit', action.size ? 'p-0' : 'p-1')}>
              <Image
                src={action.image}
                alt={action.id}
                width={action.size || 34}
                height={action.size || 34}
              />
            </div>
            <h5 className="text-sm font-medium">
              {action.title.split('/n').map((part, index) => (
                <span key={index}>
                  {part}
                  {index < action.title.split('/n').length - 1 && <br />}
                </span>
              ))}
            </h5>
          </div>
        ))}
      </div>
      {showCreateBudgetModal && (
        <CreateBudgetDrawer
          show={showCreateBudgetModal}
          setShow={setShowCreateBudgetModal}
        />
      )}
    </div>
  );
}
