'use client';
import BarChart from '../../../_components/barChart';
import Header from '@/components/header';
import { Tab, Tabs } from '@nextui-org/react';
import IncomeTab from '../_components/IncomeTab';
import CategoriesTab from '../_components/CategriesTab';
import DistributionTab from '../_components/DistributionTab';
import Loader from '@/app/_components/loader';
import useBudgetById from './useBudgetById';

const Page = ({ params }: { params: { budgetId: string } }) => {
  const { budgetStats, isLoadingBudgetStats, budgetDetails, isLoadingBudgetDetails } =
    useBudgetById({
      budgetId: params.budgetId,
    });

  return (
    <div className="space-y-4">
      <Header link="/budgets" title={budgetDetails?.name || ''} />
      {isLoadingBudgetStats ? (
        <Loader />
      ) : (
        (budgetStats?.totalIncome > 0 ||
          budgetStats?.totalExpense > 0 ||
          budgetStats?.amountLeft > 0) && (
          <BarChart
            labels={['Income', 'Expenses', 'Amount Left']}
            values={[
              budgetStats?.totalIncome,
              budgetStats?.totalExpense,
              budgetStats?.amountLeft,
            ]}
          />
        )
      )}

      {/* tabs */}
      <Tabs fullWidth>
        <Tab key="income" title="Income" className="w-full bg-gray-100 p-4">
          <IncomeTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
            collaborators={budgetDetails?.collaborators || []}
          />
        </Tab>
        <Tab key="categories" title="Allocations" className="w-full bg-gray-100 p-4">
          <CategoriesTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
          />
        </Tab>
        <Tab key="distribution" title="Distribution" className="w-full bg-gray-100 p-4">
          <DistributionTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
