/// <reference types="react" />

'use client'
import { useRouter } from 'next/router';
import Header from '@/components/header'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent, Button, cn, VisuallyHidden, useRadio, RadioGroup, CircularProgress } from "@nextui-org/react";
import { BsChevronDown, BsChevronUp, BsPlus } from 'react-icons/bs';
import DeleteSuccessModal from '../../../../components/DeleteSuccessModal';
import Image from 'next/image';
import warninglogo from '/public/images/warn.gif';
import more from '/public/images/more.png';
import visa from '/public/images/visa.png';
import mastercard from '/public/images/master.png';
import { useAuthentication } from '@/app/store/AuthStore';
import { getAllPlans, getSinglePlan } from '@/app/services/SubscriptionService';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { completeAddPaymentMethodApi, deletePaymentMethodApi, getBillingCycleApi, getBillingHistoryApi, getPaymentMethodsApi, initAddPaymentMethodApi, setDefaultPaymentMethodApi } from '@/app/services/BillingServices';
import toast from 'react-hot-toast';
import BottomDrawer from '@/components/create-budget/BottomDrawer';



interface Features {
    maxReceiptsScanning: number;
    maxAccountLinking: number;
    maxTransactionSyncing: number;
    maxCollaboratorInvites: number;
    budgetAnalytics: boolean;
}

interface Plan {
    uid: string;
    name: string;
    benefits: string[];
    basePrice: number;
    currency: string;
    features: Features;
    createdAt: string;
    updatedAt: string;
    discount: number;
    weeklyAmount: number;
    monthlyAmount: number;
}

interface Plans {
    [frequency: string]: Plan[]; // e.g., "monthly", "quarterly", "yearly"
}

interface IBillingHistory {
    date: Date;
    planName: string;
    amount: number;
}

interface IBillCycle {
    amount: number;
    nextBillingDate: Date;
}

// Mock getAllPlans function type
type GetAllPlansFn = (token: string) => Promise<Plans>;

