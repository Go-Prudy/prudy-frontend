'use client';
import Header from '@/components/header';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@nextui-org/react';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import Image from 'next/image';
import manual from '@/images/manual.png'
import photo from '@/images/camera.png'
import { GoChevronRight } from 'react-icons/go';

// Utility function to format date
const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options).replace(/(\d{1,2})(st|nd|rd|th)/, '$1');
};

const Page = ({ params }: { params: { id: string, id2: string } }) => {
    // Example values
    const amountSpent = 600000; // Current amount spent
    const amountTotal = 1000000; // Total amount

    // Calculate the amount left
    const amountLeft = amountTotal - amountSpent;

    // Calculate the progress percentage
    const progressPercentage = (amountSpent / amountTotal) * 100;

    type Expense = {
        name: string;
        date: string; // Original format e.g., "2024-09-01"
        time: string; // Time in format "hh:mm AM/PM"
        amount: number; // The actual amount of the expense
    };
    interface ManualData {
        name: string;
        amount: number;
        category: string;
        date: string;
    }

    const expenses: Expense[] = [
        { name: "Groceries", date: "2024-09-01", time: "10:30 AM", amount: 15000 },
        { name: "Rent", date: "2024-09-01", time: "12:00 PM", amount: 120000 },
        { name: "Utilities", date: "2024-09-02", time: "3:00 PM", amount: 10000 },
        { name: "Transportation", date: "2024-09-03", time: "8:15 AM", amount: 6000 },
        { name: "Dining Out", date: "2024-09-04", time: "7:45 PM", amount: 4500 },
        { name: "Entertainment", date: "2024-09-05", time: "9:00 PM", amount: 8000 },
        { name: "Health", date: "2024-09-06", time: "2:30 PM", amount: 200.00 },
        { name: "Education", date: "2024-09-07", time: "11:00 AM", amount: 15000 },
        { name: "Travel", date: "2024-09-08", time: "6:00 AM", amount: 30000 },
        { name: "Miscellaneous", date: "2024-09-09", time: "4:00 PM", amount: 2500 },
    ];

    const [showRecordModal, setShowRecordModal] = useState(false)
    const [showAddManual, setShowAddManual] = useState(false)
    const [manualData, setManualData] = useState<ManualData>({
        name: '',
        amount: 0,
        category: '',
        date: ''
    });

    // Handle "See All" button click
    const handleSeeAll = () => {
        // Redirect to a page showing all expenses or open a modal, etc.
        alert("See all expenses clicked");
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setManualData((prevData) => ({
            ...prevData,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleAddManually = () => {
        setShowAddManual(!showAddManual)
    }

    return (
        <div className=' relative'
        >
            <motion.div
                initial={{ x: '100%' }}  // Start from the right side of the screen
                animate={{ x: 0 }}      // Move to the normal position
                exit={{ x: '-100%' }}   // Optionally, move out to the left when unmounted
                transition={{ type: 'tween', stiffness: 600 }}  // Customize the animation
            >
                <div

                    className=' relative'
                >
                    <Header link={`/budget/${params.id}`} title="Food Budget" />
                    <div className='p-[24px] w-full'>
                        <div className='p-[16px] bg-[#EFEFF0] rounded-[20px] border border-[#E7E7EA]'>
                            <Progress
                                aria-label="Progress showing amount spent and left"
                                value={amountLeft}
                                maxValue={amountTotal}
                                size="md"
                                color="warning"
                                radius="md"
                                classNames={{
                                    base: "max-w-md",
                                    track: "bg-white",
                                    indicator: "",
                                    label: "tracking-wider font-medium text-default-600",
                                    value: "text-foreground/60",
                                }}
                                showValueLabel={true}
                                valueLabel={<div className='gap-[8px] flex flex-col'>
                                    <div className='text-[#6F6C8F] text-[12px]'>Amount Spent</div>
                                    <div className='text-[#514F6E] text-right text-[12px]'>₦ {amountSpent.toLocaleString()}</div>
                                </div>}
                                label={
                                    <div className='flex flex-col'>
                                        <div className='text-[#6F6C8F] my-[8px] text-[12px]'>Amount Left</div>
                                        <div className='font-[500]'>₦ {amountLeft.toLocaleString()}</div>
                                    </div>
                                }
                            />
                        </div>

                        <button onClick={() => setShowRecordModal(!showRecordModal)} type="submit" className="btn my-[24px] w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Record expenses</button>

                        <div className='w-full'>
                            <div className='flex mb-[16px] justify-between items-center w-full'>
                                <h1 className='text-[18px] font-[500] text-[#252340]'>Food Expenses</h1>
                                <button className='font-[500] text-[12px] text-[#514F6E]' onClick={handleSeeAll}>See All</button>
                            </div>

                            <ul className='flex flex-col gap-[16px] w-full'>
                                {expenses.map((expense, index) => (
                                    <li key={expense.name} className={`pb-[16px] ${index === expenses.length - 1 ? '' : 'border-b-2'} flex justify-between w-full`}>
                                        <div className='flex flex-col gap-[8px]'>
                                            <h1 className='text-[#2D2D2D] text-[14px] font-[500]'>{expense.name}</h1>
                                            <div className='flex text-[12px] text-[#575757] justify-around items-center'>
                                                <h1>{formatDate(expense.date)}</h1>
                                                <span className='h-[16px] bg-[#EFEFF0] w-[1px] mx-[8px]' />
                                                <h1>{expense.time}</h1>
                                            </div>
                                        </div>
                                        <h1 className='text-[#2D2D2D] text-[14px] font-[500]'>₦ {expense.amount.toLocaleString()}</h1>
                                    </li>
                                ))}
                            </ul>
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
                    className="fixed h-[100vh] top-0 w-full z-[40] bg-[#1c1c1c73]"
                >
                    <div className=' '>
                        <BottomDrawer

                            label="Record expense"
                            back={false}
                            show={showRecordModal}
                            close={true}
                            onClose={() => setShowRecordModal(false)}
                        >
                            <div className="flex flex-col py-[24px] gap-[16px] ">
                                <div className="bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] p-[16px] flex justify-between w-full">
                                    <div className="flex gap-4">
                                        <Image src={manual} alt="Scan receipt" className="w-[44px] h-[44px]" />
                                        <div>
                                            <h1 className="text-[14px] text-[#474747] font-[500]">Scan receipt</h1>
                                            <p className="text-[10px] text-[#575757]">Capture expense details with your camera</p>
                                        </div>
                                    </div>
                                    <GoChevronRight className="text-[#888888] w-[24px] h-[24px]" />
                                </div>

                                <div onClick={() => {
                                    setShowRecordModal(!showRecordModal)
                                    setShowAddManual(!showAddManual)


                                }} className="bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] p-[16px] flex justify-between w-full">
                                    <div className="flex gap-4">
                                        <Image src={photo} alt="Add manually" className="w-[44px] h-[44px]" />
                                        <div>
                                            <h1 className="text-[14px] text-[#474747] font-[500]">Add manually</h1>
                                            <p className="text-[10px] text-[#575757]">Add expense details manually</p>
                                        </div>
                                    </div>
                                    <GoChevronRight className="text-[#888888] w-[24px] h-[24px]" />
                                </div>
                            </div>
                        </BottomDrawer>
                    </div>

                </motion.div>
            )}


            {showAddManual && (
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed h-[100vh] top-0 w-full z-[40] bg-[#1c1c1c73]"
                >
                    <div className=' '>
                        <BottomDrawer
                            footer={<button onClick={() => handleAddManually()} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Save</button>}
                            label="Add manually"
                            back={false}
                            show={showAddManual}
                            close={true}
                            onClose={() => setShowAddManual(false)}
                        >
                            <div className="flex flex-col gap-[16px] ">
                                {/* Name of Category Input */}
                                <div className="relative w-full ">
                                    <div className="z-[10] flex w-[90%] absolute top-[30px] left-4 text-xs justify-between items-center">
                                        <label htmlFor="category" className="text-[#828282]">
                                            Name of category
                                        </label>

                                    </div>

                                    <input
                                        type="text"
                                        name="category"
                                        id="category"
                                        required
                                        value={manualData.category}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name"
                                        className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                                    />
                                </div>

                                {/* Name Input */}
                                <div className="relative w-full ">
                                    <div className="z-[10] flex w-[90%] absolute top-[30px] left-4 text-xs justify-between items-center">
                                        <label htmlFor="name" className="text-[#828282]">
                                            Name
                                        </label>
                                    </div>

                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={manualData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter name"
                                        className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                                    />
                                </div>

                                {/* Amount Input */}
                                <div className="relative w-full ">
                                    <div className="z-[10] flex w-[90%] absolute top-[30px] left-4 text-xs justify-between items-center">
                                        <label htmlFor="amount" className="text-[#828282]">
                                            Amount
                                        </label>
                                    </div>

                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        required
                                        value={manualData.amount}
                                        onChange={handleInputChange}
                                        placeholder="Enter amount"
                                        className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                                    />
                                </div>

                                {/* Date Input */}
                                <div className="relative w-full ">
                                    <div className="z-[10] flex w-[90%] absolute top-[30px] left-4 text-xs justify-between items-center">
                                        <label htmlFor="date" className="text-[#828282]">
                                            Date
                                        </label>
                                    </div>

                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        required
                                        value={manualData.date}
                                        onChange={handleInputChange}
                                        className="bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                                    />
                                </div>

                            </div>
                        </BottomDrawer>
                    </div>

                </motion.div>
            )}

        </div>
    );
};

export default Page;
