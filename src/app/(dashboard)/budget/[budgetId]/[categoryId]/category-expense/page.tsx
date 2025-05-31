'use client';
import InnerPageHeader from '@/app/_components/Header/innerPageHeader';
import { Icons } from '@/app/icons';
import Link from 'next/link';
import Button from '@/app/_components/button';
import { useRouter } from 'next/navigation';
import { useCategoryExpense } from './useCategoryExpense';

const Page = ({ params }: { params: { budgetId: string; categoryId: string } }) => {
  const { expenses, isLoading, error } = useCategoryExpense(
    params.budgetId,
    params.categoryId,
  );

  return (
    <div className="space-y-4 pb-[100px]">
      <InnerPageHeader link="/budget/${params.budgetId" title={'Expenses'}>
        <Link
          href={`/budget/${params.budgetId}/settings`}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-600"
        >
          {Icons.settings}
        </Link>
      </InnerPageHeader>

      <div>
        {/* skeleton loader */}
        {expenses.length === 0 ? (
          <div className="text-gray-500">No expenses found for this category</div>
        ) : (
          <ul className="space-y-2">
            {expenses?.map((expense: any) => (
              <li
                key={expense.id}
                className="p-3 bg-white rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold">${expense.amount.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;
