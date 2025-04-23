'use client';
import BarChart from '@/app/_components/barChart';
import Header from '@/components/header';
import { Tab, Tabs } from '@nextui-org/react';
import IncomeTab from './_components/IncomeTab';
import CategoriesTab from './_components/CategriesTab';
import DistributionTab from './_components/DistributionTab';
import Loader from '@/app/_components/loader';
import useBudgetById from './useBudgetById';
import { Icons } from '@/app/icons';
import Link from 'next/link';

const Page = ({ params }: { params: { budgetId: string } }) => {
  const {
    budgetStats,
    isLoadingBudgetStats,
    budgetDetails,
    isLoadingBudgetDetails,
    disabledTabKeys,
    setDisabledTabKeys,
    handleTabSelection,
    selectedTab,
  } = useBudgetById({
    budgetId: params.budgetId,
  });

  return (
    <div className="space-y-4">
      <Header link="/budgets" title={budgetDetails?.name || ''}>
        {/* TODO: links to budget settings page */}
        <Link
          href={`/budget/${params.budgetId}/settings`}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600"
        >
          {Icons.settings}
        </Link>
      </Header>
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
      <Tabs
        disabledKeys={disabledTabKeys}
        selectedKey={selectedTab}
        fullWidth
        className="px-4"
      >
        <Tab key="income" title="Income" className="w-full border-none bg-gray-100 p-4">
          <IncomeTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
            collaborators={budgetDetails?.collaborators || []}
            setDisabledTabKeys={setDisabledTabKeys}
            handleTabSelection={handleTabSelection}
          />
        </Tab>
        <Tab key="allocations" title="Allocations" className="w-full bg-gray-100 p-4">
          <CategoriesTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
            handleTabSelection={handleTabSelection}
          />
        </Tab>
        <Tab key="distribution" title="Distribution" className="w-full bg-gray-100 p-4">
          <DistributionTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
            handleTabSelection={handleTabSelection}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
