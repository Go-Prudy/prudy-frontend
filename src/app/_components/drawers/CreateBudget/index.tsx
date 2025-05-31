'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createBudgetSchema } from '@/app/utils/validationSchema';
import BottomDrawer from '../BottomDrawer';
import Input from '../../input';
import Button from '../../button';
import useCreateBudget from './useCreateBudget';
import LoadingModal from '../../modals/LoadingModal';
import { SuccessModal } from '../../modals/SuccessfulModal';
import { CreateBudgetForm } from '@/app/types/budget';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  type: 'create' | 'edit';
  budgetId?: string;
  budgetData?: CreateBudgetForm;
  setTypeOfDrawer?: Dispatch<SetStateAction<'create' | 'edit'>>;
}

const getDate = (date: string): string =>
  date ? new Date(new Date(date).getTime() + 86400000).toISOString().split('T')[0] : '';

const CreateBudgetDrawer = ({
  setShow,
  show,
  budgetData,
  budgetId,
  type,
  setTypeOfDrawer,
}: Props) => {
  const {
    onSubmit,
    showLoadingModal,
    handleShowLoadingModal,
    showSuccessModal,
    handleShowSuccessModal,
  } = useCreateBudget({
    setShow,
    type,
    budgetId,
    setTypeOfDrawer,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<{ name: string; purpose: string; startDate: string; endDate: string }>({
    defaultValues: {
      name: budgetData?.name || '',
      purpose: budgetData?.purpose || '',
      startDate: budgetData?.startDate ? getDate(budgetData.startDate) : '',
      endDate: budgetData?.endDate ? getDate(budgetData.endDate) : '',
    },
    resolver: yupResolver(createBudgetSchema),
    mode: 'onChange',
  });

  const startDate = watch('startDate');
  const minEndDate = getDate(startDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[680px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        footer={
          <Button onClick={handleSubmit(onSubmit)} disabled={!isValid || !isDirty}>
            Proceed
          </Button>
        }
        label={type === 'edit' ? 'Edit Budget' : 'Create New Budget'}
        back={false}
        show={show}
        close={true}
        onClose={() => {
          if (setTypeOfDrawer) {
            setTypeOfDrawer('create');
          }
          setShow(false);
        }}
      >
        <form className="space-y-6" id="create-budget-form">
          <Input
            label="Name of budget"
            inputName="name"
            type="text"
            placeholder="January..."
            {...register('name')}
            error={errors?.name?.message}
          />
          <Input
            label="Purpose of budget"
            inputName="purpose"
            type="text"
            placeholder="Monthly expenses..."
            {...register('purpose')}
            error={errors?.purpose?.message}
          />
          <div className="flex gap-3 justify-between">
            <Input
              label="Start date"
              inputName="startdate"
              type="date"
              placeholder="Select date..."
              {...register('startDate')}
              error={errors?.startDate?.message}
              className="!w-1/2"
            />
            <Input
              label="End date"
              inputName="endDate"
              type="date"
              placeholder="Select date..."
              min={minEndDate}
              disabled={!startDate}
              {...register('endDate')}
              error={errors?.endDate?.message}
              className="!w-1/2"
            />
          </div>
        </form>
      </BottomDrawer>
      <LoadingModal
        text={type === 'edit' ? 'Please wait...' : 'Creating...'}
        isOpen={showLoadingModal}
        onClose={handleShowLoadingModal}
      />
      <SuccessModal isOpen={showSuccessModal} onClose={handleShowSuccessModal} />
    </motion.div>
  );
};

export default CreateBudgetDrawer;
