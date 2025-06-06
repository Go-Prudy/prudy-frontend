'use client';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import { Icons } from '@/app/icons';
import Link from 'next/link';
import Button from '@/app/_components/button';
import { useRouter } from 'next/navigation';
import { useCategoryExpense } from './useCategoryExpense';
import { format } from 'date-fns';
import expenseIcon from '/public/images/icons/expense.svg';
import noBudgetImg from '/public/images/List 2.webp';

import Image from 'next/image';

const Page = ({ params }: { params: { budgetId: string; categoryId: string } }) => {
  const { expenses, isLoading, error } = useCategoryExpense(
    params.budgetId,
    params.categoryId,
  );

  return (
    <div className="space-y-4">
      <InnerPageHeader link={`/budget/${params.budgetId}`} title={'Expenses'}>
        <Link
          href={`/budget/${params.budgetId}/settings`}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600"
        >
          {Icons.settings}
        </Link>
      </InnerPageHeader>

      <div className="bg-gray-100 p-4 min-h-[calc(100vh-80px)]">
        {/* skeleton loader */}
        {expenses.length === 0 ? (
          <div className="text-gray-500">No expenses found for this category</div>
        ) : (
          <div>
            {/* amount left */}
            <div className="space-y-2">
              {expenses?.map((expense: any) => (
                <div
                  key={expense.id}
                  className="p-4 bg-white border border-gray-200 rounded-2xl flex items-center gap-2"
                >
                  <Image src={expenseIcon} alt="expense" width={40} height={40} />
                  <div className="space-y-2 w-full text-sm">
                    <p className="font-medium">{expense.narration}</p>

                    <div className="flex justify-between items-center ">
                      <p className="text-xs text-gray-500 gap-1 flex items-center">
                        <span>{format(new Date(expense.date), 'MMM dd')}</span>
                        <div className="h-4 w-px bg-gray-200" />
                        <span>{format(new Date(expense.date), 'hh:mm a')}</span>
                      </p>
                      <p className="font-medium">₦{expense.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
