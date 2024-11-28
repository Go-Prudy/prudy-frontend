'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsChevronDown } from 'react-icons/bs';
import BudgetChart from '@/app/(dashboard)/components/DoughnutChart';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { GetAllBudgetsApi, getBudgetDistributionApi, getSingleBudgetApi } from '@/app/services/BudgetService';
import { CircularProgress } from '@nextui-org/react';
import Image from 'next/image';
import noBudgetImg from '@/images/List 2.webp'
import { Line } from 'react-chartjs-2';

const Page = ({ params }: { params: { id: string } }) => {


    interface Category {
        uid: number;
        name: string;
    }
    const { authenticatedUser } = useAuthentication();


    const { data: budgets = [], isLoading, isPending: isBudgetsPending, error } = useQuery({
        queryKey: ['allBudgetCategories'],
        queryFn: () => GetAllBudgetsApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        staleTime: 5 * 60 * 1000
    });

    const { data: singlebudget, status: singleBudgetStatus, isPending: isSingleBudgetsPending } = useQuery({
        queryKey: ['allBudgetCategories'],
        queryFn: () => getSingleBudgetApi(authenticatedUser?.token ?? '', params.id),
        enabled: !!authenticatedUser?.token,
        staleTime: 5 * 60 * 1000
    });

    console.log(singlebudget);


    const monthlyBudget = budgets?.length > 0
        ? budgets
        : [{ name: 'No Budget', percentage: 8, color: '#FF6384' }]; // Default fallback


    // Set the initial selected month as the first budget item (or fallback if no data)
    const [selectedCategories, setSelectedCategories] = useState<number[]>([1]);
    const [selectedMonth, setSelectedMonth] = useState(budgets.length > 0 ? budgets[0] : { name: 'No Budget', percentage: 8, color: '#FF6384' });
    const [selectedUid, setSelectedUid] = useState<string>(params.id)

    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showBudget, setShowBudget] = useState<boolean>(false);






    const handleClose = () => {
        setShowCategories(false);
    };


    interface Distribution {
        name: string;
        percentage: number;
    }

    interface BudgetProps {
        data: {
            totalBudget: number;
            distributions: Distribution[];
        };
    }

    const { data: budgetDistributionData, status: distributionStatus, isPending } = useQuery({
        queryKey: ['budgetDistribution', selectedUid ? selectedUid : 0],
        queryFn: () => getBudgetDistributionApi(authenticatedUser?.token ?? '', selectedUid),
        enabled: !!authenticatedUser?.token && !!selectedUid,
        staleTime: 5 * 60 * 1000
    });

    console.log(budgetDistributionData);


    useEffect(() => {
        if (budgets?.length > 0) {
            setSelectedMonth(budgets[0] || [])
        }

    }, [isBudgetsPending])


    // Function to generate a unique random color
    const generateUniqueColors = (count: number): string[] => {
        const colors = new Set<string>();

        while (colors.size < count) {
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            colors.add(color);
        }

        return Array.from(colors);
    };

    const colors = generateUniqueColors(budgetDistributionData?.distributions.length);

    // Map `distributions` and assign a unique color to each category
    const budgetCategories = budgetDistributionData?.distributions?.map((item: any, index: number) => ({
        ...item,
        color: colors[index],
    })) || [];

    console.log(budgetCategories);


    const categories: Category[] = [
        { uid: 1, name: 'All categories' }, // Default category
        ...budgetDistributionData?.data?.distributions?.map((item: Category, index: number) => ({
            name: item.name,
            uid: item.uid || index, // Use uid if available
        })) || []
    ];


    const toggleCategory = (uid: number) => {
        console.log(uid);
        if (uid === 1) { // If "All categories" is clicked  
            if (selectedCategories.length === categories.length) {
                // If all are selected, deselect all  
                setSelectedCategories([1]);


            } else {
                // Select all categories  

                setSelectedCategories(categories.map((category) => category.uid).filter(uid => uid !== 1)); // Exclude All categories from selection
            }
        } else {
            console.log(uid);
            // For individual categories  
            setSelectedCategories((prev) =>
                prev.includes(uid) ? prev.filter((categoryId) => categoryId !== uid) : [...prev, uid]
            );
        }
    };




    const filteredCategories = selectedCategories.length === 0 || selectedCategories.includes(1)
        ? categories // If none are selected or "All categories" is selected, show everything
        : budgetDistributionData?.distributions?.filter((category: Category) => selectedCategories.includes(category.uid)); // Show selected categories


    useEffect(() => {
        if (selectedMonth) {
            // This will run whenever `selectedMonth` is updated
            console.log('Selected Month:', selectedMonth.name);
            console.log('Selected id:', selectedUid);
        }
    }, [selectedMonth, selectedCategories]); // The effect runs whenever `selectedMonth` changes


    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[100vw]  "
            >
                <Header link={`/profile`} title="Create new budget" />
                <div className=' px-[24px] gap-[16px] w-full border-b-1 border-b-[#F7F7F9] py-[8.5px]  flex justify-center'>
                    <button onClick={() => setShowCategories(!showCategories)} className=' border-[0.4px] text-[14px] items-center border-[#EFEFF0] w-full  bg-[#F7F7F9] rounded-[8px] flex p-[8px]  justify-between'>
                        <h1>All categories</h1>
                        <BsChevronDown size={10} className=' text-[#645D72] ' />
                    </button>
                    <button onClick={() => setShowBudget(!showBudget)} className=' border-[0.4px] text-[14px]  items-center border-[#EFEFF0] w-full  bg-[#F7F7F9] rounded-[8px] flex p-[8px]  justify-between'>
                        <h1>{selectedMonth ? selectedMonth?.name : monthlyBudget[0].name} </h1>
                        <BsChevronDown size={10} className=' text-[#645D72] ' />
                    </button>
                </div>
                <div className=' w-full mt-[31px]  flex justify-center'>
                    {distributionStatus === "pending" && <p>Loading budget data...</p>}
                    {distributionStatus === 'error' && <p>Failed to load budget data. Please try again.</p>}
                    {distributionStatus === 'success' && (
                        <div className="w-full mt-[31px] flex justify-center">
                            <BudgetChart
                                totalBudget={budgetDistributionData?.totalBudget ?? 0}
                                budgetCategories={budgetCategories}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white mt-[28px] p-4 flex flex-col gap-[16px]  w-full">
                    {isPending && <div key="loading" className="flex justify-center items-center py-[25px]">
                        <CircularProgress size="md" color="default" />
                    </div>}

                    {budgetDistributionData?.distributions?.length === 0 &&

                        <div className="w-full">
                            <div className="py-[25px] w-full text-center flex flex-col gap-[8px] justify-center items-center px-[51px]">
                                <Image src={noBudgetImg.src} width={1000} height={1000} className="size-[124px] mb-[8px]" alt="No Budget" />
                                <h1 className="font-[500] leading-[24px]">You do not have any budget history yet.</h1>

                            </div>
                        </div>}

                    {singleBudgetStatus == 'success' &&
                        <>


                            {
                                // Check if there are budget categories available
                                singlebudget?.data?.budgetCategories && singlebudget?.data?.budgetCategories?.length > 0 ? (
                                    singlebudget?.data?.budgetCategories?.map((category: any, index: number) => (
                                        <div
                                            key={category.uid}
                                            className="flex justify-between w-full items-center p-[12px] bg-[#F7F7F9] rounded-[12px] border-[1px] border-[#EFEFF0]"
                                        >
                                            {/* Category Name */}
                                            <div className="flex gap-[8px] items-center">
                                                <span
                                                    className="inline-block size-[12px] rounded-full"
                                                    style={{ backgroundColor: category.color }} // Dynamically set color for each category
                                                ></span>
                                                <span className="text-[#474747] text-[14px] font-medium">{category.name}</span>
                                            </div>

                                            {/* Percentage */}
                                            <span className="text-[#474747] text-[14px]">{category.percentageLeft?.toFixed(2)}%</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-[#474747] text-[14px] font-medium">
                                        No data available
                                    </div>
                                )
                            }
                        </>}
                </div>
            </motion.div>



            {showBudget &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[120vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                > <BottomDrawer
                    label={`Filter budget name`}
                    back={false}
                    show={showBudget}
                    close={true}
                    onClose={() => setShowBudget(!showBudget)}
                ><div className="">
                            <ul className="flex h-[396px] overflow-y-scroll flex-col">
                                {monthlyBudget.map((month: any, index: number) => (
                                    <div
                                        key={month.name}
                                        onClick={() => {
                                            setSelectedMonth(month)
                                            setSelectedUid(month.uid)



                                            setShowBudget(!showBudget)
                                        }}
                                        className={`py-[16px] cursor-pointer  font-[500] border-b border-b-[#EFEFF0] text-start px-[8px] ${index === monthlyBudget.length - 1 ? '' : 'border-b-1'
                                            } border-b-[#EFEFF0]`}
                                    >
                                        {month.name}
                                    </div>
                                ))}
                            </ul>
                        </div>

                    </BottomDrawer>
                </motion.div>
            }



            {
                showCategories &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[120vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                > <BottomDrawer
                    label={`Filter budget categories`}
                    back={false}
                    show={showCategories}
                    close={true}
                    onClose={handleClose}
                ><div className="">
                            <div className="flex py-[24px] flex-wrap ">
                                {categories?.map((category) => (
                                    <button
                                        key={category?.uid}
                                        onClick={() => toggleCategory(category?.uid)}
                                        className={` mr-[16px] mb-[16px] text-[14px] p-[12px] rounded-lg transition-colors duration-200 ${selectedCategories.includes(category?.uid)
                                            ? 'bg-[#ECFDDC]  border-[1px] border-[#66C227] text-[#66C227] '
                                            : 'bg-[#F7F7F9] border-[1px]  border-[#EFEFF0] text-[#474747] '
                                            }`}
                                    >
                                        {category?.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </BottomDrawer>
                </motion.div>

            }

        </div>
    )
}

export default Page