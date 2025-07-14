'use client';

import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import Button from '../../button';
import expenseIcon from '/public/images/icons/expense.svg';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import {
  AutoCategorizedCategory,
  AutoCategorizedTransaction,
} from '@/app/types/autoCategorize';
import FullPageDrawer from '../FullPageDrawer';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  transactions: AutoCategorizedTransaction[];
  name: string;
  indexToReview: number;
  autoCategorizedData: AutoCategorizedCategory[];
  setAutoCategorizedData: Dispatch<SetStateAction<AutoCategorizedCategory[]>>;
};

export default function AutoCategorizeExpensesDrawer({
  show,
  setShow,
  transactions,
  indexToReview,
  autoCategorizedData,
  setAutoCategorizedData,
  name,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <FullPageDrawer
        footer={
          <Button
            onClick={() => {
              const copiedData = autoCategorizedData;
              copiedData[indexToReview].yetToReview = false;

              const updatedData = copiedData.map(
                (item: AutoCategorizedCategory, index: number) =>
                  index === indexToReview ? copiedData[indexToReview] : item,
              );

              setAutoCategorizedData(updatedData);
              setShow(false);
            }}
          >
            Approve all Expenses
          </Button>
        }
        label={name}
        back={true}
        show={show}
        close={false}
        onClose={() => setShow(false)}
        headerClass="bg-white"
        className="!bg-gray-100"
      >
        <div className="space-y-4">
          {transactions.map((transaction: AutoCategorizedTransaction, index: number) => (
            <div
              key={index}
              className="border border-gray-200 bg-white rounded-2xl p-3 flex items-center gap-2"
            >
              <Image src={expenseIcon} alt="expense" width={40} height={40} />

              <div className="space-y-3 w-full">
                <div className="flex justify-between">
                  <span className="text-sm">{transaction.narration}</span>
                  {/* popup to either remove transaction or assign to another category */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs">{transaction.date}</span>
                  <span className="font-medium text-sm">
                    ₦ {transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FullPageDrawer>
    </motion.div>
  );
}
