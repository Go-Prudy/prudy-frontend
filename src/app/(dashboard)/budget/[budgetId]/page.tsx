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
import TrackExpenseDrawer from '@/app/_components/drawers/TrackExpenses';
import SelectSyncPeriodDrawer from '@/app/_components/drawers/SelectSyncPeriod';
import AddManualExpenseDrawer from '@/app/_components/drawers/AddManualExpense';
import SelectBankAccountDrawer from '@/app/_components/drawers/SelectBankAccount';
import ScanReceipt from '@/app/_components/scanner';

const Page = ({ params }: { params: { budgetId: string } }) => {
  const router = useRouter();
  const {
    budgetStats,
    isLoadingBudgetStats,
    budgetDetails,
    isLoadingBudgetDetails,
    handleTabSelection,
    showTrackExpensesDrawer,
    setShowTrackExpensesDrawer,
    showSelectBankAccountDrawer,
    setShowSelectBankAccountDrawer,
    showAddManualDrawer,
    setShowAddManualDrawer,
    showScanner,
    setShowScanner,
    showSyncPeriodDrawer,
    setShowSyncPeriodDrawer,
    selectedAccountId,
    setSelectedAccountId,
    value,
    setValue,
    linkedAccounts,
    isGetAllLinkedAccountsLoading,
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
      <Tabs fullWidth className="px-4">
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
        <Button onClick={() => setShowTrackExpensesDrawer(true)}>
          Track your Expenses
        </Button>
      </BottomButton>

      {showTrackExpensesDrawer && (
        <TrackExpenseDrawer
          show={showTrackExpensesDrawer}
          setShow={setShowTrackExpensesDrawer}
          setShowSelectBankAccountDrawer={setShowSelectBankAccountDrawer}
          setShowAddManualDrawer={setShowAddManualDrawer}
          setShowScanner={setShowScanner}
        />
      )}
      {showSelectBankAccountDrawer && (
        <SelectBankAccountDrawer
          show={showSelectBankAccountDrawer}
          setShow={setShowSelectBankAccountDrawer}
          linkedAccounts={linkedAccounts}
          isLoading={isGetAllLinkedAccountsLoading}
          setShowSyncPeriodDrawer={setShowSyncPeriodDrawer}
          selectedAccountId={selectedAccountId ?? ''}
          setSelectedAccountId={setSelectedAccountId}
        />
      )}

      {showAddManualDrawer && (
        <AddManualExpenseDrawer
          show={showAddManualDrawer}
          setShow={setShowAddManualDrawer}
          categories={(budgetDetails?.budgetCategories || []).map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            uid: cat.uid,
          }))}
          budgetId={params.budgetId || ''}
          isLoadingCategories={isLoadingBudgetDetails}
        />
      )}

      {/* select sync period */}
      {showSyncPeriodDrawer && (
        <SelectSyncPeriodDrawer
          show={showSyncPeriodDrawer}
          setShow={setShowSyncPeriodDrawer}
          value={value}
          onChange={setValue}
          accountId={selectedAccountId ?? ''}
          selectedBudgetId={params.budgetId ?? ''}
        />
      )}
      <ScanReceipt
        showScanner={showScanner}
        setShowScanner={setShowScanner}
        budgetId={params.budgetId || ''}
      />
    </div>
  );
};

export default Page;
