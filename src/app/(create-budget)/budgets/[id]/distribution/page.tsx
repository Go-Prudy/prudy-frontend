'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsChevronDown } from 'react-icons/bs';
import BudgetChart from '@/components/DoughnutChart';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { GetAllBudgetsApi, getBudgetDistributionApi, getSingleBudgetApi } from '@/app/services/BudgetService';
import { CircularProgress } from '@nextui-org/react';
import Image from 'next/image';
import noBudgetImg from '/public/images/List 2.webp'
import { Line } from 'react-chartjs-2';
import BudgetVisualization from '@/components/BudgetVisualization';

const Page = (props: { params: { id: string } }) => {
    const params = props.params


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


    console.log(budgets);

    const monthlyBudget = budgets.sort((a, b) => (a.uid === params.id ? -1 : b.uid === params.id ? 1 : 0));

    useEffect(() => {
        if (budgets.length > 0) {
            console.log(monthlyBudget[0]);
            setSelectedMonth(monthlyBudget[0])
        }
    }, [isBudgetsPending])

    // Set the initial selected month as the first budget item (or fallback if no data)
    const [selectedCategories, setSelectedCategories] = useState<number[]>([1]);

    const [selectedUid, setSelectedUid] = useState<string>(params.id)

    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showBudget, setShowBudget] = useState<boolean>(false);

    const rearrangedBudget = [...monthlyBudget]; // Clone the array to avoid mutation
    const matchingBudgetIndex = rearrangedBudget.findIndex(
        (budget) => budget.uid === params.id
    );

    if (matchingBudgetIndex !== -1) {
        const [matchingBudget] = rearrangedBudget.splice(matchingBudgetIndex, 1); // Remove the matching budget
        rearrangedBudget.unshift(matchingBudget); // Add it to the start of the array
    }




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
        queryKey: ['budgetDistribution', selectedUid ? selectedUid : monthlyBudget[0].uid],
        queryFn: () => getBudgetDistributionApi(authenticatedUser?.token ?? '', selectedUid ? selectedUid : monthlyBudget[0].uid),
        enabled: !!authenticatedUser?.token && !!selectedUid,
        staleTime: 5 * 60 * 1000
    });

    console.log(budgetDistributionData);


    const [selectedMonth, setSelectedMonth] = useState(monthlyBudget.length > 0 ? monthlyBudget[0] : { name: 'No Budget', percentage: 8, color: '#FF6384' });


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





    useEffect(() => {
        if (selectedMonth) {
            // This will run whenever `selectedMonth` is updated
            console.log('Selected Month:', selectedMonth.name);
            console.log('Selected id:', selectedUid);
        }
    }, [selectedMonth, selectedCategories]); // The effect runs whenever `selectedMonth` changes

    console.log(singlebudget);
    console.log(budgets);

    // Define categories, starting with "All categories"
    const categories: Category[] = [
        { uid: 0, name: "All categories" }, // Default category
        ...(budgetDistributionData?.distributions?.map((item: any, index: number) => ({
            uid: index + 1, // Assign unique IDs starting from 1
            name: item.name,
        })) || []),
    ];

    // Function to toggle category selection
    const toggleCategory = (uid: number) => {
        if (uid === 0) {
            // If "All categories" is clicked, select/deselect all
            setSelectedCategories(selectedCategories.includes(0) ? [] : [0]);
        } else {
            // For other categories
            setSelectedCategories((prev) => {
                // If "All categories" was selected, deselect it
                if (prev.includes(0)) {
                    return [uid];
                }
                return prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid];
            });
        }
    };
    useEffect(() => {
        // Set "All categories" as the default selection when the component mounts
        if (categories.length > 0) {
            setSelectedCategories([0]);
        } // Selecting "All categories" by default
    }, []); // Empty dependency array to run only once when the component mounts

    // Filter distributions based on selected categories
    const filteredDistributions =
        selectedCategories.length === 0 || selectedCategories.includes(0)
            ? budgetDistributionData?.distributions || [] // Show all categories
            : budgetDistributionData?.distributions?.filter((_: any, index: number) =>
                selectedCategories.includes(index + 1)
            );


    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className=" w-[100vw] min-h-[100vh] max-w-[500px]  "
            >
                <Header link={`/profile`} title="Budget distribution" />
                <div className=' px-[24px] gap-[16px] w-full border-b-1 border-b-[#F7F7F9] py-[8.5px]  flex justify-center'>
                    <button onClick={() => setShowCategories(!showCategories)} className=' border-[0.4px] text-[14px] items-center border-[#EFEFF0] w-full  bg-[#F7F7F9] rounded-[8px] flex p-[8px]  justify-between'>
                        <h1>All categories</h1>
                        <BsChevronDown size={10} className=' text-[#645D72] ' />
                    </button>
                    <button onClick={() => setShowBudget(!showBudget)} className=' border-[0.4px] text-[14px]  items-center border-[#EFEFF0] w-full  bg-[#F7F7F9] rounded-[8px] flex p-[8px]  justify-between'>
                        {isBudgetsPending ? 'loading...' : <h1>{selectedMonth ? selectedMonth?.name : monthlyBudget[0].name} </h1>}
                        <BsChevronDown size={10} className=' text-[#645D72] ' />
                    </button>
                </div>
                <div className=' w-full mt-[31px]  flex justify-center'>
                    {distributionStatus === "pending" && <p>Loading budget data...</p>}
                    {distributionStatus === 'error' && <p>Failed to load budget data. Please try again.</p>}
                    {distributionStatus === 'success' && (
                        <div className="w-full mt-[31px] flex justify-center">
                            <BudgetVisualization
                                totalBudget={budgetDistributionData.totalBudget}
                                distributions={filteredDistributions}
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

                    {distributionStatus == 'success' &&
                        <>


                            {
                                // Check if there are budget categories available
                                budgetDistributionData.distributions && budgetDistributionData.distributions.length > 0 ? (
                                    filteredDistributions?.map((category: any, index: number) => (
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
                                            <span className="text-[#474747] text-[14px]">{category.percentage.toFixed(1)}%</span>
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
                    label={`Filter budget by name`}
                    back={false}
                    show={showBudget}
                    close={true}
                    onClose={() => setShowBudget(!showBudget)}
                ><div className="">
                            <ul className="flex h-[396px] overflow-y-scroll flex-col">
                                {monthlyBudget.map((month: any, index: number) => (
                                    <div
                                        key={month.uid || index} // Use `uid` or fallback to `index` as a key
                                        onClick={() => {
                                            setSelectedMonth(month);
                                            setSelectedUid(month.uid);
                                            setShowBudget(!showBudget);
                                        }}
                                        className={`py-[16px] cursor-pointer font-[500] border-b text-start px-[8px] ${index === monthlyBudget.length - 1 ? '' : 'border-b-1'
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
                                {categories.map((category) => (
                                    <button
                                        key={category.uid}
                                        onClick={() => toggleCategory(category.uid)}
                                        className={`mr-[16px] mb-[16px] text-[14px] p-[12px] rounded-lg transition-colors duration-200 ${selectedCategories.includes(category.uid)
                                            ? "bg-[#ECFDDC] border-[1px] border-[#66C227] text-[#66C227]"
                                            : "bg-[#F7F7F9] border-[1px] border-[#EFEFF0] text-[#474747]"
                                            }`}
                                    >
                                        {category.name}
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