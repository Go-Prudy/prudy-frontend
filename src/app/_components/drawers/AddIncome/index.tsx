'use client';

import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import Input from '../../input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addIncomeSchema } from '@/app/utils/validationSchema';
import Button from '../../button';
import useAddIncome from './useAddIncome';
import { formatAmount } from '@/app/utils/functions';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  budgetId: string;
}
export default function AddIncomeDrawer({ setShow, show, budgetId }: Props) {
  const { onSubmit } = useAddIncome({ setShow, budgetId });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ name: string; amount: string }>({
    defaultValues: {
      name: '',
      amount: '',
    },
    resolver: yupResolver(addIncomeSchema),
  });
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
          <Button onClick={handleSubmit(onSubmit)} type="submit">
            Save
          </Button>
        }
        label="Add Income"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <form className="space-y-6" id="create-budget-form">
          <Input
            label="Name of income"
            inputName="name"
            type="text"
            placeholder="e.g Salary"
            {...register('name')}
            error={errors?.name?.message}
          />
          <Input
            label="Amount"
            inputName="purpose"
            type="text"
            placeholder="e.g ₦50,000"
            {...register('amount')}
            onChange={formatAmount}
            error={errors?.amount?.message}
          />
        </form>
      </BottomDrawer>
    </motion.div>
  );
}
