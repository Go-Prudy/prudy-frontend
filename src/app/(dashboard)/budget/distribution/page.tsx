'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsChevronDown } from 'react-icons/bs';
import BudgetChart from '@/app/(dashboard)/components/DoughnutChart';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { getBudgetDistributionApi } from '@/app/services/BudgetService';
const Page = ({ params }: { params: { id: string } }) => {

    // Define the data array
    const budgetCategories = [
        { name: 'Housing', percentage: 12, color: '#4CAF50' },  // Green
        { name: 'Food', percentage: 30, color: '#FFB74D' },     // Orange
        { name: 'Emergency', percentage: 10, color: '#E57373' },// Red
        { name: 'Miscellaneous', percentage: 5, color: '#9575CD' }, // Purple
        { name: 'Utilities', percentage: 12, color: '#F06292' }, // Pink
        { name: 'Tithe', percentage: 10, color: '#8D6E63' },    // Brown
        { name: 'Transportation', percentage: 7, color: '#42A5F5' }, // Blue
        { name: 'Generosity', percentage: 10, color: '#FF8A65' }, // Coral
        { name: 'Personal', percentage: 12, color: '#BCAAA4' }, // Light Brown
        { name: 'Savings', percentage: 30, color: '#81D4FA' },  // Light Blue
        { name: 'Utilities', percentage: 10, color: '#90A4AE' }, // Grey
        { name: 'Health', percentage: 10, color: '#9575CD' },    // Purple
    ];


    interface Category {
        id: number;
        name: string;
    }

    const categories: Category[] = [
        { id: 1, name: 'All categories' },
        { id: 2, name: 'Housing' },
        { id: 3, name: 'Food' },
        { id: 4, name: 'Emergency' },
        { id: 5, name: 'Miscellaneous' },
        { id: 6, name: 'Utilities' },
        { id: 7, name: 'Tithe' },
        { id: 8, name: 'Transportation' },
        { id: 9, name: 'Generosity' },
        { id: 10, name: 'Personal' },
        { id: 11, name: 'Savings' },
        { id: 12, name: 'Health' },
    ];
    const monthlyBudget = [
        { name: 'January Budget', percentage: 8, color: '#FF6384' },  // Example Color and Percentage
        { name: 'February Budget', percentage: 7, color: '#36A2EB' },
        { name: 'March Budget', percentage: 10, color: '#FFCE56' },
        { name: 'April Budget', percentage: 9, color: '#4BC0C0' },
        { name: 'May Budget', percentage: 12, color: '#9966FF' },
        { name: 'June Budget', percentage: 11, color: '#FF9F40' },
        { name: 'July Budget', percentage: 8, color: '#FF6384' },
        { name: 'August Budget', percentage: 10, color: '#36A2EB' },
        { name: 'September Budget', percentage: 7, color: '#FFCE56' },
        { name: 'October Budget', percentage: 6, color: '#4BC0C0' },
        { name: 'November Budget', percentage: 12, color: '#9966FF' },
        { name: 'December Budget', percentage: 10, color: '#FF9F40' },
    ];

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(monthlyBudget[0]);

    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showBudget, setShowBudget] = useState<boolean>(false);
    const { authenticatedUser } = useAuthentication();

    const toggleCategory = (id: number) => {
        if (id === 1) { // If "All categories" is clicked  
            if (selectedCategories.length === categories.length) {
                // If all are selected, deselect all  
                setSelectedCategories([]);
            } else {
                // Select all categories  
                setSelectedCategories(categories.map((category) => category.id));
            }
        } else {
            // For individual categories  
            setSelectedCategories((prev) =>
                prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
            );
        }
    };

    const handleClose = () => {
        setShowCategories(false);
    };
    const budgetId = 1

    const { data: budgetDistributionData, status: distributionStatus } = useQuery({
        queryKey: ['budgetDistribution', budgetId ? 1 : 1],
        queryFn: () => getBudgetDistributionApi(authenticatedUser?.token ?? '', '11'),
        enabled: !!authenticatedUser?.token && !!budgetId,
        staleTime: 5 * 60 * 1000
    });



    console.log(budgetDistributionData);

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
                    {/* <BudgetChart budgetCategories={budgetCategories} /> */}
                </div>
                <div className="bg-white mt-[28px] p-4 flex flex-col gap-[16px]  w-full">
                    {budgetCategories.map((category, index) => (
                        <div
                            key={index}
                            className="flex justify-between w-full items-center p-[12px] bg-[#F7F7F9] rounded-[12px]  border-[1px] border-[#EFEFF0] "
                        >
                            {/* Category Name */}
                            <div className="flex gap-[8px] items-center">
                                <span
                                    className="inline-block size-[12px] rounded-full "
                                    style={{ backgroundColor: category.color }}
                                ></span>
                                <span className="text-[#474747] text-[14px] font-medium">{category.name}</span>
                            </div>

                            {/* Percentage */}
                            <span className="text-[#474747] text-[14px]">{category.percentage}%</span>
                        </div>
                    ))}
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
                            <div className="flex h-[396px] overflow-y-scroll flex-col">
                                {monthlyBudget.map((month, index) => (
                                    <button
                                        key={month.name}
                                        onClick={() => {
                                            setSelectedMonth(month)
                                            setShowBudget(!showBudget)
                                        }}
                                        className={`py-[16px] px-[8px] ${index === monthlyBudget.length - 1 ? '' : 'border-b-1'
                                            } border-b-[#EFEFF0]`}
                                    >
                                        {month.name}
                                    </button>
                                ))}
                            </div>
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
                            <div className="flex flex-wrap ">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => toggleCategory(category.id)}
                                        className={` mr-[16px] mb-[16px] text-[14px] p-[12px] rounded-lg transition-colors duration-200 ${selectedCategories.includes(category.id)
                                            ? 'bg-[#ECFDDC]  border-[1px] border-[#66C227] text-[#66C227] '
                                            : 'bg-[#F7F7F9] border-[1px]  border-[#EFEFF0] text-[#474747] '
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