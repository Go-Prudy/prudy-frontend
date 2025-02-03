'use client'
import React, { useEffect, useRef, useState, use, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import { BsArrowRight, BsPlus } from 'react-icons/bs';
import moneyIcon from '/public/images/money.png';
import noBudgetImg from '/public/images/List 2.webp'

import Image from 'next/image';
import BottomDrawer from '@/components/create-budget/BottomDrawer';
import { useRouter } from 'next/navigation';
import { useBudgetStore } from '@/app/store/Store';
import { IAllocation, IBudget, ICreateCategory, IExpense, ISubAllocation } from '@/app/Types';

import DeleteSuccessModal from '@/components/DeleteSuccessModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { createBudgetApi, createBudgetCategoryApi, CreateSubCategoryApi, getAllBudgetCategoriesApi, RecordExpenseApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CircularProgress } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { IPreviousBudget, IPreviousBudgetAllocation } from '@/app/types/budget';

const Page = (props: { params: { id: string } }) => {
    const budgetId = props.params.id;
    const all_Budgets = useBudgetStore((state) => state.budgets);
    const currentBudget = all_Budgets?.find((b) => b.id === budgetId);

    interface BudgetAllocation {
        budgetCategory: { uid: string; name:string };  // UUID as a string
        amount: number;          // Amount allocated
        percentage: number;      // Percentage allocation (could be 0-1 range, i.e., 19% = 0.19)
        subAllocations: SubAllocation[];  // Array of sub-allocations, if any
    }

    interface SubAllocation {
        subCategory: string;    // Sub-category identifier (e.g., UUID)
        amount: number;         // Amount for this sub-category
    }

    type SubAllocation2 = {
        subCategory: string;
        name: string;
        amount: number;
    };




    const hasSelectedBudget = useRef(false); // This ref will track if the budget has already been selected
    const [showSelectedBudget, setShowSelectedBudget] = useState<boolean>(false)
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false)
    const [showNewBudgetCategory, setShowNewBudgetCategory] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [selectedBudget, setSelectedBudget] = useState<any>()
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const [allocations, setAllocations] = useState<IAllocation[]>([])
    const [previousSubAllocations, setPreviousSubAllocations] = useState<ISubAllocation[]>([]);
    const { addAllocationToBudget } = useBudgetStore();
    const [lastBudget, setLastBudget] = useState<IBudget | IPreviousBudget | null>(null);
    const [categoryName, setCategoryName] = useState<string>('')
    const [allDisplayedBudgets, setAllDisplayedBudgets] = useState<BudgetAllocation[]>([])
    const [loading, setLoading] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [singleBudget, setSingleBudget] = useState<any>()
    const [bluredData, setBluredData] = useState<SubAllocation2[]>([])
    const navigate = useRouter();
    const { authenticatedUser } = useAuthentication();

    const { getLastBudget, previousBudget, budgets, allCategories } = useBudgetStore((state) => ({
        getLastBudget: state.getLastBudget,
        budgets: state.budgets,
        allCategories: state.allCategories,
        previousBudget: state.previousBudget

    }))

    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchedLastBudget = getLastBudget();
        if (fetchedLastBudget) {
            setLastBudget(fetchedLastBudget);

        } else {
            setLastBudget(null);
        }
    }, [getLastBudget, bluredData]);

    const [budgetStats, setBudgetStats] = useState({
      income: 0,
      expense: 0,
      incomeLeft: 0,
      percentageIncomeUsed: 0,
      percentageIncomeLeft: 100,
    });

  const calculateIncomeExpenseStats =  useCallback((lastBudget:any) => {
             const income =
               lastBudget?.incomes?.reduce(
                 (total: number, income: any) => total + income.amount,
                 0,
               ) || 0;

             // Calculate total expense
             const expense =
               lastBudget?.allocations?.reduce(
                 (total: number, allocation: any) => total + allocation.amount,
                 0,
               ) || 0;

             // Calculate income left
            const incomeLeft = (income - expense);

             // Calculate percentage of income used
             const percentageIncomeUsed =
               income > 0 ? Math.min((expense / income) * 100, 100) : 0;

             // Calculate percentage of income left
             const percentageIncomeLeft = 100 - percentageIncomeUsed;
        
 return {
   income,
   expense,
   incomeLeft,
   percentageIncomeUsed,
   percentageIncomeLeft,
 };
        
  }, []);

  useEffect(() => {
      const stats = calculateIncomeExpenseStats(lastBudget);
      console.log('stats', stats);
      
    setBudgetStats(stats);
  }, [lastBudget]);
    

    // const { income, expense, incomeLeft, percentageIncomeUsed, percentageIncomeLeft } =
    //     calculateIncomeExpenseStats(lastBudget);

    // useEffect(() => {
    //     const newData = {
    //         uid: selectedBudget?.uid,
    //         amount: selectedBudget?.amount,
    //         percentage: selectedBudget?.amount / incomeLeft * 100,
    //         subAllocations: []
    //     }

    //     console.log(selectedBudget);

    // }, [selectedBudget]);


    // const formatNumber = (num: number) => {
    //     return num.toLocaleString();
    // };

    // const parseNumber = (value: string) => {
    //     // Remove commas before parsing
    //     return parseFloat(value.replace(/,/g, '')) || 0;
    // };

    // const getInputWidth = (index: number) => {
    //     if (spanRefs.current[index]) {
    //         // Calculate width but cap it at 100px
    //         return `${Math.min(spanRefs.current[index]!.offsetWidth + 30, 140)}px`;
    //     }
    //     return '50px'; // Default minimum width
    // };

    const handleClose = () => {
        setShowSelectedBudget(false);
    };


    const handleDeleteOfCategory = (id: string) => {
        try {
            setShowDeleteModal(!showDeleteModal)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteCategoryById = (id: string) => {
        try {
            setShowDeleteModal(!showDeleteModal)
            setShowDeleteSuccessModal(!showDeleteSuccessModal)
        } catch (error) {
            console.log(error);

        }
    }

const handleBudgetCategoryAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAmount = parseFloat(e.target.value.replace(/,/g, "")) || 0;
    const previousAmount = selectedBudget.amount || 0;
    const isReducingAmount = enteredAmount < previousAmount;
    const currentIncome = budgetStats?.income
    let newIncomeLeft
    
    // Calculate the current expense total - if the budget category is the same as the selected budget category, use entered amount, otherwise use the original amount
    const currentExpense =
    lastBudget?.allocations?.reduce((total: number, allocation: any) => {
        if (allocation?.budgetCategory?.uid === selectedBudget?.budgetCategory?.uid) {
            return total + enteredAmount; 
        }
        return total + allocation.amount;
    }, 0) || 0;


    // if entered amount < previous amount ,re-calculate new income left
    if (isReducingAmount) {
        newIncomeLeft = currentIncome - currentExpense;
    } else { 
        newIncomeLeft = budgetStats.incomeLeft;
    }
       
  // Allow changes if reducing amount or if new amount is within limits
    if ( enteredAmount <= newIncomeLeft) {
        const percentage = newIncomeLeft > 0 ? (enteredAmount / newIncomeLeft) * 100 : 0;

        setSelectedBudget((prev: any) => ({
            ...prev,
            amount: enteredAmount,
            percentage: Math.min(percentage, 100),
        }));

        setSingleBudget((prev: any) => ({
            ...prev,
            amount: enteredAmount,
            percentage: Math.min(percentage, 100),
        }));

        setBudgetStats({
            income: currentIncome,
            expense: currentExpense,
            incomeLeft: newIncomeLeft,
            percentageIncomeUsed: (currentExpense / currentIncome) * 100,
            percentageIncomeLeft: 100 - (currentExpense / currentIncome) * 100,
        });
    } else {
        toast.error(`Your expense exceeds your total income for ${lastBudget?.name}`);
    }
};


    const handleBlur = async (index: number) => {
        const subAllocation = selectedBudget?.subAllocations[index];

        const getCurrentDate = () => {
            const date = new Date();
            return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
        };

        // Check if subAllocation exists and is valid
        if (
            subAllocation?.subCategory &&
            subAllocation.amount !== undefined &&
            subAllocation.subCategory.trim().length > 0 &&
            subAllocation.amount > 0
        ) {
            const data = {
                amount: subAllocation.amount,
                budgetCategoryId: selectedBudget?.budgetCategory?.uid,
                name: subAllocation.subCategory, // Pass the subCategory name to create it
                date: getCurrentDate(),
            };

            // Calculate the total subAllocation amount safely
            const totalSubAllocationAmount = Array.isArray(selectedBudget?.subAllocations)
                ? selectedBudget.subAllocations.reduce(
                    (sum: any, allocation: any) => sum + allocation.amount,
                    0
                )
                : 0;

            if (totalSubAllocationAmount > (selectedBudget?.amount || 0)) {
                alert("Your expense is greater than your current budget");
            } else {
                if (createSubCategoryMutation.isPending) {
                    alert('saving....')
                } else {


                    if (selectedBudget?.amount > 0) {
                        console.log(data);
                        
                        try {                           
                            const res = await createSubCategoryMutation.mutateAsync(data);

                            let updatedSubAllocations: any[] = [];

                            // Create a new subAllocation
                            const newSubAllocation = {
                                subCategory: res.data.uid,
                                name: subAllocation.subCategory,
                                amount: subAllocation.amount,
                            };

                            // Check if the subCategory already exists
                            const existingSubAllocation = updatedSubAllocations.find(
                                (sub) => sub.subCategory === res.data.uid
                            );

                            if (existingSubAllocation) {
                                // console.log("Updating existing allocation");

                                updatedSubAllocations = updatedSubAllocations.map((sub) =>
                                    sub.subCategory === res.data.uid ? newSubAllocation : sub
                                );
                            } else {
                                // console.log("Adding new allocation");

                                updatedSubAllocations.push(newSubAllocation);

                                // Find the existing allocations and subAllocations
                                const foundBudget = lastBudget
                                // console.log(foundBudget);


                                const existingSubAllocations =
                                    foundBudget?.allocations?.find(
                                        (b) => b.budgetCategory === selectedBudget.uid
                                    )?.subAllocations || [];

                                // Check if the entry already exists in bluredData
                                const entryExists = bluredData.some(
                                    (entry: any) =>
                                        entry.subCategory === res.data.uid &&
                                        entry.amount === subAllocation.amount
                                );

                                if (!entryExists) {
                                    // console.log(existingSubAllocations);

                                    setBluredData((prevData: any[]) => {
                                        const lastIndex = prevData.length - 1;

                                        // Check the last item first
                                        if (prevData[lastIndex]?.name === newSubAllocation.name) {
                                            const updatedData = [...prevData];
                                            updatedData[lastIndex] = newSubAllocation; // Replace last item
                                            return updatedData;
                                        }

                                        // If not the last item, check the entire array
                                        const existingIndex = prevData.findIndex(
                                            (item) => item.name === newSubAllocation.name
                                        );

                                        if (existingIndex !== -1) {
                                            // Replace the existing item
                                            const updatedData = [...prevData];
                                            updatedData[existingIndex] = newSubAllocation;
                                            return updatedData;
                                        }

                                        // If not found, append the new sub-allocation
                                        return [...prevData, ...existingSubAllocations, newSubAllocation];
                                    });
                                }
                            }

                            // Remove invalid allocations
                            updatedSubAllocations = updatedSubAllocations.filter(
                                (sub) => sub.subCategory && sub.amount > 0
                            );

                            const percentage = Math.round(
                                (selectedBudget.amount / budgetStats?.incomeLeft) * 100 * 100
                            ) / 100;

                            const newAllocation = {
                                budgetCategory: selectedBudget.uid,
                                amount: selectedBudget.amount,
                                percentage,
                                subAllocations: updatedSubAllocations,
                            };

                            setSingleBudget(newAllocation);
                            setAllocations((prevAllocations) => [
                                ...prevAllocations.filter(
                                    (alloc) =>
                                        alloc?.budgetCategory?.uid !== newAllocation?.budgetCategory?.uid
                                ),
                                newAllocation,
                            ]);

                            // console.log("Updated SubAllocations:", updatedSubAllocations);
                        } catch (error) {
                            console.error("Error creating subcategory:", error);
                        }
                    } else {
                        alert("Please enter a valid amount for this category");
                    }
                }
            }
        } else {
            // console.log("Both category and amount are required before blurring.");
        }

        setFocusedIndex(null); // Reset focus tracking
    };


    const createSubCategoryMutation = useMutation({
        mutationFn: (data: any) => CreateSubCategoryApi(data.token, data.budgetCategoryId, data.name),
        onSuccess: (data: any) => {
            if (data?.success) {
                // console.log(data)
                return data
            }
        },
        onError: (error: Error) => {
            console.error('Error sending OTP:', error);
        },
    });



    const addSubAllocation = () => {
        if (!selectedBudget) return;

        // Create a new sub-allocation with default values
        const newSubAllocation: ISubAllocation = {
            subCategory: '',
            amount: 0,
        };

        // Update the selected budget with the new sub-allocation
        setSelectedBudget({
            ...selectedBudget,
            subAllocations: [...(selectedBudget.subAllocations || []), newSubAllocation],
        });
        setSingleBudget({
            ...selectedBudget,
            subAllocations: [...(selectedBudget.subAllocations || []), newSubAllocation],
        });
    };

    // Validate amount to ensure it does not exceed total income
    // useEffect(() => {
    //     if (selectedBudget?.amount > income) {
    //         alert(`Your expense is higher than your total income for ${lastBudget?.name}`);
    //         setSelectedBudget((prev: any) => ({
    //             ...prev,
    //             amount: income,
    //         }));
    //         setSingleBudget((prev: any) => ({
    //             ...prev,
    //             amount: income,
    //         }));
    //     }
    // }, [selectedBudget?.amount, income]);




    useEffect(() => {
        if (selectedBudget && (!selectedBudget.subAllocations || selectedBudget.subAllocations.length === 0)) {
            const defaultSubAllocation: ISubAllocation = {
                subCategory: '',
                amount: 0,
            };

            setSelectedBudget((prevBudget: any) => ({
                ...prevBudget,
                subAllocations: [defaultSubAllocation],
            }));
            setSingleBudget((prevBudget: any) => ({
                ...prevBudget,
                subAllocations: [defaultSubAllocation],
            }));
        }
    }, [selectedBudget]);




    // Function to call when allocation changes
    const handleAllocationChange = (index: number, field: 'subCategory' | 'amount', value: string) => {     
        if (!selectedBudget) return;

        if (selectedBudget?.amount?.toLocaleString() === '') {
            alert('Assign amount/percentage of income for this category')
        }
        let newValue: string | number;

        if (field === 'amount') {
            // Trim and check for empty value
            const trimmedValue = value.trim();
            newValue = trimmedValue === '' ? '' : parseFloat(trimmedValue); // Keep empty string if input is empty

            // Check if the parsed value is a valid number
            if (newValue !== '' && isNaN(newValue as number)) return; // Exit if not a valid number
        } else {
            newValue = value; // For 'subCategory', use the value as-is
        }



        // Update sub-allocations
        const updatedSubAllocations = selectedBudget.subAllocations.map((subAllocation: ISubAllocation, i: number) => {
            if (i === index) {
                return {
                    ...subAllocation,
                    [field]: field === 'amount' ? (newValue as string) : (newValue as string)
                };
            }
            return subAllocation;
        });

        if (newValue > selectedBudget?.amount) {
            alert('its your expense is too high for your income')
        } else {
            setSelectedBudget((prevBudget: IBudget) => ({
                ...prevBudget,
                subAllocations: updatedSubAllocations
            }));
            setSingleBudget((prevBudget: IBudget) => ({
                ...prevBudget,
                subAllocations: updatedSubAllocations
            }));
        }

        // Update the state

    };


    useEffect(() => {
        if (selectedBudget && !hasSelectedBudget.current) {
            // console.log(selectedBudget);
            if (allDisplayedBudgets.length > 0) {
                // Find the matching budget in allDisplayedBudgets
                const matchingBudget = allDisplayedBudgets.find(
                  (budget) =>
                    budget?.budgetCategory?.uid === selectedBudget?.budgetCategory?.uid,
                );                

                if (matchingBudget) {
                    // Replace subAllocations of selectedBudget with the matching budget's subAllocations
                    setSelectedBudget((prev: any) => ({
                        ...prev,
                        amount: matchingBudget.amount,
                        subAllocations: matchingBudget.subAllocations,
                    }));
                    setSingleBudget((prev: any) => ({
                        ...prev,
                        amount: matchingBudget.amount,
                        subAllocations: matchingBudget.subAllocations,
                    }));
                }
            }

            // Mark that the budget has been selected to prevent further updates
            hasSelectedBudget.current = true;
        }
    }, [selectedBudget]);

    const handleBudgetClick = (budget: any) => {        
      setShowSelectedBudget(!showSelectedBudget);
            setSelectedBudget(budget);
            setSingleBudget(budget);
            hasSelectedBudget.current = false; // Reset the ref each time a new budget is selected

    };





    const {
        data: budgetCategoriesData = [],
        status: fetchStatus,
        isError,
        error,
    } = useQuery({
        queryKey: ['allBudgetCategoriesData'],
        queryFn: () => getAllBudgetCategoriesApi(authenticatedUser?.token ?? ''),
        enabled: !!authenticatedUser?.token,
        refetchOnWindowFocus: true,
    });

       const [budgetCategoriesArray, setBudgetCategoriesArray] =
        useState(budgetCategoriesData);
    
    useEffect(() => {
        if (budgetCategoriesData) {            
          setBudgetCategoriesArray(budgetCategoriesData);
      }
    }, [budgetCategoriesArray])
    
    
    const [createCategoryLoading,setCreateCategoryLoading] = useState<boolean>(false)
    
    useEffect(() => {
      
        if (lastBudget && lastBudget.allocations && lastBudget.allocations.length > 0) {
            const allocationMap: Record<string, IPreviousBudgetAllocation> = {};
            // create hashmap
            (lastBudget.allocations as IPreviousBudgetAllocation[]).forEach((a) => {
                allocationMap[a.budgetCategory] = a;
            });            

            const updatedBudgetCategoriesArray = budgetCategoriesArray.map((bc:any) => {
                const allocation = allocationMap[bc.name];
                return {
                    ...bc,
                    amount: allocation?.amount || 0,
                    subAllocations: allocation?.subAllocations || [],
                };
            })
            setBudgetCategoriesArray(updatedBudgetCategoriesArray);
        }
    }
, [budgetCategoriesData, lastBudget]);

    
       const handleSubmit = async () => {
         try {
           setCreateCategoryLoading(true);
           const createCategoryData = {
             name: categoryName,
             subCategories: [],
           };
           if (authenticatedUser) {
             const res = await createBudgetCategoryApi(
               createCategoryData,
               authenticatedUser.token,
             );

             const updatedCategories = budgetCategoriesArray;
             updatedCategories.push(res.category);

             setBudgetCategoriesArray(updatedCategories);
           } else {
             throw new Error('User is not authenticated');
           }
           setCategoryName('');
           setShowNewBudgetCategory(false);
         } catch (error) {
           console.error('Error creating category:', error);
         } finally {
           setCreateCategoryLoading(false);
         }
       };


    const handleSaveCategory = async () => {        
        
        const totalSubAllocationAmount = Array.isArray(selectedBudget?.subAllocations)
            ? selectedBudget.subAllocations.reduce(
                (sum: any, allocation: any) => sum + allocation.amount,
                0
            )
            : 0;

        if (totalSubAllocationAmount > (selectedBudget?.amount || 0)) {
            alert("Your expense is greater than your current budget");
        }


        // else if (selectedBudget?.amount > totalSubAllocationAmount) {
        //     alert("your budgets are less than your assinged amount for this category");
        // }
        else if (createSubCategoryMutation.isPending) {
            alert("savinng expense ....");
        }
        else {



            const newData: BudgetAllocation = {
              budgetCategory: selectedBudget?.budgetCategory,
              amount: selectedBudget?.amount,
              percentage: (selectedBudget?.amount / budgetStats?.incomeLeft) * 100,
              subAllocations: selectedBudget.subAllocations,
            };
            

            const updatedBudgets = allDisplayedBudgets.some(budget => budget?.budgetCategory?.uid === newData?.budgetCategory?.uid)
                ? allDisplayedBudgets.map(budget =>
                    budget?.budgetCategory?.uid === newData?.budgetCategory?.uid ? newData : budget
                )
                : [...allDisplayedBudgets, newData];            

            setAllDisplayedBudgets(updatedBudgets);

            try {
                const percentage =
                  Math.round(
                    (selectedBudget.amount / budgetStats?.incomeLeft) * 100 * 100,
                  ) / 100;


                const newAllocation: any = {
                  budgetCategory: selectedBudget?.budgetCategory,
                  amount: selectedBudget.amount,
                  percentage,
                    subAllocations: bluredData,
                };
                

                const fetchedLastBudget = getLastBudget();
                if (fetchedLastBudget) {                    
                    setLastBudget(fetchedLastBudget);

                } else {
                    setLastBudget(lastBudget);
                }

                addAllocationToBudget(budgetId, newAllocation);

                // Clear local allocations after successful save
                calculateIncomeExpenseStats(lastBudget)
                setBluredData([])
                setAllocations([]);
                handleClose()
            } catch (error) {
                console.error("Error saving category:", error);
            }
        }
    };


    // To initialize previousSubAllocations when component mounts or selectedBudget is first set
    useEffect(() => {
        if (selectedBudget) {
            setPreviousSubAllocations(selectedBudget.subAllocations);
        }
    }, [selectedBudget]);


    // Create new budget mutation
    const CreateBudgetMutation = useMutation({
        mutationFn: (data: any) => {
            if (authenticatedUser) {
                // Remove the color property from allocations
                const newData = {
                    ...data,
                    allocations: data.allocations.map(({ color, ...rest }: any) => rest)
                };

                // console.log(newData);
                return createBudgetApi(newData, authenticatedUser.token);
            }
            throw new Error("User is not authenticated");
        },
        onSuccess: (data: any) => {
            if (data?.success) {
                setLoading(false);
                // console.log(data);
                const { success, message, ...rest } = data;
                // console.log(rest.data);
                queryClient.invalidateQueries({ queryKey: ['allBudgetCategories'] });
                navigate.push('/budgets')
            }
        },
        onError: (error: Error) => {
            console.error('Error creating category:', error);
            setLoading(false);
        },
    });





    // Function to handle the creation of a new budget
    const handleCreateBudget = async () => {
        try {
            const { id, budgetType, ...rest } = currentBudget || {};
            const newData: any = { ...rest, allocations: lastBudget?.allocations || [] }

            const FilteredData = {
                ...newData, // Copy over the non-allocations data
                allocations: newData.allocations.map((allocation: any) => ({
                    ...allocation,budgetCategory:allocation?.budgetCategory?.uid,
                    subAllocations: allocation.subAllocations
                        .map(({ subCategory, amount }: any) => ({ subCategory, amount })) // Map to only include subCategory and amount
                        .filter((sub: any) => sub.subCategory && sub.amount) // Ensure we only keep valid subAllocations
                }))
            };


            const res = await CreateBudgetMutation.mutateAsync(FilteredData)
            // console.log(res);
            setBluredData([])
            if (res) {
                // console.log(res);
                navigate.push('/budget/' + res.uid)
            }



        } catch (error) {
            console.log(error);

        }
    }

    return (
        (<motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" w-[100vw] max-w-[500px]"
        >
            <Header link={`/budgets/new/income/${lastBudget?.id ?? ""}`} title="Create new budget" />
            <div className='mt-[39.5px]  px-[24px] w-full'>
                <div className='flex gap-[8px]'>
                    <div className='bg-[#66C227] rounded-[10px] h-[8px] w-full'></div>
                    <div className='bg-[#66C227] rounded-[10px] h-[8px] w-full'></div>
                </div>
                <p className='mt-[24px] mb-[16px] font-[500] text-[20px]'>Set your Expenses</p>
                <div className='bg-[#F7F7F9] rounded-[20px] p-[16px]'>
                    <h1 className='text-[#131313] font-[500] leading-[24px]'>  ₦ {budgetStats?.incomeLeft.toLocaleString()}
                        <span className=' text-[#575757] text-[12px] font-[400] leading-[16px] mx-[8px]'>left of income</span>
                    </h1>

                    <div className="w-full bg-white rounded-[10px] mt-[8px] h-[8px] relative overflow-hidden">
                        {/* Progress Bar Background (remaining part) */}
                        <div
                            className="bg-white rounded-[10px] h-[8px] absolute top-0 left-0"
                            style={{ width: `${budgetStats?.percentageIncomeUsed}%` }} // Remaining part
                        ></div>

                        {/* Progress Bar Foreground (filled part) */}
                        <div
                            className="bg-[#FB8417] rounded-[10px] h-[8px] relative"
                            style={{ width: `${budgetStats?.percentageIncomeLeft}%` }} // Used part
                        ></div>
                    </div>
                </div>

                <div className=' my-[16px]  w-full'>
                    <div className=' w-full flex justify-between'>
                        <h1 className=' font-[500] leading-[28px]'>Budget Categories</h1>
                        <button onClick={() => setShowNewBudgetCategory(true)} className=' bg-[#EFEFF0] font-[500] text-[12px] rounded-[32px] py-[4px] px-[8px] flex gap-[4px] items-center '> <BsPlus size={20} /> Create new</button>
                    </div>
                </div>


            </div>
            {/* CATEGORIES  OR ALLOCATIONS */}
            <div className={` bg-[#F7F7F9]  grid ${budgetCategoriesArray?.length == 0 ? 'grid-cols-1' : 'grid-cols-1'}  gap-[12px] overflow-y-scroll overflow-x-hidden min-h-[322px] py-[16px] px-[24px] mb-[100px] `}>



                <div className={`grid ${fetchStatus === 'pending' || budgetCategoriesArray.length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-[16px]`}>
                    {fetchStatus === 'pending' ? (
                        // Loading State
                        (<div key="loading" className="flex justify-center items-center py-[25px]">
                            <CircularProgress size="md" color="default" />
                        </div>)
                    ) : (
                        <>
                            {budgetCategoriesArray.length === 0 ? (
                                // No Data State
                                (<div className="w-full">
                                    <div className="py-[25px] w-full text-center flex flex-col gap-[8px] justify-center items-center px-[51px]">
                                        <Image src={noBudgetImg.src} width={1000} height={1000} className="size-[124px] mb-[8px]" alt="No Budget" />
                                        <h1 className="font-[500] leading-[24px]">You do not have any budget history yet.</h1>
                                        <h1 className="text-[14px] text-[#828282] leading-[16.8px]">Click the create button above to <br /> get started.</h1>
                                    </div>
                                </div>)
                            ) : (
                                // Data Display
                                (<>
                                    {/* for each  lastBudget?.allocations */}
                                    {/* {budgetCategoriesArray.map((budget: any) => (
                                        <ul key={budget.id} className="budget-list grid grid-cols-1 gap-[16px] w-full">
                                            <li
                                                onClick={() => handleBudgetClick(budget)}
                                                className="bg-white border border-[#EFEFF0] p-[12px] rounded-[20px] flex flex-col gap-[8px]"
                                            >
                                                <div
                                                    className="w-[20px] h-[20px] rounded-full"
                                                    style={{ backgroundColor: budget.color }}
                                                ></div>
                                                <h1 className="text-[12px]">{budget.name}</h1>
                                                <span>Amount: amount here</span>
                                            </li>
                                        </ul>
                                    ))} */}
                                    {budgetCategoriesArray.map((budget: any) => {
                                        // Find the corresponding allocation for this budget using the uid
                                        const allocation = lastBudget?.allocations?.find(
                                          (allocation: any) => allocation?.budgetCategory?.uid? allocation?.budgetCategory?.uid === budget.uid: allocation?.budgetCategory ===budget.uid,
                                        )                                          

                                        // If an allocation is found, use its amount; otherwise, use 0
                                        const totalAmount = allocation?.amount || 0;

                                        const notYetAllocated = {
                                            amount: 0,
                                            budgetCategory:  { uid: budget.uid, name: budget.name },
                                            color: budget?.color,
                                            percentage: 0,
                                            subAllocations:  []
                                        }

                                        return (
                                            <ul key={budget.uid} className="budget-list grid grid-cols-1 gap-[16px] w-full">
                                                <li
                                                    onClick={() => handleBudgetClick(allocation??notYetAllocated)}
                                                    className="bg-white border border-[#EFEFF0] p-[12px] rounded-[20px] flex flex-col gap-[8px]"
                                                >
                                                    <div
                                                        className="w-[20px] h-[20px] rounded-full"
                                                        style={{ backgroundColor: budget.color }}
                                                    ></div>
                                                    <h1 className="text-[12px]">{budget.name}</h1>
                                                    <span>₦ {totalAmount.toLocaleString('en-US')}</span>
                                                </li>
                                            </ul>
                                        );
                                    })}
                                </>)
                            )}
                        </>
                    )}
                </div>



            </div>
            {/*  INDIVIDUAL EXPENSE OR ALLOCATION */}
            {
                showSelectedBudget &&
                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] max-w-[500px] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >
                    <BottomDrawer
                        footer={<div className="w-full grid gap-y-[16px]">
                            <button disabled={createSubCategoryMutation.isPending} onClick={() => {
                                if (!createSubCategoryMutation.isPending) {
                                    handleSaveCategory()
                                }
                            }
                            } className={` btn w-full rounded-[32px] px-[28px] py-[14px]  ${createSubCategoryMutation.isPending ? 'bg-[#434343]' : ' bg-black '} text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500] `} > {createSubCategoryMutation.isPending ? 'Saving...' : 'Save'}
                            </button>

                            <button onClick={() => handleDeleteOfCategory('111')} className="btn w-full text-[#F5365C] rounded-[32px] px-[28px] py-[14px] bg-[#FBEDEF] flex items-center justify-center gap-[8px] font-[500]">Delete category</button>
                        </div>}
                        label={`${selectedBudget?.budgetCategory?.name ?? selectedBudget?.name}`}
                        back={false}
                        show={showSelectedBudget}
                        close={true}
                        onClose={handleClose}
                    >


                        <form action="" className='w-full  ' method="post">
                            <h1 className=' font-[500] leading-[20px]'>
                                Assign amount/percentage of income for this category
                            </h1>

                            <div className='px-[16px] bg-[#F7F7F9] mt-[8px] border border-[#E7E7EA] rounded-[16px] grid grid-cols-2 w-full'>
                                <div className='py-[12px]'>
                                    <h1 className=' text-[#828282] text-[12px] leading-[14.4px] '>Amount</h1>
                                    <input
                                        value={selectedBudget?.amount?.toLocaleString()}
                                        className=' bg-transparent mt-[4px]'
                                        type="text"
                                        name="amount"
                                        placeholder='enter amount'
                                        onChange={handleBudgetCategoryAmountChange}
                                    />
                                </div>
                                <div className='py-[12px] w-[90%] border-l px-[16px] border-l-[#E7E7EA]'>
                                    <h1 className=' text-[#828282] text-[12px] leading-[14.4px] '>Percentage</h1>
                                    <input
                                        className='bg-transparent mt-[4px]'
                                        type="text"
                                        name="percentage"
                                        value={
                                            selectedBudget && budgetStats?.income
                                                ? isNaN((selectedBudget.amount / budgetStats?.income) * 100)
                                                    ? '0'
                                                    : ((selectedBudget.amount / budgetStats?.income) * 100).toFixed(2)
                                                : '0'
                                        }
                                        readOnly
                                    />
                                </div>
                            </div>


                            <div className='mt-[24px] h-[30vh] overflow-y-scroll p-[16px] bg-[#F7F7F9] border border-[#E7E7EA] rounded-[16px] w-full'>
                                {selectedBudget?.subAllocations?.map((eachSubAllocation: any, index: number) => (
                                    <button
                                        type='button'
                                        key={index} // Unique key for each item
                                        className="flex hover:shadow-sm hover:p-[8px] hover:rounded-md hover:font-semibold hover:bg-[#0a0a0a09] transition-all ease-in mt-[8px] items-center justify-between w-full gap-[8px]"
                                    >
                                        <div className='flex gap-[4px] w-full'>
                                            <div
                                                style={{ backgroundColor: selectedBudget?.color }}
                                                className='grid place-content-center rounded-[16px] text-white size-[28px]'
                                            >
                                                <Image src={moneyIcon} className="size-[12px]" alt={'icon'} width={1000} height={1000} />
                                            </div>
                                            <div className='text-[#514F6E] min-w-[100px] w-[80px] text-[14px] font-[500] inline-block'>
                                                <input
                                                    value={eachSubAllocation.subCategory || ''}
                                                    onChange={(e) => handleAllocationChange(index, 'subCategory', e.target.value)}
                                                    placeholder="Category"
                                                    className='bg-transparent w-full text-ellipsis overflow-hidden whitespace-nowrap'
                                                    onBlur={() => handleBlur(index)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className='bg-white rounded-[8px] py-[4px] px-[8px] flex justify-center items-center gap-[0px]'>
                                                ₦
                                                <div className="relative inline-block w-full">
                                                    <input
                                                        value={eachSubAllocation.amount ? eachSubAllocation.amount.toLocaleString('en-US') : ''}
                                                        onBlur={() => handleBlur(index)}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = e.target.value;
                                                            const numericValue = value.replace(/[^0-9.]/g, ''); // Keep only numbers and decimal point
                                                            const cleanedValue = numericValue.replace(/(\..*)\..*/g, '$1'); // Allow only one decimal point
                                                            const finalValue = cleanedValue === '' ? '' : parseFloat(cleanedValue).toString();
                                                            handleAllocationChange(index, 'amount', finalValue);
                                                        }}
                                                        type="text" // Change to text to allow formatted input
                                                        inputMode="decimal"
                                                        pattern="[0-9]*[.,]?[0-9]*"
                                                        onWheel={(e) => e.currentTarget.blur()}
                                                        className="px-1 py-1 outline-none rounded focus:outline-none transition-all duration-200"
                                                        style={{ width: '140px', maxWidth: '140px' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}


                                <button
                                    onClick={addSubAllocation} // Call addSubAllocation when clicked
                                    type='button'
                                    className="flex hover:scale-110 transition-all ease-in border-t-[1px] border-t-[#EFF0F6] mt-[10px] items-center gap-[8px]"
                                >
                                    <div className="grid place-content-center rounded-[16px] text-white size-[28px]" style={{ backgroundColor: selectedBudget?.color }}>
                                        <BsPlus />
                                    </div>
                                    <div className="text-[#514F6E] text-[14px] font-[500]">Add Another </div>
                                </button>



                            </div>
                        </form>
                    </BottomDrawer>
                </motion.div>

            }
            {/* MODAL TO DELETE CATEGORY */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    showDeleteModal={showDeleteModal}
                    setShowDeleteModal={setShowDeleteModal}
                    handleDeleteCategoryById={handleDeleteCategoryById}
                    categoryId="your-category-id" // Pass the specific category ID here
                />
            )}
            {showDeleteSuccessModal &&
                <DeleteSuccessModal
                    showModal={showDeleteSuccessModal}
                    setShowModal={setShowDeleteSuccessModal}
                    handleAction={() => handleDeleteCategoryById('category-id')}
                    handleClose={handleClose}
                    text='Delete Successfully'
                />

            }
            {/* TO CREATE A NEW CATEGORY */}
            {showNewBudgetCategory &&

                <motion.div
                    initial={{ opacity: 0, y: 90 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[100vh] max-w-[500px] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
                >
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    >

                        <BottomDrawer
                            footer={<button disabled={createCategoryLoading} type="submit" className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">

                                {createCategoryLoading ?
                                    <div className=' flex gap-2 items-center justify-center mx-auto w-full'>
                                        <CircularProgress color='default' size='sm' />

                                    </div> : 'Save'}
                            </button>}
                            label="Create budget category"
                            back={false}
                            show={showNewBudgetCategory}
                            close={true}
                            onClose={() => setShowNewBudgetCategory(false)}
                        >

                            <div className="relative w-full mb-4">
                                <div className='  z-[10]  flex w-[90%] absolute top-[30px]  left-4 text-xs justify-between items-center'>
                                    <label htmlFor={'Name of category'} className=" text-[#828282]">
                                        Name of category
                                    </label>
                                    <div
                                        className="w-[20px] h-[20px] rounded-full"
                                        style={{ backgroundColor: '#BEB8FF' }}
                                    ></div>
                                </div>

                                <input
                                    type={'text'}
                                    name={'Name of category'}
                                    id={'Name of category'}
                                    required={true}
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder={'Enter name'}
                                    className={`bg-[#F7F7F9] mt-[20px] font-[500] border border-[#EFEFF0] h-20 w-full px-4 rounded-[20px] pt-[20px] pb-2 }`}
                                />
                            </div>
                        </BottomDrawer>
                    </form>
                </motion.div>

            }
            <div className='p-[24px] fixed max-w-[500px] z-10 bg-[#ffffffaa] backdrop-blur-lg bottom-0 w-full border-t-[2px] border-t-[#EFF0F6]'>
                <div className="w-full">
                    <button onClick={() => handleCreateBudget()} className="btn w-full rounded-[32px] px-[28px] py-[14px] bg-black text-[#FAFAFA] flex items-center justify-center gap-[8px] font-[500]">
                        {CreateBudgetMutation.isPending
                            ?

                            'creating budget...'
                            :
                            <>
                                Proceed
                                <BsArrowRight />
                            </>
                        }
                    </button>
                </div>
            </div>
        </motion.div >)
    );
};

export default Page;
