'use client';

import cn from 'classnames';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import api from '@/app/utils/axiosInstance';
import BottomDrawer from '../BottomDrawer';
import Button from '../../button';
import {
  AutoCategorizedCategory,
  AutoCategorizedTransaction,
} from '@/app/types/autoCategorize';
import SuccessfulModal from '../../modals/SuccessfulModal';
import { useRouter } from 'next/navigation';
import FullPageDrawer from '../FullPageDrawer';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  autoCategorizedData: AutoCategorizedCategory[];
  setSelectedTransactionIndexToReview: Dispatch<SetStateAction<number>>;
  setShowTransactionCategoryExpenseDrawer: Dispatch<SetStateAction<boolean>>;
  budgetId: string;
  accountId: string;
};

export default function AutoCategorizeDrawer({
  show,
  setShow,
  autoCategorizedData,
  setSelectedTransactionIndexToReview,
  setShowTransactionCategoryExpenseDrawer,
  budgetId,
  accountId,
}: Props) {
  const navigate = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(true);

  const approveCategorization = useMutation({
    mutationFn: async () => {
      // Format the data according to the required structure

      const payload = autoCategorizedData.flatMap((item) =>
        item.transactions.map((transaction: AutoCategorizedTransaction) => ({
          categoryId: item.categoryUid,
          expense: {
            amount: transaction.amount,
            narration: transaction.narration,
            date: transaction.date,
          },
        })),
      );

      console.log(payload);

      // Get the budget ID from the scanned results

      return api.post(`/budgets/${budgetId}/expense/bulk`, payload);
    },
    onSuccess: () => {
      toast.success('Expenses categorized successfully');
      setShow(false);
      // show modal to show success message
    },
    onError: (error) => {
      console.error('Error categorizing expenses:', error);
      toast.error('Failed to categorize expenses');
    },
  });

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
          <Button onClick={() => approveCategorization.mutate()}>
            Approve all Categorization
          </Button>
        }
        label="Transaction Categories"
        back={true}
        show={show}
        close={false}
        onClose={() => setShow(false)}
        headerClass="bg-white"
        className="!bg-gray-100"
      >
        {/* tab */}
        <div className="border border-gray-200 bg-white rounded-3xl px-4 py-3 space-y-3">
          {/* list */}
          <div>
            <p className="font-medium">Budget Categories</p>
          </div>
          <p className="text-gray-400 text-sm">
            Click on the categories below to review the transactions.
          </p>
          <div className="space-y-4">
            {autoCategorizedData.map(
              (transaction: AutoCategorizedCategory, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedTransactionIndexToReview(index);
                    setShowTransactionCategoryExpenseDrawer(true);
                  }}
                  className="border border-gray-200 bg-gray-100 rounded-2xl p-3 space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">
                      {transaction.categoryName}
                    </span>
                    <span
                      className={cn(
                        'bg-white border border-gray-200 rounded-xl w-fit py-1 px-1.5 text-[10px]',
                        transaction.yetToReview ? 'text-red-600' : 'text-success-900',
                      )}
                    >
                      {transaction.yetToReview ? 'Yet to Review' : 'Reviewed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">
                      {autoCategorizedData.length} transactions
                    </span>
                    <span className="font-bold text-sm">
                      ₦{' '}
                      {transaction.transactions
                        .reduce(
                          (acc: number, transaction: AutoCategorizedTransaction) =>
                            acc + transaction.amount,
                          0,
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
        <SuccessfulModal
          title="Categorization Approved"
          text="Your categorization has been approved successfully."
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          textCenter
        >
          <div className="w-full space-y-4">
            <Button
              onClick={() => navigate.push(`/budget/${budgetId}`)}
              className="!bg-lemonGreen-500 !text-lemonGreen-950"
            >
              View budget allocations
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                setShow(false);
                navigate.push(`/track/${budgetId}/transactions/${accountId}`);
              }}
              className="!bg-lemonGreen-100 !text-lemonGreen-900"
            >
              Back to transactions
            </Button>
          </div>
        </SuccessfulModal>
      </FullPageDrawer>
    </motion.div>
  );
}
