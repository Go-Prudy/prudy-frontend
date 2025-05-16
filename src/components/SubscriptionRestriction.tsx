'use client';
import BottomDrawer from '@/app/_components/drawers/BottomDrawer';
import React, { ReactNode, useState } from 'react';
import { BsChevronDown, BsChevronRight, BsChevronUp, BsDot, BsX } from 'react-icons/bs';
import { motion } from 'framer-motion';
import {
  RadioGroup,
  useRadio,
  VisuallyHidden,
  cn,
  RadioProps,
  CircularProgress,
} from '@nextui-org/react';
import paymnetIcon from '/public/images/Payment method icon.png';
import CheckcircleIcon from '/public/images/Check circle.png';
import subtract1 from '/public/images/Subtract.png';
import subtract2 from '/public/images/Subtract (1).png';
import mono1 from '/public/images/mono1.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Select, SelectItem, Avatar } from '@nextui-org/react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import { getAllPlans } from '@/app/services/SubscriptionService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { getBillingCycleApi } from '@/app/services/BillingServices';
import ActionModal from '@/app/_components/modals/ActionModal';

interface CardFormValues {
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface Plan {
  uid: string;
  name: string;
  basePrice: number;
  weeklyAmount?: number;
  monthlyAmount?: number;
  discount?: number;
  benefits: string[];
}

interface Plans {
  monthly?: Plan[];
  quaterly?: Plan[];
  yearly?: Plan[];
}

interface SubscriptionPlansProps {
  authenticatedUser: {
    token: string;
  } | null;
}

const SubscriptionRestriction = ({
  setShowSubscriptionRestriction,
  showSubscriptionRestriction,
  mainText,
}: any) => {
  const features = [
    'Create smart budgets',
    'Link up to 3 bank accounts',
    'Unlimited receipt scanning per month',
    'Up to 3 collaborators monthly',
    'Analytics presentation & personalized insight',
    'Record expense manually',
  ];

  const { authenticatedUser } = useAuthentication();
  // State to manage checkbox values
  const [checkedFeatures, setCheckedFeatures] = useState(
    features.map(() => true), // Initialize all checkboxes as checked
  );
  const [showMakePayment, setShowMakePayment] = useState<boolean>(false);
  const [showSubscriptionPlan, setShowSubscriptionPlan] = useState<boolean>(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string>('Premium');
  const [formValues, setFormValues] = useState<CardFormValues>({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [showSuccessfullPayment, setShowSuccessfullPayment] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState('Monthly');
  const options = ['Monthly', 'Quaterly', 'Yearly'];
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false); // Close the popover after selection
  };
  const navigation = useRouter();
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
    header1: string;
    header2: string;
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

    const { duration, header1, header2, header3, label, labelText } = props;

    // Combine description and duration into a single node
    const combinedDescription = (
      <div className="flex gap-[8px] text-[#575757] items-center">
        <span className="text-[16px] font-[500]">{description}</span>
        {duration && <span className="text-[12px]">{duration}</span>}{' '}
        {/* Only render duration if it exists */}
      </div>
    );

    return (
      <Component
        {...getBaseProps()}
        className={cn(
          'group flex flex-col p-4 rounded-lg border-1 transition-all',
          'w-full cursor-pointer flex-nowrap border border-default rounded-[20px] gap-4',
          isSelected ? 'border-[#66C227] bg-[#ECFDDC]' : 'bg-[#F7F7F9] border-[#EFEFF0]',
        )}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>

        <div className=" flex w-full items-start ">
          <div className="flex flex-col w-full  ">
            <div className={`flex justify-between  `}>
              <div>
                <h1 className="text-[#66C227] font-[700] text-[14px]">
                  {header1}{' '}
                  {label && (
                    <span
                      className={`px-[8px]
                                 ${isSelected ? 'text-[#ffffff] bg-[#66C227] ' : 'text-black bg-white'}    ml-[8px] py-[2px] text-[10px]  rounded-[12px] font-[400]`}
                    >
                      {labelText}
                    </span>
                  )}
                </h1>
                <h1 className="mt-[8px] flex items-start font-[700] text-[24px] leading-[24px]">
                  {header2}{' '}
                  <span className=" text-[12px] font-[400] text-[#575757] ml-[8px]">
                    {header3}
                  </span>
                </h1>
              </div>
              <div {...getWrapperProps()}>
                <div {...getControlProps()} />
              </div>
            </div>
            <div>
              <div
                {...getLabelProps()}
                className="text-[#575757] mt-[12px] w-full bg-[#FFFFFF] rounded-b-[12px] text-[12px] py-[12px]   px-[4px] "
              >
                {children}
              </div>
              {combinedDescription} {/* Use the combined description node */}
            </div>
          </div>
        </div>
      </Component>
    );
  };

  // Custom Radio button implementation
  const CustomRadioForSubscription = (props: any) => {
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
    const { duration } = props;
    // Combine description and duration into a single node
    const combinedDescription = (
      <div className="flex gap-[8px] text-[#575757] items-center">
        <span className="text-[16px] font-[500] ">{description}</span>
        {duration && <span className=" text-[12px]">{duration}</span>}{' '}
        {/* Only render duration if it exists */}
      </div>
    );

    return (
      <Component
        {...getBaseProps()}
        className={cn(
          'group flex items-center relative justify-between mb-[24px] rounded-lg border-2 transition-all',
          'w-full cursor-pointer flex-nowrap border border-default rounded-[20px] gap-4 p-4',
          'data-[selected=true]:border-[#66C227] data-[selected=true]:bg-[#ECFDDC]',
        )}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>

        <div className="flex flex-col">
          <span {...getLabelProps()} className="text-[#575757] text-[12px]">
            {children}
          </span>
          {combinedDescription} {/* Use the combined description node */}
        </div>
        {isSelected && children === 'Premium' && (
          <span className="bg-[#66C227] absolute right-[8px] top-[6px] text-white rounded-full py-[2px] px-[8px] text-[10px]">
            Save 45%
          </span>
        )}
        <span {...getWrapperProps()}>
          <span {...getControlProps()} />
        </span>
      </Component>
    );
  };

  const handleSubscribe = () => {
    setShowSubscriptionPlan(!showSubscriptionPlan);
    setShowMakePayment(!showMakePayment);
  };

  const handleMakePayment = () => {
    console.log('Form submitted:', formValues);
    // Add your form submission logic here
    setSubscriptionPlan(!subscriptionPlan);
    // setShowMakePayment(!showMakePayment)
    // setShowSuccessfullPayment(!showSuccessfullPayment)
  };

  const {
    data: getAllPlansData = [],
    isPending: isGetAllPlansPending,
    isError,
  } = useQuery({
    queryKey: ['getAllPlans'],
    queryFn: () => getAllPlans(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token, // Only fetch if token exists
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchOnMount: false, // Prevent refetching on component mount
    refetchInterval: false, // Disable polling
    staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
  });

  const plans: Plans = getAllPlansData;

  return (
    <motion.div
      initial={{ y: '100%' }} // Start completely off-screen at the bottom
      animate={{ y: 0 }} // Animate to the top
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="relative w-full max-w-[500px] h-[884px]  subscription-bg  overflow-x-hidden"
      // style={{
      //     background: "linear-gradient(0deg, #66C227 15.2%, #2A860A 74.4%)",

      // }}
    >
      <div className="  relative py-[22px] px-[24px]">
        <div className="  fixed lg:absolute top-[-80.53px] right-[-10px]  rotate-[4.05deg]  w-[186.14px] z-1 h-[360.28px] ">
          <Image
            src={subtract1}
            className=" w-full h-full  "
            height={1000}
            width={1000}
            alt="payment icon"
          />
        </div>
        <div className=" fixed lg:absolute bottom-[-130px] left-[-60px]  rotate-[0.05deg]  w-[316.14px] z-0 h-[280.28px] ">
          <Image
            src={subtract2}
            className="h-full z-[-1] w-full "
            height={1000}
            width={1000}
            alt="payment icon"
          />
        </div>

        {/* Header */}
        <div className="flex mb-[36px]  items-center w-full">
          <div
            onClick={() => setShowSubscriptionRestriction(!showSubscriptionRestriction)}
            className="bg-[#FFFFFF1A] rounded-[22px] grid place-content-center text-white size-[36px]"
          >
            <BsX size={20} />
          </div>

          <h1 className="mx-auto relative z-2 text-white text-center text-[18px] font-[500]">
            Subscription
          </h1>
        </div>
        <div>
          <h1 className="text-[36px] z-2 relative mb-[16px] text-center text-white font-[500] leading-[40px]">
            {mainText}
          </h1>
          {/* <p className='flex gap-[8px] py-[4px] px-[8px] mx-auto bg-[#006D00] z-2 backdrop-blur-md relative w-fit text-white items-center rounded-[16px] mb-[24px]'>
                        2 days left
                    </p> */}
        </div>

        <div className="pt-[24px] ">
          <div className="bg-[#F7F7F9] z-10 relative text-[#2D2D2D] text-[18px] leading-[25.2px] p-[16px] rounded-[24px] ">
            <div className=" items-center flex justify-between w-full">
              <h1>Unstoppable 🚀</h1>
              <Popover
                isOpen={isOpen}
                onOpenChange={(open) => setIsOpen(!open)}
                placement="bottom"
              >
                <PopoverTrigger>
                  <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className=" bg-white font-[400] text-[14px] flex gap-[.8rem] justify-between rounded-[16px] px-[8px] py-[4px]  items-center"
                  >
                    {selectedOption}
                    {!isOpen ? <BsChevronDown /> : <BsChevronUp />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 shadow-lg">
                  <div className="flex flex-col">
                    {options.map((option) => (
                      <button
                        key={option}
                        className={`text-left px-2 py-1 hover:bg-gray-200 ${
                          selectedOption === option ? 'font-bold' : ''
                        }`}
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className=" bg-[#FFFFFF] mt-[12px] p-[12px] rounded-[12px] ">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center mb-[12px] last:mb-0">
                  <div className="relative">
                    {/* SVG tick mark to appear when checked */}
                    {checkedFeatures[index] && (
                      <Image
                        src={CheckcircleIcon}
                        className="size-[16px] "
                        height={24}
                        width={34}
                        alt="payment icon"
                      />
                    )}
                  </div>
                  <span className="ml-[12px] text-[#575757] leading-[28px]">
                    {feature}
                  </span>
                </div>
              ))}
              <button className=" bg-[#ECF7E2] rounded-[8px] mx-auto w-full text-[14px] text-[#575757] px-[24.5px] py-[12px] ">
                30 days free, then{' '}
                <span className=" font-[700] text-[16px]">₦ 3,000</span> /monthly
              </button>
            </div>
            <button
              type="submit"
              className="btn w-full mt-[12px] rounded-[32px] px-[28px] py-[14px] z-2  relative bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]"
              onClick={() => setShowMakePayment(true)}
            >
              Continue
            </button>
          </div>

          <div>
            <button
              onClick={() => setShowSubscriptionPlan(!showSubscriptionPlan)}
              className=" text-center z-[2] mb-[170px] relative w-full my-[24px]  text-[#FAFAFA] flex items-center justify-center gap-[5px] font-[500]"
            >
              See all subscriptions <BsChevronRight />
            </button>
          </div>
        </div>
      </div>

      {showSubscriptionPlan && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className=" h-[1084px] w-full z-[40]  top-[0%] fixed bg-[#1c1c1c73]"
        >
          <BottomDrawer
            footer={
              <button
                onClick={() => handleMakePayment()}
                type="submit"
                className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA]  flex items-center justify-center gap-[8px] font-[500]"
              >
                Subscribe
              </button>
            }
            label="Subscription plans"
            back={false}
            show={showSubscriptionPlan}
            close={true}
            onClose={() => setShowSubscriptionPlan(false)}
          >
            <div className="relative mt-[24px]  h-[86vh] overflow-y-auto w-full mb-4">
              <div className="mt-[16px] p-[4px] bg-[#F7F7F9] rounded-[12px] mb-[20px] flex justify-center w-fit mx-auto">
                {options.map((option: any) => (
                  <button
                    onClick={() => setSelectedOption(option)}
                    className={`${option.toLowerCase() === selectedOption.toLowerCase() && ' rounded-[12px] text-white  bg-[#66C227] '} p-[8px] `}
                    key={option.toLowerCase()}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {isGetAllPlansPending ? (
                <div className="flex items-center justify-center w-full">
                  <CircularProgress size="sm" />
                </div>
              ) : (
                <RadioGroup
                  orientation="vertical"
                  className=" flex flex-col w-full gap-[16px] "
                  color="success"
                >
                  <div className="mb-[10px] flex flex-col w-full gap-[16px]">
                    {['monthly', 'quaterly', 'yearly']?.map(
                      (period) =>
                        selectedOption?.toLowerCase() === period &&
                        plans[period as keyof Plans]
                          ?.slice()
                          .reverse()
                          .map((plan) => (
                            <CustomRadio
                              key={plan?.uid}
                              header1={`${plan?.name} ${plan?.name === 'prudy lite' ? '💫' : plan?.name === 'money master' ? '💪🏽' : '🚀'}`}
                              header2={` ${plan?.basePrice === 0 ? 'Free' : '₦' + plan?.basePrice.toLocaleString()}`}
                              header3={
                                period === 'monthly'
                                  ? plan?.weeklyAmount && plan.weeklyAmount > 0
                                    ? `₦ ${plan.weeklyAmount.toLocaleString()}/week`
                                    : null
                                  : plan?.monthlyAmount && plan.monthlyAmount > 0
                                    ? `₦ ${plan.monthlyAmount.toLocaleString()}/month`
                                    : null
                              }
                              className="flex w-full justify-between"
                              value={plan?.basePrice}
                              label={plan?.discount ? `save ${plan?.discount}%` : null}
                            >
                              <ul className="flex flex-col gap-[8px] pl-[1.5rem] mt-[5px] list-disc">
                                {plan?.benefits?.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </CustomRadio>
                          )),
                    )}
                  </div>
                </RadioGroup>
              )}
            </div>
          </BottomDrawer>
        </motion.div>
      )}

      {showSuccessfullPayment && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh] w-full z-[40] max-w-[500px] bottom-0 fixed bg-[#1c1c1c73]"
        >
          <ActionModal
            isOpen={showSuccessfullPayment}
            onClose={() => setShowSuccessfullPayment(false)}
            title="Removed successfully"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionRestriction;
