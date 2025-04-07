import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Button from '@/app/_components/button';
import expenseImg from '/public/images/budget/total-expense.png';

import { getAllBudgetCategoriesApi } from '@/app/services/BudgetService';
import { useAuthentication } from '@/app/store/AuthStore';
import { useQuery } from '@tanstack/react-query';
import { BsPlus } from 'react-icons/bs';
import { CircularProgress } from '@nextui-org/react';
import CreateCategoryDrawer from '../../../../_components/drawers/CreateCategory';
import EditCategoryDrawer from '../../../../_components/drawers/EditCategory';

type Props = { budgetId: string };

export default function CategoriesTab({ budgetId }: Props) {
  const { authenticatedUser } = useAuthentication();
  const [showCreateCategoryDrawer, setShowCreateCategoryDrawer] =
    useState<boolean>(false);
  const [showEditCategory, setShowEditCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number>();

  const { data: budgetCategories = [], isLoading } = useQuery({
    queryKey: ['getAllBudgetCategories'],
    queryFn: () => getAllBudgetCategoriesApi(authenticatedUser?.token ?? ''),
    enabled: !!authenticatedUser?.token,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 bg-white rounded-3xl">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
            <Image src={expenseImg} width={45} height={40} alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Total Planned Expenses</p>
            <h6 className="text-xl text-black-800 font-bold">₦0.00</h6>
          </div>
        </div>
        <div className="px-4 py-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-black-800 font-medium">Budget Categories</p>
            <Button
              onClick={() => setShowCreateCategoryDrawer(true)}
              buttonIcon={<BsPlus size={16} />}
              buttonTitle="Create New"
              buttonType="icon"
            />
          </div>
          <p className="text-sm text-gray-400">
            Click on the categories below to set their expenses.
          </p>

          {/* <ul className="grid grid-cols-2 gap-3 overflow-y-scroll overflow-x-hidden min-h-[322px]">
            <li
              onClick={() => {
                setSelectedCategory(0);
                setShowEditCategory(true);
              }}
              className="bg-gray-100 border border-gray-200 p-3 rounded-[20px] space-y-2 text-gray-700"
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: '#01B0C5' }}
              />
              <p className="text-xs">Grocries</p>
              <p className="text-sm font-medium">
                ₦
              </p>
            </li>
            <li
              onClick={() => {
                setSelectedCategory(1);
                setShowEditCategory(true);
              }}
              className="bg-gray-100 border border-gray-200 p-3 rounded-[20px] space-y-2 text-gray-700"
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: '#FB8417' }}
              />
              <p className="text-xs">Food</p>
              <p className="text-sm font-medium">
                ₦
              </p>
            </li>
          </ul> */}

          {/* categories list */}
          {isLoading ? (
            <CircularProgress color="default" size="md" />
          ) : (
            <ul className="grid grid-cols-2 gap-3 overflow-auto min-h-[322px]">
              {budgetCategories.map((category, index: number) => (
                <li
                  key={category.uid}
                  onClick={() => {
                    setSelectedCategory(index);
                    setShowEditCategory(true);
                  }}
                  className="bg-gray-100 border border-gray-200 p-3 rounded-[20px] space-y-2 text-gray-700"
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="text-xs">{category.name}</p>
                  <p className="text-sm font-medium">
                    ₦{/* {totalAmount.toLocaleString('en-US')} */}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showCreateCategoryDrawer && (
        <CreateCategoryDrawer
          show={showCreateCategoryDrawer}
          setShow={setShowCreateCategoryDrawer}
        />
      )}
      {showEditCategory && (
        <EditCategoryDrawer
          name={selectedCategory ? budgetCategories[selectedCategory].name : ''}
          show={showEditCategory}
          setShow={setShowEditCategory}
          totalIncome={200000}
        />
      )}
    </div>
  );
}
