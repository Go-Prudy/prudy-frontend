'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import Header from '@/components/header';
import Flag from 'react-world-flags'; // import flag component
import { CircularProgress, Switch } from '@nextui-org/react';
import Link from 'next/link';
import Image from 'next/image';
import warninglogo from '/public/images/warn.gif';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import axios from 'axios';
import { getAllCurrenciesApi } from '@/app/services/MISC';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ICurrencyData } from '@/app/Types';
import { GetSettingsApi, SetCurrencyApi } from '@/app/services/SettingService';

const Page = () => {
    const [currentState, setCurrentState] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAfreshModal, setShowAfresh] = useState(false);
    const [showAllCurrency, setShowAllCurrency] = useState(false);
    const { authenticatedUser } = useAuthentication();
    const [selectedCurrecy, setSelectedCurrency] = useState<any>({});
    const handleDelete = () => {
        console.log(` deleted successfully.`);
        // Implement your delete logic here (e.g., API call to delete category)
        setShowDeleteModal(false); // Close the modal after deletion
    };

    // // Example API endpoint for currencies (you can use an API like Open Exchange Rates or a custom one)
    // const currencyApiUrl = 'https://openexchangerates.org/api/currencies.json';

    // // REST Countries API to get flags
    // const restCountriesApiUrl = 'https://restcountries.com/v3.1/all';
    // const [currencies, setCurrencies] = useState([]);
    // const [loading, setLoading] = useState(true);


    // useEffect(() => {
    //     const fetchCurrenciesAndFlags = async () => {
    //         try {
    //             // Fetch currencies from the currency API
    //             const currencyResponse = await axios.get(currencyApiUrl);
    //             const currencyData = currencyResponse.data;
    //             console.log(currencyResponse);

    //             // Fetch country information to get flags
    //             const countryResponse = await axios.get(restCountriesApiUrl);
    //             const countryData = countryResponse.data;

    //             // Map currency data with country flags
    //             const currencyList: any = Object.keys(currencyData).map((code) => {
    //                 // Find the matching country data
    //                 const country = countryData.find((country: any) =>
    //                     country.currencies && Object.keys(country.currencies).includes(code)
    //                 );

    //                 return {
    //                     code,
    //                     name: currencyData[code],
    //                     country: country ? country.cca2 : null, // Country code (ISO alpha-2)
    //                     flag: country ? country.flags.png : null, // URL of the flag
    //                 };
    //             });

    //             setCurrencies(currencyList);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching currencies or flags:', error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchCurrenciesAndFlags();
    // }, []);



    const { data: getAllCurrenciesData = [], status: getAllCurrenciesStatus, isPending: getAllCurrenciesIsPending } = useQuery({
        queryKey: ['getAllCurrencies'],
        queryFn: () => getAllCurrenciesApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        staleTime: 5 * 60 * 1000
    });
    console.log(getAllCurrenciesData);



    const { data: getSettingsData = {}, isPending: getSettingsDataisPending } = useQuery({
        queryKey: ['getSettings'],
        queryFn: () => GetSettingsApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        staleTime: 5 * 60 * 1000
    });

    console.log(getSettingsData)



    // React Query mutation to invite a collaborator
    const SetCurrencyApiMutation = useMutation({
        mutationFn: (data: any) =>
            SetCurrencyApi(authenticatedUser?.token ?? '', data),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error: unknown) => {
            console.error('Error inviting collaborator:', error);
        },
    });


    // Function to handle form submission for inviting a collaborator
    const handleChangeCurrency = async (countryCode: any) => {
        try {
            await SetCurrencyApiMutation.mutateAsync(countryCode);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (getAllCurrenciesData?.length > 0 && !selectedCurrecy) {
            const data = { countryCode: getAllCurrenciesData[0]?.abbreviation };
            console.log("Default Currency Change:", data);
            handleChangeCurrency(data);
        }
    }, [getAllCurrenciesData]);

    useEffect(() => {
        if (selectedCurrecy?.currency) {
            const data = { countryCode: selectedCurrecy?.currency };
            console.log("Selected Currency Change:", data);
            handleChangeCurrency(data);
        }
    }, [selectedCurrecy]);



    return (
        <div className='  w-[100vw] max-w-[500px]'>
            <Header link={`/profile`} title="Currency Settings" />
            <div className=' px-[24px]'>
                <div className=' bg-[#F7F7F9] mt-[16px]  p-[8px] rounded-[12px]  border flex gap-[8px] border-[#EFEFF0] '>
                    <button onClick={() => setCurrentState(false)} className={`${!currentState ? 'bg-white' : 'bg-none'} text-center w-full py-[8px] rounded-[8px] `}>Currency</button>
                    <button onClick={() => setCurrentState(true)} className={`${currentState ? 'bg-white' : 'bg-none'} text-center w-full py-[8px] rounded-[8px] `}>Data settings</button>
                </div>

                {currentState === false && <>
                    <h1 className=' font-[500] text-[20px] mt-[16px]'>Set your preferred currency</h1>

                    <div className=' mt-[24px] w-full bg-[#F7F7F9] p-[16px] rounded-[24px] border-[#EFEFF0] border'>
                        <div className=' text-[#828282] w-full flex justify-between'>
                            <h1 className=' text-[14px] '>Default currency</h1>
                            <button onClick={() => setShowAllCurrency(true)} className=' bg-white rounded-[10px] text-[#828282] px-[8px] text-[12px] py-[4px]  '>change</button>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className=' w-[24px] rounded-full  h-[24px] '>
                                <Image src={getSettingsData?.countryFlag || ''} width={1000} height={1000} className=' size-[24px] mb-[8px]' alt="" />

                            </div>
                            <h1 className=' font-[500] text-[14px] '>{getSettingsData?.currency || 'NGN'}</h1>
                        </div>
                    </div>
                </>}

                {currentState === true && <>
                    <h1 className=' font-[500] text-[20px] mt-[16px]'>Manage Data sharing preferences</h1>
                    <div className=' mt-[24px] w-full bg-[#F7F7F9] p-[16px] rounded-[24px] border-[#EFEFF0] border'>
                        <div className=' w-full flex justify-between items-center'>
                            <h1 className=' leading-[28px] font-[500]'>Enable Bank Syncing</h1>
                            <Switch defaultSelected color="success"></Switch>
                        </div>

                        <h1 className=' text-[#828282] text-[14px] leading-[17px] mt-[8px] mb-[16px] '>Share transaction data with linked bank accounts for real-time updates.</h1>
                        <div className=' font-[700] text-[12px] text-[#828282]'>
                            <h1>Last Synced:  <span className=''>Sept 15, 2024</span></h1>
                        </div>


                    </div>


                    <div className=' mt-[24px] w-full bg-[#F7F7F9] p-[16px] rounded-[24px] border-[#EFEFF0] border'>
                        <h1 className=' leading-[28px] font-[500]'>Start afresh</h1>
                        <h1 className=' text-[#828282] text-[14px] leading-[17px] mt-[8px] mb-[16px] '>Remove all my added data</h1>
                        <button onClick={() => {
                            setShowAfresh(true)
                            setShowAfresh(!showAfreshModal)
                        }
                        } className=' bg-[#F7DAE0] w-full py-[12px] rounded-[32px] text-[14px] text-center text-[#F5365C]  '>Refresh</button>
                    </div>


                    <div className=' mt-[24px] w-full bg-[#F7F7F9] p-[16px] rounded-[24px] border-[#EFEFF0] border'>
                        <h1 className=' leading-[28px] font-[500]'>Delete data</h1>
                        <h1 className=' text-[#828282] text-[14px] leading-[17px] mt-[8px] mb-[16px] '>Delete my profile and all associated data</h1>
                        <button onClick={() => {
                            setShowAfresh(false)
                            setShowDeleteModal(true);
                        }

                        } className=' bg-[#F7DAE0] w-full py-[12px] rounded-[32px] text-[14px] text-center text-[#F5365C]  '>Delete data</button>
                    </div>

                    <div>
                        <h1 className=' font-[500] text-[#828282] mt-[20px] text-[14px]'>
                            Kindly note that customers data are only used for the purpose of improving their budgeting experience and no other purpose.

                            <span className=' mt-[16px] block mb-[24px] '>
                                See our  <Link className=' text-[#66C227]' href={'/terms&condition'}>
                                    Privacy Policy and Terms of Service  </Link>  for more information.
                            </span>
                        </h1>
                    </div>
                </>
                }








            </div>







            <>


                {/* Delete Modal */}
                {showDeleteModal && (
                    <div
                        onClick={() => setShowDeleteModal(false)} // Close modal when clicking outside the content
                        className="fixed bg-[#00000095] px-[24px] grid place-content-center h-[100vh] w-full z-[50] top-0"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                            className="bg-white flex flex-col rounded-[40px] items-center text-center w-full max-w-[400px] p-8"
                        >
                            <Image
                                src={warninglogo}
                                alt="Warning"
                                className="w-[90px] h-[90px]"
                                width={90}
                                height={90}
                            />
                            <h1 className="my-[8px] font-[500] text-[20px]">Delete category</h1>
                            <p className="text-[#707170] leading-[24px]">
                                Are you sure you want to delete your data on this app? You won’t be able to recover your profile data again after doing this
                            </p>

                            <div className="w-full flex gap-[16px] justify-between mt-[24px]">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal from closing when clicking the button
                                        handleDelete(); // Delete the category by ID
                                    }}
                                    className="flex-1 bg-[#EFF0F6] text-[#514F6E] rounded-[32px] py-[14px] text-center"
                                >
                                    Yes, delete
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal from closing when clicking the button
                                        setShowDeleteModal(false); // Close modal
                                    }}
                                    className="flex-1 bg-black text-white rounded-[32px] py-[14px] text-center"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>


            <>


                {/* Delete Modal */}
                {showAfreshModal && (
                    <div
                        onClick={() => setShowAfresh(false)} // Close modal when clicking outside the content
                        className="fixed bg-[#00000095] px-[24px] grid place-content-center h-[100vh] w-full z-[50] top-0"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                            className="bg-white flex flex-col rounded-[40px] items-center text-center w-full max-w-[400px] p-8"
                        >
                            <Image
                                src={warninglogo}
                                alt="Warning"
                                className="w-[90px] h-[90px]"
                                width={90}
                                height={90}
                            />
                            <h1 className="my-[8px] font-[500] text-[20px]">Start afresh</h1>
                            <p className="text-[#707170] leading-[24px]">
                                Are you sure you want to refresh your data on this application? This will reset as though you’re a new user
                            </p>

                            <div className="w-full flex gap-[16px] justify-between mt-[24px]">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal from closing when clicking the button
                                        setShowAfresh(false); // Delete the category by ID
                                    }}
                                    className="flex-1 bg-[#EFF0F6] text-[#514F6E] rounded-[32px] py-[14px] text-center"
                                >
                                    Yes, delete
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal from closing when clicking the button
                                        setShowAfresh(false) // Close modal
                                    }}
                                    className="flex-1 bg-black text-white rounded-[32px] py-[14px] text-center"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>



            {
                showAllCurrency && (
                    <motion.div
                        initial={{ opacity: 0, y: 90 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-[100vh] max-w-[500px] w-full z-[40] bottom-0 max-w-[500px] fixed bg-[#1c1c1c73]"
                    >
                        <BottomDrawer
                            label={`Filter budget categories`}
                            back={false}
                            show={showAllCurrency}
                            close={true}
                            onClose={() => setShowAllCurrency(!showAllCurrency)}
                        >
                            <div className=" w-full my-[24px] ">
                                <div className="flex w-full flex-wrap">
                                    <ul className=' h-[30vh] w-full overflow-y-scroll overflow-x-hidden'>
                                        {!getAllCurrenciesIsPending ?
                                            <>
                                                {getAllCurrenciesData?.map((currency: ICurrencyData, index: number) => (
                                                    <li
                                                        key={currency?.countryCode}
                                                        className={`flex w-full items-center text-[14px] text-[#575757] leading-[28px] mb-4 ${index !== getAllCurrenciesData?.length - 1 ? 'border-b border-b-[#F7F7F9]' : ''
                                                            }`}
                                                        onClick={() => setSelectedCurrency(currency)}
                                                    >
                                                        {/* Conditional rendering for the Image */}
                                                        {currency?.flag ? (
                                                            <Image
                                                                src={currency?.flag}
                                                                alt={currency?.country || 'Unknown country'}
                                                                width={1000}
                                                                height={1000}
                                                                className="mr-2 rounded-full size-[24px] "
                                                                style={{ marginRight: '10px' }}
                                                            />
                                                        ) : (
                                                            <span className="mr-2">🏳️</span>
                                                        )}
                                                        {currency?.abbreviation}
                                                    </li>
                                                ))}
                                            </>
                                            :
                                            <div className=' flex flex-col justify-center items-center m-auto my-[20px]'>
                                                <CircularProgress size='md' className=' mx-auto flex justify-center items-center ' />
                                                loading...
                                            </div>
                                        }

                                    </ul>
                                </div>
                            </div>
                        </BottomDrawer>
                    </motion.div>
                )
            }

        </div>
    )
}

export default Page;
