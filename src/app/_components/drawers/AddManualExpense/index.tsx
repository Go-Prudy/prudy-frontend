'use client';

import { motion } from 'framer-motion';
import BottomDrawer from '../BottomDrawer';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createBudgetSchema } from '@/app/utils/validationSchema';
import Button from '../../button';
import useSelectBankAccount from './useAddManualExpense';
import Input from '../../input';
import { formatAmount } from '@/app/utils/functions';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
}

const AddManualExpenseDrawer = ({ setShow, show }: Props) => {
  const navigate = useRouter();
  const { onSubmit } = useSelectBankAccount({ setShow });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ name: string; amount: string; date: string }>({
    defaultValues: {
      name: '',
      amount: '',
      date: '',
    },
    // resolver: yupResolver(createBudgetSchema),
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
        label="Add Expense Manually"
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
          <Input
            label="Total Amount"
            inputName="purpose"
            type="text"
            placeholder="e.g ₦50,000"
            {...register('amount')}
            onChange={formatAmount}
            error={errors?.amount?.message}
          />
          <div className="flex items-center">
            <Input
              label="Date"
              inputName="date"
              type="date"
              placeholder="Select date..."
              {...register('date')}
              error={errors?.date?.message}
            />
          </div>
        </form>
      </BottomDrawer>
    </motion.div>
  );
};

export default AddManualExpenseDrawer;
