'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BottomDrawer from './BottomDrawer';
import Input from '../input'; // Assuming this is your input component
import { RadioGroup, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { BsArrowRight } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useBudgetStore } from '@/app/store/Store';
import { IBudget } from '@/app/Types';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    setShow: (i: boolean) => void;
    show: boolean
}


const CreateBudget = ({ setShow, show }: IProps) => {
    // State to manage form data
    const [budgetData, setBudgetData] = useState<IBudget>({
        id: uuidv4(),
        name: '',
        purpose: '',
        startDate: '',
        endDate: '',
    });

    const { addBudget, duplicateLastBudget } = useBudgetStore((state) => ({
        addBudget: state.addBudget,
        duplicateLastBudget: state.duplicateLastBudget,
    }));


    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [budgetType, setBudgetType] = useState<string>('Create new budget');


    const navigate = useRouter()
    // Handle form input changes
    const handleChange = (key: string, value: string) => {
        setBudgetData(prevData => ({ ...prevData, [key]: value }));
    };


    const handleChangeDate = (field: 'startDate' | 'endDate', value: string) => {
        setBudgetData(prevData => {
            const newBudgetData = { ...prevData, [field]: value };

            // If startDate is updated and it's after the current endDate, reset the endDate
            if (field === 'startDate' && new Date(value) >= new Date(prevData.endDate)) {
                newBudgetData.endDate = '';
            }

            return newBudgetData;
        });
    };



    // Calculate the minimum selectable end date (the day after the start date)
    const minEndDate = budgetData.startDate
        ? new Date(new Date(budgetData.startDate).getTime() + 86400000).toISOString().split('T')[0]
        : '';


    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (budgetType === 'Create new budget') {
            addBudget(budgetData);
        } else if (budgetType === 'Duplicate last budget') {
            duplicateLastBudget();
        }
        navigate.push(`/budgets/new/income/${budgetData.id}`);
        setShow(false);
    };

    // Custom Radio button implementation
    const CustomRadio = (props: any) => {
        const {
            Component,
            children,
            isSelected,
            description,
            getBaseProps,
            getWrapperProps,
            getInputProps,
            getLabelProps,
            getLabelWrapperProps,
            getControlProps,
        } = useRadio(props);

        return (
            <Component
                {...getBaseProps()}
                className={cn(
                    "group inline-flex flex-1 items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
                    "w-[164px] cursor-pointer flex-nowrap border-2 border-default rounded-[20px] gap-4 p-4",
                    "data-[selected=true]:border-[#66C227] data-[selected=true]:bg-[#F5FEED]",
                )}
            >
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <span {...getWrapperProps()}>
                    <span {...getControlProps()} />
                </span>
                <div {...getLabelWrapperProps()}>
                    {children && <span {...getLabelProps()}>{children}</span>}
                    {description && (
                        <div className=' flex justify-between '>
                            <span className="text-[12px] max-w-[99px] font-[500] text-foreground opacity-70">{description}</span>
                        </div>
                    )}
                </div>
            </Component>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        >
            <form onSubmit={handleSubmit}>
                <BottomDrawer
                    footer={<button type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Continue <BsArrowRight /></button>}
                    label="Create budget"
                    back={false}
                    show={show}
                    close={true}
                    onClose={() => setShow(false)}
                >
                    <div className="budget-form pt-[24px] mt-[0px]">
                        <Input label="Name of budget" inputName="Nameofbudget" inputType="text" placeholder="January..." onChange={(value) => handleChange('name', value)} />
                        <Input label="Purpose of budget" inputName="Purposeofbudget" inputType="text" placeholder="Monthly expenses..." onChange={(value) => handleChange('purpose', value)} />
                        <div className="flex gap-[16px] justify-between">
                            <Input
                                label="Start date"
                                inputName="Startdate"
                                inputType="date"
                                placeholder="Select date..."
                                onChange={(value) => handleChangeDate('startDate', value)}
                                value={budgetData.startDate} // Bind the startDate state to the Input component
                            />
                            <Input
                                label="End date"
                                inputName="Enddate"
                                inputType="date"
                                placeholder="Select date..."
                                onChange={(value) => handleChangeDate('endDate', value)}
                                min={minEndDate} // Prevent selecting a date before the start date
                                disabled={!budgetData.startDate} // Disable end date input until a start date is selected
                                value={budgetData.endDate} // Bind the endDate state to the Input component
                            />
                        </div>



                        <RadioGroup
                            orientation="horizontal"
                            className=' flex w-full  justify-between  gap-[16px]'
                            color='success'
                            onValueChange={(value) => handleChange('budgetType', value)}

                        >
                            <CustomRadio
                                isSelected={budgetType === "Duplicate last budget"} onChange={() => setBudgetType("Duplicate last budget")}


                                description="Duplicate last budget" value="Duplicate last budget">
                            </CustomRadio>

                            <CustomRadio isSelected={budgetType === "Create new budget"} onChange={() => setBudgetType("Create new budget")}

                                description="Create new budget" value="Create new budget">
                            </CustomRadio>

                        </RadioGroup>
                    </div>
                </BottomDrawer>
            </form>
        </motion.div>
    );
};

export default CreateBudget;
