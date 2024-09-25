'use client'
import BottomDrawer from "@/components/create-budget/BottomDrawer";
import Header2 from "@/components/create-budget/Header2";
import { useState } from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { motion } from 'framer-motion';

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


  const [selectedBudget, setSelectedBudget] = useState<string>(allBudgets[0] || ''); // Store the selected budget
  const [topExpenses, setTopExpenses] = useState<expense[]>(topExpense || []);
  const [showBudget, setShowBudget] = useState<boolean>(false);
  const [showCategoryBreakDown, setShowCategoryBreakDown] = useState<boolean>(false);
  const [showExpenseBreakDown, setShowExpenseBreakDown] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState(monthlyBudget[0]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedBudget(value); // Update the selected budget
  };

  const budget = 1500000; // Example value
  const actual = 1000000; // Example value

  // Determine the maximum value
  const maxValue = Math.max(budget, actual);

  // Calculate the percentage for each relative to the max value
  const budgetPercentage = (budget / maxValue) * 100;
  const actualPercentage = (actual / maxValue) * 100;


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

  return (
    <div className="bg-base-white w-full h-full">
      <Header2 title={'Analytics'} />
      <div className="flex mb-[8px] w-full items-center py-[12px] px-[24px]  mt-[90px] gap-[12px]">
        <label className=" w-full bg-[#F7F7F9] px-[8px] py-[16px] rounded-[8px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">

          <button onClick={() => setShowBudget(!showBudget)} className=' border-[0.4px] text-[14px]  items-center border-[#EFEFF0] w-full  bg-[#F7F7F9] rounded-[8px] flex  justify-between'>
            <h1>{selectedMonth ? selectedMonth?.name : monthlyBudget[0].name} </h1>
            <BsChevronDown size={10} className=' text-[#645D72] ' />
          </button>
        </label>
        <button className=" rounded-[32px] bg-[#EFEFF0] px-[12px] py-[4px] h-[40px] text-[12px] font-[500]  text-center">Download</button>
      </div>

      <div className=" flex  mb-[131.5px] flex-col gap-[24px]">

        {/* BUDGET VS ACTUAL */}
        <div className="   px-[24px] ">
          <div className=" p-[24px] rounded-t-[24px]  border-[1px] border-[#EFEFF0]  ">
            <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Budget vs Actual</h1>

            <h1
              className="bg-[#66C227] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
              style={{ width: `${budgetPercentage}%` }}
            >
              <span className="text-[10px] font-[400]">Budget - </span>
              ₦ {budget.toLocaleString()}
            </h1>

            {/* Actual bar */}
            <h1
              className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
              style={{ width: `${actualPercentage}%` }}
            >
              <span className="text-[10px] font-[400]">Actual - </span>
              ₦ {actual.toLocaleString()}
            </h1>
          </div>

          <div className="  rounded-b-[24px]   pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
            <h1 className=" text-[#2D2D2D] font-[500] leading-[18px] ">You’re doing really great 🥳🎉🎊</h1>
            <h1 className=" mt-[8px] text-[14px] leading-[18px] ">Keep up with your planned budget and win up to <span className=" text-[#8A62D8] font-[700]">20 points</span> this month</h1>
            <button onClick={() => handleShowCategoryBreakdown()} className=" mt-[16px] text-[#474747] bg-white  flex w-full justify-between rounded-[20px]  border border-[#EFEFF0] p-[12px] ">
              See categories breakdown <span> <BsChevronRight className=" text-[#888888]" size={24} /></span>
            </button>

          </div>
        </div>



        {/* Top expenses */}

        <div className="  w-full  px-[24px] ">
          <div className="p-[24px] w-full rounded-t-[24px] border-[1px] border-[#EFEFF0]">
            <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Top expenses</h1>
            <div className="w-full flex flex-col gap-[12px]">
              {topExpenses
                .sort((a, b) => b.amount - a.amount) // Sort by amount in descending order
                .slice(0, 3) // Select only the top 3
                .map((expense) => (
                  <div key={expense.type} className="flex rounded-[12px] border border-[#EFEFF0] bg-[#F7F7F9] p-[8px] justify-between w-full">
                    <div className="flex gap-[8px] items-center">
                      <div
                        style={{ backgroundColor: expense.color }}
                        className="w-[24px] h-[24px] rounded-full"
                      ></div>
                      <h1 className="leading-[16px] text-[12px] text-[#474747]">
                        {expense.type.length > 9 ? `${expense.type.substring(0, 9)}...` : expense.type}
                      </h1>
                    </div>
                    <div className="text-[#474747] font-[500] text-[14px] leading-[16px]">
                      ₦ {expense.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="  rounded-b-[24px]   pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
            <h1 className=" text-[#2D2D2D] font-[500] leading-[18px] ">Come on you stunner! 😊👏🏽</h1>
            <h1 className=" mt-[8px] text-[14px] leading-[18px] ">You spent more on your housing expenses this month, however it is way above budget. Are you sure you don’t want to query some of the expenses?</h1>
            <button onClick={() => handleShowExpenseBreakdown()} className=" mt-[16px] text-[#474747] bg-white  flex w-full justify-between rounded-[20px]  border border-[#EFEFF0] p-[12px] ">
              See all expenses breakdown <span> <BsChevronRight className=" text-[#888888]" size={24} /></span>
            </button>

          </div>
        </div>



        {/* BEST PERFORMING CATEGORY */}
        <div className="   px-[24px] ">
          <div className=" p-[24px] rounded-t-[24px]  border-[1px] border-[#EFEFF0]  ">
            <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Best performing category</h1>

            <h1
              className="bg-[#66C227] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
              style={{ width: `${budgetPercentage}%` }}
            >
              <span className="text-[10px] font-[400]">Budget - </span>
              ₦ {budget.toLocaleString()}
            </h1>

            {/* Actual bar */}
            <h1
              className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
              style={{ width: `${actualPercentage}%` }}
            >
              <span className="text-[10px] font-[400]">Actual - </span>
              ₦ {actual.toLocaleString()}
            </h1>
          </div>

          <div className="  rounded-b-[24px]   pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
            <h1 className=" text-[#2D2D2D] font-[500] leading-[18px] ">Good one mate 😊👏🏽</h1>
            <h1 className=" mt-[8px] text-[14px] leading-[18px] ">Obviously, you have been able to keep up with your utilities and generosity. You should keep this up.</h1>


          </div>
        </div>



        {/* WORST PERFORMING CATEGORY  */}
        <div className="   px-[24px] ">
          <div className=" p-[24px] rounded-t-[24px]  border-[1px] border-[#EFEFF0]  ">
            <h1 className="text-[#2D2D2D] mb-[16px] font-[500] leading-[16px]">Worst performing category</h1>

            <h1
              className="bg-[#66C227] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
              style={{ width: `${budgetPercentage}%` }}
            >
              <span className="text-[10px] font-[400]">Budget - </span>
              ₦ {budget.toLocaleString()}
            </h1>

            {/* Actual bar */}
            <h1
              className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
              style={{ width: `${actualPercentage}%` }}
            >
              <span className="text-[10px] font-[400]">Actual - </span>
              ₦ {actual.toLocaleString()}
            </h1>
          </div>

          <div className="  rounded-b-[24px]   pb-[24px] pt-[16px] bg-[#F3F0FA] px-[24px]">
            <h1 className=" text-[#2D2D2D] font-[500] leading-[18px] ">Common man, you can’t save the world 🥺😑</h1>
            <h1 className=" mt-[8px] text-[14px] leading-[18px] ">Let’s be frank, you out gave yourself this month. While this is not a bad thing, it’s not sustainable for you. Let’s do better next time. 💪🏽</h1>


          </div>
        </div>

      </div>











      {showBudget &&
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[120vh] w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        > <BottomDrawer
          label={`Filter budget name`}
          back={false}
          show={showBudget}
          close={true}
          onClose={() => setShowBudget(!showBudget)}
        ><div className="">
              <div className="flex h-[396px] overflow-y-scroll flex-col">
                {monthlyBudget.map((month, index) => (
                  <button
                    key={month.name}
                    onClick={() => {
                      setSelectedMonth(month)
                      setShowBudget(!showBudget)
                    }}
                    className={`py-[16px] px-[8px] text-start ${index === monthlyBudget.length - 1 ? '' : 'border-b-1'
                      } border-b-[#EFEFF0]`}
                  >
                    {month.name}
                  </button>
                ))}
              </div>
            </div>

          </BottomDrawer>
        </motion.div>
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


              {budgetData.map((item, index) => {
                // Determine the maximum value
                const maxValue = Math.max(item.budget, item.expense);

                // Calculate the percentage for each relative to the max value
                const budgetPercentage = (item.budget / maxValue) * 100;
                const actualPercentage = (item.expense / maxValue) * 100;

                return (
                  <div key={index} className=" mb-[24px] bg-[#F7F7F9] border border-[#EFEFF0] rounded-[24px] p-[24px] ">
                    {/* Display the type of expense */}
                    <h2 className="text-[14px] text-[#2D2D2D] font-[500] mb-[4px]">{item.type}</h2>

                    {/* Budget bar */}
                    <h1
                      className="bg-[#66C227] text-[#FFFFFF] mb-[4px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${budgetPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Budget - </span>
                      ₦ {item.budget.toLocaleString()}
                    </h1>

                    {/* Actual bar */}
                    <h1
                      className="bg-[#F89446] text-[#FFFFFF] mb-[12px] text-[10px] px-[10px] py-[6px] rounded-r-[8px] font-[700] leading-[16px]"
                      style={{ width: `${actualPercentage}%` }}
                    >
                      <span className="text-[10px] font-[400]">Actual - </span>
                      ₦ {item.expense.toLocaleString()}
                    </h1>
                  </div>
                );
              })}
            </div>


          </BottomDrawer>
        </motion.div>
      }






      {showExpenseBreakDown &&
        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[100vh]  w-full z-[40] bottom-0 fixed bg-[#1c1c1c73]"
        > <BottomDrawer
          label={`Top expenses`}
          back={false}
          show={showExpenseBreakDown}
          close={true}
          onClose={() => setShowExpenseBreakDown(!showExpenseBreakDown)}
        >    <div className="h-[86vh] mt-[32px]   overflow-y-auto ">

              <div className="w-full flex flex-col gap-[12px]">
                {topExpenses.map((expense) => (
                  <div key={expense.type} className="flex rounded-[12px] border border-[#EFEFF0] bg-[#F7F7F9] p-[8px] justify-between w-full">
                    <div className="flex gap-[8px] items-center">
                      <div
                        style={{ backgroundColor: expense.color }}
                        className="w-[24px] h-[24px] rounded-full"
                      ></div>
                      <h1 className=" leading-[16px] text-[12px] text-[#474747] ">{expense.type.length > 9 ? `${expense.type.substring(0, 9)}...` : expense.type}</h1>
                    </div>
                    <div className=" text-[#474747] font-[500] text-[14px] leading-[16px] ">₦ {expense.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>


          </BottomDrawer>
        </motion.div>
      }











    </div>
  );
}
