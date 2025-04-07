'use client';
import Header from '@/components/header';
import React, { useRef, useState, use } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@nextui-org/react';
import BottomDrawer from '@/app/_components/drawers/BottomDrawer';
import Image from 'next/image';
import manual from '/public/images/manual.png';
import photo from '/public/images/camera.png';
import { GoChevronRight } from 'react-icons/go';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthentication } from '@/app/store/AuthStore';
import {
  getActiveBudgetCategoriesApi,
  getAllBudgetCategoriesApi,
  getCategoryExpenses,
  getSingleBudgetApi,
  RecordExpenseApi,
} from '@/app/services/BudgetService';
import { Expense, BudgetCategory, ExpenseResponse, ManualData } from '@/app/Types';
import Scanner from './scanner';

// Utility function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(dateString);
  return date
    .toLocaleDateString('en-US', options)
    .replace(/(\d{1,2})(st|nd|rd|th)/, '$1');
};

const Page = (props: { params: { id: string; id2: string } }) => {
  const params = props.params;

  const queryClient = useQueryClient();
  const { authenticatedUser } = useAuthentication();

  // State management
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showAddManual, setShowAddManual] = useState(false);
  const [manualData, setManualData] = useState<ManualData>({
    budgetCategoryId: params.id,
    amount: 0,
    narration: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // scan receipt
  const [scanState, setScanState] = useState<boolean>(false);
  const [addManualModalTitle, setAddManualModalTitle] = useState<string>('Add manually');

  // Add after state declarations
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value.replace(/,/g, '')) || 0 : value,
    }));
  };

  // Queries
  const { data: singleBudgetData, isPending: singleBudgetStatus } = useQuery({
    queryKey: ['singleBudgetData', params.id],
    queryFn: () => getSingleBudgetApi(authenticatedUser?.token ?? '', params.id),
    enabled: !!authenticatedUser?.token && !!params.id,
  });

  const { data: expenses } = useQuery<ExpenseResponse>({
    queryKey: ['categoryExpenses', params.id, params.id2],
    queryFn: () =>
      getCategoryExpenses(params.id, params.id2, authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token && !!params.id && !!params.id2,
  });

  // Optimistic update mutation
  const RecordExpenseMutation = useMutation({
    mutationFn: (expenseData: Partial<Expense>) =>
      RecordExpenseApi(
        params.id,
        params.id2,
        expenseData,
        authenticatedUser?.token ?? '',
      ),
    onMutate: async (newExpense) => {
      // Close modal immediately
      setShowAddManual(false);
      setShowRecordModal(false);

      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: ['categoryExpenses', params.id, params.id2],
      });
      await queryClient.cancelQueries({ queryKey: ['singleBudgetData', params.id] });

      // Snapshot previous values
      const previousExpenses = queryClient.getQueryData<ExpenseResponse>([
        'categoryExpenses',
        params.id,
        params.id2,
      ]);
      const previousBudget = queryClient.getQueryData<any>([
        'singleBudgetData',
        params.id,
      ]);

      // Optimistically update expenses
      const optimisticExpense: Expense = {
        uid: 'temp-' + Date.now(),
        narration: newExpense.narration || '',
        amount: newExpense.amount || 0,
        date: manualData.date + 'T00:00:00.000Z',
        time: new Date().toLocaleTimeString(),
      };

      // Update cache with optimistic data
      queryClient.setQueryData<ExpenseResponse>(
        ['categoryExpenses', params.id, params.id2],
        (old) => ({
          ...old!,
          data: {
            ...old!.data,
            docs: [optimisticExpense, ...(old?.data.docs || [])].filter(
              // Prevent duplicates by checking narration and amount
              (expense, index, self) =>
                index ===
                self.findIndex(
                  (e) => e.narration === expense.narration && e.amount === expense.amount,
                ),
            ),
          },
        }),
      );

      // Optimistically update budget amounts
      queryClient.setQueryData(['singleBudgetData', params.id], (old: any) => {
        const updatedCategories = old.budgetCategories.map((cat: BudgetCategory) => {
          if (cat.uid === params.id2) {
            const newAmountSpent = cat.amountSpent + (newExpense.amount || 0);
            const newAmountLeft = cat.amountAllocated - newAmountSpent;
            return {
              ...cat,
              amountSpent: newAmountSpent,
              amountLeft: newAmountLeft,
            };
          }
          return cat;
        });
        return { ...old, budgetCategories: updatedCategories };
      });

      return { previousExpenses, previousBudget };
    },
    onError: (err, newExpense, context) => {
      // Revert optimistic updates on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(
          ['categoryExpenses', params.id, params.id2],
          context.previousExpenses,
        );
      }
      if (context?.previousBudget) {
        queryClient.setQueryData(['singleBudgetData', params.id], context.previousBudget);
      }
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({
        queryKey: ['categoryExpenses', params.id, params.id2],
      });
      queryClient.invalidateQueries({ queryKey: ['singleBudgetData', params.id] });
    },
  });

  const handleAddManually = async () => {
    if (!validateInputs()) return;

    const expenseData = {
      amount: manualData.amount,
      narration: manualData.narration,
      date: manualData.date,
    };

    try {
      await RecordExpenseMutation.mutateAsync(expenseData);
      setManualData({
        budgetCategoryId: params.id,
        amount: 0,
        narration: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddManual(false);
      setErrors({});
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  // Validation function to check inputs
  const validateInputs = () => {
    const newErrors: any = {};

    // Narration validation (Make sure the narration field is not empty)
    if (!manualData.narration.trim()) newErrors.narration = 'Narration is required.';

    // Amount validation (Ensure it's a number greater than 0)
    if (!manualData.amount || Number(manualData.amount) <= 0)
      newErrors.amount = 'Amount must be greater than zero.';

    // Date validation (Ensure a date is provided)
    if (!manualData.date) newErrors.date = 'Date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If no errors, return true
  };

  const {
    data: AllBudgetCategories = [],
    isLoading: isAllBudegetLoading,
    error: AllBudgetCategoriesError,
  } = useQuery({
    queryKey: ['getAllBudgetCategoriesApi'],
    queryFn: () => getAllBudgetCategoriesApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token && !!params.id2 && !!params.id2, // Only fetch if all values are provided
    refetchOnWindowFocus: true,
  });

  console.log(AllBudgetCategories);

  console.log(expenses);

  const currentBudget =
    singleBudgetData?.budgetCategories?.filter(
      (category: any) => category.uid === params.id2,
    ) || [];

  // Safely destructure values with defaults
  const { amountLeft = 0, amountAllocated = 0, amountSpent = 0 } = currentBudget[0] || {};

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className=" relative">
      <motion.div
        initial={{ x: '100%' }} // Start from the right side of the screen
        animate={{ x: 0 }} // Move to the normal position
        exit={{ x: '-100%' }} // Optionally, move out to the left when unmounted
        transition={{ type: 'tween', stiffness: 600 }} // Customize the animation
        className=" min-h-[100vh] "
      >
        <div className=" relative">
          <Header
            link={`/budget/${params.id}`}
            title={`${currentBudget[0]?.name || 'budget name'}`}
          />
          <div className="p-[24px] w-full">
            <div className="p-[16px] bg-[#EFEFF0] rounded-[20px] border border-[#E7E7EA]">
              <Progress
                aria-label="Progress showing amount spent and left"
                value={amountLeft}
                maxValue={amountAllocated}
                size="md"
                color="warning"
                radius="md"
                classNames={{
                  base: 'max-w-md',
                  track: 'bg-white',
                  indicator: '',
                  label: 'tracking-wider font-medium text-default-600',
                  value: 'text-foreground/60',
                }}
                showValueLabel={true}
                valueLabel={
                  <div className="gap-[8px] flex flex-col">
                    <div className="text-[#6F6C8F] text-[12px]">Amount Spent</div>
                    <div className="text-[#514F6E] text-right text-[12px]">
                      ₦ {amountSpent?.toLocaleString()}
                    </div>
                  </div>
                }
                label={
                  <div className="flex flex-col">
                    <div className="text-[#6F6C8F] my-[8px] text-[12px]">Amount Left</div>
                    <div className="font-[500]">₦ {amountLeft?.toLocaleString()}</div>
                  </div>
                }
              />
            </div>

            <button
              onClick={() => setShowRecordModal(!showRecordModal)}
              type="submit"
              className="btn my-[24px] w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
            >
              Record expenses
            </button>

            <div className="w-full">
              <div className="flex mb-[16px] justify-between items-center w-full">
                <h1 className="text-[18px] font-[500] capitalize text-[#252340]">
                  {currentBudget[0]?.name || 'budget name'} Expenses
                </h1>
              </div>

              <ul className="flex flex-col gap-[16px] w-full">
                {expenses?.data?.docs?.map((expense: any, index: number) => (
                  <li
                    key={expense.uid}
                    className={`pb-[16px] ${index === expenses?.data?.docs?.length - 1 ? '' : 'border-b-2'} flex justify-between w-full`}
                  >
                    <div className="flex flex-col gap-[8px]">
                      <h1 className="text-[#2D2D2D] text-[14px] font-[500]">
                        {expense.narration}
                      </h1>
                      <div className="flex text-[12px] text-[#575757] justify-around items-center">
                        <h1>{formatDate(expense.date)}</h1>
                        <span className="h-[16px] bg-[#EFEFF0] w-[1px] mx-[8px]" />
                        <h1>
                          {new Date(expense.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-[#2D2D2D] text-[14px] font-[500]">
                      ₦ {expense.amount.toLocaleString()}
                    </h1>
                  </li>
                ))}
              </ul>

              {expenses?.data?.docs.length === 0 && (
                <>
                  <h1 className="flex text-[12px] mt-[5rem] text-[#575757] justify-around items-center ">
                    No Expense on recorded
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {showRecordModal && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed h-[100vh] bottom-0 w-full z-[40] bg-[#1c1c1c73]"
        >
          <div className=" ">
            <BottomDrawer
              label="Record expense"
              back={false}
              show={showRecordModal}
              close={true}
              onClose={() => setShowRecordModal(false)}
            >
              <div className="flex flex-col py-[24px] gap-[16px] ">
                <div
                  onClick={() => {
                    setShowRecordModal(!showRecordModal);
                    setScanState(!scanState);
                  }}
                  className="bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] p-[16px] flex justify-between w-full"
                >
                  <div className="flex gap-4">
                    <Image
                      src={manual}
                      alt="Scan receipt"
                      className="w-[44px] h-[44px]"
                    />
                    <div>
                      <h1 className="text-[14px] text-[#474747] font-[500]">
                        Scan receipt
                      </h1>
                      <p className="text-[10px] text-[#575757]">
                        Capture expense details with your camera
                      </p>
                    </div>
                  </div>
                  <GoChevronRight className="text-[#888888] w-[24px] h-[24px]" />
                </div>

                <div
                  onClick={() => {
                    setShowRecordModal(!showRecordModal);
                    setShowAddManual(!showAddManual);
                  }}
                  className="bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] p-[16px] flex justify-between w-full"
                >
                  <div className="flex gap-4">
                    <Image src={photo} alt="Add manually" className="w-[44px] h-[44px]" />
                    <div>
                      <h1 className="text-[14px] text-[#474747] font-[500]">
                        Add manually
                      </h1>
                      <p className="text-[10px] text-[#575757]">
                        Add expense details manually
                      </p>
                    </div>
                  </div>
                  <GoChevronRight className="text-[#888888] w-[24px] h-[24px]" />
                </div>
              </div>
            </BottomDrawer>
          </div>
        </motion.div>
      )}

      {scanState && (
        <div className=" text-center w-full grid   place-content-center gap-3 ">
          <div className=" w-full ">
            {/* Dark background */}
            <div
              className="h-full top-6  left-0 z-40 w-full max-w-[500px] flex justify-center items-center bg-[#1c1c1c73] absolute"
              onClick={() => setScanState(false)} // Close on background click
            ></div>
            <Scanner
              scanState={scanState}
              setScanState={setScanState}
              setManualData={setManualData}
              setAddManualModal={setShowAddManual}
              categoryId={params.id}
              setAddManualModalTitle={setAddManualModalTitle}
            />
          </div>
        </div>
      )}
      <>
        {showAddManual && (
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed h-[100vh] top-0 w-full z-[40] bg-[#1c1c1c73]"
          >
            <div>
              <BottomDrawer
                footer={
                  <button
                    ref={buttonRef}
                    onClick={() => handleAddManually()}
                    type="submit"
                    className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
                  >
                    {RecordExpenseMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                }
                label={addManualModalTitle}
                back={false}
                show={showAddManual}
                close={true}
                onClose={() => setShowAddManual(false)}
              >
                <div className="flex flex-col gap-[16px]">
                  {/* Category Input */}
                  <div className="relative w-full">
                    <label
                      htmlFor="category"
                      className="text-[#828282] absolute top-[30px] left-4 text-xs"
                    >
                      Name of item/description
                    </label>
                    <input
                      type="text"
                      name="narration"
                      id="naration"
                      required
                      value={manualData.narration}
                      onChange={handleInputChange}
                      placeholder="Enter category name"
                      className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                    />
                    {errors.narration && (
                      <span className="text-red-500 text-sm">{errors.narration}</span>
                    )}
                  </div>

                  {/* Amount Input */}
                  <div className="relative w-full">
                    <label
                      htmlFor="amount"
                      className="text-[#828282] absolute top-[30px] left-4 text-xs"
                    >
                      Amount
                    </label>
                    <input
                      type="text" // Use `text` for formatting flexibility
                      name="amount"
                      id="amount"
                      required
                      value={
                        manualData.amount
                          ? Number(manualData.amount).toLocaleString()
                          : ''
                      } // Display formatted value
                      onChange={(e) => {
                        // Only allow numeric values and update state
                        const numericValue = e.target.value
                          .replace(/,/g, '')
                          .replace(/[^\d]/g, '');
                        setManualData((prevData) => ({
                          ...prevData,
                          amount: numericValue ? parseFloat(numericValue) : 0,
                        }));
                      }}
                      onFocus={(e) => {
                        // Remove formatting for editing
                        e.target.value = manualData.amount
                          ? manualData.amount.toString()
                          : '';
                      }}
                      onBlur={(e) => {
                        // Format back to locale string on blur
                        const formattedAmount = Number(
                          manualData.amount,
                        ).toLocaleString();
                        e.target.value = formattedAmount;
                      }}
                      placeholder="Enter amount"
                      className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                    />

                    {errors.amount && (
                      <span className="text-red-500 text-sm">{errors.amount}</span>
                    )}
                  </div>
                  <div className="relative w-full">
                    <label
                      htmlFor="amount"
                      className="text-[#828282] absolute top-[30px] left-4 text-xs"
                    >
                      Category
                    </label>
                    <input
                      type="text"
                      value={`${currentBudget[0]?.name || 'budget name'}`}
                      name=""
                      required
                      id=""
                      disabled
                      className="bg-[#F7F7F9] cursor-not-allowed mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                    />
                  </div>

                  {/* Date Input */}
                  <div className="relative w-full">
                    <label
                      htmlFor="date"
                      className="text-[#828282] absolute top-[30px] left-4 text-xs"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={manualData.date}
                      onChange={handleInputChange}
                      className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                    />
                    {errors.date && (
                      <span className="text-red-500 text-sm">{errors.date}</span>
                    )}
                  </div>
                </div>
              </BottomDrawer>
            </div>
          </motion.div>
        )}
      </>
    </div>
  );
};

export default Page;
