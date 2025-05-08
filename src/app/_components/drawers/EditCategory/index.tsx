import React from 'react';
import BottomDrawer from '../BottomDrawer';
import Button from '../../button';
import { motion } from 'framer-motion';
import Input from '../../input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useCreateCategory from './useEditCategory';
import { createCategorySchema } from '@/app/utils/validationSchema';
import { BudgetCategory } from '@/app/types/budget';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  selectedCategory: BudgetCategory | null;
};

export default function EditCategoryDrawer({ show, setShow, selectedCategory }: Props) {
  const { onSubmit, editCategoryMutation } = useCreateCategory({ setShow });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: selectedCategory?.name || '',
    },
    resolver: yupResolver(createCategorySchema),
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
          <Button
            loading={editCategoryMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        }
        label="Edit category"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <form className="space-y-6" id="create-budget-form">
          <Input
            label="Name of category"
            inputName="name"
            type="text"
            placeholder="e.g Housing"
            {...register('name')}
            error={errors?.name?.message}
          />
        </form>
      </BottomDrawer>
    </motion.div>
  );
}
