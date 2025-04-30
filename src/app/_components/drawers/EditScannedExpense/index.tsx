'use client';

import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editScannedExpenseSchema } from '@/app/utils/validationSchema';
import Button from '../../button';
import Input from '../../input';
import { formatAmount, formatQuantity } from '@/app/utils/functions';
import useEditScannedExpense from './useEditScannedExpense';
import { BudgetCategory } from '@/app/types/budget';
import { Dispatch, SetStateAction, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import SelectCategoryDrawer from '../SelectCategory';
import { ScannedItem, ScannedResult } from '@/app/types/scan';
import CategorySelectInput from '../../categorySelectInput';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  budgetCategories: BudgetCategory[];
  scannedItem: ScannedItem;
  isBudgetCategriesLoading: boolean;
  handleUpdateCategory: (category: BudgetCategory) => void;
  setScannedResults: Dispatch<SetStateAction<ScannedResult | null>>;
  index: number;
}

const EditScannedExpenseDrawer = ({
  setShow,
  show,
  budgetCategories,
  scannedItem,
  isBudgetCategriesLoading,
  handleUpdateCategory,
  setScannedResults,
  index,
}: Props) => {
  const { onSubmit } = useEditScannedExpense({
    setShow,
    scannedItem,
    setScannedResults,
    index,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    name: string;
    quantity: string;
    total: string;
    price: string;
  }>({
    defaultValues: {
      name: scannedItem.name || '',
      quantity: scannedItem.quantity.toString() || '1',
      total: scannedItem.totalAmount.toString() || '0',
      price: scannedItem.baseAmount.toString() || '0',
    },
    resolver: yupResolver(editScannedExpenseSchema),
  });

  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <div className="flex gap-2">
            <Button onClick={() => {}} className="bg-red-200 text-red-600">
              Delete
            </Button>
            <Button onClick={handleSubmit(onSubmit)} type="submit">
              Save
            </Button>
          </div>
        }
        label="Item Details"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <form className="space-y-6" id="create-budget-form">
          <Input
            label="Name of Item"
            inputName="name"
            type="text"
            placeholder="January..."
            {...register('name')}
            error={errors?.name?.message}
          />

          <div className="flex items-center gap-4">
            <Input
              label="Quantity"
              inputName="quantity"
              type="text"
              placeholder="e.g ₦50,000"
              {...register('quantity')}
              onChange={formatQuantity}
              error={errors?.quantity?.message}
            />
            <Input
              label="Unit Price"
              inputName="price"
              type="text"
              placeholder="e.g ₦50,000"
              {...register('price')}
              onChange={formatAmount}
              error={errors?.price?.message}
            />
          </div>
          <div className="flex items-center gap-4">
            <Input
              label="Total"
              inputName="total"
              type="text"
              placeholder="e.g ₦50,000"
              {...register('total')}
              onChange={formatAmount}
              error={errors?.total?.message}
            />
            <CategorySelectInput
              setShowCategoriesDrawer={setShowCategoriesDrawer}
              scannedItem={scannedItem}
            />
          </div>
        </form>
        {showCategoriesDrawer && (
          <SelectCategoryDrawer
            show={showCategoriesDrawer}
            setShow={setShowCategoriesDrawer}
            categories={budgetCategories}
            isLoading={isBudgetCategriesLoading}
            selectedCategory={{
              name: scannedItem.categoryName,
              uid: scannedItem.categoryUid,
              color: '',
              id: scannedItem.categoryUid,
            }}
            handleUpdateCategory={handleUpdateCategory}
          />
        )}
      </BottomDrawer>
    </motion.div>
  );
};

export default EditScannedExpenseDrawer;
