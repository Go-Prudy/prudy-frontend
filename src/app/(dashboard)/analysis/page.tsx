'use client'
import Header2 from "@/components/create-budget/Header2";
import { useState } from "react";

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

  const [selectedBudget, setSelectedBudget] = useState<string>(allBudgets[0]); // Store the selected budget

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedBudget(value); // Update the selected budget
  };

  return (
    <div className="bg-base-white w-full h-full">
      <Header2 title={'Analytics'} />
      <div className="flex w-full items-center py-[12px] px-[24px]  mt-[90px] gap-[12px]">
        <label className=" w-full bg-[#F7F7F9] p-[16px] rounded-[8px] border-[#EFEFF0] border flex flex-col gap-[8px] text-[12px] text-[#575757]">

          <select
            name="category"
            value={selectedBudget} // Bind to selectedBudget
            onChange={handleInputChange}
            className="outline-none bg-[#ff000000] font-[400] leading-[24px] text-[14px] text-[#2D2D2D]"
          >
            {allBudgets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button className=" rounded-[32px] bg-[#EFEFF0] px-[12px] py-[4px] h-[40px] text-[12px] font-[500]  text-center">Download</button>
      </div>
    </div>
  );
}
