import PlusIcon from '@/icons/plus';
import BudgetHeader from './components/budget-header';
import CreateBudgetForm from './components/create-budget-form';
import CreateBudgetIncomeForm from './components/create-budget-income-form';
import CreateBudgetExpensesForm from './components/create-budget-expenses-form';
import NoBudgetHistory from './components/no-budget-history';
import CreateBudgetCategoryDetails from './components/create-budget-category-details';
import CreateBudgetCategoryForm from './components/create-budget-category-form';
import BudgetChart from './components/budget-chart';

const mainBg = {
  backgroundImage: `url(/grain.png), linear-gradient(128.3deg, #2D2E32 1.62%, #000000 55.79%),
  linear-gradient(291.65deg, #2D2E32 -11.65%, rgba(45, 46, 50, 0) 29.5%)`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
};

export default function Page() {
  return (
    <div className="flex flex-col h-full" style={mainBg}>
      <BudgetHeader />
      <div className="grow overflow-y-auto flex flex-col gap-4">
        <div className="p-6 flex flex-col gap-6">
          <h1 className="text-[2rem] text-white font-bold">
            Take charge of your income, budget effectively and track your finances
          </h1>

          <button className="flex items-center justify-center gap-2 bg-lemonGreen-500 rounded-[32px] py-[14px]">
            <PlusIcon className="fill-base-black" />
            <span className="text-base-black font-medium">Create budget</span>
          </button>
        </div>

        <div className="w-full rounded-t-3xl bg-white grow">
          {/* <NoBudgetHistory /> */}
          {/* <BudgetCardsList /> */}
          {/* <CreateBudgetIncomeForm /> */}
          {/* <CreateBudgetExpensesForm /> */}
          {/* <CreateBudgetCategoryDetails /> */}
          {/* <CreateBudgetCategoryForm /> */}
          <BudgetChart />
        </div>
      </div>
    </div>
  );
}
