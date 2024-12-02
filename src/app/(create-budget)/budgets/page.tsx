'use client'
import React, { useEffect, useState } from 'react';
import BudgetPageHeader from '@/components/create-budget/BudgetPageHeader';
import pics from '@/images/frame.webp';
import { BsPersonFill, BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import noBudgetImg from '@/images/List 2.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CreateBudget from '@/components/create-budget/CreateBudget';
import { CircularProgress, Skeleton } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { GetAllBudgetsApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import InviteModal from '@/app/(dashboard)/components/InviteModal';
import { getPendingInvitesApi } from '@/app/services/InviteService';

const BudgetPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showInvites, setShowInvites] = useState(false);
    const [createBudgetComponent, setCreateBudgetComponent] = useState(false);
    const [treshold, setTreshold] = useState(0);
    const navigation = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 300);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const { authenticatedUser } = useAuthentication();

    const { data: budgets = [], isFetching, error, isPending } = useQuery({
        queryKey: ['allBudgetCategories'],
        queryFn: () => GetAllBudgetsApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        refetchOnWindowFocus: true,
    });

    const { data: getPendingInvitesApiData = [], status: getPendingInvitesStatus } = useQuery({
        queryKey: ['getPendingInvites'],
        queryFn: () => getPendingInvitesApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (getPendingInvitesApiData.length > 0) {
            setShowInvites(true);
        } else {
            setShowInvites(false);
        }
    }, [getPendingInvitesApiData]);

    interface Partner {
        image: string;
        uid: string;
        name: string;
        picture: string;
    }

    interface AvatarGroupProps {
        partners: Partner[];
        expenseWidth: number;
    }

    const AvatarGroup: React.FC<AvatarGroupProps> = ({ partners, expenseWidth }) => {
        const maxAvatarsToShow = 3; // Maximum avatars to display
        const additionalCount = partners?.length - maxAvatarsToShow;

        return (
            <div className={`relative flex items-center ${expenseWidth <= treshold ? 'mt-0' : 'mt-2'}`}>
                {partners?.slice(0, maxAvatarsToShow)?.map((partner, index) => (
                    partner.picture ?
                        <Image
                            key={partner.uid}
                            width={32}
                            height={32}
                            src={partner.picture}
                            alt={partner.name}
                            className={`relative inline-block rounded-full border-2 border-white object-cover ${index > 0 ? '-ml-2' : ''}`}
                            style={{ zIndex: maxAvatarsToShow - index }}
                        />
                        :
                        <BsPersonFill key={partner.uid} className={`relative size-[32px] p-1 inline-block rounded-full border-2 border-white text-[#828282] object-cover ${index > 0 ? '-ml-2' : ''}`} />
                ))}

                {additionalCount > 0 && (
                    <div className="relative ml-[-0.35rem] w-8 h-8 rounded-full border-2 border-white bg-gray-200 text-gray-800 text-sm font-medium flex items-center justify-center">
                        +{additionalCount}
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className=''
        >
            <div className=''>
                <div
                    className="w-[100vw] bg-no-repeat relative bg-contain bg-top min-h-[100vh] transition-all duration-300 ease-out"
                    style={{
                        backgroundImage: `url(${pics.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <BudgetPageHeader />
                    <p className='px-[24px] pt-[136px] text-[32px] font-[700] text-white'>
                        Take charge of your income, budget effectively and track your finances
                    </p>
                    <div className='px-[24px] w-full'>
                        {!scrolled ?
                            <button onClick={() => setCreateBudgetComponent(!createBudgetComponent)} className='mt-[24px] w-full justify-center items-center text-center font-[500] bg-[#8EF846] px-[28px] py-[16px] rounded-[32px] flex gap-[8px]'>
                                <BsPlus size={30} />
                                Create budget
                            </button>
                            :
                            <button onClick={() => setCreateBudgetComponent(!createBudgetComponent)} className='fixed top-[550px] mt-[24px] justify-center items-center text-center font-[500] right-[24px] z-10 bg-[#8EF846] p-[14px] w-fit rounded-[32px] flex gap-[8px]'>
                                <BsPlus size={30} />
                            </button>
                        }
                    </div>
                    <div className='bg-[#F7F7F9] mb-[17px] mt-[40px] min-h-[389px] w-full rounded-t-[24px]'>
                        {isPending ? (
                            <div className='flex flex-col mb-[90px] gap-[24px] p-[24px]'>
                                {[...Array(3)].map((_, index) => (
                                    <Skeleton key={index} className='h-[100px] w-full rounded-[20px]' />
                                ))}
                            </div>
                        ) : budgets?.length === 0 ? (
                            <div className='py-[65px] text-center flex-col gap-[8px] flex justify-center items-center px-[51px]'>
                                <Image src={noBudgetImg.src} width={1000} height={1000} className='size-[124px] mb-[8px]' alt="" />
                                <h1 className='font-[500] leading-[24px]'>You do not have any budget history yet.</h1>
                                <h1 className='text-[14px] text-[#828282] leading-[16.8px]'>Click the create button above to <br /> get started.</h1>
                            </div>
                        ) : (
                            <div className='flex flex-col mb-[90px] gap-[24px] p-[24px]'>
                                {budgets?.map((budget: any, index: any) => {
                                    const totalBudgetIncome = Number(budget?.totalIncome) || 0;
                                    const totalBudgetExpenses = Number(budget?.totalExpenses) || 0;

                                    const maxBudgetValue = Math.max(totalBudgetIncome, totalBudgetExpenses) || 0;

                                    const incomeWidth = maxBudgetValue > 0
                                        ? Math.min((totalBudgetIncome / maxBudgetValue) * 100, 100)
                                        : 0;
                                    const expenseWidth = maxBudgetValue > 0
                                        ? Math.min((totalBudgetExpenses / maxBudgetValue) * 100, 100)
                                        : 0;

                                    const dynamicThreshold = (totalBudgetIncome / maxBudgetValue) * 100 || 15;

                                    return (
                                        <div onClick={() => navigation.push(`/budget/${budget.uid}`)} key={index} className='bg-[#EFEFF0] rounded-[20px] flex flex-col border-[1px] border-[#E7E7EA] gap-[8px] p-[16px]'>
                                            <div className='w-full justify-between items-center flex'>
                                                <h1 className='text-[16px] font-[500] leading-[24px]'>{budget.name}</h1>
                                                <div className='flex items-center text-[12px] gap-[12px] text-[#828282]'>
                                                    <button className='bg-[#FFFFFF] rounded-[10px] px-[8px] py-[2px]'>{budget.type}</button>
                                                    <button className='bg-[#FFFFFF] rounded-[10px] px-[8px] py-[2px]'>
                                                        <BsThreeDotsVertical />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='mt-[8px] flex flex-col gap-[8px] w-full'>
                                                <div className='flex flex-col gap-[4px]'>
                                                    <h1 className='flex justify-between w-full'>
                                                        <span className='text-[#575757] text-[10px]'>Income</span>
                                                        <span
                                                            className={`text-[#575757] font-[500] text-[12px] ${incomeWidth < 25 ? 'hidden' : 'block'}`}
                                                        >
                                                            {totalBudgetIncome.toLocaleString('en-NG', {
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0
                                                            })}
                                                        </span>
                                                    </h1>
                                                    <div className='relative w-full bg-[#EFEFF0] rounded-[4px]'>
                                                        <div
                                                            style={{
                                                                width: `${incomeWidth}%`,
                                                                backgroundColor: '#01B0C5',
                                                                maxWidth: '100%',
                                                            }}
                                                            className='h-[8px] rounded-[4px]'
                                                        />
                                                    </div>
                                                    <h1
                                                        style={{
                                                            width: `${incomeWidth}%`,
                                                            maxWidth: '100%',
                                                        }}
                                                        className={`text-[#575757]  flex justify-start font-[500] text-[12px] ${incomeWidth > 25 ? 'hidden' : 'block'}`}>₦ {totalBudgetIncome.toLocaleString()}</h1>

                                                </div>

                                                <div style={{

                                                    width: `${expenseWidth}%`,
                                                    maxWidth: '100%',
                                                }} className='flex flex-col relative  gap-[4px]'>
                                                    <h1 className='flex justify-between w-full'>
                                                        <span className='text-[#575757] text-[10px]'>Expenses</span>
                                                        <span className={` ${expenseWidth <= dynamicThreshold ? 'hidden' : 'block'} text-[#575757] font-[500] text-[12px]`}>₦ {totalBudgetExpenses.toLocaleString()}</span>
                                                    </h1>
                                                    <div className='relative w-full bg-[#EFEFF0] rounded-[4px]'>
                                                        <div
                                                            style={{
                                                                width: `${expenseWidth}%`,
                                                                backgroundColor: '#FB8417',
                                                                maxWidth: '100%',
                                                            }}
                                                            className='h-[8px] rounded-[4px]'
                                                        />
                                                    </div>
                                                    <div
                                                        className={` flex  ${expenseWidth <= dynamicThreshold ? 'block' : 'hidden'}   text-[#575757] font-[500] text-[12px]`}
                                                    >
                                                        ₦{totalBudgetExpenses.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className=' z-1 relative w-full'>
                                                    {budget?.collaborators.length === 0 ? null : (
                                                        <AvatarGroup partners={budget?.collaborators} expenseWidth={3} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                {createBudgetComponent && <CreateBudget show={createBudgetComponent} setShow={setCreateBudgetComponent} />}
                {showInvites || getPendingInvitesApiData.length > 0 && <InviteModal getPendingInvitesApiData={getPendingInvitesApiData} show={showInvites} setShow={setShowInvites} />}
            </div>
        </motion.div>
    );
};

export default BudgetPage;
