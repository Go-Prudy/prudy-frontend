'use client'
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import React, { ReactNode, useState } from 'react';
import { BsChevronRight, BsDot, BsX } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { RadioGroup, useRadio, VisuallyHidden, cn, RadioProps } from "@nextui-org/react";
import paymnetIcon from '@/images/Payment method icon.png'
import subtract1 from '@/images/Subtract.png'
import subtract2 from '@/images/Subtract (1).png'
import Image from 'next/image';
import DeleteSuccessModal from '../components/DeleteSuccessModal';
import { useRouter } from 'next/navigation';

interface CardFormValues {
    nameOnCard: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}



const Page = () => {
    const features = [
        "Create smart budgets",
        "Link up to 3 bank accounts",
        "Unlimited receipt scanning per month",
        "Up to 3 collaborators monthly",
        "Analytics presentation & personalized insight",
        "Record expense manually",
    ];

    // State to manage checkbox values
    const [checkedFeatures, setCheckedFeatures] = useState(
        features.map(() => true) // Initialize all checkboxes as checked
    );
    const [showMakePayment, setShowMakePayment] = useState<boolean>(false)
    const [showSubscriptionPlan, setShowSubscriptionPlan] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = React.useState<string>("Premium");
    const [formValues, setFormValues] = useState<CardFormValues>({
        nameOnCard: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const [showSuccessfullPayment, setShowSuccessfullPayment] = useState<boolean>(false)

    const navigation = useRouter()
    const handleChangeInMakePaymentForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Enforce mm/yyyy format for expiryDate
        if (name === 'expiryDate') {
            const formattedValue = value
                .replace(/[^\d]/g, '') // Remove any non-digit characters
                .slice(0, 6) // Ensure max length of 6
                .replace(/(\d{2})(\d{0,4})/, '$1/$2'); // Format as mm/yyyy

            setFormValues({ ...formValues, [name]: formattedValue });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formValues);
        // Add your form submission logic here
    };

    const handleChange = (value: string) => {
        setSelectedPlan(value);
    };




    // Handle change when checkbox is clicked
    const handleCheckboxChange = (index: number) => {
        const updatedCheckedFeatures = [...checkedFeatures];
        updatedCheckedFeatures[index] = !updatedCheckedFeatures[index];
        setCheckedFeatures(updatedCheckedFeatures);
    };

    // Define the props type
    interface CustomRadioProps extends RadioProps {
        duration?: string; // Optional property for duration
        description: ReactNode; // Description should be ReactNode
        children: ReactNode; // Radio button label
    }



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
            getControlProps,
        } = useRadio(props);
        const { duration } = props
        // Combine description and duration into a single node
        const combinedDescription = (
            <div className="flex gap-[8px] text-[#575757] items-center">
                <span className="text-[16px] font-[500] ">{description}</span>
                {duration && <span className=' text-[12px]'>{duration}</span>} {/* Only render duration if it exists */}
            </div>
        );

        return (
            <Component
                {...getBaseProps()}
                className={cn(
                    "group flex items-center relative justify-between mb-[24px] rounded-lg border-2 transition-all",
                    "w-full cursor-pointer flex-nowrap border border-default rounded-[20px] gap-4 p-4",
                    "data-[selected=true]:border-[#66C227] data-[selected=true]:bg-[#ECFDDC]"
                )}
            >
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>

                <div className="flex flex-col">
                    <span {...getLabelProps()} className="text-[#575757] text-[12px]">{children}</span>
                    {combinedDescription} {/* Use the combined description node */}
                </div>
                {isSelected && children === "Premium" && (
                    <span className="bg-[#66C227] absolute right-[8px] top-[6px] text-white rounded-full py-[2px] px-[8px] text-[10px]">Save 45%</span>
                )}
                <span {...getWrapperProps()}>
                    <span {...getControlProps()} />
                </span>
            </Component>
        );
    };


    const handleSubscribe = () => {
        setShowSubscriptionPlan(!showSubscriptionPlan)
        setShowMakePayment(!showMakePayment)
    }

    const handleMakePayment = () => {
        console.log('Form submitted:', formValues);
        // Add your form submission logic here
        setShowMakePayment(!showMakePayment)
        setShowSuccessfullPayment(!showSuccessfullPayment)

    }

    return (
        <div className=' relative  h-[844px] overflow-x-hidden' style={{
            background: 'linear-gradient(0deg, #66C227 15.2%, #2A860A 74.4%)',
        }}>

            <div className=' w-full py-[22px] px-[24px]'
            >
                <div className=' absolute top-[-80.53px] right-[-10px]  rotate-[4.05deg]  w-[186.14px] z-1 h-[360.28px] '>
                    <Image
                        src={subtract1}
                        className=" w-full h-full  "
                        height={1000} width={1000}
                        alt="payment icon"
                    />
                </div>
                <div className=' absolute z-1 bottom-[-60px] left-[-60px]  rotate-[0.05deg]  w-[316.14px] z-1 h-[280.28px] '>
                    <Image src={subtract2} className="h-full w-full " height={1000} width={1000} alt="payment icon" />
                </div>

                {/* Header */}
                <div className='flex mb-[36px]  items-center w-full'>
                    <div onClick={() => navigation.push('/profile')} className='bg-[#FFFFFF1A] rounded-[22px] grid place-content-center text-white size-[36px]'>
                        <BsX size={20} />
                    </div>

                    <h1 className='mx-auto relative z-2 text-white text-center text-[18px] font-[500]'>Subscription</h1>
                </div>
                <div>
                    <h1 className='text-[36px] z-2 relative mb-[16px] text-center text-white font-[500] leading-[40px]'>Start your 3 days <br /> free trial</h1>
                    <p className='flex gap-[8px] py-[8px] px-[76px] border-[#FFFFFFCC] border-[0.6px] bg-[#FFFFFF33] z-2 backdrop-blur-md relative w-full text-white items-center rounded-[16px] mb-[24px]'>
                        <span className=' z-2 relative'>3 days free</span>
                        <span className=' z-2 relative'><BsDot /></span>
                        <span className=' z-2 relative'>Save up to 50%</span>
                    </p>
                </div>

                <div className='pt-[24px] mb-[56px]'>
                    <ul className="bg-white p-[16px] rounded-[24px] ">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center mb-[12px] last:mb-0">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={checkedFeatures[index]} // Set the checkbox checked state
                                        onChange={() => handleCheckboxChange(index)} // Handle change
                                        className={`appearance-none size-[18px] grid place-content-center rounded-md focus:ring-0 cursor-pointer ${checkedFeatures[index]
                                            ? 'bg-[#66C227] border-none'
                                            : 'bg-white border-[#575757] border'
                                            }`}
                                    />
                                    {/* SVG tick mark to appear when checked */}
                                    {checkedFeatures[index] && (
                                        <svg
                                            className="absolute inset-0 w-full h-full p-1 pointer-events-none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                                clipRule="evenodd"
                                                className="text-white"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="ml-[12px] text-[#575757] leading-[28px]">{feature}</span>
                            </div>
                        ))}
                    </ul>

                    <div>
                        <p className='flex flex-col mt-[24px] gap-[8px] py-[8px] px-[76px] border-[#FFFFFFCC] z-2 backdrop-blur-md relative  border-[0.6px] bg-[#FFFFFF33] text-white items-center rounded-[16px] mb-[24px]'>
                            <span>3 days free</span>
                            <span>then ₦ 4,500/monthly</span>
                        </p>

                        <button type="submit" className="btn w-full my-[24] rounded-[32px] px-[28px] py-[14px] z-2  relative bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]" onClick={() => setShowMakePayment(true)}>Continue</button>


                        <button onClick={() => setShowSubscriptionPlan(!showSubscriptionPlan)} className=" text-center z-[2] relative w-full my-[24px]  text-[#FAFAFA] flex items-center justify-center gap-[5px] font-[500]">See all subscriptions <BsChevronRight /></button>
                    </div>
                </div>
            </div>


            {showSubscriptionPlan &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >

                    <BottomDrawer
                        footer={<button onClick={() => handleSubscribe()} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Subscribe</button>}
                        label="Subscription plans"
                        back={false}
                        show={showSubscriptionPlan}
                        close={true}
                        onClose={() => setShowSubscriptionPlan(false)}
                    >
                        <div className="relative mt-[24px] w-full mb-4">


                            <RadioGroup
                                orientation="vertical"
                                className="flex flex-col gap-[24px]"
                                onValueChange={handleChange}
                                color='success'

                            >
                                <CustomRadio
                                    isSelected={selectedPlan === "Basic"}
                                    onChange={() => setSelectedPlan("Basic")}
                                    description="₦ 3,500"
                                    duration="monthly (₦ 200/week)"
                                    value="Basic"

                                >
                                    Basic
                                </CustomRadio>

                                <CustomRadio
                                    isSelected={selectedPlan === "Premium"}
                                    onChange={() => setSelectedPlan("Premium")}
                                    description="₦ 4,500 "
                                    duration="₦ 200/week"
                                    value="Premium"
                                >
                                    Premium
                                </CustomRadio>

                                <CustomRadio
                                    isSelected={selectedPlan === "Lifetime"}
                                    onChange={() => setSelectedPlan("Lifetime")}
                                    description="₦ 50,000"
                                    duration="₦ 200/week"
                                    value="Lifetime"
                                >
                                    Lifetime
                                </CustomRadio>
                            </RadioGroup>
                        </div>


                    </BottomDrawer>
                </motion.div>
            }



            {showMakePayment &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >

                    <BottomDrawer
                        footer={<button onClick={() => handleMakePayment()} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Subscribe</button>}
                        label="Make payment"
                        back={false}
                        show={showMakePayment}
                        close={true}
                        onClose={() => setShowMakePayment(false)}
                    >
                        <div className="relative mt-[24px] w-full mb-4">
                            <form
                                className="w-full flex flex-col gap-[24px]"
                                onSubmit={handleSubmit}
                            >
                                {/* Name on Card */}
                                <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="nameOnCard">
                                    <h1 className="text-[12px] text-[#575757] leading-[16px]">Name on card</h1>
                                    <input
                                        placeholder="Enter name"
                                        className="bg-[#ff000000] outline-none font-[500] leading-[24px]"
                                        type="text"
                                        name="nameOnCard"
                                        id="nameOnCard"
                                        value={formValues.nameOnCard}
                                        onChange={handleChangeInMakePaymentForm}
                                        required
                                    />
                                </label>

                                {/* Card Number */}
                                <label className="flex flex-col p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]" htmlFor="cardNumber">
                                    <h1 className="text-[12px] text-[#575757] leading-[16px]">Card number</h1>
                                    <div className="flex justify-between">
                                        <input
                                            placeholder="**** **** **** ****"
                                            className="bg-[#ff000000] outline-none font-[500] leading-[24px]"
                                            type="text"
                                            name="cardNumber"
                                            id="cardNumber"
                                            autoComplete="cardNumber"
                                            value={formValues.cardNumber}
                                            onChange={handleChangeInMakePaymentForm}
                                            required
                                        />
                                        <Image src={paymnetIcon} className="h-[24px] w-[34px]" height={24} width={34} alt="payment icon" />
                                    </div>
                                </label>

                                {/* Expiry Date and CVV */}
                                <div className="w-full flex gap-[24px]">
                                    {/* Expiry Date */}
                                    <label className="w-[159px] flex flex-col justify-center p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]">
                                        <h1 className="text-[12px] text-[#575757] leading-[16px]">Expiry date</h1>
                                        <div className="flex justify-between">
                                            <input
                                                className="text-[#575757] bg-[#ff000000] outline-none font-[500] leading-[24px]"
                                                type="text"
                                                placeholder="MM/YYYY"
                                                name="expiryDate"
                                                id="expiryDate"
                                                value={formValues.expiryDate}
                                                onChange={handleChangeInMakePaymentForm}
                                                pattern="(0[1-9]|1[0-2])\/\d{4}" // Regex pattern to ensure valid mm/yyyy format
                                                required
                                            />
                                        </div>
                                    </label>

                                    {/* CVV */}
                                    <label className="w-[159px] flex flex-col justify-center p-[16px] bg-[#F7F7F9] rounded-[20px] border border-[#EFEFF0] gap-[8px]">
                                        <h1 className="text-[12px] text-[#575757] leading-[16px]">CVV</h1>
                                        <div className="flex justify-between">
                                            <input
                                                className="text-[#575757] bg-[#ff000000] outline-none font-[500] leading-[24px]"
                                                type="password"
                                                placeholder="***"
                                                maxLength={3}
                                                name="cvv"
                                                id="cvv"
                                                value={formValues.cvv}
                                                onChange={handleChangeInMakePaymentForm}
                                                required
                                            />
                                        </div>
                                    </label>
                                </div>


                            </form>
                        </div>


                    </BottomDrawer>
                </motion.div>
            }




            {showSuccessfullPayment &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >

                    <DeleteSuccessModal
                        showModal={showSuccessfullPayment}
                        setShowModal={setShowSuccessfullPayment}
                        handleClose={() => console.log('Modal closed')}
                        text='Removed successfully'
                    />

                </motion.div>
            }


        </div>
    );
};

export default Page;