// Mock authenticated user type
interface AuthenticatedUser {
    token: string | null;
}
const Page = ({ params, searchParams }: { params: { id: string }, searchParams: { status: string, tx_ref: string, transaction_id: string } }) => {

    const { status, tx_ref, transaction_id } = searchParams;
    const queryClient = useQueryClient();
    const id: string = params['id'];
    const tabs = ['Subscription plans', 'Billing Cycle']
    const [activeTab, setActiveTab] = useState('Subscription plans')
    const options = ["Monthly", "Quarterly", "Yearly"];
    const [isOpen, setIsOpen] = useState(false);
    const [showCancelSubscription, setShowCancelSubscription] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccesfulCancelSubscription, setShowSuccesfulCancelSubscription] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [billingHistory, setBillingHistory] = useState([]); // Store fetched data
    const [hasMore, setHasMore] = useState(true); // Determine if more data is available
    const [visibleTooltipUid, setVisibleTooltipUid] = useState<string | null>(null);
    const [showSubscriptionPlan, setShowSubscriptionPlan] = useState<boolean>(false)
    const handleTooltipToggle = (uid: string) => {
        setVisibleTooltipUid(visibleTooltipUid === uid ? null : uid);

    };


    useEffect(() => {
        if (status && tx_ref && transaction_id) {
            console.log('Status:', status);
            console.log('Transaction Reference:', tx_ref);
            console.log('Transaction ID:', transaction_id);
            // Handle the parameters as needed
        }
    }, [status, tx_ref, transaction_id]);


    const limit = 10;


    const { authenticatedUser } = useAuthentication();

    const { data: getAllPlansData = [], isPending: isGetAllPlansPending, isError } = useQuery({
        queryKey: ['getAllPlans'],
        queryFn: () => getAllPlans(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token, // Only fetch if token exists
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        refetchOnMount: false, // Prevent refetching on component mount
        refetchInterval: false, // Disable polling
        staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    });

    const allOptions = Object.keys(getAllPlansData) || [];


    const [selectedOption, setSelectedOption] = useState<string>('');

    useEffect(() => {
        if (allOptions.length > 0 && !selectedOption) {
            setSelectedOption(allOptions[0]);
        }
    }, [allOptions, selectedOption]);

    const { data: getSinglePalnData = {}, isLoading: isLoadingGetSinglePlan } = useQuery({
        queryKey: ['gestSinglePlan', params?.id],
        queryFn: () => getSinglePlan(authenticatedUser?.token ?? '', params?.id),
        enabled: !!authenticatedUser?.token && !!params?.id, // Only fetch if token exists and plan id is provided
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        refetchOnMount: false, // Prevent refetching on component mount
        refetchInterval: false, // Disable polling
        staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    });

    console.log(getSinglePalnData);



    const { data: billingCycleData = {}, isPending: isGetBillingCyclePending, isError: isGetBillingCycleError } = useQuery({
        queryKey: ['getbillingCycle'],
        queryFn: () => getBillingCycleApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token, // Only fetch if token exists
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        refetchOnMount: false, // Prevent refetching on component mount
        refetchInterval: false, // Disable polling
        staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    });

    const { data: billingHistoryData = [], isPending: isGetBillingHistoryPending, isError: isGetBillingCycleHistoryError, isFetching } = useQuery({
        queryKey: ['getbillingHistory'],
        queryFn: () => getBillingHistoryApi(authenticatedUser?.token ?? '', currentPage, limit),
        enabled: !!authenticatedUser?.token, // Only fetch if token exists
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        refetchOnMount: false, // Prevent refetching on component mount
        refetchInterval: false, // Disable polling
        staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    });



    const { data: getPaymentMethodData = [], isPending: isGetPaymentMethodPending, isError: isGetPaymentMethodError } = useQuery({
        queryKey: ['paymentMethods'],
        queryFn: () => getPaymentMethodsApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token, // Only fetch if token exists
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        refetchOnMount: false, // Prevent refetching on component mount
        refetchInterval: false, // Disable polling
        staleTime: 5 * 60 * 1000, // Data will be considered fresh for 5 minutes
    });



    console.log(getPaymentMethodData);


    const currentPlan = getSinglePalnData?.data;
    const billingDate = new Date(currentPlan?.createdAt); // Get the 'createdAt' date

    // Format the date as needed (e.g., 'YYYY-MM-DD')
    const formattedDate = billingDate.toLocaleDateString('en-GB'); // You can adjust the locale and format



    function rearrangePlans(plans: Plans, targetId: string, selectedOption: string): Plan[] {
        // Extract plans into separate arrays
        const monthlyPlans = plans.monthly || [];
        const quarterlyPlans = plans.quaterly || [];
        const yearlyPlans = plans.yearly || [];

        // Function to prioritize the targetId plan
        const prioritizePlan = (planList: Plan[], targetId: string): Plan[] => {
            const targetPlan = planList.find(plan => plan.uid === targetId);
            const otherPlans = planList.filter(plan => plan.uid !== targetId);
            return targetPlan ? [targetPlan, ...otherPlans] : otherPlans;
        };

        // Rearrange each group individually
        const prioritizedMonthly = prioritizePlan(monthlyPlans, targetId);
        const prioritizedQuarterly = prioritizePlan(quarterlyPlans, targetId);
        const prioritizedYearly = prioritizePlan(yearlyPlans, targetId);

        // Combine all plans with the prioritized plan at the start, filter by selected option
        let filteredPlans: Plan[] = [];
        if (selectedOption === "All") {
            filteredPlans = [...prioritizedMonthly, ...prioritizedQuarterly, ...prioritizedYearly];
        } else if (selectedOption === "Monthly") {
            filteredPlans = prioritizedMonthly;
        } else if (selectedOption === "Quarterly") {
            filteredPlans = prioritizedQuarterly;
        } else if (selectedOption === "Yearly") {
            filteredPlans = prioritizedYearly;
        }

        return filteredPlans;
    }


    const rearrangedPlans = rearrangePlans(getAllPlansData, params?.id, selectedOption);

    console.log(rearrangedPlans);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const handleCancelSubscription = () => {
        setShowCancelSubscription(false);
        setShowSuccesfulCancelSubscription(true);
    };

    // Detect when user scrolls to the bottom
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 50 // Adjust the threshold as needed
        ) {
            if (hasMore && !isFetching) {
                setCurrentPage((prev) => prev + 1); // Load the next page
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetching]); // Re-attach event listener when necessary


    const transactionIdRef = useRef(false);

    useEffect(() => {
        if (transaction_id && !transactionIdRef.current) {
            completeAddPaymentMethodMutation.mutate({
                token: authenticatedUser?.token ?? '',
                paymentRef: transaction_id,
            });
            transactionIdRef.current = true;
        }
    }, [transaction_id, authenticatedUser?.token]);


    // React Query mutation for verifying OTP
    const initializePaymentMethodMutation = useMutation({
        mutationFn: (token: any) => initAddPaymentMethodApi(token),
        onSuccess: (data: any) => {
            if (data?.link) {
                console.log(data.link);
                window.location.href = data.link;
            }
        },
        onError: (error: Error) => {
            console.error('Error initializing payment method:', error);
        },
    });

    const completeAddPaymentMethodMutation = useMutation({
        mutationFn: ({ token, paymentRef }: { token: string, paymentRef: string }) => completeAddPaymentMethodApi(token, paymentRef),
        onSuccess: (data: any) => {
            console.log('Payment method added successfully:', data);
        },
        onError: (error: Error) => {
            console.error('Error completing payment method:', error);
        },
    });



    const setDefaultPaymentMethodMutation = useMutation({
        mutationFn: ({ token, cardId }: { token: string, cardId: string }) => setDefaultPaymentMethodApi(token, cardId),
        onMutate: async ({ cardId }) => {
            await queryClient.cancelQueries({ queryKey: ['paymentMethods'] });
            const previousPaymentMethods = queryClient.getQueryData(['paymentMethods']);
            queryClient.setQueryData(['paymentMethods'], (old: any) =>
                old.map((method: any) =>
                    method.uid === cardId ? { ...method, isDefault: true } : { ...method, isDefault: false }
                ).sort((a: any, b: any) => b.isDefault - a.isDefault)
            );
            return { previousPaymentMethods };
        },
        onError: (error, variables, context) => {
            if (context?.previousPaymentMethods) {
                queryClient.setQueryData(['paymentMethods'], context.previousPaymentMethods);
            }
            toast.error('Failed to set default payment method');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
        },
    });

    const deletePaymentMethodMutation = useMutation({
        mutationFn: ({ token, cardId }: { token: string, cardId: string }) => deletePaymentMethodApi(token, cardId),
        onMutate: async ({ cardId }) => {
            await queryClient.cancelQueries({ queryKey: ['paymentMethods'] });
            const previousPaymentMethods = queryClient.getQueryData(['paymentMethods']);
            queryClient.setQueryData(['paymentMethods'], (old: any) =>
                old.filter((method: any) => method.uid !== cardId)
            );
            return { previousPaymentMethods };
        },
        onError: (error, variables, context) => {
            if (context?.previousPaymentMethods) {
                queryClient.setQueryData(['paymentMethods'], context.previousPaymentMethods);
            }
            toast.error('Failed to delete payment method');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
        },
    });



    const handleSetDefaultPaymentMethod = (cardId: string) => {
        setDefaultPaymentMethodMutation.mutate({
            token: authenticatedUser?.token ?? '',
            cardId,
        });
        setVisibleTooltipUid(null)
    };

    const handleDeletePaymentMethod = (cardId: string) => {
        deletePaymentMethodMutation.mutate({
            token: authenticatedUser?.token ?? '',
            cardId,
        });
        setVisibleTooltipUid(null)
    };

    const handleAddNewCard = async () => {
        try {
            initializePaymentMethodMutation.mutateAsync(authenticatedUser?.token ?? '');
        } catch (error) {
            console.log(error);
        }
    }

    const plans: Plans = getAllPlansData




    const handleMakePayment = () => {

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

        const { duration, header1,
            header2,
            header3,
            label,
            label2Text,
            labelText } = props;

        // Combine description and duration into a single node
        const combinedDescription = (
            <div className="flex gap-[8px] text-[#575757] items-center">
                <span className="text-[16px] font-[500]">{description}</span>
                {duration && <span className='text-[12px]'>{duration}</span>} {/* Only render duration if it exists */}
            </div>
        );

        return (
            <Component
                {...getBaseProps()}
                className={cn(
                    "group flex flex-col p-4 rounded-lg border-1 transition-all",
                    "w-full cursor-pointer flex-nowrap border border-default rounded-[20px] gap-4",
                    isSelected ? "border-[#66C227] bg-[#ECFDDC]" : "bg-[#F7F7F9] border-[#EFEFF0]"
                )}
            >
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>

                <div className=' flex w-full items-start '>
                    <div className="flex flex-col w-full  ">
                        <div className={`flex justify-between  `}>
                            <div >
                                <h1 className='text-[#66C227] font-[700] text-[14px]'>{header1} {label && <span className={`px-[8px]
                                 ${isSelected ? 'text-[#ffffff] bg-[#66C227] ' : 'text-black bg-white'}    ml-[8px] py-[2px] text-[10px]  rounded-[12px] font-[400]`}>{labelText}</span>}  {label2Text && <span className={`px-[8px]
                                    ${isSelected ? 'text-[#ffffff] bg-[#66C227] ' : 'text-black bg-white'}    ml-[8px] py-[2px] text-[10px]  rounded-[12px] font-[400]`}>{label2Text}</span>}</h1>

                                <h1 className='mt-[8px] flex items-start font-[700] text-[24px] leading-[24px]'>{header2} <span className=' text-[12px] font-[400] text-[#575757] ml-[8px]'>{header3}</span></h1>
                            </div>
                            <div  {...getWrapperProps()}>
                                <div {...getControlProps()} />
                            </div>
                        </div>
                        <div>
                            <div {...getLabelProps()} className="text-[#575757] mt-[12px] w-full bg-[#FFFFFF] rounded-b-[12px] text-[12px] py-[12px]   px-[4px] ">{children}</div>
                            {combinedDescription} {/* Use the combined description node */}

                        </div>
                    </div>



                </div>

            </Component>
        );
    };







    return (
        <div className='relative w-full max-w-[500px] overflow-x-hidden  h-screen'>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', stiffness: 600 }}
                className=' pb-[44px]'
            >
                <Header link={`/profile`} title="Manage Subscription" />
                <div className='px-[24px] pb-[44px]'>

                    <div className=' bg-[#F7F7F9] mb-[28px] rounded-[12px]  flex  p-[4px] mt-[12px]  '>
                        {tabs.map((tab: string, i) => (
                            <button onClick={() => setActiveTab(tab)} key={i} className={` w-full  rounded-[12px] py-[8px] items-center px-[21px] ${activeTab === tab ? ' bg-white' : ''}`}>{tab}</button>
                        ))}
                    </div>
                    <div className='flex px-[8px] items-center justify-between'>
                        <h2 className=''>{activeTab}</h2>
                        {activeTab === 'Subscription plans' ? (
                            <Button onClick={() => setShowSubscriptionPlan(true)} className=' bg-[#fff] border border-[#E7E7EA] font-[400] text-[14px] flex gap-[.8rem] justify-between rounded-[24px] px-[12px] py-[8px]  items-center' >
                                Change plan
                            </Button>

                        ) : (
                            <button onClick={() => setShowCancelSubscription(true)} className='text-[12px] cursor-pointer font-[400] text-[#D2303E]'>Cancel Subscription</button>
                        )}
                    </div>
                    {activeTab === 'Subscription plans' ? (
                        <div  >
                            {isGetAllPlansPending ? <div className='flex items-center justify-center w-full'>
                                <CircularProgress size='sm' />
                            </div>
                                :
                                <RadioGroup

                                    className="flex flex-col overflow-x-hidden w-full gap-[16px]"
                                    color="success"
                                    classNames={{
                                        base: 'mt-[24px]'
                                    }}
                                >
                                    <div className="mb-[10px] flex flex-row w-full gap-[16px] overflow-x-auto">

                                        <div key={getSinglePalnData?.data?.uid} className="h-[242px] w-full ">
                                            <CustomRadio
                                                header1={getSinglePalnData?.data?.name}
                                                header2={` ${getSinglePalnData?.data?.basePrice === 0 ? 'Free' : '₦' + getSinglePalnData?.data?.basePrice.toLocaleString()}`}
                                                header3={
                                                    getSinglePalnData?.data?.basePrice !== 0
                                                        ? (getSinglePalnData?.data?.weeklyAmount && getSinglePalnData?.data?.weeklyAmount > 0
                                                            ? `₦ ${getSinglePalnData?.data?.weeklyAmount.toLocaleString()}/week`
                                                            : `₦ ${getSinglePalnData?.data?.monthlyAmount.toLocaleString()}/month`)
                                                        : null
                                                }
                                                className="flex w-full h-full justify-between min-w-[300px]"
                                                value={`₦ ${getSinglePalnData?.data?.basePrice}`}
                                                label={getSinglePalnData?.data?.discount}
                                                label2={getSinglePalnData?.data?.uid === params.id}
                                                label2Text={getSinglePalnData?.data?.uid === params.id ? "Current plan" : "d"}

                                                labelText={`save ${getSinglePalnData?.data?.discount}%`}
                                            >
                                                <ul className="flex flex-col gap-[8px] pl-[1.5rem] mt-[5px] list-disc">
                                                    {getSinglePalnData?.data?.benefits?.map((benefit: any, index: any) => (
                                                        <li key={index}>{benefit}</li>
                                                    ))}
                                                </ul>
                                            </CustomRadio>
                                        </div>
                                    </div>

                                </RadioGroup>
                            }
                            <div className='flex justify-between items-center mt-[40px]'>
                                <h1>Payment methods</h1>
                                <button onClick={() => handleAddNewCard()} className='bordr-[#E7E7EA] border rounded-[16px] p-[8px] text-[14px] text-[#575757] flex gap-[4px] items-center'>
                                    <span><BsPlus size={20} /></span> Add new card
                                </button>
                            </div>
                            {initializePaymentMethodMutation.isPending && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <CircularProgress />
                                </div>
                            )}
                            {isGetPaymentMethodPending ? <div className='flex items-center justify-center w-full'>
                                <CircularProgress size='sm' />
                            </div>
                                :
                                <div className=' flex gap-[16px] flex-col mt-[16px] '>
                                    {getPaymentMethodData.length > 0 ? (
                                        <AnimatePresence>
                                            {getPaymentMethodData.map((item: any) => (
                                                <motion.div
                                                    key={item.uid}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`flex justify-between p-[16px] rounded-[16px] ${item.isDefault ? 'bg-[#ECFDDC] border-[#66C227] border' : 'bg-[#ffffff] border border-[#EFEFF0]'} items-center`}
                                                >
                                                    <div className="flex gap-[12px] items-start">
                                                        <div className="flex gap-[8px] items-center">
                                                            {item.type === "MASTERCARD" && <Image className='w-[40px] h-[35px]' src={mastercard} width={1000} height={1000} alt="payment icon" />}
                                                            {item.type === "VISA" && <Image className='w-[40px] h-[35px]' src={visa} width={1000} height={1000} alt="payment icon" />}
                                                            <div className='flex flex-col gap-[4px]'>
                                                                <p className="text-[14px] font-[500] text-[#2D2D2D]">{'**** **** **** '} {item.lastFourDigits}</p>
                                                                <p className="text-[12px] text-[#828282]">Expiry {item.expiry}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] px-[8px] py-[2px] rounded-[12px] bg-white text-[#66C227]">{item.isDefault ? 'default' : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <button onClick={() => handleTooltipToggle(item.uid)}>
                                                            <Image src={more} className='w-6 h-6' alt="more" width={24} height={24} />
                                                        </button>
                                                        {visibleTooltipUid === item.uid && (
                                                            <div className="absolute top-[60%] grid gap-[24px] place-content-center w-[109px] min-h-[72px]  right-[20px] transform translate-y-2 z-10 bg-white p-2 rounded-md shadow-xl">
                                                                <div className="flex text-[#575757] gap-[8px] flex-col">
                                                                    <button className="text-[12px] p-2  hover:bg-gray-100 rounded-md" onClick={() => handleSetDefaultPaymentMethod(item.uid)}>
                                                                        Make Default
                                                                    </button>
                                                                    <button className="text-[12px] p-2  hover:bg-gray-100 rounded-md" onClick={() => handleDeletePaymentMethod(item.uid)}>
                                                                        Delete Card
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    ) : (
                                        <p className='text-[14px] text-center text-[#575757] mt-[36px] font-medium'>
                                            No payment methods added yet
                                        </p>
                                    )}
                                </div>}
                        </div>
                    ) : null}




                    {activeTab === 'Billing Cycle' ?
                        <div className='border-[#EFEFF0] bg-[#F7F7F9] flex items-start justify-between border rounded-[12px] p-[16px] mt-[16px]'>

                            {isGetBillingCyclePending ? <div className='flex items-center justify-center w-full'>
                                <CircularProgress size='sm' />
                            </div>

                                :

                                <>
                                    <div>
                                        <h1 className='text-[14px] font-[500]'>Next billing date</h1>
                                        <p className='text-[#828282] mt-[8px] text-[12px] leading-[14.4px]'>
                                            {billingCycleData.nextBillingDate
                                                ? new Date(billingCycleData.nextBillingDate).toLocaleDateString()
                                                : new Date().toLocaleDateString()}
                                        </p>

                                    </div>
                                    <div>
                                        <h1 className='text-[16px] font-[600]'>
                                            ₦  {billingCycleData?.amount ? billingCycleData?.amount.toFixed(2) : '0'}
                                        </h1>
                                    </div>

                                </>
                            }
                        </div> : null}


                    {activeTab === 'Billing Cycle' && (
                        <div className="mt-[24px]">
                            <h2 className="text-[14px] font-[500] mb-[16px]">Billing History</h2>
                            {isGetBillingHistoryPending ? <div className='flex items-center justify-center w-full'>
                                <CircularProgress size='sm' />
                            </div> :
                                <div className="flex flex-col gap-[16px]">
                                    {billingHistoryData?.docs?.length > 0 ? (
                                        billingHistoryData.docs.map((history: IBillingHistory, index: number) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div className="flex gap-[12px] items-center">
                                                    <div>
                                                        <p className="text-[14px] font-[500]">{new Date(history?.date).toLocaleDateString()}</p>
                                                        <p className="text-[12px] text-[#828282]">{history?.planName}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[14px] font-[500]">{history?.amount.toFixed(2)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-[14px] text-[#828282]">No billing history available</p>
                                    )}
                                    {isFetching && <p>Fetching more data...</p>}
                                    {!hasMore && <p>No more data available</p>}
                                </div>
                            }
                        </div>
                    )}
                </div>


            </motion.div>



            {
                showCancelSubscription &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] max-w-[500px] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >
                    <div
                        onClick={() => setShowCancelSubscription(false)}
                        className="fixed bg-[#00000095] px-[24px] grid place-content-center h-[100vh] max-w-[500px] w-full z-[50] top-0"
                    >
                        <div className="bg-white flex flex-col rounded-[40px] items-center text-center w-full p-8">
                            <Image src={warninglogo} alt="Warning" className="size-[90px]" width={90} height={90} />
                            <h1 className="my-[8px] font-[500] text-[20px]">Cancel Subscription</h1>
                            <p className="text-[#707170] leading-[24px]">
                                You are about to cancel your subscription from Prudy. Are you sure you want to proceed with this action?
                            </p>

                            <div className="w-full flex gap-[16px] justify-between mt-[24px]">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelSubscription();
                                    }}
                                    className="flex-1 bg-[#EFF0F6] text-[#514F6E] rounded-[32px] py-[14px] text-center"
                                >
                                    Yes, cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCancelSubscription(false);
                                    }}
                                    className="flex-1 bg-black text-white rounded-[32px] py-[14px] text-center"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            }




            {
                showSubscriptionPlan &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full z-[40] fixed bg-[#1c1c1c73] top-0  max-w-[500px] flex items-center justify-center"
                >
                    <BottomDrawer
                        footer={<button onClick={() => handleMakePayment()} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">Subscribe</button>}
                        label="Subscription plans"
                        back={false}
                        show={showSubscriptionPlan}
                        close={true}
                        onClose={() => setShowSubscriptionPlan(false)}
                    >
                        <div className="relative mt-[24px] overflow-y-auto h-[calc(80vh-100px)] w-full mb-4">
                            <div className='mt-[16px] p-[4px] bg-[#F7F7F9] rounded-[12px] mb-[20px] flex justify-center w-fit mx-auto'>
                                {allOptions.map((option: any) => (
                                    <button onClick={() => setSelectedOption(option)} className={`${option === selectedOption && 'rounded-[12px] text-white bg-[#66C227]'} p-[8px]`} key={option}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {isGetAllPlansPending ?
                                <div className='flex items-center justify-center w-full'>
                                    <CircularProgress size='sm' />
                                </div> :
                                <RadioGroup
                                    orientation="vertical"
                                    className='flex flex-col w-full gap-[16px]'
                                    color='success'
                                >
                                    <div className="mb-[10px] overflow-y-auto flex flex-col w-full gap-[16px]">
                                        {['monthly', 'quaterly', 'yearly']?.map((period) => (
                                            selectedOption === period &&
                                            plans[period as keyof Plans]?.slice().reverse().map((plan) => (
                                                <CustomRadio
                                                    key={plan?.uid}
                                                    header1={`${plan?.name} ${plan?.name === 'prudy lite' ? '💫' : plan?.name === 'money master' ? '💪🏽' : '🚀'}`}
                                                    header2={` ${plan?.basePrice === 0 ? 'Free' : '₦' + plan?.basePrice.toLocaleString()}`}
                                                    header3={
                                                        period === 'monthly'
                                                            ? (plan?.weeklyAmount && plan.weeklyAmount > 0 ? `₦ ${plan.weeklyAmount.toLocaleString()}/week` : null)
                                                            : (plan?.monthlyAmount && plan.monthlyAmount > 0 ? `₦ ${plan.monthlyAmount.toLocaleString()}/month` : null)
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
                                            ))
                                        ))}
                                    </div>
                                </RadioGroup>
                            }
                        </div>
                    </BottomDrawer>
                </motion.div>
            }

            {showSuccesfulCancelSubscription && (
                <DeleteSuccessModal
                    showModal={showSuccesfulCancelSubscription}
                    setShowModal={setShowSuccesfulCancelSubscription}
                    handleClose={() => console.log('Modal closed')}
                    text='Your subscription has been cancelled successfully'
                />
            )}
        </div>
    )
}

export default Page