'use client'
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsArrowRight, BsPlus } from 'react-icons/bs';
import { IExpense, IIncome } from '@/app/Models';
import moneyIcon from '@/images/money.png';
import Image from 'next/image';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useRouter } from 'next/navigation';

const Page = () => {
    const categories = [
        {
            id: 1,
            text: 'Housing',
            amount: '200000',
            color: '#01B0C5',
            percentage: '20%',
            isSelected: false,
            data: [{ type: 'Rent', amount: '400' }],
        },
        {
            id: 2,
            text: 'Food',
            amount: '',
            color: '#FB8417',
            percentage: '15%',
            isSelected: false,
            data: [{ type: 'Groceries', amount: '200' }],
        },
        {
            id: 3,
            text: 'Transportation',
            amount: '',
            color: '#A858EE',
            percentage: '10%',
            isSelected: false,
            data: [{ type: 'Gas', amount: '100' }],
        },
        {
            id: 4,
            text: 'Savings',
            amount: '',
            color: '#F18987',
            percentage: '15%',
            isSelected: false,
            data: [{ type: 'Emergency Fund', amount: '150' }],
        },
        {
            id: 5,
            text: 'Education',
            amount: '',
            color: '#F18987',
            percentage: '10%',
            isSelected: false,
            data: [{ type: 'Tuition', amount: '100' }],
        },
        {
            id: 6,
            text: 'Tithe',
            amount: '',
            color: '#99DFAD',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Church Donation', amount: '50' }],
        },
        {
            id: 7,
            text: 'Generosity',
            amount: '',
            color: '#6F6C8F',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Charity', amount: '50' }],
        },
        {
            id: 8,
            text: 'Emergency funds',
            amount: '',
            color: '#E3B53C',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Unexpected Expenses', amount: '50' }],
        },
        {
            id: 9,
            text: 'Personal',
            amount: '',
            color: '#FDC1C1',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Leisure', amount: '50' }],
        },
        {
            id: 10,
            text: 'Miscellaneous',
            amount: '',
            color: '#66C227',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Other Expenses', amount: '50' }],
        },
        {
            id: 11,
            text: 'Utilities',
            amount: '',
            color: '#338BD4',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Electricity', amount: '50' }],
        },
        {
            id: 12,
            text: 'Health',
            amount: '',
            color: '#BEB8FF',
            percentage: '5%',
            isSelected: false,
            data: [{ type: 'Medical Bills', amount: '50' }],
        },
    ];


    const prevIncomes: IIncome[] = [
        { index: 1, incomeType: 'Salary', amount: 0 },
    ];


    const [allExpenses, setExpenses] = useState<IExpense[]>([]);
    const [showSelectedBudget, setShowSelectedBudget] = useState<boolean>(false)
    const [selectedBudget, setSelectedBudget] = useState<any>()
    const [anExpense, setExpense] = useState<IExpense>({
        index: 0,
        type: '',
        amount: 0,
    });




    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const spanRefsExpense = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRefsExpense = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useRouter();

    const handleExpenseChange = (
        expenseIndex: number,
        field: 'amount' | 'type',
        value: any
    ) => {
        // Update the selected budget's data array
        const updatedData = selectedBudget?.data.map((expense: any, index: number | string) =>
            index === expenseIndex ? { ...expense, [field]: value } : expense
        ) || [];

        // Update the selectedBudget state with the modified data
        setSelectedBudget((prevBudget: any) => ({
            ...prevBudget,
            data: updatedData,
        }));
    };



    const addExpense = () => {
        try {
            if (selectedBudget) {
                // Add a new entry to the selected budget's data array
                const updatedBudget = {
                    ...selectedBudget,
                    data: [
                        ...selectedBudget.data,
                        { type: '', amount: '' }, // Add a new empty entry for type and amount
                    ],
                };

                // Update the selectedBudget state with the updated budget
                setSelectedBudget(updatedBudget);
            }

            setTimeout(() => {
                const newIndex = (selectedBudget?.data.length || 0) - 1;
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
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    const getInputWidth = (index: number) => {
        const ref = spanRefs.current[index];
        if (ref) {
            return `${Math.min(ref.offsetWidth + 30, 400)}px`;
        }
        return '50px';
    };

    const handleSubmit = () => {
        navigate.push('/budgets/new/expense');
    };




    const income = 1245679;
    const expense = 9520;
    const incomeLeft = income - expense;
    const percentageIncomeLeft = (incomeLeft / income) * 100;
    const percentageIncomeUsed = 100 - percentageIncomeLeft;

    const handleClose = () => {
        setShowSelectedBudget(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[100vw]"
        >
            <Header link='/budgets' title="Create new budget" />
            <div className='mt-[39.5px]  px-[24px] w-full'>
                <div className='flex gap-[8px]'>
                    <div className='bg-[#66C227] rounded-[10px] h-[8px] w-full'></div>
                    <div className='bg-[#66C227] rounded-[10px] h-[8px] w-full'></div>
                </div>
                <p className='mt-[24px] mb-[16px] font-[500] text-[20px]'>Set your Expenses</p>
                <div className='bg-[#F7F7F9] rounded-[20px] p-[16px]'>
                    <h1 className='text-[#131313] font-[500] leading-[24px]'>  ₦ {incomeLeft.toLocaleString()}
                        <span className=' text-[#575757] text-[12px] font-[400] leading-[16px] mx-[8px]'>left of income</span>
                    </h1>

                    <div className="w-full bg-white rounded-[10px] mt-[8px] h-[8px]">
                        {/* Progress Bar Background (remaining part) */}
                        <div
                            className="bg-[#FB8417] rounded-[10px] h-[8px]"
                            style={{ width: `${percentageIncomeUsed}%` }}
                        ></div>
                        {/* Progress Bar Foreground (filled part) */}
                        <div
                            className="bg-white rounded-[10px] h-[8px] absolute top-0 left-0"
                            style={{ width: `${percentageIncomeLeft}%` }}
                        ></div>
                    </div>
                </div>

                <div className=' my-[16px]  w-full'>
                    <div className=' w-full flex justify-between'>
                        <h1 className=' font-[500] leading-[28px]'>Budget Categories</h1>
                        <button className=' bg-[#EFEFF0] font-[500] text-[12px] rounded-[32px] py-[4px] px-[8px] flex gap-[4px] items-center '> <BsPlus size={20} /> Create new</button>
                    </div>
                </div>


            </div>


            {/* CATEGORIES */}
            <div className=' bg-[#F7F7F9]  grid grid-cols-2 gap-[12px] overflow-y-scroll overflow-x-hidden h-[322px] py-[16px] px-[24px] mb-[100px] '>
                {categories.map((category, index) => (
                    <li
                        key={index}
                        onClick={() => {
                            setShowSelectedBudget(!showSelectedBudget)
                            setSelectedBudget(category)

                        }}

                        className="bg-white border border-[#EFEFF0] p-[12px] rounded-[20px] flex flex-col gap-[8px]"
                    >
                        <div
                            className="w-[20px] h-[20px] rounded-full"
                            style={{ backgroundColor: category.color }}
                        ></div>
                        <h1 className="text-[12px]">{category.text}</h1>
                        <h1 className="font-[500] text-[14px]">₦ {category.amount}</h1>
                    </li>
                ))}
            </div>
            {
                showSelectedBudget &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                > <BottomDrawer
                    footer={<div className="w-full grid gap-y-[16px]">
                        <button className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">save </button>

                        <button className="btn w-full text-[#F5365C] rounded-[32px] px-[28px] py-[14px] bg-[#FBEDEF] flex items-center justify-center gap-[8px] font-[500]">Delete category</button>
                    </div>}
                    label={`${selectedBudget.text}`}
                    back={false}
                    show={showSelectedBudget}
                    close={true}
                    onClose={handleClose}
                >
                        <form action="" className='w-full  ' method="post">
                            <h1 className=' font-[500] leading-[20px]'>
                                Assign amount/percentage of income for this category
                            </h1>
                            <div className='px-[16px] bg-[#F7F7F9] mt-[8px] border border-[#E7E7EA] rounded-[16px] grid grid-cols-2 w-full'>
                                <div className='py-[12px]'>
                                    <h1 className=' text-[#828282] text-[12px] leading-[14.4px] '>Amount</h1>
                                    <input
                                        value={selectedBudget?.amount || ''}
                                        className=' bg-transparent mt-[4px]'
                                        type="text"
                                        name="amount"
                                        onChange={(e) => {
                                            const updatedBudget = {
                                                ...selectedBudget,
                                                amount: e.target.value,
                                            };
                                            setSelectedBudget(updatedBudget);
                                        }}
                                    />
                                </div>
                                <div className='py-[12px] w-[90%] border-l px-[16px] border-l-[#E7E7EA]'>
                                    <h1 className=' text-[#828282] text-[12px] leading-[14.4px] '>Percentage</h1>
                                    <input
                                        value={selectedBudget?.percentage || ''}
                                        className=' bg-transparent mt-[4px]'
                                        type="text"
                                        name="percentage"
                                        onChange={(e) => {
                                            const updatedBudget = {
                                                ...selectedBudget,
                                                percentage: e.target.value,
                                            };
                                            setSelectedBudget(updatedBudget);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className=' mt-[24px] h-[30vh] overflow-y-scroll p-[16px] bg-[#F7F7F9]  border border-[#E7E7EA]  rounded-[16px]  w-full '>
                                <>


                                    {selectedBudget?.data.map((expense: any, index: number) => (
                                        <button
                                            type='button'
                                            key={index}
                                            className="flex hover:scale-105 transition-all ease-in mt-[8px] items-center justify-between w-full gap-[8px]"
                                        >
                                            <div className="flex items-center gap-[4px] w-full">
                                                <div
                                                    className="grid place-content-center rounded-[16px] text-white size-[28px]"
                                                    style={{ backgroundColor: selectedBudget?.color }}
                                                >
                                                    <Image src={moneyIcon} className="size-[12px]" alt={'icon'} width={1000} height={1000} />
                                                </div>
                                                <div className="text-[#514F6E] text-[14px] font-[500]">
                                                    <input
                                                        value={expense.type || ''}
                                                        onChange={(e) => handleExpenseChange(index, 'type', e.target.value)}
                                                        placeholder="Type"
                                                        className='bg-transparent  px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px] transition-all duration-200'
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="bg-transparent rounded-[8px] py-[4px] px-[8px] flex items-start gap-[8px]">
                                                    ₦
                                                    <div className="relative inline-block w-full">
                                                        <input
                                                            value={expense.amount || ''}
                                                            onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                                                            placeholder="Amount"
                                                            className=" bg-transparent  px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px] transition-all duration-200"
                                                        />
                                                        <span className="absolute bg-transparent invisible whitespace-pre">
                                                            {expense.amount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                </>


                                <button
                                    onClick={addExpense}
                                    type='button'
                                    className="flex hover:scale-110 transition-all ease-in border-t-[1px] border-t-[#EFF0F6] mt-[10px] items-center gap-[8px]"
                                >
                                    <div className="grid place-content-center rounded-[16px] text-white size-[28px]" style={{ backgroundColor: selectedBudget?.color }}>
                                        <BsPlus />
                                    </div>
                                    <div className="text-[#514F6E] text-[14px] font-[500]">Add Another </div>
                                </button>



                            </div>
                        </form>
                    </BottomDrawer>
                </motion.div>

            }
            <div className='p-[24px] fixed z-10 bg-[#ffffffaa] backdrop-blur-lg bottom-0 w-full border-t-[2px] border-t-[#EFF0F6]'>
                <div className="w-full">
                    <button className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Proceed <BsArrowRight /></button>
                </div>
            </div>


        </motion.div >
    );
};

export default Page;
