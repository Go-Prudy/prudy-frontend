'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
// import { toast } from 'react-toastify';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { BsArrowLeft, BsArrowRight, BsThreeDotsVertical } from 'react-icons/bs';
// import moneyIcon from '/public/images/money.png';
import addAnotherIcon from '/public/images/icons/add.svg';
import moneyIcon from '/public/images/icons/money.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Income } from '@/app/Types';
import { useBudgetStore } from '@/app/store/Store';
import { formatNumber } from '@/utils/functions';

interface BudgetDetailsProps {
  budgetId: string;
}

const Page = ({ params }: { params: { id: string } }) => {
  const navigate = useRouter();
  const budgetId = params.id;

  const { budgets, previousBudget } = useBudgetStore();
  const budget = budgets.find((b) => b.id === budgetId);

  const [allIncomes, setIncomes] = useState<Income[]>(previousBudget?.incomes ?? []);
  const [popupPosition, setPopupPosition] = useState({ top: 0 });
  const [selectedIncomeIndex, setSelectedIncomeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (budget?.incomes?.length) {
      setIncomes(budget.incomes);
    }
    // else {
    //     setIncomes([{ name: '', amount: 0 }]);
    // }
  }, [budget]);

  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addIncomeToBudget = useBudgetStore((state) => state.addIncomeToBudget);

  const handleAddIncome = () => {
    setIncomes([...allIncomes, { name: '', amount: 0 }]);
    setTimeout(() => {
      const newIndex = allIncomes.length;
      if (inputRefs.current[newIndex]) {
        inputRefs.current[newIndex]?.focus();
      }
    }, 0);
  };

  const handleSubmit = () => {
    const hasValidIncome = allIncomes.some(
      (income) => income.name.trim() !== '' && income.amount > 0,
    );
    if (!hasValidIncome) {
      toast.error('Oops.. you’ll need to add your income', {
        position: 'top-center',
        transition: Slide,
        autoClose: 2000,
        closeButton: false,
      });

      return; // Prevent adding a new income
    }
    const updatedIncomes = allIncomes.map((income) => ({
      name: income.name,
      amount: parseFloat(income.amount.toString()),
    }));

    addIncomeToBudget(budgetId, updatedIncomes);
    navigate.push(`/budgets/new/expense/${budgetId}`);
  };

  const handleIncomeChange = (index: number, field: keyof Income, value: any) => {
    const updatedIncomes = [...allIncomes];

    if (field === 'amount') {
      const rawNumber = value.replace(/,/g, ''); // Remove commas
      if (!/^\d*\.?\d*$/.test(rawNumber)) return; // Prevent invalid characters

      updatedIncomes[index] = {
        ...updatedIncomes[index],
        amount: rawNumber, // Store raw value
      };
    } else {
      updatedIncomes[index] = { ...updatedIncomes[index], [field]: value };
    }

    setIncomes(updatedIncomes);
  };

  const handleDeleteIncome = (incomeIndex: number) => {
    const remainingIncomes = allIncomes.filter((_, index) => index !== incomeIndex);
    setIncomes(remainingIncomes);
    setSelectedIncomeIndex(null);
  };

  const handleDotsClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the button's position
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom - 210,
    });

    setSelectedIncomeIndex(index);
  };

  const getInputWidth = (index: number) => {
    if (spanRefs.current[index]) {
      return `${Math.min(spanRefs.current[index]!.offsetWidth + 30, 140)}px`;
    }
    return '50px';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedIncomeIndex !== null &&
        !(event.target as Element).closest('.dots-button, .delete-popup')
      ) {
        setSelectedIncomeIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedIncomeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className=" w-[100vw] relative min-h-[100vh] max-w-[500px] bg-white"
    >
      <Header link="/budgets" title="Create new budget" />
      <ToastContainer />
      <div className="mt-6 mb-[140px] px-[24px] w-full">
        <div className="flex gap-[8px] justify-between items-center">
          <p className="mt-[24px] mb-[16px] font-[500] text-[20px]">Set your income</p>
          <div className="relative h-[42px] w-[42px]">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(#66C227 0% 50%, #EFEFF0 50% 100%)',
              }}
            />
            <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center">
              <span className="text-[#2D2D2D] text-[12px] font-[700]">1/2</span>
            </div>
          </div>
        </div>

        <div className="bg-[#F7F7F9] rounded-[20px] mb-5 border border-[#EFEFF0]">
          <h1 className="text-[#575757] leading-[24px] p-4 bg-white rounded-t-[20px]">
            Income Streams
          </h1>
          <hr className="fill-white" />
          <div className="relative grid grid-cols-1 max-h-[calc(65vh-140px)] px-4 pt-2 pb-3 space-y-3">
            <div className="overflow-y-auto overflow-x-hidden  max-h-[calc(65vh-140px)] ">
              {allIncomes.map((income, index) => (
                <form key={index} className={`relative mt-[8px]`}>
                  <div className="flex transition-all ease-in items-center justify-between w-full gap-[8px]">
                    <div className="flex items-center gap-3 w-full">
                      <Image src={moneyIcon} className="size-8" alt={'icon'} />
                      <div className="text-[#514F6E] min-w-[140px] w-[80px] text-[14px] font-[500] inline-block">
                        <input
                          className="bg-transparent outline-[#66C227] px-2 w-full text-ellipsis overflow-hidden whitespace-nowrap"
                          type="text"
                          placeholder="Enter income name"
                          onChange={(e) =>
                            handleIncomeChange(index, 'name', e.target.value)
                          }
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          value={income.name}
                        />
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white rounded-[8px] py-[4px] px-[8px] items-center flex  gap-[0px]">
                        <h2>₦</h2>
                        <div className="relative inline-block w-full">
                          <input
                            value={formatNumber(income.amount.toString())}
                            onChange={(e) =>
                              handleIncomeChange(index, 'amount', e.target.value)
                            }
                            type="text"
                            className="px-2 py-1 rounded focus:outline-none border-none focus:border-none transition-all duration-200"
                            style={{ width: getInputWidth(index), maxWidth: '140px' }}
                          />

                          <span
                            ref={(el) => {
                              spanRefs.current[index] = el;
                            }}
                            className="absolute invisible whitespace-pre"
                          >
                            {formatNumber(income.amount.toString())}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="dots-button"
                      onClick={(e) => handleDotsClick(e, index)}
                    >
                      <BsThreeDotsVertical />
                    </button>
                  </div>
                </form>
              ))}
              {selectedIncomeIndex !== null && (
                <button
                  className="absolute right-4 z-[100] bg-white border rounded-[8px] shadow-lg p-2 flex gap-1 delete-popup"
                  style={{
                    top: `${popupPosition.top}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDeleteIncome(selectedIncomeIndex);
                  }}
                >
                  <span className="text-white text-base leading-[10px] grid place-content-center rounded-[5px] px-[6px] bg-[#F5365C]">
                    -
                  </span>
                  <span className="text-sm"> Delete Income</span>
                </button>
              )}
            </div>
            <button
              onClick={handleAddIncome}
              className="flex gap-x-4 items-center hover:scale-105"
            >
              <Image src={addAnotherIcon} className="size-8" alt={'icon'} />
              <span className="text-[#514F6E] text-[14px] font-[500]">Add New</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-[24px] max-w-[500px] mt-[12rem] fixed  z-10 bg-[#ffffffaa] backdrop-blur-lg bottom-0 w-[100%] border-t-[2px] border-t-[#EFF0F6]">
        <div className="w-full flex items-center gap-4">
          <button
            onClick={() => navigate.push(`/budgets/`)}
            className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-[#E7E7EA] text-black flex items-center justify-center gap-[8px] font-[500]"
          >
            <BsArrowLeft />
            Previous
          </button>
          <button
            onClick={() => handleSubmit()}
            className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
          >
            Proceed <BsArrowRight />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Page;
