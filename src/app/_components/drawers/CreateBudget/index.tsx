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

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
}

const CreateBudgetDrawer = ({ setShow, show }: Props) => {
  const {
    onSubmit,
    showLoadingModal,
    handleShowLoadingModal,
    showSuccessModal,
    handleShowSuccessModal,
  } = useCreateBudget({
    setShow,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<{ name: string; purpose: string; startDate: string; endDate: string }>({
    defaultValues: {
      name: '',
      purpose: '',
      startDate: '',
      endDate: '',
    },
    resolver: yupResolver(createBudgetSchema),
    mode: 'onChange',
  });

  const startDate = watch('startDate');
  const minEndDate = startDate
    ? new Date(new Date(startDate).getTime() + 86400000).toISOString().split('T')[0]
    : '';

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
        label="Create budget"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
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
          <div className="flex gap-[16px] justify-between">
            <Input
              label="Start date"
              inputName="startdate"
              type="date"
              placeholder="Select date..."
              {...register('startDate')}
              error={errors?.startDate?.message}
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
            />
          </div>
        </form>
      </BottomDrawer>
      <LoadingModal isOpen={showLoadingModal} onClose={handleShowLoadingModal} />
      <SuccessModal isOpen={showSuccessModal} onClose={handleShowSuccessModal} />
    </motion.div>
  );
};

export default CreateBudgetDrawer;
