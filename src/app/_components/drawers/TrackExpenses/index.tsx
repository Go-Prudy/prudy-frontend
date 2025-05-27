import React from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import { Icons } from '@/app/icons';
import { BsChevronRight } from 'react-icons/bs';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  setShowSelectBankAccountDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowScanner: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddManualDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const actions = [
  {
    title: 'Sync your transactions',
    icon: Icons.bank,
    description: 'Say in touch with all your bank transactions',
    key: 'sync',
  },
  {
    title: 'Scan receipt',
    icon: Icons.bank,
    description: 'Capture expense details with your camera',
    key: 'scan',
  },
  {
    title: 'Add manually',
    icon: Icons.note,
    description: 'Add expense details manually',
    key: 'manual',
  },
];

export default function TrackExpenseDrawer({
  show,
  setShow,
  setShowSelectBankAccountDrawer,
  setShowScanner,
  setShowAddManualDrawer,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Track your Expenses"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-3">
          <p>Kindly select the mode with which you would like to track your expenses</p>
          <div className="space-y-4">
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={() => {
                  if (action.key === 'sync') {
                    setShowSelectBankAccountDrawer(true);
                  }
                  if (action.key === 'scan') {
                    setShowScanner(true);
                  }
                  if (action.key === 'manual') {
                    setShowAddManualDrawer(true);
                  }
                  setShow(false);
                }}
                className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 rounded-[20px] w-full"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white rounded-full w-9 h-9 flex justify-center items-center">
                    {action.icon}
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-sm font-medium text-gray-700">{action.title}</p>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                </div>
                <BsChevronRight />
              </button>
            ))}
          </div>
        </div>
      </BottomDrawer>
    </motion.div>
  );
}
