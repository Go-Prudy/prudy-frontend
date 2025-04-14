import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { getBudgetDistributionApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { BudgetDistributionCategory } from '@/app/utils/types';
import { generateUniqueColors } from '@/app/utils/functions';
import PlannedBudget from './PlannedBudget';

type Props = { budgetId: string };

export default function DistributionTab({ budgetId }: Props) {
  const { authenticatedUser } = useAuthentication();

  const [distributions, setDistributions] = useState<BudgetDistributionCategory[]>([]);
  const [filteredDistributions, setFilteredDistributions] = useState<
    BudgetDistributionCategory[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'All categories',
  ]);

  const { data: budgetDistributionData, isLoading } = useQuery({
    queryKey: ['getBudgetDistribution', budgetId],
    queryFn: () => getBudgetDistributionApi(authenticatedUser?.token ?? '', budgetId),
    enabled: !!authenticatedUser?.token && !!budgetId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (budgetDistributionData) {
      const colors = generateUniqueColors(budgetDistributionData?.distributions.length);

      const newDistributions =
        budgetDistributionData?.distributions?.map((item: any, index: number) => ({
          ...item,
          color: colors[index],
        })) || [];

      setDistributions(newDistributions);
      setFilteredDistributions(newDistributions);
    }
  }, [budgetDistributionData]);

  useEffect(() => {
    if (selectedCategories.includes('All categories')) {
      setFilteredDistributions(distributions);
    } else {
      const filtered = distributions.filter((distribution) =>
        selectedCategories.includes(distribution.name),
      );
      setFilteredDistributions(filtered);
    }
  }, [selectedCategories, distributions]);

  return (
    <div className="border border-gray-200 bg-white rounded-3xl py-4">
      <Tabs
        fullWidth
        classNames={{
          cursor: 'w-full bg-lemonGreen-600',
          tab: 'text-gray-600 font-medium text-base',
          tabContent:
            'group-data-[selected=true]:text-lemonGreen-600 group-data-[selected=true]:font-bold',
        }}
        variant="underlined"
      >
        <Tab key="plannedBudget" title="Planned Budget" className="w-full">
          <PlannedBudget
            isLoading={isLoading}
            totalBudget={budgetDistributionData?.totalBudget}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            distributions={filteredDistributions}
          />
        </Tab>
        <Tab key="categories" title="Categories" className="w-full"></Tab>
      </Tabs>
    </div>
  );
}
