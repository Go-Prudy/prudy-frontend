'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsArrowRight, BsPlus } from 'react-icons/bs';
import moneyIcon from '@/images/money.png';
import noBudgetImg from '@/images/List 2.webp'

import Image from 'next/image';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useRouter } from 'next/navigation';
import warninglogo from '@/images/warn.gif'
import Successlogo from '@/images/success.gif'
import { useBudgetStore } from '@/app/store/Store';
import { Allocation, Budget, Budget as IBudget, SubAllocation } from '@/app/Types';
import { Budgets } from '@/app/data/DummyData';

import DeleteSuccessModal from '@/app/(dashboard)/components/DeleteSuccessModal';
import DeleteConfirmationModal from '@/app/(dashboard)/components/DeleteConfirmationModal';

const Page = () => {

    const prevIncomes = [
        { index: 1, incomeType: 'Salary', amount: 0 },
    ];

    const [showSelectedBudget, setShowSelectedBudget] = useState<boolean>(false)
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false)
    const [showNewBudgetCategory, setShowNewBudgetCategory] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [selectedBudget, setSelectedBudget] = useState<Budget | any>()
    const [allBudgets, setAllBudgets] = useState<IBudget[]>(Budgets || [])
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const inputRefsExpense = useRef<(HTMLInputElement | null)[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([])
    const [updatedIndex, setUpdatedIndex] = React.useState<number | null>(null);
    const [updatedField, setUpdatedField] = React.useState<'subCategory' | 'amount' | null>(null);
    const [updatedValue, setUpdatedValue] = React.useState<string | null>(null);
    const [previousSubAllocations, setPreviousSubAllocations] = useState<SubAllocation[]>([]);


    const navigate = useRouter();
    const { getLastBudget } = useBudgetStore((state) => ({
        getLastBudget: state.getLastBudget,
    }))

    const { addAllocationToBudget, createAllocation } = useBudgetStore();

    const [lastBudget, setLastBudget] = useState<IBudget | null>(null);


    useEffect(() => {
        const fetchedLastBudget = getLastBudget();
        if (fetchedLastBudget) {
            setLastBudget(fetchedLastBudget);
        } else {
            setLastBudget(null);
        }
        console.log(fetchedLastBudget);
    }, [getLastBudget]);


    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const parseNumber = (value: string) => {
        // Remove commas before parsing
        return parseFloat(value.replace(/,/g, '')) || 0;
    };

    const getInputWidth = (index: number) => {
        if (spanRefs.current[index]) {
            // Calculate width but cap it at 100px
            return `${Math.min(spanRefs.current[index]!.offsetWidth + 30, 140)}px`;
        }
        return '50px'; // Default minimum width
    };


    const handleSubmit = () => {
        navigate.push('/budgets/new/expense');
    };

    const income = lastBudget?.incomes?.reduce((total, income) => total + income.amount, 0) || 0;
    const expense = 0;
    const incomeLeft = income - expense;
    const percentageIncomeLeft = (incomeLeft / income) * 100;
    const percentageIncomeUsed = 100 - percentageIncomeLeft;


    const handleClose = () => {
        setShowSelectedBudget(false);
    };



    const createNewCategory = () => {
        try {
            createAllocation(selectedBudget.category, selectedBudget.category, selectedBudget)
            setShowNewBudgetCategory(false)
        } catch (error) {
            console.log(error);

        }
    }

    const handleSaveCategory = (id: string) => {
        try {
            setShowSelectedBudget(!showSelectedBudget)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteOfCategory = (id: string) => {
        try {
            setShowDeleteModal(!showDeleteModal)
        } catch (error) {
            console.log(error);
        }
    }


    const handleDeleteCategoryById = (id: string) => {
        try {
            setShowDeleteModal(!showDeleteModal)
            setShowDeleteSuccessModal(!showDeleteSuccessModal)
        } catch (error) {
            console.log(error);

        }
    }



    // Format number to 2 decimal places and add '%' symbol
    // Ensure percentage is a number and format to 2 decimal places with '%' symbol
    const formatPercentage = (percentage: number) => {
        const percentageNumber = Number(percentage); // Ensure percentage is a number
        return `${percentageNumber.toFixed(2)}%`;
    };


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = parseFloat(e.target.value) || 0;
        const percentage = income > 0 ? (amount / income) * 100 : 0;

        if (amount > income) {
            alert(`Your expense is higher than your total income for ${lastBudget?.name}`);
        } else {
            setSelectedBudget((prev: any) => ({
                ...prev,
                amount: amount > income ? income : amount,
                percentage: percentage > 100 ? 100 : percentage,
            }));
        }



    };

    // Handle percentage change and update amount
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const percentage = parseFloat(e.target.value.replace('%', '')) || 0;
        const amount = income > 0 ? (percentage / 100) * income : 0;
        setSelectedBudget((prev: any) => ({
            ...prev,
            percentage: percentage > 100 ? 100 : percentage,
            amount: amount > income ? income : amount,
        }));
    };

    const addSubAllocation = () => {
        if (!selectedBudget) return;

        // Create a new sub-allocation with default values
        const newSubAllocation: SubAllocation = {
            subCategory: '',
            amount: 0,
        };

        // Update the selected budget with the new sub-allocation
        setSelectedBudget({
            ...selectedBudget,
            subAllocations: [...(selectedBudget.subAllocations || []), newSubAllocation],
        });
    };

    // Validate amount to ensure it does not exceed total income
    useEffect(() => {
        if (selectedBudget?.amount > income) {
            alert(`Your expense is higher than your total income for ${lastBudget?.name}`);
            setSelectedBudget((prev: any) => ({
                ...prev,
                amount: income,
            }));
        }
    }, [selectedBudget?.amount, income]);

    useEffect(() => {
        console.log(selectedBudget);

        if (selectedBudget?.amount > income) {
            alert(`Your expense is higher than your total income for ${lastBudget?.name}`);
            setSelectedBudget((prev: any) => ({
                ...prev,
                amount: income,
            }));
        }
    }, [selectedBudget?.amount, income]);



    // Function to call when allocation changes
    const handleAllocationChange = (index: number, field: 'subCategory' | 'amount', value: string) => {
        if (!selectedBudget) return;

        let newValue: string | number;

        if (field === 'amount') {
            // Allow empty input to be treated as 0, or parse the number if present
            const trimmedValue = value.trim();
            newValue = trimmedValue === '' ? 0 : parseFloat(trimmedValue);

            // Check if the parsed value is a valid number
            if (isNaN(newValue)) return;
        } else {
            // For 'subCategory', we just use the value as-is
            newValue = value;
        }

        // Update sub-allocations with the new value
        const updatedSubAllocations = selectedBudget.subAllocations.map((subAllocation: SubAllocation, i: number) => {
            if (i + 1 === index) {
                return {
                    ...subAllocation,
                    [field]: field === 'amount' ? (newValue as number) : (newValue as string)
                };
            }
            return subAllocation;
        });

        // Temporarily update the state with the new sub-allocations
        setSelectedBudget((prevBudget: IBudget) => ({
            ...prevBudget,
            subAllocations: updatedSubAllocations
        }));
    };


    useEffect(() => {
        if (!selectedBudget) return;

        // Calculate the current total amount of all sub-allocations
        const currentTotal = selectedBudget.subAllocations.reduce(
            (acc: number, sub: SubAllocation) => acc + (sub.amount || 0), 0
        );

        // Check if the new total exceeds the budget
        if (currentTotal > selectedBudget.amount) {
            alert(`Total expenses exceed the budget for ${selectedBudget.budgetCategory}. Please adjust your allocations.`);

            // Revert the sub-allocations to the previous state
            setSelectedBudget((prevBudget: IBudget) => ({
                ...prevBudget,
                subAllocations: previousSubAllocations
            }));
        } else {
            // Update previousSubAllocations if the total is within budget
            setPreviousSubAllocations(selectedBudget.subAllocations);
        }

    }, [selectedBudget]); // Dependency array ensures useEffect runs whenever selectedBudget changes

    // To initialize previousSubAllocations when component mounts or selectedBudget is first set
    useEffect(() => {
        if (selectedBudget) {
            setPreviousSubAllocations(selectedBudget.subAllocations);
        }
    }, [selectedBudget]);
    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[100vw]"
        >
            <Header link={`/budgets/new/income/${lastBudget?.id}`} title="Create new budget" />
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
                        <button onClick={() => setShowNewBudgetCategory(true)} className=' bg-[#EFEFF0] font-[500] text-[12px] rounded-[32px] py-[4px] px-[8px] flex gap-[4px] items-center '> <BsPlus size={20} /> Create new</button>
                    </div>
                </div>


            </div>


            {/* CATEGORIES  OR ALLOCATIONS */}
            <div className={` bg-[#F7F7F9]  grid ${allBudgets.length == 0 ? 'grid-cols-1' : 'grid-cols-2'}  gap-[12px] overflow-y-scroll overflow-x-hidden h-[322px] py-[16px] px-[24px] mb-[100px] `}>
                {allBudgets.length == 0 ?
                    <div className=' w-full'>
                        <div className='py-[25px] w-full text-center flex-col gap-[8px] flex justify-center items-center px-[51px]'>
                            <Image src={noBudgetImg.src} width={1000} height={1000} className=' size-[124px] mb-[8px]' alt="" />
                            <h1 className=' font-[500] leading-[24px] '>You do not have any budget history yet.</h1>
                            <h1 className=' text-[14px] text-[#828282] leading-[16.8px]'>Click the create button above to <br /> get started.</h1>

                        </div>

                    </div>

                    :
                    <>
                        {allBudgets.map((budget: IBudget) => (
                            budget.allocations?.map((allocation: Allocation) => (
                                <li
                                    key={allocation.budgetCategory}
                                    onClick={() => {
                                        setShowSelectedBudget(!showSelectedBudget)
                                        setSelectedBudget(allocation)

                                    }}
                                    className="bg-white border border-[#EFEFF0] p-[12px] rounded-[20px] flex flex-col gap-[8px]"
                                >
                                    <div
                                        className="w-[20px] h-[20px] rounded-full"
                                        style={{ backgroundColor: allocation.color }}
                                    ></div>
                                    <h1 className="text-[12px]">{allocation.budgetCategory}</h1>
                                    <h1 className="font-[500] text-[14px]">₦ {allocation.amount}</h1>
                                </li>
                            ))

                        ))}

                    </>}
            </div>


            {/*  INDIVIDUAL EXPENSE OR ALLOCATION */}
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
                        <button onClick={() => handleSaveCategory('111')} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">save </button>

                        <button onClick={() => handleDeleteOfCategory('111')} className="btn w-full text-[#F5365C] rounded-[32px] px-[28px] py-[14px] bg-[#FBEDEF] flex items-center justify-center gap-[8px] font-[500]">Delete category</button>
                    </div>}
                    label={`${selectedBudget?.budgetCategory}`}
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
                                        onChange={handleAmountChange}
                                    />
                                </div>
                                <div className='py-[12px] w-[90%] border-l px-[16px] border-l-[#E7E7EA]'>
                                    <h1 className=' text-[#828282] text-[12px] leading-[14.4px] '>Percentage</h1>
                                    <input
                                        value={formatPercentage(selectedBudget?.percentage || 0)}
                                        className=' bg-transparent mt-[4px]'
                                        type="text"
                                        name="percentage"
                                        onChange={handlePercentageChange}
                                    />
                                </div>
                            </div>

                            <div className=' mt-[24px] h-[30vh] overflow-y-scroll p-[16px] bg-[#F7F7F9]  border border-[#E7E7EA]  rounded-[16px]  w-full '>
                                <>
                                    {selectedBudget?.subAllocations?.map((eachSubAllocation: any, index: number) => (
                                        <button
                                            type='button'
                                            key={index + 1}
                                            className="flex hover:scale-105 transition-all ease-in mt-[8px] items-center justify-between w-full gap-[8px]"
                                        >
                                            <div className='flex gap-[4px] w-full'>
                                                <div
                                                    style={{ backgroundColor: selectedBudget?.color }}
                                                    className='grid place-content-center rounded-[16px] text-white size-[28px]'
                                                >
                                                    <Image src={moneyIcon} className="size-[12px]" alt={'icon'} width={1000} height={1000} />
                                                </div>
                                                <div className='text-[#514F6E] min-w-[100px] w-[80px] text-[14px] font-[500] inline-block'>
                                                    <input
                                                        value={eachSubAllocation.subCategory || ''}
                                                        onChange={(e) => handleAllocationChange(index + 1, 'subCategory', e.target.value)}
                                                        placeholder="Category"
                                                        className='bg-transparent w-full text-ellipsis overflow-hidden whitespace-nowrap'
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className='bg-white rounded-[8px] py-[4px] px-[8px] flex items-start gap-[8px]'>
                                                    ₦
                                                    <div className="relative inline-block w-full">
                                                        <input
                                                            value={isNaN(eachSubAllocation.amount) ? '' : formatNumber(eachSubAllocation.amount)}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const value = e.target.value;
                                                                const numericValue = value.replace(/[^0-9.]/g, ''); // Keep only numbers and decimal point
                                                                const cleanedValue = numericValue.replace(/(\..*)\..*/g, '$1'); // Allow only one decimal point

                                                                // Ensure the value is a valid number or empty string
                                                                const finalValue = cleanedValue === '' ? '' : parseFloat(cleanedValue).toString();

                                                                handleAllocationChange(index + 1, 'amount', finalValue);
                                                            }}
                                                            type="text"
                                                            inputMode="decimal"
                                                            pattern="[0-9]*[.,]?[0-9]*"
                                                            onWheel={(e) => e.currentTarget.blur()}
                                                            className="px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                            style={{ width: '140px', maxWidth: '140px' }}
                                                        />
                                                        <span
                                                            ref={(el) => {
                                                                spanRefs.current[index] = el;
                                                            }}
                                                            className="absolute invisible whitespace-pre"
                                                        >
                                                            {formatNumber(eachSubAllocation.amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                </>


                                <button
                                    onClick={addSubAllocation} // Call addSubAllocation when clicked
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


            {/* MODAL TO DELETE CATEGORY */}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    showDeleteModal={showDeleteModal}
                    setShowDeleteModal={setShowDeleteModal}
                    handleDeleteCategoryById={handleDeleteCategoryById}
                    categoryId="your-category-id" // Pass the specific category ID here
                />
            )}

            {showDeleteSuccessModal &&
                <DeleteSuccessModal
                    showModal={showDeleteSuccessModal}
                    setShowModal={setShowDeleteSuccessModal}
                    handleAction={() => handleDeleteCategoryById('category-id')}
                    handleClose={handleClose}
                    text='Delete Successfully'
                />

            }




            {/* TO CREATE A NEW CATEGORY */}
            {showNewBudgetCategory &&

                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >
                    <form onSubmit={handleSubmit}>

                        <BottomDrawer
                            footer={<button onClick={() => createNewCategory()} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Save</button>}
                            label="Create budget category"
                            back={false}
                            show={showNewBudgetCategory}
                            close={true}
                            onClose={() => setShowNewBudgetCategory(false)}
                        >

                            <div className="relative w-full mb-4">
                                <div className='  z-[10]  flex w-[90%] absolute top-[30px]  left-4 text-xs justify-between items-center'>
                                    <label htmlFor={'Name of category'} className=" text-[#828282]">
                                        Name of category
                                    </label>
                                    <div
                                        className="w-[20px] h-[20px] rounded-full"
                                        style={{ backgroundColor: '#BEB8FF' }}
                                    ></div>
                                </div>

                                <input
                                    type={'text'}
                                    name={'Name of category'}
                                    id={'Name of category'}
                                    required={true}
                                    placeholder={'Enter name'}
                                    className={`bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 }`}
                                />
                            </div>
                        </BottomDrawer>
                    </form>
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
