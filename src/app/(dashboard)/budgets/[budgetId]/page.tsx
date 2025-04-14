'use client';
import BarChart from '../../../_components/barChart';
import Header from '@/components/header';
import { Tab, Tabs } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthentication } from '@/app/store/AuthStore';
import IncomeTab from '../_components/IncomeTab';
import CategoriesTab from '../_components/CategriesTab';
import DistributionTab from '../_components/DistributionTab';

const Page = ({ params }: { params: { budgetId: string } }) => {
  const navigation = useRouter();

  return (
    <div className="space-y-4">
      <Header link="/budgets" title={'untitled'} />
      <BarChart labels={['Income', 'Expenses', 'Amount Left']} values={[0, 2, 4]} />

      {/* tabs */}
      <Tabs fullWidth>
        <Tab key="income" title="Income" className="w-full bg-gray-100 p-4">
          <IncomeTab budgetId={params.budgetId} />
        </Tab>
        <Tab key="categories" title="Categories" className="w-full bg-gray-100 p-4">
          <CategoriesTab budgetId={params.budgetId} />
        </Tab>
        <Tab key="distribution" title="Distribution" className="w-full bg-gray-100 p-4">
          <DistributionTab budgetId={params.budgetId} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
