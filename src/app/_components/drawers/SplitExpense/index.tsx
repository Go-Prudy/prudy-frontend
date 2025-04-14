'use client';
import { motion } from 'framer-motion';
import BottomDrawer from '@/app/_components/drawers/BottomDrawer';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Switch } from '@nextui-org/react';
import { formatCategoryNumber } from '@/app/utils/functions';
import Button from '../../button';
import useSplitExpense from './useSplitExpense';
import SuccessfulModal from '../../modals/SuccessfulModal';

interface SplitCategory {
  allocationId: string;
  amount: number | string;
}

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
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  transactionDetails: Transaction | null;
  singleBudgetData: any;
  setShowAssignCategories: React.Dispatch<React.SetStateAction<boolean>>;
  accountId: string;
  budgetId: string;
  transactionId: string;
}

export default function SplitExpenseDrawer({
  setShow,
  show,
  transactionDetails,
  singleBudgetData,
  setShowAssignCategories,
  accountId,
  budgetId,
  transactionId,
}: Props) {
  const {
    handleSelectSplitCategory,
    handleAssignSplitCategory,
    assignSplitCategoryMutation,
    showSplitExpenseSuccessModal,
    handleCloseSplitExpenseSuccessModal,
    handleAmountChange,
    amountDetails,
    splitCategories,
    setSplitCategories,
  } = useSplitExpense({
    accountId,
    budgetId,
    transactionId,
    setShow,
    transactionDetails,
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
            onClick={handleAssignSplitCategory}
            loading={assignSplitCategoryMutation.isPending}
            disabled={splitCategories.length === 0}
          >
            Split Expense
          </Button>
        }
        label="Assign to Budget Category"
        back={false}
        show={show}
        close={true}
        onClose={() => {
          setShow(!show);
          setSplitCategories([]);
        }}
        className="max-h-[85vh] overflow-auto"
      >
        <div className="space-y-4 bg-white">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <p className="text-xs font-[500] text-[#575757]">
              Split to different categories
            </p>
            <Switch
              isSelected={show}
              onChange={() => {
                setShowAssignCategories(true);
                setShow(false);
              }}
              size="sm"
              color="success"
            />
          </div>
          <div
            style={{
              background: 'linear-gradient(20.37deg, #66C227 15.2%, #2A860A 74.4%)',
            }}
            className="text-white rounded-2xl p-4 flex flex-col items-center gap-1"
          >
            <p className="text-xs">
              {transactionDetails?.name ?? transactionDetails?.narration}
            </p>
            <h1 className=" font-[500] text-[28px] leading-[28px]">
              ₦{transactionDetails?.amount.toLocaleString()}
            </h1>

            <div className="w-full max-w-[310px] bg-white p-2 rounded-[12px]">
              <p className="text-base font-500 text-[#2D2D2D]">
                ₦ {amountDetails?.amountLeft?.toLocaleString()}{' '}
                <span className="text-[#575757] text-sm">left to split</span>
              </p>
              <div className="w-full bg-white rounded-[10px] mt-[8px] h-[8px] relative overflow-hidden">
                <div
                  className="bg-[#EFEFF0] rounded-[10px] h-[8px] absolute top-0 left-0"
                  style={{ width: `${100}%` }} // Remaining part
                ></div>

                <div
                  className="bg-[#FB8417] rounded-[10px] h-[8px] relative"
                  style={{ width: `${amountDetails.percentageIncomeUsed}%` }} // Used part
                ></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#828282]">
            Enter the amount you want to split into the categories below
          </p>
        </div>

        <div className="bg-[#F7F7F9] pt-4 pb-[32px] px-4 rounded-t-lg shadow-lg">
          <div className="grid grid-cols-2 gap-3">
            {singleBudgetData?.budgetCategories?.map((category: any) => {
              // const isSelected = splitCategories.some(
              //   (item) => item.allocationId === category.allocationId,
              // );

              return (
                <div
                  key={category.uid}
                  className={`relative p-[8px] w-full border rounded-[20px] cursor-pointer space-y-2 bg-white`}
                >
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          // backgroundColor: isSelected ? category.color : 'transparent',
                          backgroundColor: category.color,
                          borderColor: category.color,
                          borderWidth: '2px',
                        }}
                      >
                        {/* {isSelected && <BsCheck className="text-white" />} */}
                      </div>
                      <h1 className="text-[#2d2d2d] text-[12px] truncate">
                        {category.name}
                      </h1>
                    </div>
                    <h1 className="font-medium text-[14px] text-[#2d2d2d] truncate">
                      ₦ {category.amountLeft}
                      <span className="text-[#828282] text-[10px] font-[400]"> left</span>
                    </h1>
                  </div>
                  <div className="">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#575757] h-2 rounded-full"
                        style={{
                          width: `${
                            (category.amountLeft / category.amountAllocated) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* {isSelected && ( */}
                  <div className="bg-[#F7F7F9] border border-[#EFEFF0] px-2 py-1 w-full text-sm rounded-lg flex items-center gap-1">
                    <span> ₦</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full text-sm bg-transparent focus:outline-none"
                      value={
                        splitCategories
                          .find((item) => item.allocationId === category.allocationId)
                          ?.amount?.toString() || ''
                      }
                      placeholder="0.00"
                      onChange={(e) => {
                        // Only allow numbers and one decimal point
                        const value = e.target.value.replace(/,/g, '');
                        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                          handleAmountChange(e, category.allocationId);
                        }
                      }}
                    />
                  </div>
                  {/* )} */}
                </div>
              );
            })}
          </div>
        </div>
      </BottomDrawer>
      <SuccessfulModal
        title="Split Successful 🎉"
        text="Your transaction has been successfully split into the categories"
        isOpen={showSplitExpenseSuccessModal}
        onClose={handleCloseSplitExpenseSuccessModal}
      />
    </motion.div>
  );
}
