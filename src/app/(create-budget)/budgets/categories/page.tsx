'use client'
import Header from '@/components/header'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { getAllBudgetCategoriesApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { useBudgetStore } from '@/app/store/Store';

const Page = () => {

    const { authenticatedUser } = useAuthentication();
    const [showEditCategory, setShowEditCategory] = useState<boolean>(false)
    const [EditCategory, setEditCategory] = useState<any>({})
    const { previousBudget } = useBudgetStore()

    useEffect(() => {
        
    })

    const { data: listofCategories = [], isPending: listofCategoriesisPending } = useQuery({
        queryKey: ['listofCategories'],
        queryFn: () => getAllBudgetCategoriesApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        refetchOnWindowFocus: true,
    });

    console.log(listofCategories);

    // Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="flex flex-col gap-[24px]  w-full justify-center">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex justify-between w-full items-center p-[12px] bg-[#F7F7F9] rounded-[12px] border-[1px] border-[#EFEFF0] animate-pulse"
                >
                    <div className="flex gap-[8px] items-center">
                        <div className="inline-block w-[18px] h-[12px] rounded-full bg-gray-300"></div>
                        <div className="h-[14px] w-[100px] bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleSaveCategory = () => {
        setShowEditCategory(!showEditCategory)
        setEditCategory({})

    }
    return (
        <div className='  w-[100vw] max-w-[500px] relative h-screen'
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', stiffness: 600 }}
            >
                <motion.div className=' relative'
                >
                    <Header link={`/profile`} title="Budget Categories" />
                    <h1 className=' mt-[18px] mb-[14px] ml-[24px] text-[16px] font-[500]'>All Categories</h1>
                    <div className='flex flex-col gap-[24px] p-[24px] w-full justify-center'>
                        {listofCategoriesisPending ? (
                            <LoadingSkeleton />
                        ) : (
                            listofCategories.map((category: any, index: any) => (
                                <div
                                    key={category.uid || index}
                                    onClick={() => {
                                        setEditCategory(category);
                                        setShowEditCategory(!showEditCategory);
                                    }}
                                    className="flex justify-between w-full items-center p-[12px] bg-[#F7F7F9] rounded-[12px] border-[1px] border-[#EFEFF0]"
                                >
                                    {/* Category Name */}
                                    <div className="flex gap-[8px] items-center">
                                        <span
                                            className="inline-block w-[12px] h-[12px] rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        ></span>
                                        <span className="text-[#474747] text-[14px] font-medium">{category.name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </motion.div>









            {
                showEditCategory &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setShowEditCategory(!showEditCategory)}
                    className="h-[120vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                > <BottomDrawer
                    label={`Edit category`}
                    back={false}
                    show={showEditCategory}
                    close={true}
                    footer={<div className="w-full grid gap-y-[16px]">
                        <button onClick={() => handleSaveCategory()} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">save </button>


                    </div>}
                    onClose={() => setShowEditCategory(!showEditCategory)}
                ><div onClick={(e) => e.stopPropagation()} className=" my-[24px] w-full">
                            <div
                                className="flex justify-between w-full items-center p-[12px] bg-[#F7F7F9] rounded-[12px]  border-[1px] border-[#EFEFF0] "
                            >
                                {/* Category Name */}
                                <div className="flex w-full gap-[8px] items-center">
                                    <span
                                        className="inline-block size-[12px] rounded-full "
                                        style={{ backgroundColor: EditCategory.color }}
                                    ></span>
                                    <input
                                        value={EditCategory.name || ''}
                                        onChange={(e) =>
                                            setEditCategory((prev: any) => ({ ...prev, name: e.target.value }))
                                        }
                                        className="text-[#474747] text-[14px] w-full outline-none bg-[#f7f0] font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                    </BottomDrawer>
                </motion.div>

            }
        </div>
    )
}

export default Page