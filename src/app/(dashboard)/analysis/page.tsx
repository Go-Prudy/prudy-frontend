'use client'
import BottomDrawer from "@/components/create-budget/BottomDrawer";
import Header2 from "@/components/create-budget/Header2";
import { useEffect, useState } from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from "@tanstack/react-query";
import { useAuthentication } from "@/app/store/AuthStore";
import { GetAllBudgetsApi, getSingleBudgetApi } from "@/app/services/BudgetService";
import { CircularProgress } from "@nextui-org/react";
import { GetBudgetCategoriesAnalyticsApi, GetOverallBudgetAnalyticsApi } from "@/app/services/AnalyticsService";
import { BudgetVsActualSkeleton, TopExpensesSkeleton } from "../components/Skelentons/AnalysisSkeleton";

export default function Page() {
  const allBudgets: string[] = [
    'January budget',
    'February budget',
    'March budget',
    'April budget',
    'May budget',
    'June budget',
    'July budget',
    'August budget',
    'September budget',
    'October budget',
    'November budget',
    'December budget'
  ];

  interface expense {
    color: string,
    type: string,
    amount: number
  }

  const topExpense: expense[] = [
    {
      color: '#01B0C5',
      type: 'Housing',
      amount: 450000
    },
    {
      color: '#FB8417',
      type: 'Food',
      amount: 350000
    },
    {
      color: '#A858EE',
      type: 'Transportation',
      amount: 250000
    },
    {
      color: '#F94F70',
      type: 'Healthcare',
      amount: 200000
    },
    {
      color: '#FFCD3C',
      type: 'Education',
      amount: 150000
    },
    {
      color: '#6E91F6',
      type: 'Entertainment',
      amount: 120000
    },
    {
      color: '#4CAF50',
      type: 'Utilities',
      amount: 100000
    },
    {
      color: '#D44545',
      type: 'Insurance',
      amount: 80000
    },
    {
      color: '#FF8A80',
      type: 'Clothing',
      amount: 60000
    },
    {
      color: '#9575CD',
      type: 'Miscellaneous',
      amount: 50000
    }
  ];


  const budgetData = [
    {
      budget: 250000,
      type: 'Housing',
      expense: 450000
    },
    {
      budget: 150000,
      type: 'Food',
      expense: 350000
    },
    {
      budget: 100000,
      type: 'Transportation',
      expense: 250000
    },
    {
      budget: 50000,
      type: 'Utilities',
      expense: 70000
    },
    {
      budget: 200000,
      type: 'Healthcare',
      expense: 180000
    },
    {
      budget: 120000,
      type: 'Education',
      expense: 160000
    },
    {
      budget: 80000,
      type: 'Entertainment',
      expense: 100000
    },
    {
      budget: 90000,
      type: 'Clothing',
      expense: 110000
    },
    {
      budget: 300000,
      type: 'Savings',
      expense: 250000
    },
    {
      budget: 60000,
      type: 'Miscellaneous',
      expense: 50000
    }
  ];



  const monthlyBudget = [
    { name: 'January Budget', percentage: 8, color: '#FF6384' },  // Example Color and Percentage
    { name: 'February Budget', percentage: 7, color: '#36A2EB' },
    { name: 'March Budget', percentage: 10, color: '#FFCE56' },
    { name: 'April Budget', percentage: 9, color: '#4BC0C0' },
    { name: 'May Budget', percentage: 12, color: '#9966FF' },
    { name: 'June Budget', percentage: 11, color: '#FF9F40' },
    { name: 'July Budget', percentage: 8, color: '#FF6384' },
    { name: 'August Budget', percentage: 10, color: '#36A2EB' },
    { name: 'September Budget', percentage: 7, color: '#FFCE56' },
    { name: 'October Budget', percentage: 6, color: '#4BC0C0' },
    { name: 'November Budget', percentage: 12, color: '#9966FF' },
    { name: 'December Budget', percentage: 10, color: '#FF9F40' },
  ];

  const { authenticatedUser } = useAuthentication();

  const [selectedBudget, setSelectedBudget] = useState<any>({}); // Store the selected budget
  // const [topExpenses, setTopExpenses] = useState<expense[]>(topExpense || []);
  const [showBudget, setShowBudget] = useState<boolean>(false);
  const [showCategoryBreakDown, setShowCategoryBreakDown] = useState<boolean>(false);
  const [showExpenseBreakDown, setShowExpenseBreakDown] = useState<boolean>(false);
  // const [selectedMonth, setSelectedMonth] = useState(monthlyBudget[0]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedBudget(value); // Update the selected budget
  };

  const budget = 1500000; // Example value
  const actual = 1000000; // Example value

  // Determine the maximum value
  const maxValue = Math.max(budget, actual);

  // // Calculate the percentage for each relative to the max value
  // const budgetPercentage = (budget / maxValue) * 100;
  // const actualPercentage = (actual / maxValue) * 100;


  const handleShowCategoryBreakdown = () => {
    try {
      setShowCategoryBreakDown(!showCategoryBreakDown)
    } catch (error) {

    }
  }


  const handleShowExpenseBreakdown = () => {
    try {
      setShowExpenseBreakDown(!showExpenseBreakDown)
    } catch (error) {

    }
  }


  const { data: budgets = [], isLoading, error, isPending } = useQuery({
    queryKey: ['allBudgetCategories'],
    queryFn: () => GetAllBudgetsApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });

  useEffect(() => {
    if (budgets.length > 0) {
      setSelectedBudget(budgets[0])
    }

  }, [budgets])

  const { data: GetOverallBudgetAnalyticsData = [], isLoading: GetOverallBudgetAnalyticIsLoading, error: GetOverallBudgetAnalyticError, isPending: GetOverallBudgetAnalyticIsPending } = useQuery({
    queryKey: ['GetOverallBudgetAnalyticsData', selectedBudget?.uid],
    queryFn: () => GetOverallBudgetAnalyticsApi(authenticatedUser?.token ?? '', selectedBudget.uid),
    enabled: !!authenticatedUser?.token && !!selectedBudget.uid,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });



  const { data: GetBudgetCategoriesAnalyticsApiData = [], isLoading: GetBudgetCaGetBudgetCategoriesAnalyticsApiIsPending } = useQuery({
    queryKey: ['GetBudgetCategoriesAnalyticsApi', selectedBudget?.uid],
    queryFn: () => GetBudgetCategoriesAnalyticsApi(authenticatedUser?.token ?? '', selectedBudget.uid),
    enabled: !!authenticatedUser?.token && !!selectedBudget.uid,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });


  const { data: getSingleBudgetApiData = [], isLoading: getSingleBudgetApiIsPending } = useQuery({
    queryKey: ['getSingleBudgetApi', selectedBudget?.uid],
    queryFn: () => getSingleBudgetApi(authenticatedUser?.token ?? '', selectedBudget.uid),
    enabled: !!authenticatedUser?.token && !!selectedBudget?.uid,
    refetchOnWindowFocus: true, // This should be directly in the options object.
  });

  console.log(GetBudgetCategoriesAnalyticsApiData);
  console.log(getSingleBudgetApiData);




  // Destructure data to get relevant sections
  const overall = GetOverallBudgetAnalyticsData?.overall || {};
  const bestPerformingCategory = GetOverallBudgetAnalyticsData?.bestPerformingCategory || {};
  const worstPerformingCategory = GetOverallBudgetAnalyticsData?.worstPerformingCategory || {};


  return (
    <div className="bg-base-white w-full h-full">
      <Header2 title={'Analytics'} />
      <div className="flex mb-[8px] w-full items-center py-[12px] px-[24px]  mt-[90px] gap-[12px]">
        <label className=" w-full bg-[#F7F7F9] px-[8px] py-[16px] rounded-[8px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">

          <button onClick={() => setShowBudget(!showBudget)} className='  text-[14px]  items-center border-[#EFEFF0] w-full  bg-[#F7F7F9] rounded-[8px] flex  justify-between'>
            {isPending ?
              <div className=' w-full   my-auto  flex  items-center'>
                loading...
              </div>
              :
              <>
                <h1>{selectedBudget.name} </h1>
                <BsChevronDown size={10} className=' text-[#645D72] ' />
              </>
            }

          </button>
        </label>
        <button className=" rounded-[32px] bg-[#EFEFF0] px-[12px] py-[4px] h-[40px] text-[12px] font-[500]  text-center">Download</button>
      </div>

      <div className=" flex  mb-[131.5px] flex-col gap-[24px]">

        {/* BUDGET VS ACTUAL */}

        {GetOverallBudgetAnalyticIsPending ?
          <BudgetVsActualSkeleton />
          :


          <div className="px-[24px]">
            <div className="p-[24px] rounded-t-[24px] border-[1px] border-[#EFEFF0]">
              <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Budget vs Actual</h1>

              {/* Calculate the width percentages */}
              {(() => {
                const { totalBudgeted, actualExpenses } = overall.breakdown || {};
                const largerValue = Math.max(totalBudgeted, actualExpenses);
                const smallerValue = Math.min(totalBudgeted, actualExpenses);

                const largerPercentage = 100; // The larger value always takes up 100% width.
                const smallerPercentage = largerValue > 0 ? (smallerValue / largerValue) * 100 : 0;
                // If either value is 0, set the width to 20% (as per your requirement)
                const adjustedBudgetPercentage = totalBudgeted <= 30 ? 50 : (largerValue === totalBudgeted ? largerPercentage : smallerPercentage);
                const adjustedActualPercentage = smallerPercentage <= 30 ? 50 : (largerValue === actualExpenses ? largerPercentage : smallerPercentage);
                return (
                  <>
                    {/* Budget bar */}
                    <h1
                      className="bg-[#66C227] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedBudgetPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Budget - </span>
                      ₦ {totalBudgeted?.toLocaleString()}
                    </h1>

                    {/* Actual bar */}
                    <h1
                      className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedActualPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Actual Expenses -  </span>
                      ₦ {actualExpenses?.toLocaleString()}
                    </h1>
                  </>
                );
              })()}


            </div>

            <div className="rounded-b-[24px] pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
              <h1 className="text-[#2D2D2D] font-[500] leading-[18px]">
                {overall.remark?.title}
              </h1>
              <h1 className="mt-[8px] text-[14px] leading-[18px]">
                {overall.remark?.description}
              </h1>
              <button
                onClick={handleShowCategoryBreakdown}
                className="mt-[16px] text-[#474747] bg-white flex w-full justify-between rounded-[20px] border border-[#EFEFF0] p-[12px]"
              >
                See categories breakdown <span><BsChevronRight className="text-[#888888]" size={24} /></span>
              </button>
            </div>
          </div>
        }

        {/* Top expenses */}

        {GetOverallBudgetAnalyticIsPending ?
          <TopExpensesSkeleton />
          :
          <div className="w-full px-[24px]">
            <div className="p-[24px] w-full rounded-t-[24px] border-[1px] border-[#EFEFF0]">
              <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Top expenses</h1>
              <div className="w-full flex flex-col gap-[12px]">
                {GetOverallBudgetAnalyticsData?.topExpenses?.categories
                  .map((expense: any) => (
                    <div
                      key={expense.uid}
                      className="flex rounded-[12px] border border-[#EFEFF0] bg-[#F7F7F9] p-[8px] justify-between w-full"
                    >
                      <div className="flex gap-[8px] items-center">
                        <div
                          style={{ backgroundColor: expense.color }}
                          className="w-[24px] h-[24px] rounded-full"
                        ></div>
                        <h1 className="leading-[16px] text-[12px] text-[#474747]">
                          {expense.name.length > 9 ? `${expense.name.substring(0, 9)}...` : expense.name}
                        </h1>
                      </div>
                      <div className="text-[#474747] font-[500] text-[14px] leading-[16px]">
                        ₦ {expense.amountAllocated.toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-b-[24px] pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
              <h1 className="text-[#2D2D2D] font-[500] leading-[18px]">
                Come on you stunner! 😊👏🏽
              </h1>
              <h1 className="mt-[8px] text-[14px] leading-[18px]">
                You spent more on your housing expenses this month, however it is way above budget.
                Are you sure you don’t want to query some of the expenses?
              </h1>
              <button
                onClick={() => handleShowExpenseBreakdown()}
                className="mt-[16px] text-[#474747] bg-white flex w-full justify-between rounded-[20px] border border-[#EFEFF0] p-[12px]"
              >
                See all expenses breakdown <span><BsChevronRight className="text-[#888888]" size={24} /></span>
              </button>
            </div>
          </div>}



        {/* BEST PERFORMING CATEGORY */}

        {GetOverallBudgetAnalyticIsPending ?
          <BudgetVsActualSkeleton />
          :
          <div className="px-[24px]">
            <div className="p-[24px] rounded-t-[24px] border-[1px] border-[#EFEFF0]">
              <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Best performing category</h1>

              {/* Calculate the width percentages */}
              {(() => {
                const { totalBudgeted, actualExpenses } = bestPerformingCategory?.breakdown || {};
                const largerValue = Math.max(totalBudgeted, actualExpenses);
                const smallerValue = Math.min(totalBudgeted, actualExpenses);

                console.log(bestPerformingCategory);
                console.log(largerValue);


                const largerPercentage = 100; // The larger value always takes up 100% width.
                const smallerPercentage = largerValue > 0 ? (smallerValue / largerValue) * 100 : 0;

                // If either value is 0, set the width to 20% (as per your requirement)
                const adjustedBudgetPercentage = totalBudgeted <= 30 ? 50 : (largerValue === totalBudgeted ? largerPercentage : smallerPercentage);
                const adjustedActualPercentage = smallerPercentage <= 30 ? 50 : (largerValue === actualExpenses ? largerPercentage : smallerPercentage);


                return (
                  <>
                    {/* Budget bar */}
                    <h1
                      className="bg-[#66C227] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedBudgetPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Budget - </span>
                      ₦ {totalBudgeted?.toLocaleString()}
                    </h1>

                    {/* Actual bar */}
                    <h1
                      className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedActualPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Actual Expenses -  </span>
                      ₦ {actualExpenses?.toLocaleString()}
                    </h1>
                  </>
                );
              })()}
            </div>

            <div className="rounded-b-[24px] pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
              <h1 className="text-[#2D2D2D] font-[500] leading-[18px]">
                {bestPerformingCategory?.remark?.title || null}
              </h1>
              <h1 className="mt-[8px] text-[14px] leading-[18px]">
                {bestPerformingCategory?.remark?.description || null}
              </h1>
            </div>
          </div>}




        {/* WORST PERFORMING CATEGORY */}
        {GetOverallBudgetAnalyticIsPending ?
          <BudgetVsActualSkeleton />
          :
          <div className="px-[24px]">
            <div className="p-[24px] rounded-t-[24px] border-[1px] border-[#EFEFF0]">
              <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Worst performing category</h1>

              {/* Calculate the width percentages */}
              {(() => {
                const { totalBudgeted, actualExpenses } = worstPerformingCategory?.breakdown || {};
                const largerValue = Math.max(totalBudgeted, actualExpenses);
                const smallerValue = Math.min(totalBudgeted, actualExpenses);

                const largerPercentage = 100; // The larger value always takes up 100% width.
                const smallerPercentage = largerValue > 0 ? (smallerValue / largerValue) * 100 : 0;

                // If either value is 0, set the width to 20% (as per your requirement)
                const adjustedBudgetPercentage = totalBudgeted <= 30 ? 50 : (largerValue === totalBudgeted ? largerPercentage : smallerPercentage);
                const adjustedActualPercentage = smallerPercentage <= 30 ? 50 : (largerValue === actualExpenses ? largerPercentage : smallerPercentage);

                return (
                  <>
                    {/* Budget bar */}
                    <h1
                      className="bg-[#66C227] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedBudgetPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Budget - </span>
                      ₦ {totalBudgeted?.toLocaleString()}
                    </h1>

                    {/* Actual bar */}
                    <h1
                      className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedActualPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Actual Expenses -  </span>
                      ₦ {actualExpenses?.toLocaleString()}
                    </h1>
                  </>
                );
              })()}
            </div>

            <div className="rounded-b-[24px] pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
              <h1 className="text-[#2D2D2D] font-[500] leading-[18px]">
                {worstPerformingCategory?.remark?.title}
              </h1>
              <h1 className="mt-[8px] text-[14px] leading-[18px]">
                {worstPerformingCategory?.remark?.description}
              </h1>
            </div>
          </div>
        }


      </div>











      {showBudget &&
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 90 }} // Exit animation similar to the opening animation
            transition={{ duration: 0.3 }}
            className="h-[120vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
          >
            <BottomDrawer
              label="Filter budget name"
              back={false}
              show={showBudget}
              close={true}
              onClose={() => setShowBudget(!showBudget)}
            >
              <div className="flex h-[396px] overflow-y-scroll flex-col">
                {isPending ?
                  <div className=' w-full mx-auto  my-auto mt-[10rem] flex justify-center items-center'>
                    <CircularProgress size='md' color='default' />
                  </div>
                  :
                  <>

                    {budgets.map((budget, index) => (
                      <button
                        key={budget.uid} // Unique key for each month
                        onClick={() => {
                          console.log(budget);

                          setSelectedBudget(budget); // Set selected budget
                          setShowBudget(false); // Close the drawer
                        }}
                        className={`py-[16px] px-[8px] text-start ${index === budgets.length - 1 ? '' : 'border-b-1'} border-b-[#EFEFF0]`}
                      >
                        {budget.name}
                      </button>
                    ))}
                  </>}
              </div>
            </BottomDrawer>
          </motion.div>
        </AnimatePresence>

      }






      {showCategoryBreakDown &&
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh]  w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        > <BottomDrawer
          label={`Budget vs Actual`}
          back={false}
          show={showCategoryBreakDown}
          close={true}
          onClose={() => setShowCategoryBreakDown(!showCategoryBreakDown)}
        >    <div className="h-[86vh] mt-[32px]   overflow-y-auto ">


              {GetBudgetCategoriesAnalyticsApiData.map((item: any, index: any) => {
                // Determine the maximum value
                // Destructure the breakdown data for easier access
                const { title, actualExpenses, totalBudgeted } = item.breakdown;

                // Determine the maximum value for calculating percentages
                const largerValue = Math.max(totalBudgeted, actualExpenses);
                const smallerValue = Math.min(totalBudgeted, actualExpenses);

                // Set the larger value to always take up 100% width
                const largerPercentage = 100;
                const smallerPercentage = largerValue > 0 ? (smallerValue / largerValue) * 100 : 0;

                // Adjust the width to 20% if the value is too low
                const adjustedBudgetPercentage = totalBudgeted <= 30 ? 50 : (largerValue === totalBudgeted ? largerPercentage : smallerPercentage);
                const adjustedActualPercentage = smallerPercentage <= 30 ? 50 : (largerValue === actualExpenses ? largerPercentage : smallerPercentage);

                return (
                  <div key={index} className="mb-[24px] bg-[#F7F7F9] border border-[#EFEFF0] rounded-[24px] p-[24px]">
                    {/* Display the type of expense */}
                    <h2 className="text-[14px] text-[#2D2D2D] font-[500] mb-[4px]">{title}</h2>

                    {/* Budget bar */}
                    <h1
                      className="bg-[#66C227] text-[#FFFFFF] mb-[4px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedBudgetPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Budget - </span>
                      ₦ {totalBudgeted.toLocaleString()}
                    </h1>

                    {/* Actual bar */}
                    <h1
                      className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${adjustedActualPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Actual Expenses -  </span>
                      ₦ {actualExpenses.toLocaleString()}
                    </h1>

                    {/* Remark section */}
                    <div>
                      <h3 className="text-[12px] text-[#2D2D2D] font-[500] mb-[4px]">{item.remark.title}</h3>
                      <p className="text-[12px] text-[#2D2D2D]">{item.remark.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>


          </BottomDrawer>
        </motion.div>
      }






      {showExpenseBreakDown && (
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        >
          <BottomDrawer
            label={`Top expenses`}
            back={false}
            show={showExpenseBreakDown}
            close={true}
            onClose={() => setShowExpenseBreakDown(!showExpenseBreakDown)}
          >
            <div className="h-[86vh] mt-[32px] overflow-y-auto">
              <div className="w-full flex flex-col gap-[12px]">
                {/* Map over budgetCategories to display their details */}
                {getSingleBudgetApiData?.budgetCategories?.map((category: any) => (
                  <div
                    key={category.uid}
                    className="flex rounded-[12px] border border-[#EFEFF0] bg-[#F7F7F9] p-[8px] justify-between w-full"
                  >
                    <div className="flex gap-[8px] items-center">
                      <div
                        style={{ backgroundColor: category.color }}
                        className="w-[24px] h-[24px] rounded-full"
                      ></div>
                      <h1 className="leading-[16px] text-[12px] text-[#474747]">
                        {category.name.length > 9 ? `${category.name.substring(0, 9)}...` : category.name}
                      </h1>
                    </div>
                    <div className="text-[#474747] font-[500] text-[14px] leading-[16px]">
                      ₦ {category.amountSpent.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BottomDrawer>
        </motion.div>
      )}











    </div>
  );
}
