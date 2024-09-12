'use client';
import React, { useRef, useState } from 'react';
import BarChart from '../../components/BarChart';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import pics from '@/images/frame.webp';
import colab from '@/images/collab.png';
import { BsPlus } from 'react-icons/bs';
import { Budgets } from '@/app/data/DummyData';
import { Allocation, Budget as IBudget } from '@/app/Types';
import Image from 'next/image';
import noBudgetImg from '@/images/List 2.webp'
import moneyIcon from '@/images/money.png';
import add from '@/images/add.png'
import { Progress } from '@nextui-org/react';
import { GoChevronRight, GoPerson } from "react-icons/go";
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import DeleteSuccessModal from '../../components/DeleteSuccessModal';
import { useRouter } from 'next/navigation';


interface Budget {
    amount: string;
    percentage: string;
    color: string;
    subAllocations: SubAllocation[];
}

interface SubAllocation {
    subCategory: string;
    amount: number | string;
}

interface Budget {
    amount: string;
    percentage: string;
    color: string;
    subAllocations: SubAllocation[];
}

const Page = ({ params }: { params: { id: string } }) => {
    const navigation = useRouter()
    const [showNewBudgetCategory, setShowNewBudgetCategory] = useState<boolean>(false)
    const [showSucces, setShowSuccess] = useState<boolean>(false)
    const [showInvite, setShowInvite] = useState<boolean>(false)
    const [allBudgets, setAllBudgets] = useState<IBudget[]>(Budgets || [])
    const [showSelectedBudget, setShowSelectedBudget] = useState<boolean>(false)
    const [showRecordModal, setShowRecordModal] = useState<boolean>(false)
    // Define state for the selected budget
    const spanRefs = useRef<any>([]);

    const [selectedBudget, setSelectedBudget] = useState<any>({
        amount: '',
        percentage: '',
        color: '#4CAF50', // Placeholder color
        subAllocations: [],
    });


    // Handles the amount change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedBudget({ ...selectedBudget, amount: e.target.value });
    };

    // Handles the percentage change
    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimals
        setSelectedBudget({ ...selectedBudget, percentage: value });
    };


    // Handles the sub-allocation updates
    const handleAllocationChange = (index: number, field: keyof SubAllocation, value: string | number) => {
        const updatedAllocations = [...selectedBudget.subAllocations];
        updatedAllocations[index] = { ...updatedAllocations[index], [field]: value };
        setSelectedBudget({ ...selectedBudget, subAllocations: updatedAllocations });
    };

    // Removes a sub-allocation (task)
    const removeSubAllocation = (index: number) => {
        const updatedAllocations: SubAllocation[] = selectedBudget.subAllocations.filter((_: SubAllocation, i: number) => i !== index);

        setSelectedBudget({ ...selectedBudget, subAllocations: updatedAllocations });
    };

    const [categoryName, setCategoryName] = useState('');
    const [subAllocations, setSubAllocations] = useState([{ subCategory: '', amount: '' }]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    };

    const handleSubAllocationChange = (index: number, field: string, value: string) => {
        const updatedAllocations: any = [...subAllocations];
        updatedAllocations[index][field] = value;
        setSubAllocations(updatedAllocations);
    };

    const addSubAllocation = () => {
        setSubAllocations([...subAllocations, { subCategory: '', amount: '' }]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newBudgetCategory = {
            categoryName,
            subAllocations,
        };
        console.log(newBudgetCategory); // Replace with actual save function
        setCategoryName('');
        setSubAllocations([{ subCategory: '', amount: '' }]);
    };

    const formatNumber = (number: string | number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatPercentage = (percentage: number) => `${percentage}%`;


    const [collaborators, setCollaborators] = useState([
        {
            name: 'James Smith'
        }
    ])



    const createNewCategory = () => {
        try {

            setShowNewBudgetCategory(false)
        } catch (error) {
            console.log(error);

        }
    }
    const handleSendInvite = () => {
        try {

            setShowSuccess(!showSucces)
            setShowInvite(!showInvite)
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
            className="w-[100vw] "
            style={{
                backgroundImage: `url(${pics.src})`, // Access the 'src' property for the image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Header light={false} link="/budgets" title="Create new budget" />
            <div className=' px-[24px] pt-[40px] pb-[40px] '>
                <BarChart labels={['Income', 'Expenses', 'Amount left']}
                    values={[1245679, 500009, 700009]}
                />
            </div>


            <motion.div
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[100vw] bg-[#FFFFFF] rounded-t-[24px] "
            >
                <div className='  py-[16px]  px-[24px]   w-full'>
                    <div className=' w-full flex justify-between'>
                        <h1 className=' font-[500] leading-[28px]'>Budget Categories</h1>
                        <button onClick={() => setShowNewBudgetCategory(true)} className=' bg-[#EFEFF0] font-[500] text-[12px] rounded-[32px] py-[4px] px-[8px] flex gap-[4px] items-center '> <BsPlus size={20} /> Create new</button>
                    </div>
                </div>


                {/* CATEGORIES  OR ALLOCATIONS */}
                <div className={` bg-[#F7F7F9]  grid ${allBudgets.length == 0 ? 'grid-cols-1' : 'grid-cols-2'}  gap-[12px] overflow-y-scroll overflow-x-hidden h-[322px] py-[16px] px-[24px] mb-[24px] `}>
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
                            {allBudgets.map((budget: IBudget, budgetIndex: number) => (
                                budget.allocations?.map((allocation: Allocation, allocationIndex: number) => (
                                    <li
                                        key={allocation.budgetCategory}
                                        onClick={() => navigation.push(`/budget/${params.id}/${budgetIndex + 1}`)}  // Use budgetIndex + 1 to form the route
                                        className="bg-white border border-[#EFEFF0] p-[12px] rounded-[20px] flex flex-col gap-[8px]"
                                    >
                                        <div
                                            className="w-[20px] h-[20px] rounded-full"
                                            style={{ backgroundColor: allocation.color }}
                                        ></div>
                                        <h1 className="text-[12px]">{allocation.budgetCategory}</h1>
                                        <h1 className="font-[500] text-[14px]">₦ {allocation.amount} <span className='font-[400] text-[10px] text-[#828282]'> left</span></h1>
                                        <Progress
                                            style={{ height: '6px' }}
                                            size="md"
                                            radius="lg"
                                            classNames={{
                                                base: "max-w-md",
                                                track: "drop-shadow-none bg-[#EFEFF0] border border-[#EFEFF0]",
                                                indicator: "bg-[#575757]",
                                                label: "tracking-wider font-medium text-default-600",
                                                value: "text-foreground/60",
                                            }}
                                            value={65}
                                        />
                                    </li>
                                ))
                            ))}

                        </>}





                </div>
                <div className='  border-none    px-[24px] w-full '>
                    <div onClick={() => navigation.push("/budget/distribution")} className='bg-[#F7F7F9] rounded-[20px]  border border-[#EFEFF0] p-[16px] flex justify-between w-full'>
                        <div className=' flex  gap-[12px] items-start'>
                            <Image src={colab} alt='helo' className=' size-[44px] ' />
                            <div className=' '>
                                <h1 className=' text-[#474747] font-[500] '>Budget distribution</h1>
                                <p className=' text-[12px] text-[#575757]'>See how your budget is distributed <br /> across all the categories</p>

                            </div>
                        </div>

                        <GoChevronRight className=' text-[#888888] size-[24px]' />


                    </div>

                    <h1 className=' text-[#474747] my-[24px] text-[18px] font-[500] '>Collaborators</h1>
                    <div className=' w-full pb-[36px]  flex gap-[16px]'>
                        {collaborators.map((item) => (
                            <div key={item.name} className='bg-[#F7F7F9]  rounded-[20px] items-center border border-[#EFEFF0] p-[16px] flex flex-col justify-center w-full'>
                                <GoPerson className=' size-[30px]' />
                                <h1 className=' text-[#2D2D2D] '>{item.name}</h1>
                            </div>
                        ))}

                        <div onClick={() => setShowInvite(!showInvite)} className='rounded-[20px] bg-[#F5FEED] items-center border-dashed border-[#66C227] border-2 p-[16px] flex flex-col justify-center w-full'>
                            <Image src={add} alt='hello' className='size-[24px]' />
                            <h1 className='text-[#2D2D2D] leading-[16px] text-center'>
                                Invite a <br /> collaborator
                            </h1>
                        </div>


                    </div>

                </div>
            </motion.div>








            {showInvite &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >
                    <form onSubmit={handleSubmit}>
                        <BottomDrawer
                            footer={<button onClick={() => handleSendInvite()} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Send invite</button>}
                            label="Invite collaborator to budget"
                            back={false}
                            show={showInvite}
                            close={true}
                            onClose={() => {
                                setShowInvite(false)
                            }}
                        >

                            <div className="relative w-full mb-4">
                                <div className='  z-[10]  flex w-[90%] absolute top-[30px]  left-4 text-xs justify-between items-center'>
                                    <label htmlFor={'Name of category'} className=" relative h-fit w-fit  z-[10] text-[#828282]">
                                        Email address
                                    </label>

                                </div>

                                <input
                                    type={'text'}
                                    name={'Email address'}
                                    id={'Email address'}
                                    required={true}
                                    placeholder={'Enter email address'}
                                    className={`bg-[#F7F7F9]  mt-[20px] font-[500] border border-[#EFEFF0] placeholder:text-[#575757] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 }`}
                                />
                            </div>
                        </BottomDrawer>
                    </form>
                </motion.div>

            }

            {
                showSucces && <>
                    <DeleteSuccessModal
                        showModal={showSucces}
                        setShowModal={setShowSuccess}
                        handleClose={() => console.log('Modal closed')}
                        text='Sent Successfully'
                    />

                </>
            }

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
                            footer={<button type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Save</button>}
                            label="Create budget category"
                            back={false}
                            show={showNewBudgetCategory}
                            close={true}
                            onClose={() => setShowNewBudgetCategory(false)}
                        >
                            <div className="relative w-full mb-4">
                                <div className='flex w-[90%] absolute top-[16px] h-fit left-4 text-xs justify-between items-center'>
                                    <label htmlFor={'Name of category'} className="text-[#828282]">
                                        Name of category
                                    </label>
                                </div>
                                <input
                                    type={'text'}
                                    name={'Name of category'}
                                    id={'Name of category'}
                                    required={true}
                                    placeholder={'Enter name'}
                                    className="bg-[#F7F7F9] outline-none font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2"
                                    value={categoryName}
                                    onChange={handleCategoryChange}
                                />
                            </div>

                            <div>
                                <h1 className='font-[500] leading-[20px]'>
                                    Assign amount/percentage of income for this category
                                </h1>

                                <div className='px-[16px] bg-[#F7F7F9] mt-[8px] border border-[#E7E7EA] rounded-[16px] grid grid-cols-2 w-full'>
                                    <div className='py-[12px]'>
                                        <h1 className='text-[#828282] text-[12px] leading-[14.4px]'>Amount</h1>
                                        <input
                                            className=' outline-none bg-transparent mt-[4px]'
                                            type="text"
                                            name="amount"
                                            value={selectedBudget?.amount || ''}
                                            onChange={handleAmountChange}
                                        />
                                    </div>
                                    <div className='py-[12px] w-[90%] border-l px-[16px] border-l-[#E7E7EA]'>
                                        <h1 className='text-[#828282] text-[12px] leading-[14.4px]'>Percentage</h1>
                                        <input
                                            className=' outline-none bg-transparent mt-[4px]'
                                            type="text"
                                            name="percentage"
                                            value={formatPercentage(selectedBudget?.percentage || 0)}
                                            onChange={handlePercentageChange}
                                        />
                                    </div>
                                </div>

                                <div className='mt-[24px]  p-[16px] bg-[#F7F7F9] min-h-[100px] max-h-[200px] overflow-y-scroll border border-[#E7E7EA] rounded-[16px] w-full'>
                                    {subAllocations.map((eachSubAllocation: any, index: number) => (
                                        <button
                                            type='button'
                                            key={index + 1}

                                            className="flex hover:scale-105 transition-all ease-in mt-[8px] items-center justify-between w-full gap-[8px]"
                                        >
                                            <div className='flex flex-1 gap-[4px] w-full'>
                                                <div
                                                    style={{ backgroundColor: '#BEB8FF' }}
                                                    className='grid place-content-center rounded-[16px] text-white size-[28px]'
                                                >
                                                    <Image src={moneyIcon} className="size-[12px]" alt={'icon'} width={1000} height={1000} />
                                                </div>
                                                <div className='text-[#514F6E] min-w-[100px] w-[80px] text-[14px] font-[500] inline-block'>
                                                    <input
                                                        value={eachSubAllocation.subCategory || ''}
                                                        onChange={(e) => handleSubAllocationChange(index, 'subCategory', e.target.value)}
                                                        placeholder="Enter sub category"
                                                        className='bg-transparent w-full outline-none text-ellipsis overflow-hidden whitespace-nowrap'
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className='bg-white rounded-[8px] py-[4px] px-[8px] flex items-start gap-[8px]'>
                                                    ₦
                                                    <div className="relative inline-block">
                                                        <input
                                                            value={isNaN(eachSubAllocation.amount) ? '' : formatNumber(eachSubAllocation.amount)}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const value = e.target.value;
                                                                const numericValue = value.replace(/[^0-9.]/g, ''); // Keep only numbers and decimal point
                                                                const cleanedValue = numericValue.replace(/(\..*)\..*/g, '$1'); // Allow only one decimal point

                                                                // Ensure the value is a valid number or empty string
                                                                const finalValue = cleanedValue === '' ? '' : parseFloat(cleanedValue).toString();

                                                                handleSubAllocationChange(index, 'amount', finalValue);
                                                            }}
                                                            type="text"
                                                            inputMode="decimal"
                                                            pattern="[0-9]*[.,]?[0-9]*"
                                                            onWheel={(e) => e.currentTarget.blur()}
                                                            className="px-2 py-1 rounded outline-none transition-all duration-200"
                                                            style={{
                                                                minWidth: '60px',  // Set a minimum width
                                                                maxWidth: '140px', // Set a maximum width
                                                                width: `calc(${spanRefs.current[index]?.offsetWidth}px + 10px)` // Dynamically adjust width based on content
                                                            }}
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

                                    <button
                                        onClick={addSubAllocation}
                                        type='button'
                                        className="flex hover:scale-110 transition-all ease-in border-t-[1px] border-t-[#EFF0F6] mt-[10px] items-center gap-[8px]"
                                    >
                                        <div className="grid place-content-center rounded-[16px] text-white size-[28px]" style={{ backgroundColor: '#BEB8FF' }}>
                                            <BsPlus />
                                        </div>
                                        <div className="text-[#514F6E] text-[14px] font-[500]">Add Another </div>
                                    </button>
                                </div>
                            </div>
                        </BottomDrawer>
                    </form>
                </motion.div>

            }







        </motion.div>
    );
};

export default Page;




