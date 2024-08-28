'use client'
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsArrowRight, BsPlus } from 'react-icons/bs';
import { IIncome } from '@/app/Models';
import moneyIcon from '@/images/money.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {
    const navigate = useRouter()
    const prevIncomes: IIncome[] = [
        { index: 1, incomeType: 'Salary', amount: 0 },
    ];

    const [allIncomes, setIncomes] = useState<IIncome[]>(prevIncomes || []);
    const [anIncome, setIncome] = useState<IIncome>({
        index: 0,
        incomeType: '',
        amount: 0
    });
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleIncomeChange = (incomeIndex: number, field: 'amount' | 'incomeType', value: any) => {
        const updatedIncomes = allIncomes.map((income) =>
            income.index === incomeIndex ? { ...income, [field]: value } : income
        );
        setIncomes(updatedIncomes);
    };

    const addIncome = () => {
        try {
            // Add a new income
            setIncomes([...allIncomes, {
                index: allIncomes.length + 1,
                incomeType: '',
                amount: 0
            }]);

            // Focus on the new input
            setTimeout(() => {
                const newIndex = allIncomes.length;
                if (inputRefs.current[newIndex]) {
                    inputRefs.current[newIndex]?.focus();
                }
            }, 0);
        } catch (error) {
            console.log(error);
        }
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const parseNumber = (value: string) => {
        // Remove commas before parsing
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    const getInputWidth = (index: number) => {
        if (spanRefs.current[index]) {
            // Calculate width but cap it at 400px
            return `${Math.min(spanRefs.current[index]!.offsetWidth + 30, 400)}px`;
        }
        return '50px'; // Default minimum width
    };

    const handleSubmit = () => {
        navigate.push('/budgets/new/expense')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[100vw]"
        >
            <Header link='/budgets' title="Create new budget" />
            <div className='mt-[39.5px] mb-[140px] px-[24px] w-full'>
                <div className='flex gap-[8px]'>
                    <div className='bg-[#66C227] rounded-[10px] h-[8px] w-full'></div>
                    <div className='bg-[#EFEFF0] rounded-[10px] h-[8px] w-full'></div>
                </div>
                <p className='my-[24px] font-[500] text-[20px]'>Set your income</p>
                <div className='bg-[#F7F7F9] rounded-[20px] p-[16px]'>
                    <h1 className='text-[#575757] leading-[24px]'>Income</h1>
                    <div
                        className="flex hover:scale-105 transition-all ease-in border-t-[1px] border-t-[#EFF0F6] mt-[10px] items-center justify-between w-full gap-[8px]"
                    ></div>
                    {allIncomes.map((income, index) => (
                        <button
                            key={income.index}
                            className="flex hover:scale-105 transition-all ease-in  mt-[8px] items-center justify-between w-full gap-[8px]"
                        >
                            <div className='flex gap-[4px] w-full'>
                                <div className='grid place-content-center bg-[#01B0C5] rounded-[16px] text-white size-[28px]'>
                                    <Image src={moneyIcon} className='size-[12px]' alt={'icon'} width={1000} height={1000} />
                                </div>
                                <div className='text-[#514F6E] text-[14px] font-[500]'>
                                    <input
                                        className='bg-transparent'
                                        type="text"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleIncomeChange(income.index, 'incomeType', e.target.value)
                                        }
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        value={income.incomeType}
                                    />
                                </div>
                            </div>
                            <div className='flex items-start'>
                                <div className='bg-white rounded-[8px] py-[4px] px-[8px] flex items-start gap-[8px]'>
                                    ₦
                                    <div className="relative inline-block w-full">
                                        <input
                                            value={formatNumber(income.amount)}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleIncomeChange(income.index, 'amount', parseNumber(e.target.value))
                                            }
                                            type="text"
                                            className="  px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px] transition-all duration-200"
                                            style={{ width: getInputWidth(index) }}
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
                        </button>
                    ))}
                    <button
                        onClick={() => addIncome()}
                        className="flex hover:scale-110 transition-all ease-in border-t-[1px] border-t-[#EFF0F6] mt-[10px] items-center gap-[8px]"
                    >
                        <div className='grid place-content-center bg-[#01B0C5] rounded-[16px] text-white size-[28px]'>
                            <BsPlus />
                        </div>
                        <div className='text-[#514F6E] text-[14px] font-[500]'>Add Another</div>
                    </button>
                </div>
            </div>

            <div className='p-[24px] fixed z-10 bg-[#ffffffaa] backdrop-blur-lg bottom-0 w-full border-t-[2px] border-t-[#EFF0F6]'>
                <div className="w-full">
                    <button onClick={() => handleSubmit()} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Proceed <BsArrowRight /></button>
                </div>
            </div>

        </motion.div>
    );
};

export default Page;
