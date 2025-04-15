import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormModal from '../FormModal';
import Input from '../../input';
import { addSubcategorySchema } from '@/app/utils/validationSchema';
import { formatAmount } from '@/app/utils/functions';
import useAddSubCategory from './useAddSubCategory';
import { Dispatch, SetStateAction } from 'react';
import { SubAllocationForm } from '@/app/types/budget';

type Props = {
  setShow: (i: boolean) => void;
  show: boolean;
  subAllocations: SubAllocationForm[];
  setSubAllocations: Dispatch<SetStateAction<SubAllocationForm[]>>;
  allocatedAmount: string;
};

export default function AddSubCategoryDrawer({
  show,
  setShow,
  subAllocations,
  setSubAllocations,
  allocatedAmount,
}: Props) {
  const { onSubmit } = useAddSubCategory({
    setShow,
    subAllocations,
    setSubAllocations,
    allocatedAmount,
  });
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
    resolver: yupResolver(addSubcategorySchema),
  });

  return (
    <FormModal
      title="Add Sub-Category"
      isOpen={show}
      onClose={() => setShow(false)}
      onClick={handleSubmit(onSubmit)}
    >
      <form className="space-y-6" id="create-budget-form">
        <Input
          label="Name of sub-category"
          inputName="name"
          type="text"
          placeholder="e.g Haircut"
          {...register('name')}
          error={errors?.name?.message}
        />
        <Input
          label="Amount"
          inputName="amount"
          type="text"
          placeholder="e.g ₦50,000"
          {...register('amount')}
          onChange={formatAmount}
          error={errors?.amount?.message}
        />
      </form>
    </FormModal>
  );
}
