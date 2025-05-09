'use client';

import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import { useRouter } from 'next/navigation';
import Button from '../../button';
import useAssignExpense from './useAssignExpense';
import { Switch } from '@nextui-org/react';
import { lightenColor } from '@/app/utils/functions';
import { BsCheck } from 'react-icons/bs';
import SuccessfulModal from '../../modals/SuccessfulModal';
import { BudgetAllocation } from '@/app/types/budget';

interface Transaction {
  id: number;
  name: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  narration: string;
}

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  setShowSplitExapenseDrawer: (i: boolean) => void;
  accountId: string;
  budgetId: string;
  transactionId: string;
  budgetCategories: BudgetAllocation[];
  transactionDetails: Transaction | null;
}

const AssignExpenseDrawer = ({
  setShow,
  show,
  setShowSplitExapenseDrawer,
  accountId,
  budgetId,
  transactionId,
  budgetCategories,
  transactionDetails,
}: Props) => {
  const navigate = useRouter();
  const {
    handleAssignCategory,
    assignCategoryMutation,
    selectedCategory,
    setSelectedCategory,
    showAssignExpenseSuccessModal,
    handleCloseAssignExpenseSuccessModal,
  } = useAssignExpense({
    accountId,
    budgetId,
    transactionId,
    setShow,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button
            onClick={handleAssignCategory}
            loading={assignCategoryMutation.isPending}
            disabled={!selectedCategory}
            type="submit"
          >
            Assign
          </Button>
        }
        label="Assign to Budget Category"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <div className="space-y-4 bg-white">
          {/* TODO: transaction */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 text-sm flex justify-between items-end">
            <div>
              <p className="font-medium">{transactionDetails?.narration}</p>
              <p className="text-gray-600 text-xs">
                {/* {formatDateTime(transactionDetails?.date)} */}
                {transactionDetails?.date}
              </p>
            </div>
            <div className="font-medium whitespace-nowrap">
              ₦ {transactionDetails?.amount?.toLocaleString()}
            </div>
          </div>

          <h1 className="text-base font-medium text-black-800">Select category</h1>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <p className="text-xs font-medium text-gray-600">
              Split to different categories
            </p>
            <Switch
              isSelected={show}
              onChange={() => {
                setShow(false);
                setShowSplitExapenseDrawer(true);
              }}
              size="sm"
              color="success"
            />
          </div>
          <div className="grid grid-cols-3 max-h-[50vh] overflow-auto gap-3">
            {budgetCategories?.map((category: any) => (
              <div
                key={category.uid}
                className={`relative p-[8px] w-full h-[100px] border rounded-[20px] cursor-pointer`}
                onClick={() => setSelectedCategory(category.uid)}
                style={{
                  backgroundColor:
                    selectedCategory === category.uid
                      ? lightenColor(category.color, 0.9)
                      : '#F7F7F9',
                  borderColor:
                    selectedCategory === category.uid ? category.color : '#EFEFF0',
                }}
              >
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          selectedCategory === category.uid
                            ? category.color
                            : 'transparent',
                        borderColor: category.color,
                        borderWidth: '2px',
                      }}
                    >
                      {selectedCategory === category.uid && (
                        <BsCheck className="text-white" />
                      )}
                    </div>
                    <h1 className="text-black-800 text-xs truncate">{category.name}</h1>
                  </div>
                  <h1 className="font-medium text-sm text-black-800 truncate">
                    ₦ {category.amountLeft}
                    <span className="text-[#828282] text-[10px] font-[400]"> left</span>
                  </h1>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (category.amountLeft / category.amountAllocated) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BottomDrawer>
      <SuccessfulModal
        title="Assigned Successfully 🎉"
        text="Your transaction has been successfully assigned to the category"
        isOpen={showAssignExpenseSuccessModal}
        onClose={handleCloseAssignExpenseSuccessModal}
      />
    </motion.div>
  );
};

export default AssignExpenseDrawer;
