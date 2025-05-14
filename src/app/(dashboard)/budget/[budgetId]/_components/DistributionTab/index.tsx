import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { getBudgetDistributionApi } from '@/app/services/BudgetService';
import { useQuery } from '@tanstack/react-query';
import { generateUniqueColors } from '@/app/utils/functions';
import PlannedBudget from './PlannedBudget';
import { BudgetDistributionCategory } from '@/app/types/budget';
import { useAuthStore } from '@/app/store/useAuthStore';
import ActualExpenses from './ActualExpenses';
import BottomButton from '../bottomButton';
import { BsArrowLeft } from 'react-icons/bs';
import Button from '@/app/_components/button';

type Props = {
  budgetId: string;
  isLoadingBudgetDetails: boolean;
  handleTabSelection: (key: string) => void;
};

export default function DistributionTab({ budgetId, handleTabSelection }: Props) {
  return (
    <div className="border border-gray-200 bg-white rounded-3xl py-4 mb-[100px]">
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
          <PlannedBudget budgetId={budgetId} />
        </Tab>
        <Tab key="actualExpenses" title="Actual Expenses" className="w-full">
          <ActualExpenses budgetId={budgetId} />
        </Tab>
      </Tabs>
      <BottomButton>
        <Button
          className="!bg-lemonGreen-100 !text-lemonGreen-900"
          onClick={() => handleTabSelection('allocations')}
        >
          <BsArrowLeft />
          Back
        </Button>

        <Button>Save</Button>
      </BottomButton>
    </div>
  );
}
