'use client';
import { motion } from 'framer-motion';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Switch } from '@nextui-org/react';
import { formatCategoryNumber } from '@/utils/functions';

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
  setShowSplitExapenseModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSplitExapenseModal: boolean;
  handleAssignCategory: () => void;
  isPending: boolean;
  transactionDetails: Transaction | null;
  singleBudgetData: any;
  handleSelectSplitCategory: (id: string) => void;
  splitCategories: SplitCategory[];
  setSplitCategories: React.Dispatch<React.SetStateAction<SplitCategory[]>>;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SplitExpenseModal({
  setShowSplitExapenseModal,
  showSplitExapenseModal,
  handleAssignCategory,
  isPending,
  transactionDetails,
  singleBudgetData,
  // handleSelectSplitCategory,
  splitCategories,
  setSplitCategories,
  setShowCategories,
}: Props) {
  const [amountDetails, setAmountDetails] = useState({
    amountLeft: transactionDetails?.amount,
    percentageIncomeUsed: 0,
  });

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const rawValue = e.target.value;
      const value = Number(parseFloat(e.target.value.replace(/,/g, '')).toFixed(2)) || 0;
      const amountToSplit = transactionDetails?.amount || 0;

      // Check if category already exists in splitCategories
      const categoryExists = splitCategories.some((cat) => cat.allocationId === id);

      // Calculate total of all other categories
      const otherCategoriesTotal = splitCategories.reduce((total, category) => {
        if (category.allocationId !== id) {
          return total + (Number(category.amount) || 0);
        }
        return total;
      }, 0);

      const availableAmount = amountToSplit - otherCategoriesTotal;

      if (value <= availableAmount) {
        setSplitCategories((prev: SplitCategory[]) => {
          if (!categoryExists && value > 0) {
            // Add new category if it doesn't exist and value is greater than 0
            return [...prev, { allocationId: id, amount: rawValue }];
          } else if (categoryExists && value > 0) {
            // Update existing category if value is greater than 0
            return prev.map((category) =>
              category.allocationId === id ? { ...category, amount: rawValue } : category,
            );
          } else if (value === 0) {
            // Remove category if value is 0
            return prev.filter((category) => category.allocationId !== id);
          }
          return prev;
        });

        const newTotal = otherCategoriesTotal + value;        
        setAmountDetails((prev) => ({
          ...prev,
          amountLeft: Number((amountToSplit - newTotal).toFixed(2)),
          percentageIncomeUsed: Number(((newTotal / amountToSplit) * 100).toFixed(2)),
        }));
      } else {
        toast.error(
          `The amount you're entering exceeds the available amount (₦${availableAmount.toLocaleString()}) for ${
            transactionDetails?.name ?? transactionDetails?.narration
          }`,
        );
      }
    },
    [splitCategories, transactionDetails],
  );

  return (
    <div className="h-[100vh] w-[100vw] max-w-[500px] z-[40] fixed bottom-0">
      <div
        className="h-full w-full bg-[#1c1c1c73] fixed"
        onClick={() => setShowSplitExapenseModal(false)} // Close on background click
      ></div>
      {/* Bottom drawer */}
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0  w-full z-[50]"
      >
        <BottomDrawer
          label={`Assign to Expense Category`}
          back={false}
          show={showSplitExapenseModal}
          close={true}
          padding={1}
          removePadding={false}
          className="overflow-y-auto max-h-screen bottom-[-70px] pb-[70px]"
          footer={
            <button
              className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
              onClick={handleAssignCategory}
              disabled={isPending} // Disable button when loading
            >
              {isPending ? (
                // Show a loading spinner or some text when loading
                <span className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  <span className="ml-2">Splitting...</span>
                </span>
              ) : (
                // Regular button text
                'Split Expense'
              )}
            </button>
          }
          onClose={() => {
            setShowSplitExapenseModal(!showSplitExapenseModal);
            setSplitCategories([]);
          }}
        >
          <div className="px-4 pt-4 pb-2 space-y-4 bg-white">
            <h1 className="text-base font-[500] text-[#2D2D2D]">Select category</h1>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <p className="text-xs font-[500] text-[#575757]">
                Split to different categories
              </p>
              <Switch
                isSelected={showSplitExapenseModal}
                onChange={() => {
                  setShowCategories(true);
                  setShowSplitExapenseModal(false);
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
            <div className="grid grid-cols-2 max-h-[50vh]  overflow-y-scroll gap-3">
              {singleBudgetData?.budgetCategories?.map((category: any) => {
                // const isSelected = splitCategories.some(
                //   (item) => item.allocationId === category.uid,
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
                        <span className="text-[#828282] text-[10px] font-[400]">
                          {' '}
                          left
                        </span>
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
                            .find((item) => item.allocationId === category.uid)
                            ?.amount?.toString() || ''
                        }
                        placeholder="0.00"
                        onChange={(e) => {
                          // Only allow numbers and one decimal point
                          const value = e.target.value.replace(/,/g, '');
                          if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                            handleAmountChange(e, category.uid);
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
      </motion.div>
    </div>
  );
}
