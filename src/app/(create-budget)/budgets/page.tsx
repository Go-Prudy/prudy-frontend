'use client'
import React, { useEffect, useState } from 'react';
import BudgetPageHeader from '@/components/create-budget/BudgetPageHeader';
import pics from '@/images/frame.webp'; // Ensure the image is imported correctly
import { BsPlus, BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import BottomNavigation from '@/components/create-budget/BottomNavigation';
import noBudgetImg from '@/images/List 2.webp'
import Image from 'next/image';
import { motion } from 'framer-motion';
import CreateBudget from '@/components/create-budget/CreateBudget';


const BudgetPage = () => {
    const allBudgets = [
        {
            monthBudget: 'January',
            typeOfBudget: 'Surplus',
            income: 4500000,
            expenses: 4000000,
            partners: ['Fola', 'Kayode']
        },
        {
            monthBudget: 'February',
            typeOfBudget: 'Deficit',
            income: 3000000,
            expenses: 3500000,
            partners: ['Ade', 'Bola']
        },
        {
            monthBudget: 'March',
            typeOfBudget: 'Balanced',
            income: 4000000,
            expenses: 4000000,
            partners: ['Chidi', 'Grace']
        },
        {
            monthBudget: 'April',
            typeOfBudget: 'Surplus',
            income: 5000000,
            expenses: 4500000,
            partners: ['Tunde', 'Yemi']
        },
        {
            monthBudget: 'May',
            typeOfBudget: 'Deficit',
            income: 2500000,
            expenses: 3000000,
            partners: ['Dami', 'Lola']
        },
        {
            monthBudget: 'June',
            typeOfBudget: 'Balanced',
            income: 3500000,
            expenses: 3500000,
            partners: ['Kunle', 'Ada']
        },
        {
            monthBudget: 'July',
            typeOfBudget: 'Surplus',
            income: 6000000,
            expenses: 5500000,
            partners: ['Femi', 'Ngozi']
        },
        {
            monthBudget: 'August',
            typeOfBudget: 'Deficit',
            income: 2700000,
            expenses: 3200000,
            partners: ['Chuka', 'Sade']
        },
        {
            monthBudget: 'September',
            typeOfBudget: 'Balanced',
            income: 4000000,
            expenses: 4000000,
            partners: ['Gbenga', 'Rita']
        },
        {
            monthBudget: 'October',
            typeOfBudget: 'Surplus',
            income: 4800000,
            expenses: 4300000,
            partners: ['Nkechi', 'Ife']
        }
    ];

    const [scrolled, setScrolled] = useState(false);
    const [createBudgetComponent, setCreateBudgetComponent] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className=''>
            <div className=''>
                <div
                    className="w-[100vw]  bg-no-repeat relative bg-contain bg-top min-h-[100vh]   transition-all duration-300 ease-out"
                    style={{
                        backgroundImage: `url(${pics.src})`, // Access the 'src' property for the image URL
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <BudgetPageHeader />
                    <p className=' px-[24px] pt-[136px] text-[32px] font-[700]  text-white '>Take charge of your income, budget effectively and track your finances</p>
                    <div className=' px-[24px] w-full'>
                        {!scrolled ?

                            <button onClick={() => setCreateBudgetComponent(!createBudgetComponent)} className=' mt-[24px] w-full justify-center items-center  text-center font-[500] bg-[#8EF846] px-[28px]py-[14px] py-[16px] rounded-[32px] flex gap-[8px]'>
                                <BsPlus size={30} />
                                Create budget
                            </button> :
                            <button onClick={() => setCreateBudgetComponent(!createBudgetComponent)} className=' fixed top-[550px] mt-[24px] justify-center items-center  text-center font-[500] right-[24px] z-10 bg-[#8EF846]  p-[14px] w-fit rounded-[32px] flex gap-[8px]'>
                                <BsPlus size={30} />
                            </button>

                        }
                    </div>
                    <div className=' bg-[#F7F7F9] mb-[17px] mt-[40px] min-h-[389px] w-full rounded-t-[24px]'>
                        {allBudgets.length === 0 ?
                            <div className='py-[65px] text-center flex-col gap-[8px] flex justify-center items-center px-[51px]'>
                                <Image src={noBudgetImg.src} width={1000} height={1000} className=' size-[124px] mb-[8px]' alt="" />
                                <h1 className=' font-[500] leading-[24px] '>You do not have any budget history yet.</h1>
                                <h1 className=' text-[14px] text-[#828282] leading-[16.8px]'>Click the create button above to <br /> get started.</h1>


                            </div>

                            :

                            <div className=' flex flex-col mb-[90px] gap-[24px] p-[24px]'>
                                {allBudgets.map((i, index) => {
                                    const maxValue = Math.max(i.income, i.expenses);
                                    const minValue = Math.min(i.income, i.expenses);

                                    // Calculate the percentage of the smaller value relative to the maximum value
                                    const minValuePercentage = (minValue / maxValue) * 100;

                                    const isIncomeGreater = i.income >= i.expenses;

                                    return (
                                        <div key={index} className='bg-[#EFEFF0] rounded-[20px] flex flex-col border-[1px] border-[#E7E7EA] gap-[8px] p-[16px]'>
                                            <div className='w-full justify-between items-center flex'>
                                                <h1 className='text-[16px] font-[500] leading-[24px]'>{i.monthBudget} budget</h1>
                                                <div className='flex items-center text-[12px] gap-[12px] text-[#828282]'>
                                                    <button className='bg-[#FFFFFF] rounded-[10px] px-[8px] py-[2px]'>{i.typeOfBudget}</button>
                                                    <button className='bg-[#FFFFFF] rounded-[10px] px-[8px] py-[2px]'>
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className='mt-[8px] flex flex-col gap-[8px] w-full'>
                                                <div className='flex flex-col gap-[4px]'>
                                                    <h1 className='flex justify-between w-full'>
                                                        <span className='text-[#575757] text-[10px]'>Income</span>
                                                        <span className='text-[#575757] font-[500] text-[12px]'>₦ {i.income.toLocaleString()}</span>
                                                    </h1>
                                                    <div className='relative w-full bg-[#EFEFF0] rounded-[4px]'>
                                                        <div
                                                            style={{
                                                                width: isIncomeGreater ? '100%' : `${minValuePercentage}%`,
                                                                backgroundColor: '#01B0C5',
                                                            }}
                                                            className='h-[8px] rounded-[4px]'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='flex flex-col gap-[4px]'>
                                                    <h1 className='flex justify-between w-full'>
                                                        <span className='text-[#575757] text-[10px]'>Expenses</span>
                                                        <span className='text-[#575757] font-[500] text-[12px]'>₦ {i.expenses.toLocaleString()}</span>
                                                    </h1>
                                                    <div className='relative w-full bg-[#EFEFF0] rounded-[4px]'>
                                                        <div
                                                            style={{
                                                                width: !isIncomeGreater ? '100%' : `${minValuePercentage}%`,
                                                                backgroundColor: '#FB8417',
                                                            }}
                                                            className='h-[8px] rounded-[4px]'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        }

                    </div>
                    {createBudgetComponent && <CreateBudget show={createBudgetComponent} setShow={setCreateBudgetComponent} />}
                    <BottomNavigation />
                </div>

            </div>
        </motion.div>
    );
};

export default BudgetPage;
