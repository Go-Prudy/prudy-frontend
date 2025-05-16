'use client';
import BarChart from '@/app/_components/barChart';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import { Tab, Tabs } from '@nextui-org/react';
import IncomeTab from './_components/IncomeTab';
import AllocationsTab from './_components/AllocationsTab';
import DistributionTab from './_components/DistributionTab';
import Loader from '@/app/_components/loader';
import useBudgetById from './useBudgetById';
import { Icons } from '@/app/icons';
import Link from 'next/link';
import BottomButton from './_components/bottomButton';
import Button from '@/app/_components/button';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { budgetId: string } }) => {
  const router = useRouter();
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
    <div className="space-y-4 pb-[100px]">
      <InnerPageHeader link="/budgets" title={budgetDetails?.name || ''}>
        <Link
          href={`/budget/${params.budgetId}/settings`}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600"
        >
          {Icons.settings}
        </Link>
      </InnerPageHeader>

      {/* tabs */}
      <Tabs
        // disabledKeys={disabledTabKeys}
        // selectedKey={selectedTab}
        fullWidth
        className="px-4"
      >
        <Tab key="income" title="Income" className="w-full border-none p-0">
          <div className="px-6 mb-3">
            <BarChart
              labels={['Income', 'Expenses', 'Amount Left']}
              values={[
                budgetStats?.totalIncome || 0,
                budgetStats?.totalExpense || 0,
                budgetStats?.amountLeft || 0,
              ]}
              isLoadingBudgetStats={isLoadingBudgetStats}
            />
          </div>
          <IncomeTab
            budgetId={params.budgetId}
            isLoadingBudgetDetails={isLoadingBudgetDetails}
            collaborators={budgetDetails?.collaborators || []}
            setDisabledTabKeys={setDisabledTabKeys}
            handleTabSelection={handleTabSelection}
          />
        </Tab>
        <Tab key="allocations" title="Allocations" className="w-full p-0">
          <div className="px-6 mb-3">
            <BarChart
              labels={['Income', 'Expenses', 'Amount Left']}
              values={[
                budgetStats?.totalIncome || 0,
                budgetStats?.totalExpense || 0,
                budgetStats?.amountLeft || 0,
              ]}
              isLoadingBudgetStats={isLoadingBudgetStats}
            />
          </div>
          <AllocationsTab
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
      <BottomButton>
        <Button onClick={() => router.push('/track')}>Track your Expenses</Button>
      </BottomButton>
    </div>
  );
};

export default Page;
