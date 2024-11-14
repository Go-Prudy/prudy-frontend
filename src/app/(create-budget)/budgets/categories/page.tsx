'use client'
import Header from '@/components/header'
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import BottomDrawer from '@/components/create-budget/BottomDrawer';

const Page = () => {

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


    const [showEditCategory, setShowEditCategory] = useState<boolean>(false)
    const [EditCategory, setEditCategory] = useState<any>({})

    const handleSaveCategory = () => {
        setShowEditCategory(!showEditCategory)
        setEditCategory({})

    }
    return (
        <div className=' relative h-screen'
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
                    <div className='flex flex-col gap-[24px] p-[24px] w-full justify-center'>
                        {budgetCategories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setEditCategory(category)
                                    setShowEditCategory(!showEditCategory)
                                }}
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