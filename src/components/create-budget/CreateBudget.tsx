'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BottomDrawer from './BottomDrawer';
import Input from '../input'; // Assuming this is your input component
import { RadioGroup, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { BsArrowRight } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

interface IProps {
    setShow: (i: boolean) => void;
    show: boolean
}

const CreateBudget = ({ setShow, show }: IProps) => {
    // State to manage form data
    const [budgetData, setBudgetData] = useState({
        nameofBudget: '',
        purposeOfBudget: '',
        startDate: '',
        endDate: '',
        budgetType: '', // To store the radio button selection
    });

    const navigate = useRouter()
    // Handle form input changes
    const handleChange = (key: string, value: string) => {
        setBudgetData(prevData => ({ ...prevData, [key]: value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', budgetData);
        navigate.push('/budgets/new/income')
        // Here you can add logic to submit the form data to your API or backend
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
                    "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
                    "max-w-[300px] cursor-pointer border-2 border-default rounded-[20px] gap-4 p-4",
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
                        <span className="text-[12px] w-[99px] font-[500] text-foreground opacity-70">{description}</span>
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
                    <div className="budget-form mt-[8px]">
                        <Input label="Name of budget" inputName="Nameofbudget" inputType="text" placeholder="January..." onChange={(value) => handleChange('nameofBudget', value)} />
                        <Input label="Purpose of budget" inputName="Purposeofbudget" inputType="text" placeholder="Monthly expenses..." onChange={(value) => handleChange('purposeOfBudget', value)} />
                        <div className="flex gap-[16px] justify-between">
                            <Input label="Start date" inputName="Startdate" inputType="date" placeholder="Select date..." onChange={(value) => handleChange('startDate', value)} />
                            <Input label="End date" inputName="Enddate" inputType="date" placeholder="Select date..." onChange={(value) => handleChange('endDate', value)} />
                        </div>


                        <RadioGroup
                            orientation="horizontal"
                            className=' flex gap-[16px]'
                            color='success'
                            onValueChange={(value) => handleChange('budgetType', value)}

                        >
                            <CustomRadio description="Duplicate last budget" value="Duplicate last budgetd">
                            </CustomRadio>

                            <CustomRadio description="Create new budget" value="Create new budget">
                            </CustomRadio>

                        </RadioGroup>
                    </div>
                </BottomDrawer>
            </form>
        </motion.div>
    );
};

export default CreateBudget;
