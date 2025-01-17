'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
// import { toast } from 'react-toastify';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { BsArrowRight, BsPlus } from 'react-icons/bs';
// import moneyIcon from '/public/images/money.png';
import addAnotherIcon from '/public/images/icons/add.svg';
import moneyIcon from '/public/images/icons/money.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Income } from '@/app/Types';
import { useBudgetStore } from '@/app/store/Store';

interface BudgetDetailsProps {
    budgetId: string;
}

const Page = ({ params }: { params: { id: string } }) => {
    const navigate = useRouter();
    const budgetId = params.id;

    const { budgets, previousBudget } = useBudgetStore();
    const budget = budgets.find((b) => b.id === budgetId);

    const [allIncomes, setIncomes] = useState<Income[]>(previousBudget?.incomes ?? []);

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

    const handleIncomeChange = (index: number, field: keyof Income, value: any) => {
        const updatedIncomes = [...allIncomes];
        updatedIncomes[index] = { ...updatedIncomes[index], [field]: value };
        setIncomes(updatedIncomes);
    };

    const handleSubmit = () => {

        const hasValidIncome = allIncomes.some((income) => income.name.trim() !== '' && income.amount > 0);
        if (!hasValidIncome) {
            toast.error('Oops.. you’ll need to add your income', {
                position: 'top-center',
                transition: Slide,
                autoClose: 2000,
                closeButton: false
            });

            return; // Prevent adding a new income
        }
        addIncomeToBudget(budgetId, allIncomes);
        navigate.push(`/budgets/new/expense/${budgetId}`);
    };

    const formatNumber = (num: number) => num.toLocaleString();

    const parseNumber = (value: string) => parseFloat(value.replace(/,/g, '')) || 0;

    const getInputWidth = (index: number) => {
        if (spanRefs.current[index]) {
            return `${Math.min(spanRefs.current[index]!.offsetWidth + 30, 140)}px`;
        }
        return '50px';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" w-[100vw] relative min-h-[100vh] max-w-[500px] bg-white"
        >
            <Header link='/budgets' title="Create new budget" />
            <ToastContainer />
            <div className='mt-[39.5px] mb-[140px] px-[24px] w-full'>
                <div className='flex gap-[8px]'>
                    <div className='bg-[#66C227] rounded-[10px] h-[8px] w-full'></div>
                    <div className='bg-[#EFEFF0] rounded-[10px] h-[8px] w-full'></div>
                </div>
                <p className='my-[24px] font-[500] text-[20px]'>Set your income</p>

                <div className='bg-[#F7F7F9] rounded-[20px] mb-5'>
                    <h1 className='text-[#575757] leading-[24px] p-4'>Income</h1>
                    <hr className='fill-white' />
                    <div className='grid grid-cols-1 max-h-[calc(65vh-140px)] px-4 pt-2 pb-3 space-y-3'>
                        <div className='overflow-y-auto overflow-x-hidden  max-h-[calc(65vh-140px)] '>
                            {allIncomes.map((income, index) => (
                                <form
                                    key={index} className="flex z-[100] relative  transition-all ease-in mt-[8px] items-center justify-between w-full gap-[8px]">
                                    <div className='flex items-center gap-3 w-full'>
                                        <Image src={moneyIcon} className='size-8' alt={'icon'} />
                                        <div className='text-[#514F6E] min-w-[100px] w-[80px] text-[14px] font-[500] inline-block'>
                                            <input
                                                className='bg-transparent outline-[#66C227] px-2 w-full text-ellipsis overflow-hidden whitespace-nowrap'
                                                type="text"
                                                placeholder='Enter income'
                                                onChange={(e) => handleIncomeChange(index, 'name', e.target.value)}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                value={income.name}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex items-start'>
                                        <div className='bg-white rounded-[8px] py-[4px] px-[8px] items-center flex  gap-[0px]'>
                                            <h2>₦</h2>
                                            <div className="relative inline-block w-full">
                                                <input
                                                    value={formatNumber(income.amount)}
                                                    onChange={(e) => handleIncomeChange(index, 'amount', parseNumber(e.target.value))}
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
                                                    {formatNumber(income.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ))}
                        </div>
                        <button onClick={handleAddIncome} className='flex gap-x-4 items-center hover:scale-105'>
                            <Image src={addAnotherIcon} className='size-8' alt={'icon'} />
                            <span className='text-[#514F6E] text-[14px] font-[500]'>Add Another</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className='p-[24px] max-w-[500px] mt-[12rem] fixed  z-10 bg-[#ffffffaa] backdrop-blur-lg bottom-0 w-[100%] border-t-[2px] border-t-[#EFF0F6]'>
                <div className="w-full">
                    <button onClick={() => handleSubmit()} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">
                        Proceed <BsArrowRight />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Page;
