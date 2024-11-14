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
import { IAllocation, IBudget, ICreateCategory, IExpense, ISubAllocation } from '@/app/Types';
import { Budgets } from '@/app/data/DummyData';

import DeleteSuccessModal from '@/app/(dashboard)/components/DeleteSuccessModal';
import DeleteConfirmationModal from '@/app/(dashboard)/components/DeleteConfirmationModal';
import { createBudgetApi, createBudgetCategoryApi, getAllBudgetCategories, RecordExpenseApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CircularProgress } from '@nextui-org/react';

const Page = ({ params }: { params: { id: string } }) => {

    const prevIncomes = [
        { index: 1, incomeType: 'Salary', amount: 0 },
    ];
    const budgetId = params.id;
    const all_Budgets = useBudgetStore((state) => state.budgets);
    const currentBudget = all_Budgets.find((b) => b.id === budgetId);


    const [showSelectedBudget, setShowSelectedBudget] = useState<boolean>(false)
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false)
    const [showNewBudgetCategory, setShowNewBudgetCategory] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [selectedBudget, setSelectedBudget] = useState<any>()
    const [allBudgets, setAllBudgets] = useState<[]>([])
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const inputRefsExpense = useRef<(HTMLInputElement | null)[]>([]);
    const [allocations, setAllocations] = useState<IAllocation[]>([])
    const [updatedIndex, setUpdatedIndex] = React.useState<number | null>(null);
    const [updatedField, setUpdatedField] = React.useState<'subCategory' | 'amount' | null>(null);
    const [updatedValue, setUpdatedValue] = React.useState<string | null>(null);
    const [previousSubAllocations, setPreviousSubAllocations] = useState<ISubAllocation[]>([]);
    const { addAllocationToBudget, createBudgetCategory, createAllocation } = useBudgetStore();
    const [lastBudget, setLastBudget] = useState<IBudget | null>(null);
    const [categoryName, setCategoryName] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [isClient, setIsClient] = useState(false);
    const [triggered, setTriggered] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const queryClient = useQueryClient();


    const navigate = useRouter();
    const { authenticatedUser } = useAuthentication();

    const { getLastBudget, budgets, addToCategory, allCategories } = useBudgetStore((state) => ({
        getLastBudget: state.getLastBudget,
        budgets: state.budgets,
        allCategories: state.allCategories,
        addToCategory: state.addToCategory
    }))
    // console.log(budgets);





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


    const handleSubmit = async () => {
        try {
            setLoading(true)
            const createCategoryData = {
                name: categoryName,
                subCategories: [],
            };
            console.log(createCategoryData);
            await createCategoryMutation.mutateAsync(createCategoryData);
            setCategoryName('')
            setLoading(false)
            setShowNewBudgetCategory(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    };


    // Calculate income, expense, and percentage of income used
    const income = lastBudget?.incomes?.reduce((total, income) => total + income.amount, 0) || 0;
    const expense = 0;
    const incomeLeft = income - expense;

    // Calculate percentage of income used, capped at 100%
    const percentageIncomeUsed = income > 0 ? Math.min((expense / income) * 100, 100) : 0;
    const percentageIncomeLeft = 100 - percentageIncomeUsed; // Calculate remaining percentage
    console.log("Income:", income);
    console.log("Expense:", expense);
    console.log("Percentage of Income Used:", percentageIncomeUsed);
    console.log("Percentage of Income Left:", percentageIncomeLeft);

    const handleClose = () => {
        setShowSelectedBudget(false);
    };



    const createNewCategory = () => {
        try {
            handleSaveCategory()
            // createBudgetCategory(lastBudget?.id || '')
            // addToCategory({ name: categoryName, id: lastBudget?.id || '' }, lastBudget?.id || '')
            // setShowNewBudgetCategory(false)
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





    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredAmount = parseFloat(e.target.value.replace(/,/g, "")) || 0;  // Remove commas for parsing
        const cappedAmount = Math.min(enteredAmount, income);  // Cap the amount to not exceed income
        const percentage = income > 0 ? (cappedAmount / income) * 100 : 0;

        if (enteredAmount > income) {
            alert(`Your expense exceeds your total income for ${lastBudget?.name}`);
        }

        // Update the selected budget's amount and percentage
        setSelectedBudget((prev: any) => ({
            ...prev,
            amount: cappedAmount,
            percentage: Math.min(percentage, 100), // Cap the percentage at 100
        }));
    };
    // Triggers when the user leaves the input field.
    const handleBlur = (index: number) => {
        const subAllocation = selectedBudget?.subAllocations[index];
        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };
        if (subAllocation?.subCategory && subAllocation?.amount) {
            const data = {
                amount: subAllocation.amount,
                budgetCategoryId: selectedBudget?.uid,
                narration: subAllocation?.subCategory,
                date: getCurrentDate()

            }

        }
        setFocusedIndex(null); // Reset focus tracking
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
        const newSubAllocation: ISubAllocation = {
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
        if (selectedBudget && (!selectedBudget.subAllocations || selectedBudget.subAllocations.length === 0)) {
            const defaultSubAllocation: ISubAllocation = {
                subCategory: '',
                amount: 0,
            };

            setSelectedBudget((prevBudget: any) => ({
                ...prevBudget,
                subAllocations: [defaultSubAllocation],
            }));
        }
    }, [selectedBudget]);

    useEffect(() => {
        // console.log(selectedBudget);

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

        if (selectedBudget?.amount?.toLocaleString() === '') {
            alert('Assign amount/percentage of income for this category')
        }
        let newValue: string | number;

        if (field === 'amount') {
            // Trim and check for empty value
            const trimmedValue = value.trim();
            newValue = trimmedValue === '' ? '' : parseFloat(trimmedValue); // Keep empty string if input is empty

            // Check if the parsed value is a valid number
            if (newValue !== '' && isNaN(newValue as number)) return; // Exit if not a valid number
        } else {
            newValue = value; // For 'subCategory', use the value as-is
        }



        // Update sub-allocations
        const updatedSubAllocations = selectedBudget.subAllocations.map((subAllocation: ISubAllocation, i: number) => {
            if (i === index) {
                return {
                    ...subAllocation,
                    [field]: field === 'amount' ? (newValue as string) : (newValue as string)
                };
            }
            return subAllocation;
        });

        if (newValue > selectedBudget?.amount) {
            alert('its your expense is too high for your income')
        } else {
            setSelectedBudget((prevBudget: IBudget) => ({
                ...prevBudget,
                subAllocations: updatedSubAllocations
            }));
        }

        // Update the state

    };



    const {
        data: budgetCategoriesData = [],
        status: fetchStatus,
        isError,
        error,
    } = useQuery({
        queryKey: ['allBudgetCategories'],
        queryFn: () => getAllBudgetCategories(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
    });

    const budgetCategoriesArray = Array.isArray(budgetCategoriesData) ? budgetCategoriesData : [];

    console.log(budgetCategoriesData);


    const handleSaveCategory = async () => {
        try {
            // console.log(budgetCategoriesData)
            console.log(selectedBudget);
            // console.log(lastBudget);
            // console.log(allCategories);
            const data = {
                name: lastBudget?.name,
                purpose: lastBudget?.purpose,
                startDate: lastBudget?.startDate,
                endDate: lastBudget?.startDate,
                incomes: lastBudget?.incomes,
                allocations: [

                ]
            }

        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    // To initialize previousSubAllocations when component mounts or selectedBudget is first set
    useEffect(() => {
        if (selectedBudget) {
            setPreviousSubAllocations(selectedBudget.subAllocations);
        }
    }, [selectedBudget]);






    // Mutations
    const createCategoryMutation = useMutation({
        mutationFn: (data: any) => {
            if (authenticatedUser) {
                return createBudgetCategoryApi(data, authenticatedUser.token);
            }
            throw new Error("User is not authenticated");
        },
        onSuccess: (data: any) => {
            if (data?.success) {
                setLoading(false);
                console.log(data);
                const { success, message, ...rest } = data;
                console.log(rest.data);
            }
        },
        onError: (error: Error) => {
            console.error('Error creating category:', error);
            setLoading(false);
        },
    });




    // Mutations
    const CreateBudgetMutation = useMutation({
        mutationFn: (data: any) => {
            if (authenticatedUser) {
                return createBudgetApi(data, authenticatedUser.token);
            }
            throw new Error("User is not authenticated");
        },
        onSuccess: (data: any) => {
            if (data?.success) {
                setLoading(false);
                console.log(data);
                const { success, message, ...rest } = data;
                console.log(rest.data);
                navigate.push('/')
            }
        },
        onError: (error: Error) => {
            console.error('Error creating category:', error);
            setLoading(false);
        },
    });



    const handleCreateBudget = async () => {
        try {
            console.log(currentBudget);
            // navigate.push('/')
            const { id, budgetType, ...rest } = currentBudget || {};
            const newData = { ...rest, allocations: [] }
            console.log(newData);
            CreateBudgetMutation.mutateAsync(newData)
            navigate.push('/budgets')

        } catch (error) {
            console.log(error);

        }
    }


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

                    <div className="w-full bg-white rounded-[10px] mt-[8px] h-[8px] relative overflow-hidden">
                        {/* Progress Bar Background (remaining part) */}
                        <div
                            className="bg-white rounded-[10px] h-[8px] absolute top-0 left-0"
                            style={{ width: `${percentageIncomeUsed}%` }} // Remaining part
                        ></div>

                        {/* Progress Bar Foreground (filled part) */}
                        <div
                            className="bg-[#FB8417] rounded-[10px] h-[8px] relative"
                            style={{ width: `${percentageIncomeLeft}%` }} // Used part
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
            <div className={` bg-[#F7F7F9]  grid ${budgetCategoriesData?.length == 0 ? 'grid-cols-1' : 'grid-cols-1'}  gap-[12px] overflow-y-scroll overflow-x-hidden min-h-[322px] py-[16px] px-[24px] mb-[100px] `}>



                <div className={`grid ${fetchStatus === 'pending' || budgetCategoriesArray.length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-[16px]`}>
                    {fetchStatus === 'pending' ? (
                        // Loading State
                        <div key="loading" className="flex justify-center items-center py-[25px]">
                            <CircularProgress size="md" color="default" />
                        </div>
                    ) : (
                        <>
                            {budgetCategoriesArray.length === 0 ? (
                                // No Data State
                                <div className="w-full">
                                    <div className="py-[25px] w-full text-center flex flex-col gap-[8px] justify-center items-center px-[51px]">
                                        <Image src={noBudgetImg.src} width={1000} height={1000} className="size-[124px] mb-[8px]" alt="No Budget" />
                                        <h1 className="font-[500] leading-[24px]">You do not have any budget history yet.</h1>
                                        <h1 className="text-[14px] text-[#828282] leading-[16.8px]">Click the create button above to <br /> get started.</h1>
                                    </div>
                                </div>
                            ) : (
                                // Data Display
                                <>
                                    {budgetCategoriesArray.map((budget: any) => (
                                        <ul key={budget.id} className="budget-list grid grid-cols-1 gap-[16px] w-full">
                                            <li
                                                onClick={() => {
                                                    setShowSelectedBudget(!showSelectedBudget);
                                                    setSelectedBudget(budget);
                                                    console.log(budget);
                                                }}
                                                className="bg-white border border-[#EFEFF0] p-[12px] rounded-[20px] flex flex-col gap-[8px]"
                                            >
                                                <div
                                                    className="w-[20px] h-[20px] rounded-full"
                                                    style={{ backgroundColor: budget.color }}
                                                ></div>
                                                <h1 className="text-[12px]">{budget.name}</h1>
                                            </li>
                                        </ul>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>



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
                        <button onClick={() => handleSaveCategory()} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">save </button>

                        <button onClick={() => handleDeleteOfCategory('111')} className="btn w-full text-[#F5365C] rounded-[32px] px-[28px] py-[14px] bg-[#FBEDEF] flex items-center justify-center gap-[8px] font-[500]">Delete category</button>
                    </div>}
                    label={`${selectedBudget?.name}`}
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
                                        value={selectedBudget?.amount?.toLocaleString()}
                                        className=' bg-transparent mt-[4px]'
                                        type="text"
                                        name="amount"
                                        placeholder='enter amount'
                                        onChange={handleAmountChange}
                                    />
                                </div>
                                <div className='py-[12px] w-[90%] border-l px-[16px] border-l-[#E7E7EA]'>
                                    <h1 className=' text-[#828282] text-[12px] leading-[14.4px] '>Percentage</h1>
                                    <input
                                        className='bg-transparent mt-[4px]'
                                        type="text"
                                        name="percentage"
                                        value={
                                            selectedBudget && incomeLeft
                                                ? isNaN((selectedBudget.amount / incomeLeft) * 100)
                                                    ? '0'
                                                    : ((selectedBudget.amount / incomeLeft) * 100).toFixed(2)
                                                : '0'
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>


                            <div className='mt-[24px] h-[30vh] overflow-y-scroll p-[16px] bg-[#F7F7F9] border border-[#E7E7EA] rounded-[16px] w-full'>
                                {selectedBudget?.subAllocations?.map((eachSubAllocation: any, index: number) => (
                                    <button
                                        type='button'
                                        key={index} // Unique key for each item
                                        className="flex hover:shadow-sm hover:p-[8px] hover:rounded-md hover:font-semibold hover:bg-[#0a0a0a09] transition-all ease-in mt-[8px] items-center justify-between w-full gap-[8px]"
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
                                                    onChange={(e) => handleAllocationChange(index, 'subCategory', e.target.value)}
                                                    placeholder="Category"
                                                    className='bg-transparent w-full text-ellipsis overflow-hidden whitespace-nowrap'
                                                    onBlur={() => handleBlur(index)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className='bg-white rounded-[8px] py-[4px] px-[8px] flex items-start gap-[8px]'>
                                                ₦
                                                <div className="relative inline-block w-full">
                                                    <input
                                                        value={eachSubAllocation.amount ? eachSubAllocation.amount.toLocaleString('en-US') : ''}
                                                        onBlur={() => handleBlur(index)}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = e.target.value;
                                                            const numericValue = value.replace(/[^0-9.]/g, ''); // Keep only numbers and decimal point
                                                            const cleanedValue = numericValue.replace(/(\..*)\..*/g, '$1'); // Allow only one decimal point
                                                            const finalValue = cleanedValue === '' ? '' : parseFloat(cleanedValue).toString();
                                                            handleAllocationChange(index, 'amount', finalValue);
                                                        }}
                                                        type="text" // Change to text to allow formatted input
                                                        inputMode="decimal"
                                                        pattern="[0-9]*[.,]?[0-9]*"
                                                        onWheel={(e) => e.currentTarget.blur()}
                                                        className="px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                        style={{ width: '140px', maxWidth: '140px' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}


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
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    >

                        <BottomDrawer
                            footer={<button type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">

                                {loading ?
                                    <div className=' flex gap-2 items-center justify-center mx-auto w-full'>
                                        <CircularProgress color='default' size='sm' />

                                    </div> : 'Save'}
                            </button>}
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
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
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
                    <button onClick={() => handleCreateBudget()} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">
                        {CreateBudgetMutation.isPending
                            ?

                            'creating budget...'
                            :
                            <>
                                Proceed
                                <BsArrowRight />
                            </>
                        }
                    </button>
                </div>
            </div>


        </motion.div >
    );
};

export default Page;
